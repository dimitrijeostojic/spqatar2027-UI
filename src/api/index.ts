import {
  Group, Team, Stadium, Match, GroupStandings,
} from '../types/entities/entities';
import { CreateGroupRequest, UpdateGroupRequest } from '../types/requests/group';
import { CreateMatchRequest, ForfeitMatchRequest, GetAllMatchesRequest, RecordMatchResultRequest } from '../types/requests/match';
import { CreateTeamRequest, UpdateTeamRequest } from '../types/requests/team';
import keycloak from './keycloak';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7001';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Čeka dok keycloak token ne postane dostupan (max 5s)
function waitForToken(timeoutMs = 5000): Promise<string> {
  return new Promise((resolve, reject) => {
    if (keycloak.token) {
      resolve(keycloak.token);
      return;
    }
    const interval = setInterval(() => {
      if (keycloak.token) {
        clearInterval(interval);
        resolve(keycloak.token);
      }
    }, 50);
    setTimeout(() => {
      clearInterval(interval);
      reject(new Error('Keycloak token nije dostupan'));
    }, timeoutMs);
  });
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  // Osvježi token ako ističe
  if (keycloak.authenticated) {
    await keycloak.updateToken(30).catch(() => keycloak.login());
  }

  // Čekaj token ako još nije dostupan
  const token = await waitForToken().catch(() => null);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text || `HTTP ${res.status}`);
  }

  const text = await res.text();
  if (!text) return undefined as unknown as T;
  const parsed = JSON.parse(text);
  // Unwrap { items: [...] } paginovani odgovor
  if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
    return parsed.items as unknown as T;
  }
  return parsed as T;
}

// --- Groups ---
export const groupsApi = {
  getAll: () => request<Group[]>('/api/group'),
  getById: (publicId: string) => request<Group>(`/api/group/${publicId}`),
  getStandings: (publicId: string) => request<GroupStandings>(`/group/standings/${publicId}`),
  create: (body: CreateGroupRequest) => request<Group>('/api/group', { method: 'POST', body: JSON.stringify(body) }),
  update: (publicId: string, body: UpdateGroupRequest) =>
    request<Group>(`/api/group/${publicId}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (publicId: string) => request<void>(`/api/group/${publicId}`, { method: 'DELETE' }),
};

// --- Teams ---
export const teamsApi = {
  getAll: () => request<Team[]>('/api/team'),
  getById: (publicId: string) => request<Team>(`/api/team/${publicId}`),
  create: (body: CreateTeamRequest) => request<Team>('/api/team', { method: 'POST', body: JSON.stringify(body) }),
  update: (publicId: string, body: UpdateTeamRequest) =>
    request<Team>(`/api/team/${publicId}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (publicId: string) => request<void>(`/api/team/${publicId}`, { method: 'DELETE' }),
};

// --- Stadiums ---
export const stadiumsApi = {
  getAll: () => request<Stadium[]>('/api/stadium'),
};

// --- Matches ---
export const matchesApi = {
  getAll: (query?: GetAllMatchesRequest) => {
    const params = new URLSearchParams();
    if (query?.groupPublicId) params.set('groupPublicId', query.groupPublicId);
    const qs = params.toString();
    return request<Match[]>(`/api/match${qs ? `?${qs}` : ''}`);
  },
  create: (body: CreateMatchRequest) => request<Match>('/api/match', { method: 'POST', body: JSON.stringify(body) }),
  recordResult: (publicId: string, body: RecordMatchResultRequest) =>
    request<Match>(`/api/match/${publicId}/result`, { method: 'PUT', body: JSON.stringify(body) }),
  forfeit: (publicId: string, body: ForfeitMatchRequest) =>
    request<Match>(`/api/match/${publicId}/forfeit`, { method: 'PUT', body: JSON.stringify(body) }),
};