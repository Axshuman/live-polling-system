import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
let sessions = new Map();
let activePolls = new Map();
let pollResults = new Map();
let timers = new Map();

// Session management
class PollSession {
  constructor(teacherId) {
    this.id = uuidv4();
    this.teacherId = teacherId;
    this.students = new Map();
    this.currentPoll = null;
    this.pollHistory = [];
    this.createdAt = new Date();
  }

  addStudent(studentId, studentName) {
    this.students.set(studentId, {
      id: studentId,
      name: studentName,
      hasAnswered: false,
      joinedAt: new Date()
    });
  }

  removeStudent(studentId) {
    this.students.delete(studentId);
  }

  resetAnswers() {
    this.students.forEach(student => {
      student.hasAnswered = false;
    });
  }

  getAllStudentsAnswered() {
    return Array.from(this.students.values()).every(student => student.hasAnswered);
  }
}

class Poll {
  constructor(sessionId, question, options, timeLimit = 60) {
    this.id = uuidv4();
    this.sessionId = sessionId;
    this.question = question;
    this.options = options.map(option => ({ text: option, votes: 0 }));
    this.timeLimit = timeLimit;
    this.startTime = new Date();
    this.endTime = null;
    this.isActive = true;
    this.answers = new Map();
  }

  addAnswer(studentId, optionIndex) {
    if (!this.isActive || this.answers.has(studentId)) {
      return false;
    }
    
    this.answers.set(studentId, optionIndex);
    this.options[optionIndex].votes++;
    return true;
  }

  getResults() {
    const totalVotes = this.options.reduce((sum, option) => sum + option.votes, 0);
    return {
      id: this.id,
      question: this.question,
      options: this.options.map(option => ({
        ...option,
        percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
      })),
      totalVotes,
      isActive: this.isActive,
      timeRemaining: this.getTimeRemaining()
    };
  }

  getTimeRemaining() {
    if (!this.isActive) return 0;
    const elapsed = (new Date() - this.startTime) / 1000;
    return Math.max(0, this.timeLimit - elapsed);
  }

  endPoll() {
    this.isActive = false;
    this.endTime = new Date();
  }
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Teacher creates a new session
  socket.on('teacher:create-session', (callback) => {
    const session = new PollSession(socket.id);
    sessions.set(session.id, session);
    socket.join(`session:${session.id}`);
    socket.join(`teacher:${session.id}`);
    
    callback({
      success: true,
      sessionId: session.id
    });
  });

  // Student joins a session
  socket.on('student:join-session', ({ sessionId, studentName }, callback) => {
    const session = sessions.get(sessionId);
    
    if (!session) {
      callback({ success: false, error: 'Session not found' });
      return;
    }

    const studentId = socket.id;
    session.addStudent(studentId, studentName);
    socket.join(`session:${sessionId}`);
    socket.join(`student:${sessionId}`);

    // Notify teacher about new student
    io.to(`teacher:${sessionId}`).emit('student:joined', {
      studentId,
      studentName,
      students: Array.from(session.students.values())
    });

    // Send current poll if active
    if (session.currentPoll && session.currentPoll.isActive) {
      socket.emit('poll:active', {
        poll: {
          id: session.currentPoll.id,
          question: session.currentPoll.question,
          options: session.currentPoll.options.map(opt => ({ text: opt.text })),
          timeRemaining: session.currentPoll.getTimeRemaining()
        }
      });
    }

    callback({
      success: true,
      sessionId,
      studentId,
      students: Array.from(session.students.values())
    });
  });

  // Teacher creates a new poll
  socket.on('teacher:create-poll', ({ sessionId, question, options, timeLimit = 60 }, callback) => {
    const session = sessions.get(sessionId);
    
    if (!session || session.teacherId !== socket.id) {
      callback({ success: false, error: 'Unauthorized or session not found' });
      return;
    }

    // Check if previous poll is complete
    if (session.currentPoll && session.currentPoll.isActive && !session.getAllStudentsAnswered()) {
      callback({ success: false, error: 'Previous poll is still active' });
      return;
    }

    const poll = new Poll(sessionId, question, options, timeLimit);
    session.currentPoll = poll;
    session.resetAnswers();
    activePolls.set(poll.id, poll);

    // Start timer
    const timer = setTimeout(() => {
      poll.endPoll();
      const results = poll.getResults();
      
      // Send results to all participants
      io.to(`session:${sessionId}`).emit('poll:results', results);
      
      // Add to history
      session.pollHistory.push(results);
      
      timers.delete(poll.id);
    }, timeLimit * 1000);
    
    timers.set(poll.id, timer);

    // Send poll to all students
    io.to(`student:${sessionId}`).emit('poll:active', {
      poll: {
        id: poll.id,
        question: poll.question,
        options: poll.options.map(opt => ({ text: opt.text })),
        timeRemaining: poll.getTimeRemaining()
      }
    });

    // Send poll to teacher
    socket.emit('poll:created', {
      poll: poll.getResults()
    });

    callback({ success: true, pollId: poll.id });
  });

  // Student submits answer
  socket.on('student:submit-answer', ({ pollId, optionIndex, sessionId }, callback) => {
    const poll = activePolls.get(pollId);
    const session = sessions.get(sessionId);
    
    if (!poll || !session) {
      callback({ success: false, error: 'Poll or session not found' });
      return;
    }

    const student = session.students.get(socket.id);
    if (!student) {
      callback({ success: false, error: 'Student not found in session' });
      return;
    }

    if (student.hasAnswered) {
      callback({ success: false, error: 'Already answered this poll' });
      return;
    }

    const success = poll.addAnswer(socket.id, optionIndex);
    if (success) {
      student.hasAnswered = true;
      
      // Send updated results to teacher
      io.to(`teacher:${sessionId}`).emit('poll:update', poll.getResults());
      
      // Check if all students have answered
      if (session.getAllStudentsAnswered()) {
        // Clear timer
        const timer = timers.get(pollId);
        if (timer) {
          clearTimeout(timer);
          timers.delete(pollId);
        }
        
        poll.endPoll();
        const results = poll.getResults();
        
        // Send results to all participants
        io.to(`session:${sessionId}`).emit('poll:results', results);
        
        // Add to history
        session.pollHistory.push(results);
      }
      
      callback({ success: true });
    } else {
      callback({ success: false, error: 'Failed to submit answer' });
    }
  });

  // Teacher removes student
  socket.on('teacher:remove-student', ({ sessionId, studentId }, callback) => {
    const session = sessions.get(sessionId);
    
    if (!session || session.teacherId !== socket.id) {
      callback({ success: false, error: 'Unauthorized' });
      return;
    }

    session.removeStudent(studentId);
    
    // Disconnect the student
    const studentSocket = io.sockets.sockets.get(studentId);
    if (studentSocket) {
      studentSocket.emit('student:removed');
      studentSocket.disconnect();
    }

    // Notify teacher
    io.to(`teacher:${sessionId}`).emit('student:removed', {
      studentId,
      students: Array.from(session.students.values())
    });

    callback({ success: true });
  });

  // Get session info
  socket.on('get-session-info', ({ sessionId }, callback) => {
    const session = sessions.get(sessionId);
    
    if (!session) {
      callback({ success: false, error: 'Session not found' });
      return;
    }

    callback({
      success: true,
      session: {
        id: session.id,
        students: Array.from(session.students.values()),
        currentPoll: session.currentPoll ? session.currentPoll.getResults() : null,
        pollHistory: session.pollHistory
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Clean up sessions where this socket was the teacher
    for (const [sessionId, session] of sessions.entries()) {
      if (session.teacherId === socket.id) {
        // Notify all students that teacher left
        io.to(`session:${sessionId}`).emit('teacher:disconnected');
        sessions.delete(sessionId);
      } else if (session.students.has(socket.id)) {
        // Remove student from session
        const student = session.students.get(socket.id);
        session.removeStudent(socket.id);
        
        // Notify teacher
        io.to(`teacher:${sessionId}`).emit('student:left', {
          studentId: socket.id,
          studentName: student.name,
          students: Array.from(session.students.values())
        });
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});