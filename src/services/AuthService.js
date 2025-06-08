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
  static async login(email, password) {
    const response = await api.post('/auth/login', { body: { email, password } });
    if (!response.data) return response;
    return {
      ...response,
      data: response.data.token
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
    const response = await api.get('/auth/me', { token });
    if (!response.data) return response;
    return { ...response, data: User.fromApiData(response.data, token) };
  }

  static async logout() {
    return await api.post('/auth/logout');
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
