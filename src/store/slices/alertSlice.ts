import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertMessage } from '../../services/websocket/alertTypes';

interface AlertState {
  alerts: AlertMessage[];
  unreadCount: number;
}

const initialState: AlertState = {
  alerts: [],
  unreadCount: 0,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<AlertMessage>) => {
      state.alerts.unshift(action.payload);
      state.unreadCount += 1;
    },
    clearAlerts: state => {
      state.alerts = [];
      state.unreadCount = 0;
    },
    markAllAsRead: state => {
      state.unreadCount = 0;
    },
  },
});

export const { addAlert, clearAlerts, markAllAsRead } = alertSlice.actions;
export default alertSlice.reducer;
