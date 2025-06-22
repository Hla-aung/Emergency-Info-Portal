import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Real-time event types
export interface MemberJoinEvent {
  type: "MEMBER_JOINED";
  organizationId: string;
  member: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: "MEMBER";
    joinedAt: string;
  };
}

export interface OrganizationEvent {
  type: "MEMBER_JOINED" | "MEMBER_LEFT" | "ROLE_CHANGED";
  organizationId: string;
  data: any;
  timestamp: string;
}

// Channel names
export const getOrganizationChannel = (organizationId: string) =>
  `organization:${organizationId}`;
export const getUserChannel = (userId: string) => `user:${userId}`;

// Event constants
export const REALTIME_EVENTS = {
  MEMBER_JOINED: "MEMBER_JOINED",
  MEMBER_LEFT: "MEMBER_LEFT",
  ROLE_CHANGED: "ROLE_CHANGED",
} as const;
