export type Archetype =
  | "athlete"
  | "artist"
  | "culinarian"
  | "explorer"
  | "mannequin"
  | "universalist";

export type Method =
  | "takePictureMethod"
  | "registerAudioMethod"
  | "takeNotesMethod"
  | "wakeUpMethod"
  | "trackMotionMethod"
  | "countPushupsMethod"
  | "playGamesMethod"
  | "readBooksMethod"
  | "learnWithAlfredMethod"
  | "undefined";

export type Section = "skills" | "wellness" | "housekeeping" | "experience";

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type FeedbackType =
  | "qualityAudio"
  | "qualityImage"
  | "qualityText"
  | "reactionOnly"
  | "none";

export interface TimeSlot {
  timeSlotID: string;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  isActive: boolean;
}

export interface PatternMeta {
  timeOfDay?: "morning" | "afternoon" | "evening" | "any";
  energy?: "low" | "medium" | "high";
  location?: "home" | "outside" | "gym" | "desk" | "kitchen" | "any";
  domain?:
    | "body"
    | "mind"
    | "learning"
    | "creativity"
    | "environment"
    | "social"
    | "admin";
  social?: "solo" | "social" | "either";
  needsEquipment?: boolean;
  valence?: "calming" | "stimulating" | "neutral";
}

export interface TemplatePattern {
  id: string;
  text: string;
  symbol: string;
  archetype: Archetype;
  method: Method;
  section: Section;
  description: string;
  durations: number[];
  tags: string[];
  meta: PatternMeta;
}

// Stored in Supabase under user_patterns.default_settings
export interface PatternDefaultSettings {
  template_pattern_id: string;
  pattern_name: string;
  pattern_symbol: string;
  pattern_method: Method;
  pattern_archetype: Archetype;
  feedback_type: FeedbackType;
}

// Stored in Supabase under user_patterns.user_settings
export interface PatternUserSettings {
  time_slot: TimeSlot;
  selected_days: string[];
  selected_color: string;
  view_option: string;
  holiday_enabled: boolean;
  skip_enabled: boolean;
  alert_time: string;
}

export interface PatternInstanceDate {
  didIt?: boolean;
  content?: string;
  dataType?: "text" | "audio" | "float" | "image" | "boolean" | "map";
  timePublished?: number;
}

export interface PatternInstance {
  id: string;
  selectedDay: string;
  startTime: string;
  endTime: string;
  dates: Record<string, PatternInstanceDate>;
}

// Full row from user_patterns table
export interface UserPatternRow {
  id: string;
  user_id: string;
  default_settings: PatternDefaultSettings;
  user_settings: PatternUserSettings;
  pattern_instances: Record<string, PatternInstance>;
  created_at?: string;
  updated_at?: string;
}

// Flat, convenient shape used in the UI
export interface UserPattern {
  id: string;
  templatePatternId: string;
  name: string;
  symbol: string;
  method: Method;
  archetype: Archetype;
  feedbackType: FeedbackType;
  timeSlot: TimeSlot;
  selectedDays: string[];
  color: string;
  holidayEnabled: boolean;
  skipEnabled: boolean;
  alertTime: string;
  instances: PatternInstance[];
}
