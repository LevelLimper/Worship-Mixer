import { useEffect, useRef, useState, useCallback } from 'react';

interface UseWebSocketOptions {
  url: string;
  onMessage: (data: any) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket({
  url,
  onMessage,
  reconnectInterval = 3000,
  maxReconnectAttempts = 10,
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [maxRetriesReached, setMaxRetriesReached] = useState(false);
  const [reconnectTrigger, setReconnectTrigger] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const connect = () => {
      try {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}${url}`;
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          reconnectAttemptsRef.current = 0;
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            onMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          socketRef.current = null;

          // Attempt to reconnect with exponential backoff
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            setMaxRetriesReached(false);
            const delay = Math.min(
              reconnectInterval * Math.pow(2, reconnectAttemptsRef.current),
              30000 // Max 30 seconds
            );
            
            console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectAttemptsRef.current++;
              connect();
            }, delay);
          } else {
            console.error('Max reconnection attempts reached');
            setMaxRetriesReached(true);
          }
        };

        socketRef.current = socket;
      } catch (error) {
        console.error('Error creating WebSocket:', error);
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current !== undefined) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url, onMessage, reconnectInterval, maxReconnectAttempts, reconnectTrigger]);

  const manualReconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    setMaxRetriesReached(false);
    if (reconnectTimeoutRef.current !== undefined) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
    // Trigger the useEffect to run again and create a new connection
    setReconnectTrigger((prev) => prev + 1);
  }, []);

  return { isConnected, maxRetriesReached, manualReconnect };
}
