/* eslint-disable no-unused-vars */
import api from '@/utils/api';

export default class RhkService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Rhk[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/rhk', { token, params });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Rhk[];
   * }>}
   * */
  static async getBySkp({ token, skp_id, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/skp/${skp_id}/rhk`, { token, params });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * Add RHK to SKP (new endpoint)
   * @param {string} skpId - SKP ID
   * @param {object} data - RHK data
   * @param {string} token
   * @returns {Promise<Response>}
   */
  static async addToSkp(skpId, data, token) {
    return await api.post(`/skp/${skpId}/rhk/add`, { body: data, token });
  }

  /**
   * @param {Rhk} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/rhk', { body: data, token });
  }

  /**
   * @param {number} id
   * @param {Rhk} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/rhk/${id}`, { body: data, token });
  }

  /**
   * Update RHK for SKP (with skpId and rhkId)
   * @param {string} skpId - SKP ID
   * @param {string} rhkId - RHK ID
   * @param {object} data - RHK data
   * @param {string} token
   * @returns {Promise<Response>}
   */
  static async updateInSkp(skpId, rhkId, data, token) {
    return await api.patch(`/skp/${skpId}/rhk/${rhkId}`, { body: data, token });
  }

  /**
   * @param {string} skpId
   * @param {string} rhkId
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async delete(skpId, rhkId, token) {
    return await api.delete(`/skp/${skpId}/rhk/${rhkId}`, { token });
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
    return await api.delete(`/rhk/multi-delete/?id=${ids.join(',')}`, { token });
  }

  /**
   * Add aspek to RHK
   * @param {string} skpId - SKP ID
   * @param {string} rhkId - RHK ID
   * @param {object} data - Aspek data
   * @param {string} token
   * @returns {Promise<Response>}
   */
  static async addAspek(skpId, rhkId, data, token) {
    return await api.post(`/skp/${skpId}/rhk/${rhkId}/aspek`, { body: data, token });
  }

  /**
   * Update aspek in RHK
   * @param {string} skpId - SKP ID
   * @param {string} rhkId - RHK ID
   * @param {string} aspekId - Aspek ID
   * @param {object} data - Aspek data
   * @param {string} token
   * @returns {Promise<Response>}
   */
  static async updateAspek(skpId, rhkId, aspekId, data, token) {
    return await api.patch(`/skp/${skpId}/rhk/${rhkId}/aspek/${aspekId}`, { body: data, token });
  }

  /**
   * Delete aspek from RHK
   * @param {string} skpId - SKP ID
   * @param {string} rhkId - RHK ID
   * @param {string} aspekId - Aspek ID
   * @param {string} token
   * @returns {Promise<Response>}
   */
  static async deleteAspek(skpId, rhkId, aspekId, token) {
    return await api.delete(`/skp/${skpId}/rhk/${rhkId}/aspek/${aspekId}`, { token });
  }
}
