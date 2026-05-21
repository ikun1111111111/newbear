import { apiRequest } from "./client";
import type {
  ResetResponse,
  StateResponse,
  StepPayload,
  StepResponse,
} from "../types/api";

export function fetchWorldState() {
  return apiRequest<StateResponse>("/api/state");
}

export function runStep(payload: StepPayload) {
  return apiRequest<StepResponse>("/api/step", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resetWorld() {
  return apiRequest<ResetResponse>("/api/reset", {
    method: "POST",
  });
}