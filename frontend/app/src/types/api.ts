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

export type CompanyState = {
  name?: string;
  cash?: number;
  day?: number;
  step?: number;
  clock?: string;
  phase?: string;
};

export type ActorState = {
  actor_id: string;
  display_name: string;
  location: string;
  stress?: number;
  energy?: number;
  mood?: string;
  current_task?: string;
  intent?: string;
  move_to?: string;
  last_speech?: string;
};

export type MapLocation = {
  location_id: string;
  name: string;
  function?: string;
  can_move_to?: boolean;
  aliases?: string[];
  contains?: string[];
  anchor_x?: number;
  anchor_y?: number;
};

export type MapState = {
  world?: {
    pixel_width?: number;
    pixel_height?: number;
  };
  semantics?: {
    locations?: MapLocation[];
  };
};

export type WorldState = {
  company?: CompanyState;
  actors?: ActorState[];
  map?: MapState;
};

export type AuthSuccessResponse = {
  ok: true;
  user: AuthUser;
  state: WorldState;
};

export type ApiErrorResponse = {
  error: string;
};
export type StateResponse = {
  state: WorldState;
};

export type StepPayload = {
  affair: string;
};

export type StepResponse = {
  ok: true;
  state: WorldState;
};

export type ResetResponse = {
  ok: true;
  state: WorldState;
};