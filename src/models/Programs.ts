import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  unitId: string;
  totalAnggaran: number;
  tujuanId: string;
  tujuan: {
    id: string;
    name: string;
    unitId: number;
    renstraId: string;
    createdAt: string;
    updatedAt: string;
  };
  indicators: {
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
  unitId: number;
  totalAnggaran: number;
  tujuanId: string;
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
    public id_unit: string,
    public total_anggaran: number,
    public id_tujuan: string,
    public tujuan: {
      id: string;
      nama: string;
      id_unit: number;
      renstra_id: string;
      created_at: string;
      updated_at: string;
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
      apiData.unitId,
      Number(apiData.totalAnggaran),
      apiData.tujuanId,
      {
        id: apiData.tujuanId,
        nama: apiData.tujuan.name,
        id_unit: apiData.tujuan.unitId,
        renstra_id: apiData.tujuan.renstraId,
        created_at: apiData.tujuan.createdAt,
        updated_at: apiData.tujuan.updatedAt
      },
      apiData.indicators.map((item) => ({
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
      unitId: programs.id_unit,
      totalAnggaran: programs.total_anggaran,
      tujuanId: programs.id_tujuan,
      indicators: programs.indikator_kinerja.map((item) => ({
        name: item.nama,
        target: item.target,
        satuan: item.satuan
      }))
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
