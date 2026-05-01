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
   *  pagination?: { page: number; perPage: number; totalItems: number; totalPages: number };
   * }>}
   * */
  static async getAll({ token, page = 1, perPage = 10, search = '' }) {
    const params = {
      page,
      perPage,
      ...(search && { search })
    };
    const response = await api.get('/skp', { token, params });
    if (!response.data) return response;
    return {
      ...response,
      data: response.data,
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
   *  data?: Skps[];
   * }>}
   * */
  static async getAllByUserId({ token, user_id, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/skp/user/${user_id}`, { token, params });
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
   *  pagination?: { page: number; perPage: number; totalItems: number; totalPages: number };
   * }>}
   * */
  static async getByAtasan({ token, id, page = 1, perPage = 10, search = '' }) {
    const params = {
      page,
      perPage,
      ...(search && { search })
    };
    const response = await api.get(`/skp/${id}/bawahan`, { token, params });
    if (!response.data) return response;
    return {
      ...response,
      data: response.data,
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
   *  data?: { rhks: any[]; parentSkpRhk: any[] };
   *  pagination?: { page: number; perPage: number; totalItems: number; totalPages: number };
   * }>}
   * */
  static async getSkpRhks({ token, id, page = 1, per_page = 10 }) {
    const params = { page, per_page };
    const response = await api.get(`/skp/${id}/rhk`, { token, params });
    if (!response.data) return response;
    return {
      ...response,
      data: response.data,
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
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Goals[];
   * }>}
   * */
  static async getDetailSkpByAssessmentPeriod({ token, id, assessment_period_id }) {
    const response = await api.get(`/skp/${id}/penilaian/${assessment_period_id}`, { token });
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
  static async getDetailSkpAssessment({ token, id, assessment_period_id }) {
    const response = await api.get(`/skp/${id}/penilaian/${assessment_period_id}/nilai`, { token });
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
    return await api.post('/skp', { body: data, token });
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
  static async storePenilaianSkp(data, token) {
    return await api.post('/penilaian/predikat', { body: data, token });
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
   * Create SKP for bawahan
   * @param {string} skpId - Parent SKP ID
   * @param {object} data - {bawahanNip, pendekatan}
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async createBawahan(skpId, data, token) {
    return await api.post(`/skp/${skpId}/bawahan`, { body: data, token });
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

  /**
   * Submit SKP for review
   * @param {string} id - SKP ID
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async submitSkp(id, token) {
    return await api.post(`/skp/${id}/submit`, { body: {}, token });
  }

  /**
   * Approve SKP
   * @param {string} id - SKP ID
   * @param {object} data - {remarks?: string}
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async approveSkp(id, data, token) {
    return await api.post(`/skp/${id}/approve`, { body: data, token });
  }

  /**
   * Reject SKP
   * @param {string} id - SKP ID
   * @param {object} data - {remarks: string}
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async rejectSkp(id, data, token) {
    return await api.post(`/skp/${id}/reject`, { body: data, token });
  }
}
