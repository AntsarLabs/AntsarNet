import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/features/auth/store';
import { useOnlineStatus } from './store';
import type { UserPresencePayload } from './types';

/**
 * Helper to construct the WebSocket URL for the live heartbeat function.
 */
function getLiveUrl() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  // Parse HTTP to WS
  const wsProtocol = supabaseUrl.startsWith('https') ? 'wss' : 'ws';
  const wsBaseUrl = supabaseUrl.replace(/^https?/, wsProtocol);

  return `${wsBaseUrl}/functions/v1/live`;
}

/**
 * useTrackOnlineStatus is a unified hook that:
 * 1. Maintains a WebSocket heartbeat for the current user's online status.
 * 2. Subscribes to real-time updates from the public_users table to sync other users' presence.
 */
export function useTrackOnlineStatus() {
  const { session, isAuthenticated } = useAuthStore();
  const setOnlineStatus = useOnlineStatus((state) => state.setOnlineStatus);

  // WebSocket refs for heartbeat
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttempts = useRef(0);

  // ======================================================
  // 1. HEARTBEAT (Current User Status)
  // ======================================================
  useEffect(() => {
    // If not logged in, ensure socket is closed
    if (!isAuthenticated || !session?.access_token) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    let isMounted = true;

    const connect = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
        return;
      }

      const token = session.access_token;
      const url = `${getLiveUrl()}?token=${token}`;

      const ws = new WebSocket(url);

      ws.onopen = () => {
        if (!isMounted) {
          ws.close();
          return;
        }
        reconnectAttempts.current = 0;
        console.log('Live status: Connected');
      };

      ws.onclose = () => {
        if (!isMounted) return;
        wsRef.current = null;
        console.log('Live status: Disconnected');

        // Exponential backoff reconnect
        const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectAttempts.current += 1;

        if (reconnectTimeoutRef.current) {
          window.clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = window.setTimeout(connect, timeout);
      };

      ws.onerror = (error) => {
        console.error('Live status WebSocket error:', error);
      };

      wsRef.current = ws;
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isAuthenticated, session?.access_token]);

  // ======================================================
  // 2. REAL-TIME SYNC (Other Users Presence)
  // ======================================================
  useEffect(() => {
    if (!isAuthenticated) return;
    console.log('Live status: Syncing users');
    const channel = supabase
      .channel('users_online_status_sync')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'public_users',
        },
        (payload) => {
          const { id, is_online } = payload.new as UserPresencePayload;
          console.log('Live status: User online status changed', id, is_online);

          setOnlineStatus(id, is_online);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, setOnlineStatus]);
}
