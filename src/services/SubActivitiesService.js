/* eslint-disable no-unused-vars */
import { SubActivities } from '@/models';
import api from '@/utils/api';

export default class SubActivitiesService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: SubActivities[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/sub-kegiatan', { token, params });
    if (!response.data) return response;

    return { ...response, data: SubActivities.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Activities[];
   * }>}
   * */
  static async getById(token, id) {
    const response = await api.get(`/sub-kegiatan/${id}`, { token });
    if (!response.data) return response;
    return { ...response, data: SubActivities.fromApiData(response.data) };
  }

  /**
   * @param {SubActivities} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/sub-kegiatan', { body: SubActivities.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {SubActivities} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    console.log(data);

    return await api.patch(`/sub-kegiatan/${id}`, { body: SubActivities.toApiData(data), token });
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
    return await api.delete(`/sub-kegiatan/${id}`, { token });
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
    return await api.delete(`/sub-kegiatan/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
