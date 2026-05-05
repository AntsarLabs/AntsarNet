import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth/store';


function getLiveUrl() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  // Parse HTTP to WS
  const wsProtocol = supabaseUrl.startsWith('https') ? 'wss' : 'ws';
  const wsBaseUrl = supabaseUrl.replace(/^https?/, wsProtocol);

  return `${wsBaseUrl}/functions/v1/live`;
}

export function useLiveStatus() {
  const { session, isAuthenticated } = useAuthStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttempts = useRef(0);

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
      // Pass the token as a query parameter because standard WebSockets do not support custom headers
      const url = `${getLiveUrl()}?token=${token}`;

      const ws = new WebSocket(url);

      ws.onopen = () => {
        if (!isMounted) {
          ws.close();
          return;
        }
        // Reset retry attempts on successful connection
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
        // onclose will be called automatically after error
      };

      wsRef.current = ws;
    };

    // Initial connection attempt
    connect();

    // Cleanup on unmount or auth state change
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
}
