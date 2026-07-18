import { z } from 'zod';

export const TicketTypeSchema = z.enum(['Contact', 'Bug', 'Feature', 'Help']);
export const TicketStatusSchema = z.enum(['Open', 'Investigating', 'Planned', 'Waiting for User', 'Resolved', 'Closed']);
export const TicketPrioritySchema = z.enum(['Low', 'Medium', 'High', 'Critical']);

export const AttachmentSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  filename: z.string(),
  size: z.number(),
  mimeType: z.string(),
  uploadedAt: z.number(),
});

export const SupportTicketSchema = z.object({
  id: z.string(),
  ticketNumber: z.string(),
  ticketType: TicketTypeSchema,
  status: TicketStatusSchema,
  priority: TicketPrioritySchema,
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(10000),
  category: z.string(),
  
  // User Data
  userId: z.string().nullable().optional(),
  userEmail: z.string().email(),
  userName: z.string().min(2),
  
  // Environment Data
  browser: z.string().optional(),
  device: z.string().optional(),
  operatingSystem: z.string().optional(),
  screenResolution: z.string().optional(),
  timeZone: z.string().optional(),
  currentPage: z.string().optional(),
  appVersion: z.string().optional(),
  ipAddress: z.string().optional(),
  
  // Form Specific
  expectedBehaviour: z.string().optional(),
  actualBehaviour: z.string().optional(),
  proposedSolution: z.string().optional(),
  businessValue: z.string().optional(),
  company: z.string().optional(),
  
  attachments: z.array(AttachmentSchema).default([]),
  
  createdAt: z.number(),
  updatedAt: z.number(),
  lastReplyAt: z.number(),
  
  adminNotes: z.string().optional(),
});

export type SupportTicket = z.infer<typeof SupportTicketSchema>;

export const TicketMessageSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  senderRole: z.enum(['User', 'Admin', 'System']),
  message: z.string(),
  attachments: z.array(AttachmentSchema).default([]),
  createdAt: z.number(),
  isInternalNote: z.boolean().default(false),
});

export type TicketMessage = z.infer<typeof TicketMessageSchema>;

export const AuditLogSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  action: z.enum([
    'Ticket Created', 
    'Email Sent', 
    'Email Failed', 
    'Status Changed', 
    'Reply Added', 
    'Attachment Uploaded', 
    'Admin Reply', 
    'Ticket Closed'
  ]),
  actorId: z.string(),
  actorName: z.string(),
  timestamp: z.number(),
  details: z.string().optional(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;

// Request Schemas

export const SubmitBugRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  expected_behaviour: z.string().min(10, "Expected behaviour must be at least 10 characters"),
  actual_behaviour: z.string().min(10, "Actual behaviour must be at least 10 characters"),
  severity: z.string(),
  category: z.string(),
  browser: z.string(),
  os: z.string(),
  app_version: z.string(),
  url: z.string(),
});

export const SubmitFeatureRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  suggested_solution: z.string().optional(),
  business_impact: z.string().optional(),
  priority: z.string(),
  category: z.string(),
});

export const SubmitContactRequestSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  category: z.string(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
