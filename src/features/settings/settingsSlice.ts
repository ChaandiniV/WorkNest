import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark';
  notifications: boolean;
  profile: {
    name: string;
    email: string;
    department: string;
  };
}

const initialState: SettingsState = {
  theme: 'light',
  notifications: true,
  profile: {
    name: 'Ava Ramirez',
    email: 'ava.ramirez@worknest.com',
    department: 'Finance'
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setNotifications(state, action: PayloadAction<boolean>) {
      state.notifications = action.payload;
    },
    updateProfile(state, action: PayloadAction<{ name: string; email: string; department: string }>) {
      state.profile = action.payload;
    }
  }
});

export const { toggleTheme, setNotifications, updateProfile } = settingsSlice.actions;
export default settingsSlice.reducer;
