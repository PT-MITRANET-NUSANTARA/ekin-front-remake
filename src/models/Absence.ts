import Model from './Model';
import { AbsenceStatus } from '@/constants/AbsenceStatus';

export interface IncomingApiData {
  id: string;
  user_id: string;
  date: string;
  status: AbsenceStatus;
  unit_id: string;
  desc: string;
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  user_id: string;
  date: string;
  status: AbsenceStatus;
  unit_id: string;
  desc: string;
}

interface FormValue {
  id_user: string;
  tanggal: string;
  status: AbsenceStatus;
  id_unit: string;
  keterangan: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Absence extends Model {
  constructor(
    public id: string,
    public id_user: string,
    public tanggal: string,
    public status: AbsenceStatus,
    public id_unit: string,
    public keterangan: string,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Absence> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Absence>;
    return new Absence(
      apiData.id,
      apiData.user_id,
      apiData.date,
      apiData.status,
      apiData.unit_id,
      apiData.desc,
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, Absence>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(absence: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(absence)) return absence.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      user_id: absence.id_user,
      date: absence.tanggal,
      status: absence.status,
      unit_id: absence.id_unit,
      desc: absence.keterangan
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}