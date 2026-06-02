import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DevConsoleLog {
  id: string;
  message: string;
  category: string;
  timestamp: string;
}

interface DevConsoleState {
  logs: DevConsoleLog[];
  errors: string[];
  apiLatency: number;
  failedCalls: number;
  validationErrors: string[];
  featureFlags: Record<string, boolean>;
}

const initialState: DevConsoleState = {
  logs: [],
  errors: [],
  apiLatency: 0,
  failedCalls: 0,
  validationErrors: [],
  featureFlags: {
    devConsole: true,
    newAnalytics: true,
    darkMode: true
  }
};

const devConsoleSlice = createSlice({
  name: 'devConsole',
  initialState,
  reducers: {
    pushLog(state, action: PayloadAction<{ message: string; category: string }>) {
      state.logs.unshift({ id: `log-${Date.now()}`, timestamp: new Date().toISOString(), ...action.payload });
      state.logs = state.logs.slice(0, 10);
    },
    addError(state, action: PayloadAction<string>) {
      state.errors.unshift(action.payload);
      state.errors = state.errors.slice(0, 10);
    },
    setApiLatency(state, action: PayloadAction<number>) {
      state.apiLatency = action.payload;
    },
    incrementFailedCalls(state) {
      state.failedCalls += 1;
    },
    addValidationError(state, action: PayloadAction<string>) {
      state.validationErrors.unshift(action.payload);
      state.validationErrors = state.validationErrors.slice(0, 10);
    },
    setFeatureFlags(state, action: PayloadAction<Record<string, boolean>>) {
      state.featureFlags = action.payload;
    }
  }
});

export const { pushLog, addError, setApiLatency, incrementFailedCalls, addValidationError, setFeatureFlags } = devConsoleSlice.actions;
export default devConsoleSlice.reducer;
