import { z } from "zod";

// Schema for WebSocket message payloads
export const wsInitialMessageSchema = z.object({
  type: z.literal('initial'),
  requests: z.array(z.object({
    id: z.string(),
    requesterName: z.string(),
    itemType: z.string(),
    itemName: z.string(),
    adjustment: z.number(),
    timestamp: z.string(), // ISO string from server
  })),
});

export const wsNewRequestMessageSchema = z.object({
  type: z.literal('new-request'),
  request: z.object({
    id: z.string(),
    requesterName: z.string(),
    itemType: z.string(),
    itemName: z.string(),
    adjustment: z.number(),
    timestamp: z.string(), // ISO string from server
  }),
});

export const wsClearMessageSchema = z.object({
  type: z.literal('clear'),
});

export const wsMessageSchema = z.union([
  wsInitialMessageSchema,
  wsNewRequestMessageSchema,
  wsClearMessageSchema,
]);

export type WsMessage = z.infer<typeof wsMessageSchema>;
