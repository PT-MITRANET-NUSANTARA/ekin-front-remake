import Model from './Model';

export interface OutgoingApiData {
  periode_start: string;
  periode_end: string;
  user_id: number;
  pendekatan: 'KUANTITATIF' | 'KUALITATIF';
  renstra_id: string;
}

interface FormValue {
  tanggal_mulai: string;
  tanggal_selesai: string;
  id_user: number;
  pendekatan: 'KUANTITATIF' | 'KUALITATIF';
  renstra_id: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Skps extends Model {
  public static toApiData<T extends FormValue | FormValue[]>(skps: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(skps)) return skps.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      periode_start: skps.tanggal_mulai,
      periode_end: skps.tanggal_selesai,
      user_id: skps.id_user,
      pendekatan: skps.pendekatan,
      renstra_id: skps.renstra_id
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

