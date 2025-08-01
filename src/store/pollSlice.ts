import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PollOption {
  text: string;
  votes: number;
  percentage: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  isActive: boolean;
  timeRemaining: number;
}

interface PollState {
  currentPoll: Poll | null;
  pollHistory: Poll[];
  isLoading: boolean;
  hasAnswered: boolean;
  selectedOption: number | null;
}

const initialState: PollState = {
  currentPoll: null,
  pollHistory: [],
  isLoading: false,
  hasAnswered: false,
  selectedOption: null,
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setPoll: (state, action: PayloadAction<Poll>) => {
      state.currentPoll = action.payload;
      state.hasAnswered = false;
      state.selectedOption = null;
    },
    updatePoll: (state, action: PayloadAction<Poll>) => {
      if (state.currentPoll && state.currentPoll.id === action.payload.id) {
        state.currentPoll = action.payload;
      }
    },
    setPollResults: (state, action: PayloadAction<Poll>) => {
      state.currentPoll = action.payload;
      if (!state.pollHistory.find(poll => poll.id === action.payload.id)) {
        state.pollHistory.push(action.payload);
      }
    },
    setHasAnswered: (state, action: PayloadAction<{ answered: boolean; option?: number }>) => {
      state.hasAnswered = action.payload.answered;
      if (action.payload.option !== undefined) {
        state.selectedOption = action.payload.option;
      }
    },
    clearCurrentPoll: (state) => {
      state.currentPoll = null;
      state.hasAnswered = false;
      state.selectedOption = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPollHistory: (state, action: PayloadAction<Poll[]>) => {
      state.pollHistory = action.payload;
    },
  },
});

export const { 
  setPoll, 
  updatePoll, 
  setPollResults, 
  setHasAnswered, 
  clearCurrentPoll, 
  setLoading,
  setPollHistory 
} = pollSlice.actions;

export default pollSlice.reducer;