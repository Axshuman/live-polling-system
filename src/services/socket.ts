import { io, Socket } from 'socket.io-client';
import { store } from '../store/store';
import { 
  setPoll, 
  updatePoll, 
  setPollResults, 
  clearCurrentPoll,
  setPollHistory 
} from '../store/pollSlice';
import { 
  setStudents, 
  addStudent, 
  removeStudent, 
  setConnectionStatus,
  setConnectionError,
  clearSession 
} from '../store/sessionSlice';
import toast from 'react-hot-toast';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      store.dispatch(setConnectionStatus(true));
      this.reconnectAttempts = 0;
      toast.success('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      store.dispatch(setConnectionStatus(false));
      toast.error('Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      store.dispatch(setConnectionError('Failed to connect to server'));
      
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Unable to connect to server. Please try again later.');
      }
    });

    // Poll events
    this.socket.on('poll:active', (data) => {
      console.log('Active poll received:', data);
      store.dispatch(setPoll(data.poll));
    });

    this.socket.on('poll:update', (pollData) => {
      console.log('Poll update received:', pollData);
      store.dispatch(updatePoll(pollData));
    });

    this.socket.on('poll:results', (pollData) => {
      console.log('Poll results received:', pollData);
      store.dispatch(setPollResults(pollData));
      toast.success('Poll results are now available!');
    });

    this.socket.on('poll:created', (data) => {
      console.log('Poll created:', data);
      store.dispatch(setPoll(data.poll));
      toast.success('Poll created successfully!');
    });

    // Student events
    this.socket.on('student:joined', (data) => {
      console.log('Student joined:', data);
      store.dispatch(setStudents(data.students));
      toast.success(`${data.studentName} joined the session`);
    });

    this.socket.on('student:left', (data) => {
      console.log('Student left:', data);
      store.dispatch(removeStudent(data.studentId));
      toast(`${data.studentName} left the session`);
    });

    this.socket.on('student:removed', () => {
      toast.error('You have been removed from the session');
      store.dispatch(clearSession());
    });

    this.socket.on('student:removed', (data) => {
      store.dispatch(setStudents(data.students));
      toast('Student removed from session');
    });

    // Teacher events
    this.socket.on('teacher:disconnected', () => {
      toast.error('Teacher has disconnected. Session ended.');
      store.dispatch(clearSession());
      store.dispatch(clearCurrentPoll());
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Teacher methods
  createSession(): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Not connected to server' });
        return;
      }

      this.socket.emit('teacher:create-session', (response: any) => {
        resolve(response);
      });
    });
  }

  createPoll(sessionId: string, question: string, options: string[], timeLimit = 60): Promise<{ success: boolean; pollId?: string; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Not connected to server' });
        return;
      }

      this.socket.emit('teacher:create-poll', {
        sessionId,
        question,
        options,
        timeLimit
      }, (response: any) => {
        resolve(response);
      });
    });
  }

  removeStudent(sessionId: string, studentId: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Not connected to server' });
        return;
      }

      this.socket.emit('teacher:remove-student', {
        sessionId,
        studentId
      }, (response: any) => {
        resolve(response);
      });
    });
  }

  // Student methods
  joinSession(sessionId: string, studentName: string): Promise<{ success: boolean; sessionId?: string; studentId?: string; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Not connected to server' });
        return;
      }

      this.socket.emit('student:join-session', {
        sessionId,
        studentName
      }, (response: any) => {
        resolve(response);
      });
    });
  }

  submitAnswer(pollId: string, optionIndex: number, sessionId: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Not connected to server' });
        return;
      }

      this.socket.emit('student:submit-answer', {
        pollId,
        optionIndex,
        sessionId
      }, (response: any) => {
        resolve(response);
      });
    });
  }

  // General methods
  getSessionInfo(sessionId: string): Promise<{ success: boolean; session?: any; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Not connected to server' });
        return;
      }

      this.socket.emit('get-session-info', { sessionId }, (response: any) => {
        resolve(response);
      });
    });
  }
}

export const socketService = new SocketService();