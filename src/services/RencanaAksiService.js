import api from '@/utils/api';

export default class RencanaAksiService {
  /**
   * Get rencana aksi and RHK periode penilaians for a SKP
   * @param {{ token: string, skpId: string }} params
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: { rhkPeriodePenilaians: Array, rencanaAksis: Array };
   * }>}
   */
  static async getBySkp(params) {
    const { token, skpId } = params;
    const response = await api.get(`/skp/${skpId}/rencana-aksi`, { token });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * Create rencana aksi for a RHK periode penilaian
   * @param {{ rhkPeriodePenilaianId: string, desc: string, startDate: string, endDate: string }} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async store(data, token) {
    const { rhkPeriodePenilaianId, desc, startDate, endDate } = data;
    return await api.post(`/rhk-periode-penilaian/${rhkPeriodePenilaianId}/rencana-aksi`, {
      body: { desc, startDate, endDate },
      token
    });
  }

  /**
   * Update rencana aksi
   * @param {{ rhkPeriodePenilaianId: string, rencanaAksiId: string, desc: string, startDate: string, endDate: string }} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(data, token) {
    const { rhkPeriodePenilaianId, rencanaAksiId, desc, startDate, endDate } = data;
    return await api.patch(
      `/rhk-periode-penilaian/${rhkPeriodePenilaianId}/rencana-aksi/${rencanaAksiId}`,
      { body: { desc, startDate, endDate }, token }
    );
  }

  /**
   * Delete rencana aksi
   * @param {{ rhkPeriodePenilaianId: string, rencanaAksiId: string }} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async delete(data, token) {
    const { rhkPeriodePenilaianId, rencanaAksiId } = data;
    return await api.delete(
      `/rhk-periode-penilaian/${rhkPeriodePenilaianId}/rencana-aksi/${rencanaAksiId}`,
      { token }
    );
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
    return await api.delete(`/rencana-aksi/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
