import api from '@/utils/api';
import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  desc: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutgoingApiData {
  name: string;
  desc: string;
}

interface FormValue {
  nama: string;
  deskripsi: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Visions extends Model {
  constructor(
    public id: string,
    public nama: string,
    public deskripsi: string,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Visions> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Visions>;
    return new Visions(apiData.id, apiData.name, apiData.desc, apiData.createdAt, apiData.updatedAt) as ReturnType<T, IncomingApiData, Visions>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(visions: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(visions)) return visions.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: visions.nama,
      desc: visions.deskripsi
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
