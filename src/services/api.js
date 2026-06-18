import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

const TOKEN_KEY = 'matchcamp_token';

async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function saveToken(token) {
  return AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken() {
  return AsyncStorage.removeItem(TOKEN_KEY);
}

async function request(method, path, body, isFormData = false) {
  const token = await getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData && body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) {
    const errObj = data.error || {};
    const err = new Error(errObj.message || data.message || 'Erro desconhecido');
    err.code = errObj.code || data.code;
    err.status = res.status;
    throw err;
  }
  return data;
}

// Auth
export const login = (email, password) =>
  request('POST', '/v1/auth/login', { email, password });

export const register = (email, password, displayName) =>
  request('POST', '/v1/auth/register', { email, password, display_name: displayName });

export const logout = () => request('POST', '/v1/auth/logout');

export const forgotPassword = (email) =>
  request('POST', '/v1/auth/forgot-password', { email });

export const resetPassword = (token, password) =>
  request('POST', '/v1/auth/reset-password', { token, password });

export const updatePushToken = (token) =>
  request('PUT', '/v1/me/push-token', { token });

export const getGoogleAuthURL = () => `${API_URL}/v1/auth/google`;

// Profile
export const getMe = () => request('GET', '/v1/me');

export const updateProfile = (data) => request('PUT', '/v1/profile', data);

export const uploadProfilePhoto = async (uri, position) => {
  const formData = new FormData();
  const filename = uri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';
  formData.append('photo', { uri, name: filename, type });
  return request('PUT', `/v1/profile/photos/${position}`, formData, true);
};

export const deleteProfilePhoto = (photoId) =>
  request('DELETE', `/v1/profile/photos/${photoId}`);

export const reorderProfilePhotos = (photoIds) =>
  request('PUT', '/v1/profile/photos/order', { photo_ids: photoIds });

export const upsertPreferences = (data) =>
  request('PUT', '/v1/profile/preferences', data);

// Discovery & Swipes
export const getDiscovery = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request('GET', `/v1/discovery${qs ? `?${qs}` : ''}`);
};

export const recordSwipe = (targetUserId, direction) =>
  request('POST', '/v1/swipes', { target_user_id: targetUserId, direction });

// Matches
export const getMatches = () => request('GET', '/v1/matches');

// Conversations & Messages
export const getConversations = () => request('GET', '/v1/conversations');

export const getMessages = (conversationId, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request('GET', `/v1/conversations/${conversationId}/messages${qs ? `?${qs}` : ''}`);
};

export const sendMessage = (conversationId, text) =>
  request('POST', `/v1/conversations/${conversationId}/messages`, {
    conversation_id: conversationId,
    text,
  });

// Public profile
export const getPublicProfile = (userId) =>
  request('GET', `/v1/users/${userId}`);

// Blocks
export const blockUser = (userId) =>
  request('POST', `/v1/users/${userId}/block`);

export const unblockUser = (userId) =>
  request('DELETE', `/v1/users/${userId}/block`);
