/* eslint-disable no-unused-vars */
import { Rkts } from '@/models';
import api from '@/utils/api';

export default class RktsService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Rkts[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    // Transform filters to match API parameter names
    const transformedFilters = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value === null || value === undefined || value === '') continue;
      if (key === 'perPage') transformedFilters.perPage = value;
      else if (key === 'page') transformedFilters.page = value;
      else if (key === 'search') transformedFilters.search = value;
      else if (key === 'unitIds') {
        transformedFilters.unitIds = Array.isArray(value) ? value : [value];
      } else {
        transformedFilters[key] = value;
      }
    }
    const response = await api.get('/rkt', { token, params: transformedFilters });

    if (!response.data) return response;
    const dataArray = Array.isArray(response.data) ? response.data : [];
    return { 
      ...response, 
      data: Rkts.fromApiData(dataArray), 
      totalData: response.pagination?.totalItems || 0, 
      pagination: response.pagination 
    };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Rkts[];
   * }>}
   * */
  static async getById(token, id) {
    const response = await api.get(`/rkt/${id}`, { token });
    if (!response.data) return response;
    return { ...response, data: Rkts.fromApiData(response.data) };
  }

  /**
   * @param {Rkts} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/rkt', { body: Rkts.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {Rkts} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/rkt/${id}`, { body: Rkts.toApiData(data), token });
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
    return await api.delete(`/rkt/${id}`, { token });
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
    return await api.delete(`/rkt/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
