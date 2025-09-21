import Model from './Model';
import Missions, { IncomingApiData as IncomingMissions } from './Missions';

export interface IncomingApiData {
  id: string;
  periode_start: string;
  periode_end: string;
  unit_id: {
    id_sapk: string;
    id_simpeg: number;
    nama_unor: string;
  };
  misi_id: {
    id: string;
    name: string;
    desc: string;
    visi_id: string;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface OutgoingApiData {
  periode_start: string;
  periode_end: string;
  unit_id: number;
  misi_ids: string[];
}

interface FormValue {
  tanggal_mulai: string;
  tanggal_selesai: string;
  id_unit: number;
  ids_misi: string[];
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Renstras extends Model {
  constructor(
    public id: string,
    public tanggal_mulai: string,
    public tanggal_selesai: string,
    public id_unit: {
      id_sapk: string;
      id_simpeg: number;
      nama_unor: string;
    },
    public ids_misi: {
      id: string;
      nama: string;
      deskripsi: string;
      id_visi: string;
      created_at: string;
      updated_at: string;
    }[],
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Renstras> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Renstras>;
    return new Renstras(
      apiData.id,
      apiData.periode_start,
      apiData.periode_end,
      {
        id_sapk: apiData.unit_id.id_sapk,
        id_simpeg: apiData.unit_id.id_simpeg,
        nama_unor: apiData.unit_id.nama_unor
      },
      apiData.misi_id.map((mision) => ({
        id: mision.id,
        id_visi: mision.visi_id,
        nama: mision.name,
        deskripsi: mision.desc,
        created_at: mision.createdAt,
        updated_at: mision.updatedAt
      })),
      apiData.createdAt,
      apiData.updatedAt
    ) as ReturnType<T, IncomingApiData, Renstras>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(renstras: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(renstras)) return renstras.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      unit_id: renstras.id_unit,
      periode_start: renstras.tanggal_mulai,
      periode_end: renstras.tanggal_selesai,
      misi_ids: renstras.ids_misi
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
