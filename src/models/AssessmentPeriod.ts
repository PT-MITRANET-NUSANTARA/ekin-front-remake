import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  unitId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OutgoingApiData {
  name: string;
  startDate: string;
  endDate: string;
  unitId: string;
}

interface FormValue {
  nama: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  id_unit: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class AssessmentPeriod extends Model {
  constructor(
    public id: string,
    public nama: string,
    public tanggal_mulai: string,
    public tanggal_selesai: string,
    public id_unit: string,
    public created_at?: string,
    public updated_at?: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, AssessmentPeriod> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, AssessmentPeriod>;
    return new AssessmentPeriod(apiData.id, apiData.name, apiData.startDate, apiData.endDate, apiData.unitId, apiData.createdAt, apiData.updatedAt) as ReturnType<T, IncomingApiData, AssessmentPeriod>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(assessmentPeriod: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(assessmentPeriod)) return assessmentPeriod.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: assessmentPeriod.nama,
      startDate: assessmentPeriod.tanggal_mulai,
      endDate: assessmentPeriod.tanggal_selesai,
      unitId: assessmentPeriod.id_unit
    };
    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
