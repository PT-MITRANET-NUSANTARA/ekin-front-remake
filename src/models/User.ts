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
}

export interface untranslatedIncoming {}

// interface OutgoingApiData {
//   email: IncomingApiData['email'];
// }

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
    }
    // public permissions: Permission[] = []
  ) {
    super();
  }

  // is(role: Role) {
  //   return this.role === role;
  // }

  // can(action: Action, model: ModelChildren) {
  //   return this.permissions.some((permission) => permission.can(action, model));
  // }

  // cant(action: Action, model: ModelChildren) {
  //   return !this.can(action, model);
  // }

  // eitherCan(...permissions: [Action, ModelChildren][]) {
  //   return permissions.some(([action, model]) => this.can(action, model));
  // }

  // cantDoAny(...permissions: [Action, ModelChildren][]) {
  //   return !this.eitherCan(...permissions);
  // }

  static fromApiData(apiData: IncomingApiData, token: string): User {
    const roles = {
      admin: Role.ADMIN,
      opd_provinsi: Role.PEGAWAI
    };
    // const role = roles[apiData.role.name as keyof typeof roles] || null;
    // const permissions = Permission.fromApiData([...apiData.role.permissions, ...apiData.permissions]);
    return new User(
      apiData.idASN,
      apiData.nipBaru,
      apiData.nama,
      apiData.nik,
      apiData.status_asn,
      {
        id: apiData.unor.id,
        nama: apiData.unor.nama
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
          name: apiData.pimpinan.eselon.nama
        },
        asn: {
          asn_id: apiData.pimpinan.asn.asn_id,
          asn_name: apiData.pimpinan.asn.asn_nama
        },
        atasan: apiData.pimpinan.atasan,
        induk: {
          id_sapk: apiData.pimpinan.induk.id_sapk,
          id_simpeg: apiData.pimpinan.induk.id_simpeg,
          name: apiData.pimpinan.induk.nama
        }
      }
    );
  }

  // static toApiData(user: User): OutgoingApiData {
  //   return {
  //     email: user.email
  //   };
  // }
}

Model.children.pengguna = User;
