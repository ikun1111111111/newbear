import { apiRequest } from "./client";
import type {
  AuthMeResponse,
  AuthPayload,
  AuthSuccessResponse,
} from "../types/api";

export function getCurrentUser() {
  return apiRequest<AuthMeResponse>("/api/auth/me");
}

export function login(payload: AuthPayload) {
  return apiRequest<AuthSuccessResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: AuthPayload) {
  return apiRequest<AuthSuccessResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return apiRequest<{ ok: true }>("/api/auth/logout", {
    method: "POST",
  });
}