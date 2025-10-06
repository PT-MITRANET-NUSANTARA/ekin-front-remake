/* eslint-disable no-unused-vars */
import { Absence } from '@/models';
import api from '@/utils/api';

export default class AbsenceService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Absence[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/absence', { token, params });
    if (!response.data) return response;
    return { ...response, data: Absence.fromApiData(response.data) };
  }

  /**
   * @param {Absence} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/absence', { body: Absence.toApiData(data), token });
  }

  /**
   * @param {string} id
   * @param {Absence} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/absence/${id}`, { body: Absence.toApiData(data), token });
  }

  /**
   * @param {string} id
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async delete(id, token) {
    return await api.delete(`/absence/${id}`, { token });
  }

  /**
   * @param {string[]} ids
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async deleteBatch(ids, token) {
    return await api.delete(`/absence/multi-delete/?id=${ids.join(',')}`, { token });
  }
}