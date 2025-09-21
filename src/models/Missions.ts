import Model from './Model';
import Visions, { IncomingApiData as IncomingVisions } from './Visions';

export interface IncomingApiData {
  id: string;
  name: string;
  desc: string;
  visi_id: string;
  visi: IncomingVisions;
  createdAt: string;
  updatedAt: string;
}

export interface OutgoingApiData {
  name: string;
  desc: string;
  visi_id: string;
}

interface FormValue {
  nama: string;
  deskripsi: string;
  visi_id: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Missions extends Model {
  constructor(
    public id: string,
    public nama: string,
    public deskripsi: string,
    public id_visi: string,
    public visi: Visions,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Missions> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Missions>;
    return new Missions(
      apiData.id,
      apiData.name,
      apiData.desc,
      apiData.visi_id,
      {
        id: apiData.visi.id,
        nama: apiData.visi.name,
        deskripsi: apiData.visi.desc,
        created_at: apiData.visi.createdAt,
        updated_at: apiData.visi.updatedAt
      },
      apiData.createdAt,
      apiData.updatedAt
    ) as ReturnType<T, IncomingApiData, Missions>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(missions: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(missions)) return missions.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: missions.nama,
      desc: missions.deskripsi,
      visi_id: missions.visi_id
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
