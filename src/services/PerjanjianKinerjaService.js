/* eslint-disable no-unused-vars */
import api from '@/utils/api';

export default class PerjanjianKinerjaService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: PerjanjianKinerja[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/perjanjian-kinerja', { token, params });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {string} token
   * @param {string} skp_id
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: any;
   * }>}
   * */
  static async getTemplate({ token, skp_id, signal }) {
    const response = await api.get(`/perjanjian-kinerja/skp/${skp_id}/template`, { token, signal });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: PerjanjianKinerja[];
   * }>}
   * */
  static async download(token, id) {
    const response = await api.get(`/perjanjian-kinerja/${id}/download`, { token });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {PerjanjianKinerja} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    return await api.post('/perjanjian-kinerja', { body: data, token, file: { file: file } });
  }

  /**
   * @param {number} id
   * @param {PerjanjianKinerja} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/perjanjian-kinerja/edit/${id}`, { body: data, token });
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
    return await api.delete(`/perjanjian-kinerja/${id}`, { token });
  }

  /**
   * @param {number[]} ids
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async deleteBatch(ids, token) {
    return await api.delete(`/perjanjian-kinerja/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
