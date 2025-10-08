import api from '@/utils/api';

export default class UserService {
  /**
   * Mengambil data user berdasarkan unit_id
   * @param {string} token - Token autentikasi
   * @param {string} unitId - ID unit kerja
   * @param {Object} options - Opsi tambahan seperti search, page, perPage
   * @returns {Promise<{
   *  code: number;
   *  status: boolean;
   *  message: string;
   *  data?: Array<Object>;
   * }>}
   * */
  static async getUsersByUnit({ token, unitId, search = '', page = 1, perPage = 10 }) {
    const params = { search, page, perPage };
    const response = await api.get(`/user/unit/${unitId}`, { token, params });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }
}
