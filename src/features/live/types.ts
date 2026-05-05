/**
 * Online Status Store State Definition
 */
export interface OnlineStatusState {
  // A simple map of user IDs to their online status (true = online, false = offline)
  // This allows for O(1) fast lookup.
  onlineStatus: Record<string, boolean>;

  // Actions
  setOnlineStatus: (userId: string, isOnline: boolean) => void;
  setBulkOnlineStatus: (users: Record<string, boolean>) => void;
  getOnlineStatus: (userId: string) => boolean;
  clearOnlineStatus: (userId: string) => void;
}

/**
 * Payload structure for public_users table updates
 */
export interface UserPresencePayload {
  id: string;
  is_online: boolean;
}
