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
  static async getAll(token, params = {}) {
    const queryParams = {};

    // Add user_id and date to query params if they exist
    if (params.user_id) queryParams.user_id = params.user_id;
    if (params.date) queryParams.date = params.date;

    const response = await api.get('/harian', { token, params: queryParams });
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
