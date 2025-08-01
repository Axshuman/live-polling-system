import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Student {
  id: string;
  name: string;
  hasAnswered: boolean;
  joinedAt: string;
}

interface SessionState {
  sessionId: string | null;
  studentId: string | null;
  studentName: string | null;
  userType: 'teacher' | 'student' | null;
  students: Student[];
  isConnected: boolean;
  connectionError: string | null;
}

const initialState: SessionState = {
  sessionId: null,
  studentId: null,
  studentName: null,
  userType: null,
  students: [],
  isConnected: false,
  connectionError: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<{
      sessionId: string;
      studentId?: string;
      studentName?: string;
      userType: 'teacher' | 'student';
    }>) => {
      state.sessionId = action.payload.sessionId;
      state.studentId = action.payload.studentId || null;
      state.studentName = action.payload.studentName || null;
      state.userType = action.payload.userType;
    },
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      const existingIndex = state.students.findIndex(s => s.id === action.payload.id);
      if (existingIndex >= 0) {
        state.students[existingIndex] = action.payload;
      } else {
        state.students.push(action.payload);
      }
    },
    removeStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter(s => s.id !== action.payload);
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.connectionError = null;
      }
    },
    setConnectionError: (state, action: PayloadAction<string>) => {
      state.connectionError = action.payload;
      state.isConnected = false;
    },
    clearSession: (state) => {
      state.sessionId = null;
      state.studentId = null;
      state.studentName = null;
      state.userType = null;
      state.students = [];
      state.isConnected = false;
      state.connectionError = null;
    },
  },
});

export const {
  setSession,
  setStudents,
  addStudent,
  removeStudent,
  setConnectionStatus,
  setConnectionError,
  clearSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;