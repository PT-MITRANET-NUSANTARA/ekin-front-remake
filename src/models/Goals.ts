import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  unitId: string;
  renstraId: string;
  renstra: {
    id: string;
    name: string;
    desc: string;
    startDate: string;
    endDate: string;
    unitId: number;
    createdAt: number;
    updatedAt: number;
  };
  indicators: {
    name: string;
    target: string;
    satuan: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface OutgoingApiData {
  name: string;
  renstraId: string;
  unitId: number;
  indicators: {
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
    public id_unit: string,
    public id_renstra: string,
    public renstra: {
      id: string;
      nama: string;
      deskripsi: string;
      tanggal_mulai: string;
      tanggal_selesai: string;
      id_unit: number;
      created_at: number;
      updated_at: number;
    },
    public indikator_kinerja: {}[],
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
      apiData.unitId,
      apiData.renstraId,
      {
        id: apiData.renstra.id,
        nama: apiData.renstra.name,
        deskripsi: apiData.renstra.desc,
        tanggal_mulai: apiData.renstra.startDate,
        tanggal_selesai: apiData.renstra.endDate,
        id_unit: apiData.renstra.unitId,
        created_at: apiData.renstra.createdAt,
        updated_at: apiData.renstra.updatedAt
      },
      apiData.indicators.map((item) => ({
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
      indicators: goals.indikator_kinerja.map((item) => ({
        name: item.nama,
        target: item.target,
        satuan: item.satuan
      })),
      renstraId: goals.id_renstra,
      unitId: goals.id_unit
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
