import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  desc: string;
  startDate: string;
  endDate: string;
  unitId: string;
  misis: {
    id: string;
    name: string;
    desc: string;
    visiId: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface OutgoingApiData {
  name: string;
  desc: string;
  startDate: string;
  endDate: string;
  unitId: number;
  misiIds: string[];
}

interface FormValue {
  nama: string;
  deskripsi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  id_unit: number;
  ids_misi: string[];
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Renstras extends Model {
  constructor(
    public id: string,
    public name: string,
    public deskripsi: string,
    public tanggal_mulai: string,
    public tanggal_selesai: string,
    public id_unit: string,
    public ids_misi: {
      id: string;
      nama: string;
      deskripsi: string;
      id_visi: string;
      created_at: string;
      updated_at: string;
    }[]
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Renstras> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Renstras>;
    return new Renstras(
      apiData.id,
      apiData.name,
      apiData.desc,
      apiData.startDate,
      apiData.endDate,
      apiData.unitId,
      apiData.misis.map((mision) => ({
        id: mision.id,
        id_visi: mision.visiId,
        nama: mision.name,
        deskripsi: mision.desc,
        created_at: mision.createdAt,
        updated_at: mision.updatedAt
      }))
    ) as ReturnType<T, IncomingApiData, Renstras>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(renstras: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(renstras)) return renstras.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: renstras.nama,
      desc: renstras.deskripsi,
      unitId: renstras.id_unit,
      startDate: renstras.tanggal_mulai,
      endDate: renstras.tanggal_selesai,
      misiIds: renstras.ids_misi
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
