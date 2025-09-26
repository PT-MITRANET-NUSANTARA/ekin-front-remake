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
  tujuan_id: {
    id: string;
    name: string;
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
  unit_id: number;
  total_anggaran: number;
  tujuan_id: string;
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
  id_tujuan: string;
  indikator_kinerja: {
    nama: string;
    target: string;
    satuan: string;
  }[];
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Programs extends Model {
  constructor(
    public id: string,
    public nama: string,
    public id_unit: {
      id_sapk: string;
      id_simpeg: number;
      nama_unor: string;
    },
    public total_anggaran: number,
    public id_tujuan: {
      id: string;
      nama: string;
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

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Programs> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Programs>;
    return new Programs(
      apiData.id,
      apiData.name,
      {
        id_sapk: apiData.unit_id.id_sapk,
        id_simpeg: apiData.unit_id.id_simpeg,
        nama_unor: apiData.unit_id.nama_unor
      },
      Number(apiData.total_anggaran),
      {
        id: apiData.tujuan_id.id,
        nama: apiData.tujuan_id.name
      },
      apiData.indikator_kinerja_id.map((item) => ({
        id: item.id,
        nama: item.name,
        target: item.target,
        satuan: item.satuan
      })),
      apiData.createdAt,
      apiData.updatedAt
    ) as ReturnType<T, IncomingApiData, Programs>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(programs: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(programs)) return programs.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: programs.nama,
      unit_id: programs.id_unit,
      total_anggaran: programs.total_anggaran,
      tujuan_id: programs.id_tujuan,
      indikator_kinerja: programs.indikator_kinerja.map((item) => ({
        name: item.nama,
        target: item.target,
        satuan: item.satuan
      }))
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
