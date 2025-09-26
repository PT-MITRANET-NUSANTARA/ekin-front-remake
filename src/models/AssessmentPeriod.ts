import Model from './Model';

export interface IncomingApiData {
  id: string;
  periode_start: string;
  periode_end: string;
  unit_id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutgoingApiData {
  name: string;
  periode_start: string;
  periode_end: string;
  unit_id: number;
}

interface FormValue {
  nama: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  id_unit: number;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class AssessmentPeriod extends Model {
  constructor(
    public id: string,
    public tanggal_mulai: string,
    public tanggal_selesai: string,
    public id_unit: number,
    public nama: string,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, AssessmentPeriod> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, AssessmentPeriod>;
    return new AssessmentPeriod(apiData.id, apiData.periode_start, apiData.periode_end, apiData.unit_id, apiData.name, apiData.createdAt, apiData.updatedAt) as ReturnType<T, IncomingApiData, AssessmentPeriod>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(assessmentPeriod: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(assessmentPeriod)) return assessmentPeriod.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: assessmentPeriod.nama,
      periode_start: assessmentPeriod.tanggal_selesai,
      periode_end: assessmentPeriod.tanggal_selesai,
      unit_id: assessmentPeriod.id_unit
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
