import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  unit_id: {
    id_sapk: string;
    id_simpeg: number;
  };
  total_anggaran: number;
  kegiatan_id: {
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
  kegiatan_id: string;
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
  id_kegiatan: string;
  indikator_kinerja: {
    nama: string;
    target: string;
    satuan: string;
  }[];
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class SubActivities extends Model {
  constructor(
    public id: string,
    public nama: string,
    public id_unit: {
      id_sapk: string;
      id_simpeg: number;
    },
    public total_anggaran: number,
    public id_kegiatan: {
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

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, SubActivities> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, SubActivities>;
    return new SubActivities(
      apiData.id,
      apiData.name,
      {
        id_sapk: apiData.unit_id.id_sapk,
        id_simpeg: apiData.unit_id.id_simpeg
      },
      Number(apiData.total_anggaran),
      {
        id: apiData.kegiatan_id.id,
        nama: apiData.kegiatan_id.name,
        total_anggaran: apiData.kegiatan_id.total_anggaran
      },
      apiData.indikator_kinerja_id.map((item) => ({
        id: item.id,
        nama: item.name,
        target: item.target,
        satuan: item.satuan
      })),
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, SubActivities>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(subActivities: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(subActivities)) return subActivities.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: subActivities.nama,
      unit_id: subActivities.id_unit,
      total_anggaran: subActivities.total_anggaran,
      kegiatan_id: subActivities.id_kegiatan,
      indikator_kinerja: subActivities.indikator_kinerja.map((item) => ({
        name: item.nama,
        target: item.target,
        satuan: item.satuan
      }))
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
