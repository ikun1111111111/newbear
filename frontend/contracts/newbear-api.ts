export const API_ENDPOINTS = {
  authMe: "/api/auth/me",
  authRegister: "/api/auth/register",
  authLogin: "/api/auth/login",
  authLogout: "/api/auth/logout",
  state: "/api/state",
  reset: "/api/reset",
  step: "/api/step",
  meetingEnter: "/api/meeting/enter",
  meetingStart: "/api/meeting/start",
  meetingSay: "/api/meeting/say",
  meetingTick: "/api/meeting/tick",
  meetingFinish: "/api/meeting/finish",
  meetingClose: "/api/meeting/close",
  pantrySay: "/api/pantry/say",
  pantryTick: "/api/pantry/tick",
  pantryLeave: "/api/pantry/leave",
  reportClose: "/api/report/close",
} as const;

export type ApiErrorResponse = {
  error: string;
};

export type ApiOkResponse = {
  ok: true;
};

export type AuthUser = {
  user_id: number;
  username: string;
  session_id: string;
};

export type AuthMeResponse =
  | {
      authenticated: true;
      user: AuthUser;
    }
  | {
      authenticated: false;
    };

export type AuthPayload = {
  username: string;
  password: string;
};

export type CompanyLogReaction = {
  actor_id?: string;
  display_name?: string;
  from_location?: string;
  to_location?: string;
  move_to?: string;
  task?: string;
  intent?: string;
  speech?: string;
  stress?: number;
  energy?: number;
  [key: string]: unknown;
};

export type EncounterDialogueLine = {
  actor_id?: string;
  to_actor_id?: string;
  speech?: string;
  [key: string]: unknown;
};

export type Encounter = {
  encounter_id: number;
  location: string;
  actor_ids: string[];
  actor_names: string[];
  summary: string;
  day: number;
  step: number;
  clock: string;
  display_names: string[];
  dialogue: EncounterDialogueLine[];
};

export type CompanyLog = {
  step?: number;
  from_clock?: string;
  to_clock?: string;
  affair?: string;
  actor_reactions?: CompanyLogReaction[];
  encounters?: Encounter[];
  [key: string]: unknown;
};

export type CompanyState = {
  name: string;
  cash: number;
  day: number;
  step: number;
  clock: string;
  phase: string;
  logs: CompanyLog[];
};

export type ActorMemoryItem = {
  memory_id: number;
  kind: string;
  text: string;
  clock: string;
  importance: number;
  tags: string[];
  related_actor_ids: string[];
};

export type ActorState = {
  actor_id: string;
  display_name: string;
  location: string;
  stress: number;
  energy: number;
  mood: string;
  current_task: string;
  intent: string;
  move_to: string;
  last_speech: string;
  memory: string[];
  pending_action: Record<string, unknown>;
  memory_stream: ActorMemoryItem[];
  reflection_importance_buffer: number;
};

export type ActorReaction = {
  actor_id?: string;
  display_name?: string;
  from_location?: string;
  to_location?: string;
  move_to?: string;
  task?: string;
  intent?: string;
  speech?: string;
  stress?: number;
  energy?: number;
  [key: string]: unknown;
};

export type UserInputRecord = {
  input_id: number;
  raw_text: string;
  is_empty: boolean;
  day: number;
  step: number;
  clock: string;
  actor_reactions: ActorReaction[];
};

export type MapLocation = {
  location_id: string;
  name: string;
  function: string;
  can_move_to: boolean;
  aliases: string[];
  contains: string[];
  anchor_x?: number;
  anchor_y?: number;
};

export type MapObject = {
  object_id: string;
  name: string;
  kind: string;
  can_move_to: boolean;
};

export type MapWorld = {
  pixel_width?: number;
  pixel_height?: number;
  [key: string]: unknown;
};

export type MapNavigation = Record<string, unknown>;

export type MapSemantics = {
  locations: MapLocation[];
  objects: MapObject[];
};

export type MapState = {
  package_id: string;
  package_version: string;
  world: MapWorld;
  navigation: MapNavigation;
  semantics: MapSemantics;
};

export type IncidentRecord = {
  incident_id: string;
  time: string;
  title: string;
  content: string;
  day: number;
  step: number;
  clock: string;
};

export type MeetingTranscriptLine = {
  actor_id?: string;
  display_name?: string;
  role?: string;
  content?: string;
  speech?: string;
  message?: string;
  from?: string;
  type?: string;
  [key: string]: unknown;
};

export type MeetingResult = Record<string, unknown>;

export type MeetingState = {
  meeting_id: string;
  time: string;
  title: string;
  content: string;
  participants: string[];
  day: number;
  step: number;
  clock: string;
  phase: string;
  duration_seconds: number;
  remaining_seconds: number;
  transcript: MeetingTranscriptLine[];
  result: MeetingResult;
};

export type MeetingEvent = {
  meeting_id: string;
  time: string;
  title: string;
  content: string;
  participants: string[];
  day: number;
  step: number;
  clock: string;
};

export type PantryTranscriptLine = {
  actor_id?: string;
  display_name?: string;
  content?: string;
  speech?: string;
  message?: string;
  from?: string;
  type?: string;
  [key: string]: unknown;
};

export type PantryState = {
  pantry_id: string;
  time: string;
  title: string;
  content: string;
  participants: string[];
  day: number;
  step: number;
  clock: string;
  phase: string;
  transcript: PantryTranscriptLine[];
  result: Record<string, unknown>;
  active: true;
  actors: Array<{
    actor_id: string;
  }>;
};

export type RadarItem = {
  label?: string;
  code?: string;
  value?: number;
  [key: string]: unknown;
};

export type ReportState = {
  report_id: string;
  time: string;
  title: string;
  trait_summary: string;
  letter_title: string;
  letter_body: string;
  scores: Record<string, number>;
  radar_items: RadarItem[];
  evidence: string[];
  day: number;
  step: number;
  clock: string;
  provider: string;
  visible: boolean;
};

export type OnboardingCharacter = {
  actor_id: string;
  display_name: string;
  work_title: string;
  job_title: string;
  role_name: string;
  age: string;
  education: string;
  commute: string;
  marital_status: string;
  economic_status: string;
  core_drives: string[];
  habits: string[];
  speaking_style: string;
  shadow_pattern: string;
  company_lens: string;
  responsibility: string;
  power: string;
  kpi: string;
};

export type OnboardingCompany = Record<string, unknown>;

export type OnboardingState = {
  company: OnboardingCompany;
  characters: OnboardingCharacter[];
};

export type WorldState = {
  company: CompanyState;
  actors: ActorState[];
  user_inputs: UserInputRecord[];
  map: MapState;
  encounters: Encounter[];
  pending_incident: IncidentRecord | null;
  incidents: IncidentRecord[];
  active_meeting: MeetingState | null;
  meetings: MeetingEvent[];
  active_pantry: PantryState | null;
  active_report: ReportState | null;
  onboarding: OnboardingState;
};

export type StateResponse = {
  state: WorldState;
};

export type AuthSuccessResponse = ApiOkResponse & {
  user: AuthUser;
  state: WorldState;
};

export type ResetResponse = ApiOkResponse & StateResponse;

export type StepPayload = {
  affair: string;
};

export type StepResponse = ApiOkResponse & StateResponse;

export type MeetingMessagePayload = {
  message: string;
};

export type MeetingFinishResponse = ApiOkResponse & {
  result: Record<string, unknown>;
  state: WorldState;
};

export type PantryMessagePayload = {
  message: string;
};

export type CloseReportResponse = ApiOkResponse & StateResponse;
