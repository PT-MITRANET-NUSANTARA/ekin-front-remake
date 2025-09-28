import { User } from '@/models';
import api from '@/utils/api';

export default class AuthService {
  /**
   * Logs in a user with the provided email and password.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<{
   *   code: HTTPStatusCode,
   *   status: boolean,
   *   message: string,
   *   data?: string
   * }>} - A promise that resolves to an object containing the HTTP status code, status, message, and authentication token.
   */
  static async login(username, password) {
    const response = await api.post('/auth/login', { body: { username, password }, base: 'public' });
    if (!response.data) return response;
    return {
      ...response,
      data: response.data
    };
  }

  /**
   * @param {string} token
   * @returns {Promise<Promise<{
   *   code: HTTPStatusCode,
   *   status: boolean,
   *   message: string,
   *   data?: User
   * }>}
   */
  static async me(token) {
    const response = await api.get('/auth/profile', { token });
    if (!response.data) return response;
    return { ...response, data: User.fromApiData(response.data, token) };
  }

  static async getDetailProfile(token, nip) {
    const response = await api.get(`/user/${nip}`, { token });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  static async getSubordinate({ token: token, unit: unit_id, unor: unor_id }) {
    const response = await api.get(`/user/unit/${unit_id}/unor/${unor_id}`, { token });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  static async logout() {
    return await api.post('/auth/logout');
  }

  static async verifyToken(token) {
    return await api.post('/auth/verify', { token });
  }

  static async getPhoto(token) {
    const response = await api.getFile('/auth/profile/foto', token);
    return response;
  }

  static async forgot(email) {
    return await api.post('/auth/forgot-password', { body: { email } });
  }

  static async reset(token, password, password_confirmation) {
    return await api.post('/auth/reset-password', { body: { password, password_confirmation, token } });
  }

  static async changeProfile(token, data) {
    return await api.put('/auth/change-profile', { body: data, token });
  }

  static async changePassword(token, data) {
    return await api.post('/auth/change-password', { body: data, token });
  }
}
