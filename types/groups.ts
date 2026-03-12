export interface Group {
  id: string;
  name: string;
  description: string;
  scope: "global" | "national";
  status: "active" | "archived";
  country_code?: string;
  max_members?: number;
  schedule_days: string[];
  schedule_time: string;
  pattern_id?: string;
  created_by: string;
  members: GroupMember[];
  pending_invites: GroupInvite[];
  activity: GroupActivityEvent[];
  age_group?: string;
  language?: string;
  region?: string;
  gender: string;
  chat_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  joined_at: string;
  role: "admin" | "member";
}

export interface GroupInvite {
  user_id: string;
  invited_at: string;
}

export interface GroupActivityEvent {
  user_id: string;
  event_type: "completed" | "joined" | "left";
  timestamp: string;
  data?: Record<string, unknown>;
}
