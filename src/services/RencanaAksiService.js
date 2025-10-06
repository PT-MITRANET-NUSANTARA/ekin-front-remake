import api from '@/utils/api';

export default class RencanaAksiService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: RencanaAksi[];
   * }>}
   * */
  static async getAll(token) {
    const response = await api.get('/rencana-aksi', { token });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {RencanaAksi} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/rencana-aksi', { body: data, token });
  }

  /**
   * @param {number} id
   * @param {RencanaAksi} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/rencana-aksi/${id}`, { body: data, token });
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
    return await api.delete(`/rencana-aksi/${id}`, { token });
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
