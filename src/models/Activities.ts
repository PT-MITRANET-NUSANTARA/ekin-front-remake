import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  unit_id: {
    id_sapk: string;
    id_simpeg: number;
    nama_unor: string;
  };
  total_anggaran: number;
  program_id: {
    id: string;
    name: string;
    total_anggaran: number;
  };
  indikator_kinerja_id: {
    id: string;
    name: string;
    target: string;
    satuan: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  name: string;
  unit_id: number;
  total_anggaran: number;
  program_id: string;
  indikator_kinerja: {
    name: string;
    target: string;
    satuan: string;
  }[];
}

interface FormValue {
  nama: string;
  id_unit: number;
  total_anggaran: number;
  id_program: string;
  indikator_kinerja: {
    nama: string;
    target: string;
    satuan: string;
  }[];
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Activities extends Model {
  constructor(
    public id: string,
    public nama: string,
    public id_unit: {
      id_sapk: string;
      id_simpeg: number;
      nama_unor: string;
    },
    public total_anggaran: number,
    public id_program: {
      id: string;
      nama: string;
      total_anggaran: number;
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

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Activities> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Activities>;
    return new Activities(
      apiData.id,
      apiData.name,
      {
        id_sapk: apiData.unit_id.id_sapk,
        id_simpeg: apiData.unit_id.id_simpeg,
        nama_unor: apiData.unit_id.nama_unor
      },
      Number(apiData.total_anggaran),
      {
        id: apiData.program_id.id,
        nama: apiData.program_id.name,
        total_anggaran: apiData.program_id.total_anggaran
      },
      apiData.indikator_kinerja_id.map((item) => ({
        id: item.id,
        nama: item.name,
        target: item.target,
        satuan: item.satuan
      })),
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, Activities>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(activities: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(activities)) return activities.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: activities.nama,
      unit_id: activities.id_unit,
      total_anggaran: activities.total_anggaran,
      program_id: activities.id_program,
      indikator_kinerja: activities.indikator_kinerja.map((item) => ({
        name: item.nama,
        target: item.target,
        satuan: item.satuan
      }))
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
