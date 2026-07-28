import api from '@/utils/api';

export default class CalendarsService {
  static async getByUnitId(token, unitId) {
    const response = await api.get(`/kalender/unit/${unitId}`, { token });
    if (!response.data) return response;
    const data = response.data?.items ? response.data : { items: response.data };
    return { ...response, data };
  }

  static async store(data, token) {
    return await api.post('/kalender', { body: data, token });
  }

  static async update(id, data, token) {
    return await api.patch(`/kalender/${id}`, { body: data, token });
  }

  static async delete(id, token) {
    return await api.delete(`/kalender/${id}`, { token });
  }

  static async storeHoliday(data, token) {
    return await api.post('/kalender/holiday/add', { body: data, token });
  }

  static async deleteHoliday(id, token) {
    return await api.delete(`/kalender/holiday/${id}`, { token });
  }
}
