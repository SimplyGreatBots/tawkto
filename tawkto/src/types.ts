import { z } from '@botpress/sdk';
import { integrationName } from 'package.json';

export const chatId = `${integrationName}:chatId` as const

export const tawkToEvent = z.object({
  event: z.enum(['chat:start', 'chat:end', 'chat:transcript_created', 'ticket:create']),
  time: z.string(),
  property: z.object({
    id: z.string(),
    name: z.string(),
  }),
  chatId: z.string().optional(),
  message: z.object({
    text: z.string(),
    type: z.enum(['msg', 'file', 'webrtc-call']),
    sender: z.object({
      type: z.enum(['agent', 'visitor', 'system'])
    })
  }).optional(),
  visitor: z.object({
    name: z.string(),
    email: z.string().optional(),
    city: z.string(),
    country: z.string(),
  }).optional(),
  ticket: z.object({
    id: z.string(),
    humanId: z.number(),
    subject: z.string(),
    message: z.string(),
  }).optional(),
  requester: z.object({
    name: z.string(),
    email: z.string().optional(),
  }).optional()
}).passthrough()
