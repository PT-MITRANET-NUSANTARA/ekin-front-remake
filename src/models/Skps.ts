import Model from './Model';

export interface IncomingApiData {
  id: string;
  periode_start: string;
  periode_end: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  pendekatan: 'KUALITATIF' | 'KUANTITATIF';
  lampiran: string | null;
  user_id: number;
  atasan_skp_id: string | null;
  posjab: {
    id_posjab: string;
    unor: {
      id: string;
      nama: string;
      atasan: {
        unor_id: string;
        unor_nama: string;
        unor_jabatan: string;
        asn: {
          idasn_atasan: number;
          nip_atasan: number;
          nama_atasan: string;
        };
      };
      induk: {
        id: string;
        id_simpeg: number;
        nama: string;
      };
    };
    jenis_jabatan: {
      id: number | null;
      nama: string | null;
    };
    jabatan_status: {
      id: number | null;
      nama: string | null;
    };
    eselon: {
      id: number | null;
      nama: string | null;
    };
    golongan_pns: {
      id: number | null;
      nama: string | null;
    };
    golongan_pppk: {
      id: number | null;
      nama: string | null;
    };
    jabfung: {
      id: number | null;
      nama: string | null;
    };
    jabfungum: {
      id: number | null;
      nama: number | null;
    };
    id_asn: number;
    nip_asn: number;
    nama_asn: string;
    jenis_asn: string;
    nama_jabatan: string;
    tmt_jabatan: string;
    tunjangan: number;
    pejabat_sk: string;
    nomor_sk: string;
    tgl_sk: string;
    doc: string;
    userId: number;
    NCSISTIME: string;
  }[];
  unit_id: number;
  created_at: string;
  updated_at: string;
  unit: {
    id_sapk: string;
    id_simpeg: number;
    nama_unor: string;
  };
}

export interface OutgoingApiData {
  periode_start: string;
  periode_end: string;
  user_id: number;
  pendekatan: 'KUANTITATIF' | 'KUALITATIF';
}

interface FormValue {
  tanggal_mulai: string;
  tanggal_selesai: string;
  id_user: number;
  pendekatan: 'KUANTITATIF' | 'KUALITATIF';
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Skps extends Model {
  constructor(
    public id: string,
    public tanggal_mulai: string,
    public tanggal_selesai: string,
    public status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED',
    public pendekatan: 'KUALITATIF' | 'KUANTITATIF',
    public lampiran: string | null,
    public id_user: number,
    public id_skp_atasan: string | null,
    public posjab: {
      id_posjab: string;
      unor: {
        id: string;
        nama: string;
        atasan: {
          unor_id: string;
          unor_nama: string;
          unor_jabatan: string;
          asn: {
            idasn_atasan: number;
            nip_atasan: number;
            nama_atasan: string;
          };
        };
        induk: {
          id: string;
          id_simpeg: number;
          nama: string;
        };
      };
      jenis_jabatan: {
        id: number | null;
        nama: string | null;
      };
      jabatan_status: {
        id: number | null;
        nama: string | null;
      };
      eselon: {
        id: number | null;
        nama: string | null;
      };
      golongan_pns: {
        id: number | null;
        nama: string | null;
      };
      golongan_pppk: {
        id: number | null;
        nama: string | null;
      };
      jabfung: {
        id: number | null;
        nama: string | null;
      };
      jabfungum: {
        id: number | null;
        nama: number | null;
      };
      id_asn: number;
      nip_asn: number;
      nama_asn: string;
      jenis_asn: string;
      nama_jabatan: string;
      tmt_jabatan: string;
      tunjangan: number;
      pejabat_sk: string;
      nomor_sk: string;
      tgl_sk: string;
      doc: string;
      userId: number;
      NCSISTIME: string;
    }[],
    public id_unit: number,
    public created_at: string,
    public updated_at: string,
    public unit: {
      id_sapk: string;
      id_simpeg: number;
      nama_unor: string;
    }
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Skps> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Skps>;
    return new Skps(apiData.id, apiData.periode_start, apiData.periode_end, apiData.status, apiData.pendekatan, apiData.lampiran, apiData.user_id, apiData.atasan_skp_id, apiData.posjab, apiData.unit_id, apiData.created_at, apiData.updated_at, {
      id_sapk: apiData.unit.id_sapk,
      id_simpeg: apiData.unit.id_simpeg,
      nama_unor: apiData.unit.nama_unor
    }) as ReturnType<T, IncomingApiData, Skps>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(skps: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(skps)) return skps.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      periode_start: skps.tanggal_mulai,
      periode_end: skps.tanggal_selesai,
      user_id: skps.id_user,
      pendekatan: skps.pendekatan
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
