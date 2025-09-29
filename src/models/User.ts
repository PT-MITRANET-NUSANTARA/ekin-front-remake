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
    public isJpt: boolean
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
      apiData.isJpt
    );
  }

  // static toApiData(user: User): OutgoingApiData {
  //   return {
  //     email: user.email
  //   };
  // }
}

Model.children.pengguna = User;
