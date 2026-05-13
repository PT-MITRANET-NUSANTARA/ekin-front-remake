/* eslint-disable no-unused-vars */
import api from '@/utils/api';

export default class JptService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Jpt[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/unor', { token, params });
    if (!response.data) return response;
    return {
      ...response,
      data: response.data,
      pagination: response.pagination ? {
        total: response.pagination.totalItems,
        per_page: response.pagination.perPage,
        current_page: response.pagination.page,
        last_page: response.pagination.totalPages
      } : undefined
    };
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
    const response = await api.get(`/unor/${id}/details`, { token });
    if (!response.data) return response;
    return { ...response, data: response.data };
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
  static async getByUnitId(token, unitKerjaId) {
    const response = await api.get(`/pimpinan-unit-kerja/unit/${unitKerjaId}`, { token });
    if (!response.data) return response;
    return { ...response, data: response.data };
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
  static async getJptByUnitId(token, unitKerjaId) {
    try {
      // Try new endpoint first
      const response = await api.get(`/jpt/unit/${unitKerjaId}`, { token });
      if (!response.data) return response;
      return { ...response, data: response.data };
    } catch (error) {
      // Fallback: fetch all and filter locally
      console.warn('JPT unit endpoint not available, fetching all JPT and filtering locally');
      const allResponse = await api.get('/jpt', { token });
      if (!allResponse.data) return allResponse;
      const filtered = (allResponse.data || []).filter(jpt => jpt.unitId === unitKerjaId);
      return { ...allResponse, data: filtered };
    }
  }

  /**
   * @param {object} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async storePimpinanUnitKerja(data, token) {
    return await api.post('/pimpinan-unit-kerja', { body: data, token });
  }

  /**
   * @param {string} id
   * @param {object} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async updatePimpinanUnitKerja(id, data, token) {
    return await api.patch(`/pimpinan-unit-kerja/${id}`, { body: data, token });
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
  static async deletePimpinanUnitKerja(id, token) {
    return await api.delete(`/pimpinan-unit-kerja/${id}`, { token });
  }

  /**
   * @param {Umpeg} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/jpt', { body: data, token });
  }

  /**
   * @param {number} id
   * @param {Umpeg} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/jpt/${id}`, { body: data, token });
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
    return await api.delete(`/jpt/${id}`, { token });
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
    return await api.delete(`/jpt/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
