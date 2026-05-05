import { create } from 'zustand';
import type { OnlineStatusState } from './types';

/**
 * useOnlineStatus manages the real-time presence data for all users.
 * Optimized for fast lookups using a simple boolean map.
 */
export const useOnlineStatus = create<OnlineStatusState>((set, get) => ({
  onlineStatus: {},

  /**
   * Updates or adds a user's online status.
   */
  setOnlineStatus: (userId, isOnline) =>
    set((state) => ({
      onlineStatus: {
        ...state.onlineStatus,
        [userId]: isOnline,
      },
    })),

  /**
   * Updates multiple users' statuses at once.
   */
  setBulkOnlineStatus: (users) =>
    set((state) => ({
      onlineStatus: {
        ...state.onlineStatus,
        ...users,
      },
    })),

  /**
   * Fast lookup to check if a user is online.
   */
  getOnlineStatus: (userId) => {
    return !!get().onlineStatus[userId];
  },

  /**
   * Removes a user from the tracking list.
   */
  clearOnlineStatus: (userId) =>
    set((state) => {
      const { [userId]: _, ...rest } = state.onlineStatus;
      return { onlineStatus: rest };
    }),
}));
