/* eslint-disable no-unused-vars */
import api from '@/utils/api';

export default class HarianService {
  /**
   * @param {string} token
   * @param {Object} params - Optional parameters for filtering
   * @param {string} [params.user_id] - Filter by user_id
   * @param {string} [params.date] - Filter by date (YYYY-MM-DD)
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: any[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/harian', { token, params });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }
  /**
   * @param {Object} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/harian', { body: data, token });
  }

  /**
   * @param {number} id
   * @param {Object} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/harian/${id}`, { body: data, token });
  }

  /**
   * @param {number} id
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async delete(id, token) {
    return await api.delete(`/harian/${id}`, { token });
  }
}
