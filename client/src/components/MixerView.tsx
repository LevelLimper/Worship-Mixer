import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/use-websocket";
import { wsMessageSchema } from "@shared/websocket-schema";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

interface MixRequestWithDate {
  id: string;
  requesterName: string;
  itemType: string;
  itemName: string;
  adjustment: number;
  timestamp: Date;
}

export default function MixerView() {
  const [requests, setRequests] = useState<MixRequestWithDate[]>([]);
  const { toast } = useToast();

  // Handle WebSocket messages with validation
  const handleWebSocketMessage = useCallback((data: any) => {
    try {
      // Validate the message against our schema
      const validatedMessage = wsMessageSchema.parse(data);

      if (validatedMessage.type === 'initial') {
        // Initial load of requests - timestamps are ISO strings from server
        setRequests(validatedMessage.requests.map((req) => ({
          ...req,
          timestamp: new Date(req.timestamp),
        })));
      } else if (validatedMessage.type === 'new-request') {
        // New request received - timestamp is ISO string from server
        setRequests((prev) => [{
          ...validatedMessage.request,
          timestamp: new Date(validatedMessage.request.timestamp),
        }, ...prev]);
      } else if (validatedMessage.type === 'clear') {
        // All requests cleared
        setRequests([]);
      }
    } catch (error) {
      console.error('Invalid WebSocket message received:', error);
      toast({
        title: "Invalid data received",
        description: "Received malformed data from server",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Set up WebSocket connection with reconnection handling
  const { isConnected, maxRetriesReached, manualReconnect } = useWebSocket({
    url: '/ws',
    onMessage: handleWebSocketMessage,
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 min ago";
    if (diffMins < 60) return `${diffMins} mins ago`;
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-10 bg-background border-b border-border">
        <div className="px-4 py-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">Incoming Requests</h1>
          <div className="flex items-center gap-3">
            {maxRetriesReached && (
              <Button
                data-testid="button-reconnect"
                onClick={manualReconnect}
                size="sm"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reconnect
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Connected' : maxRetriesReached ? 'Connection lost' : 'Reconnecting...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="px-4 py-6 space-y-3">
            {requests.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-base text-muted-foreground">No pending requests</p>
              </div>
            ) : (
              requests.map((request) => (
                <Card
                  key={request.id}
                  data-testid={`card-request-${request.id}`}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span 
                          data-testid={`text-requester-${request.id}`}
                          className="text-lg font-semibold text-foreground"
                        >
                          {request.requesterName}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {request.itemType}
                        </Badge>
                      </div>
                      <p 
                        data-testid={`text-item-${request.id}`}
                        className="text-base text-foreground"
                      >
                        {request.itemName}
                      </p>
                      <p 
                        data-testid={`text-timestamp-${request.id}`}
                        className="text-sm text-muted-foreground"
                      >
                        {formatTime(request.timestamp)}
                      </p>
                    </div>
                    <div 
                      data-testid={`text-adjustment-${request.id}`}
                      className={`text-2xl font-bold ${
                        request.adjustment > 0 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {request.adjustment > 0 ? '+' : ''}{request.adjustment}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
