import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  unitId: string;
  totalAnggaran: number;
  programId: string;
  program: {
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
  programId: string;
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
    public id_unit: string,
    public total_anggaran: number,
    public id_program: string,
    public program: {
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
      apiData.unitId,
      Number(apiData.totalAnggaran),
      apiData.programId,
      {
        id: apiData.program.id,
        nama: apiData.program.name,
        total_anggaran: apiData.program.totalAnggaran
      },
      apiData.indicators.map((item) => ({
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
      unitId: activities.id_unit,
      totalAnggaran: activities.total_anggaran,
      programId: activities.id_program,
      indicators: activities.indikator_kinerja.map((item) => ({
        name: item.nama,
        target: item.target,
        satuan: item.satuan
      }))
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
