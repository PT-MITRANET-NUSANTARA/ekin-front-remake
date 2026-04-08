import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  unitId: string;
  totalAnggaran: number;
  kegiatanId: string;
  kegiatan: {
    id: string;
    name: string;
    totalAnggaran: number;
  };
  indicators: {
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
  unitId: number;
  totalAnggaran: number;
  kegiatanId: string;
  indicators: {
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
    public id_unit: string,
    public total_anggaran: number,
    public id_kegiatan: string,
    public kegiatan: {
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
      apiData.unitId,
      Number(apiData.totalAnggaran),
      apiData.kegiatanId,
      {
        id: apiData.kegiatan.id,
        nama: apiData.kegiatan.name,
        total_anggaran: apiData.kegiatan.totalAnggaran
      },
      apiData.indicators.map((item) => ({
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
      unitId: subActivities.id_unit,
      totalAnggaran: subActivities.total_anggaran,
      kegiatanId: subActivities.id_kegiatan,
      indicators: subActivities.indikator_kinerja.map((item) => ({
        name: item.nama,
        target: item.target,
        satuan: item.satuan
      }))
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
