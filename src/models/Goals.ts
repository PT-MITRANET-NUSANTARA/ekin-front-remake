import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  unit_id: {
    id_sapk: string;
    id_simpeg: number;
    nama_unor: string;
  };
  renstra: {
    id: string;
    periode_start: string;
    periode_end: string;
    unit_id: number;
  };
  indikator_kinerja_id: {
    id: string;
    name: string;
    target: string;
    satuan: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface OutgoingApiData {
  name: string;
  renstra_id: string;
  unit_id: number;
  indikator_kinerja: {
    name: string;
    target: string;
    satuan: string;
  }[];
}

interface FormValue {
  nama: string;
  id_renstra: string;
  id_unit: number;
  indikator_kinerja: {
    nama: string;
    target: string;
    satuan: string;
  }[];
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Goals extends Model {
  constructor(
    public id: string,
    public nama: string,
    public id_unit: {
      id_sapk: string;
      id_simpeg: number;
      nama_unor: string;
    },
    public renstra: {
      id: string;
      tanggal_mulai: string;
      tanggal_selesai: string;
      id_unit: number;
    },
    public indikator_kinerja: {
      id: string;
      nama: string;
      target: string;
      satuan: string;
    }[],
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Goals> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Goals>;
    return new Goals(
      apiData.id,
      apiData.name,
      {
        id_sapk: apiData.unit_id.id_sapk,
        id_simpeg: apiData.unit_id.id_simpeg,
        nama_unor: apiData.unit_id.nama_unor
      },
      {
        id: apiData.renstra.id,
        tanggal_mulai: apiData.renstra.periode_start,
        tanggal_selesai: apiData.renstra.periode_end,
        id_unit: apiData.renstra.unit_id
      },
      apiData.indikator_kinerja_id.map((item) => ({
        id: item.id,
        nama: item.name,
        target: item.target,
        satuan: item.satuan
      })),
      apiData.createdAt,
      apiData.updatedAt
    ) as ReturnType<T, IncomingApiData, Goals>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(goals: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(goals)) return goals.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: goals.nama,
      indikator_kinerja: goals.indikator_kinerja.map((item) => ({
        name: item.nama,
        target: item.target,
        satuan: item.satuan
      })),
      renstra_id: goals.id_renstra,
      unit_id: goals.id_unit
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
