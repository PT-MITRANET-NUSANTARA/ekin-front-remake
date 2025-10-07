import { Action, Role } from '@/constants';
import Model, { ModelChildren } from './Model';
// import Permission from './Permission';

export interface IncomingApiData {
  idASN: number;
  nipBaru: number;
  nama: string;
  nik: number;
  status_asn: string;
  unor: {
    id: number;
    nama: string;
  };
  foto: string;
  permissions: string[];
  isAdmin: boolean;
  isBupati: boolean;
  isJpt: boolean;
  pimpinan: {
    id: string;
    namaUnor: string;
    namaJabatan: string;
    eselon: {
      id: number;
      nama: string;
    };
    asn: {
      asn_id: string;
      asn_nama: string;
    };
    atasan: string;
    induk: {
      id_sapk: string;
      id_simpeg: number;
      nama: string;
    };
  };
  umpegs: {
    id: string,
    unit_id: number,
    jabatan: string[],
    created_at: string,
    updated_at: string,
    unit: {
      id_sapk: string,
      id_simpeg: number,
      nama_unor: string
    }
  }[];
}


export default class User extends Model {
  constructor(
    public idAsn: number,
    public newNip: number,
    public name: string,
    public nik: number,
    public asn_status: string,
    public unor: {
      id: number;
      nama: string;
    },
    public photo: string,
    public isAdmin: boolean,
    public isBupati: boolean,
    public isJpt: boolean,
    public pimpinan: {
      id: string;
      unorName: string;
      jabatanName: string;
      eselon: {
        id: number;
        name: string;
      };
      asn: {
        asn_id: string;
        asn_name: string;
      };
      atasan: string;
      induk: {
        id_sapk: string;
        id_simpeg: number;
        name: string;
      };
    },
    public permissions: string[] = [],
    public umpegs: {
      id: string,
      unit_id: number,
      jabatan: string[],
      created_at: string,
      updated_at: string,
      unit: {
        id_sapk: string,
        id_simpeg: number,
        nama_unor: string
      }
    }[]
  ) {
    super();
  }


  static fromApiData(apiData: IncomingApiData, token: string): User {
    const adminPermissions = [
      'lihat_dashboard',
      'manage_visi',
      'manage_misi',
      'manage_renstra',
      'manage_goals',
      'manage_skp',
      'manage_umpegs',
      'manage_verificator',
      'manage_kegiatan',
      'manage_subkegiatan',
      'manage_rkts',
      'manage_assessment_period',
      'manage_perjanjian_kinerja',
    ];

    const umpegPermission = [
      'lihat_dashboard',
      'manage_renstra',
      'manage_goals',
      'manage_skp',
      'manage_kegiatan',
      'manage_subkegiatan',
      'manage_rkts',
      'manage_assessment_period',
      'manage_perjanjian_kinerja',
    ];

    const jptPermissions = [
      'lihat_dashboard',
      'manage_skp',
    ];

    // Prioritas: Admin > Bupati > JPT
    let permissions: string[] = [];
    if (apiData.isAdmin) {
      permissions = adminPermissions;
    } else if (apiData.umpegs) {
      permissions = umpegPermission;
    } else if (apiData.isJpt) {
      permissions = jptPermissions;
    }

    const mappedUmpegs = apiData.umpegs?.map((item) => ({
      id: item.id,
      unit_id: item.unit_id,
      jabatan: item.jabatan,
      created_at: item.created_at,
      updated_at: item.updated_at,
      unit: {
        id_sapk: item.unit.id_sapk,
        id_simpeg: item.unit.id_simpeg,
        nama_unor: item.unit.nama_unor
      }
    })) || []

    return new User(
      apiData.idASN,
      apiData.nipBaru,
      apiData.nama,
      apiData.nik,
      apiData.status_asn,
      {
        id: apiData.unor.id,
        nama: apiData.unor.nama,
      },
      apiData.foto,
      apiData.isAdmin,
      apiData.isBupati,
      apiData.isJpt,
      {
        id: apiData.pimpinan.id,
        unorName: apiData.pimpinan.namaUnor,
        jabatanName: apiData.pimpinan.namaJabatan,
        eselon: {
          id: apiData.pimpinan.eselon.id,
          name: apiData.pimpinan.eselon.nama,
        },
        asn: {
          asn_id: apiData.pimpinan.asn.asn_id,
          asn_name: apiData.pimpinan.asn.asn_nama,
        },
        atasan: apiData.pimpinan.atasan,
        induk: {
          id_sapk: apiData.pimpinan.induk.id_sapk,
          id_simpeg: apiData.pimpinan.induk.id_simpeg,
          name: apiData.pimpinan.induk.nama,
        },
      },
      permissions,
      mappedUmpegs
    );
  }



  // static toApiData(user: User): OutgoingApiData {
  //   return {
  //     email: user.email
  //   };
  // }
}
