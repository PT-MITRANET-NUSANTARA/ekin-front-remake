/* eslint-disable no-unused-vars */
import { AssessmentPeriod } from '@/models';
import api from '@/utils/api';

export default class AssessmentPeriodService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: AssessmentPeriod[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/periode-penilaian', { token, params });
    if (!response.data) return response;
    return { ...response, data: AssessmentPeriod.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: AssessmentPeriod[];
   * }>}
   * */
  static async getById(token, id) {
    const response = await api.get(`/periode-penilaian/${id}`, { token });
    if (!response.data) return response;
    return { ...response, data: AssessmentPeriod.fromApiData(response.data) };
  }

  /**
   * @param {AssessmentPeriod} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/periode-penilaian', { body: AssessmentPeriod.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {AssessmentPeriod} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/periode-penilaian/${id}`, { body: AssessmentPeriod.toApiData(data), token });
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
    return await api.delete(`/periode-penilaian/${id}`, { token });
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
    return await api.delete(`/periode-penilaian/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
