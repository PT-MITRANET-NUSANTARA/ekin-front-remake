/* eslint-disable no-unused-vars */
import { Skps } from '@/models';
import api from '@/utils/api';

export default class SkpsService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Skps[];
   * }>}
   * */
  static async getAll({ token, user_id, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/skp/user/${user_id}`, { token, params });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {string} token
   * @returns {Promise<{a
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Skps[];
   * }>}
   * */
  static async getByAtasan({ token, id, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/skp/${id}/bawahan`, { token, params });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Skps[];
   * }>}
   * */
  static async getMatriks({ token, id, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/skp/${id}/matriks`, { token, params });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Goals[];
   * }>}
   * */
  static async getById({ token, id, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/skp/${id}`, { token, params });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {Skps} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/skp', { body: Skps.toApiData(data), token });
  }

  /**
   * @param {Skps} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async storeBawahan(data, token) {
    return await api.post('/skp', { body: data, token });
  }

  /**
   * @param {number} id
   * @param {Skps} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/skp/${id}`, { body: data, token });
  }

  /**
   * @param {number} id
   * @param {Skps} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async aspekUpdate(id, data, token) {
    return await api.patch(`/aspek/${id}`, { body: data, token });
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
    return await api.delete(`/skp/${id}`, { token });
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
  static async aspekDelete(id, token) {
    return await api.delete(`/aspek/${id}`, { token });
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
    return await api.delete(`/skp/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
