import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertMixRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Set up WebSocket server on /ws path
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Broadcast function to send data to all connected clients
  const broadcast = (data: any) => {
    const message = JSON.stringify(data, (key, value) => {
      // Convert Date objects to ISO strings for consistent serialization
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // WebSocket connection handler
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    // Send all existing requests to newly connected client
    storage.getAllMixRequests().then((requests) => {
      ws.send(JSON.stringify({ type: 'initial', requests }, (key, value) => {
        // Convert Date objects to ISO strings for consistent serialization
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      }));
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // API Routes
  
  // Create a new mix request
  app.post('/api/mix-requests', async (req, res) => {
    try {
      const validatedData = insertMixRequestSchema.parse(req.body);
      const newRequest = await storage.createMixRequest(validatedData);
      
      // Broadcast the new request to all connected clients
      broadcast({ type: 'new-request', request: newRequest });
      
      res.json(newRequest);
    } catch (error) {
      console.error('Error creating mix request:', error);
      res.status(400).json({ error: 'Invalid request data' });
    }
  });

  // Get all mix requests
  app.get('/api/mix-requests', async (req, res) => {
    try {
      const requests = await storage.getAllMixRequests();
      // Serialize dates consistently
      const serializedRequests = requests.map(req => ({
        ...req,
        timestamp: req.timestamp.toISOString(),
      }));
      res.json(serializedRequests);
    } catch (error) {
      console.error('Error fetching mix requests:', error);
      res.status(500).json({ error: 'Failed to fetch requests' });
    }
  });

  // Clear all mix requests
  app.delete('/api/mix-requests', async (req, res) => {
    try {
      await storage.clearMixRequests();
      broadcast({ type: 'clear' });
      res.json({ success: true });
    } catch (error) {
      console.error('Error clearing mix requests:', error);
      res.status(500).json({ error: 'Failed to clear requests' });
    }
  });

  return httpServer;
}
