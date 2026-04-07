import { Action } from '@/constants';
import Model, { ModelChildren } from './Model';
import Permission from './Permission';

export interface IncomingApiData {
  idASN: number;
  nipBaru: string;
  nama: string;
  nik: string;
  status_asn: string;
  unor: {
    id: number;
    nama: string;
  };
  foto: string;
  roles: string[];
  authorities: string[];
}

export default class User extends Model {
  constructor(
    public id: number,
    public nip_baru: string,
    public nama: string,
    public nik: string,
    public status_asn: string,
    public unor: {
      id: number;
      nama: string;
    },
    public photo: string,
    public roles: string[],
    public permissions: Permission[] = []
  ) {
    super();
  }

  can(action: Action, model: ModelChildren) {
    return this.permissions.some((permission) => permission.can(action, model));
  }

  cant(action: Action, model: ModelChildren) {
    return !this.can(action, model);
  }

  eitherCan(...permissions: [Action, ModelChildren][]) {
    return permissions.some(([action, model]) => this.can(action, model));
  }

  isRole(role: string) {
    return this.roles.includes(role);
  }

  eitherRole(...roles: string[]) {
    return roles.some((role) => this.isRole(role));
  }

  canAccess(options: { roles?: string[]; permissions?: [Action, ModelChildren][] }) {
    const { roles, permissions } = options;

    // ❌ tidak ada constraint → boleh akses
    if (!roles && !permissions) return true;

    // ✅ hanya role
    if (roles && !permissions) {
      return this.eitherRole(...roles);
    }

    // ✅ hanya permission
    if (!roles && permissions) {
      return this.eitherCan(...permissions);
    }

    // ✅ kombinasi: HARUS dua-duanya lolos
    return this.eitherRole(...(roles || [])) && this.eitherCan(...(permissions || []));
  }

  static fromApiData(apiData: IncomingApiData): User {
    const permissions = Permission.fromApiData(apiData.authorities);

    return new User(
      Number(apiData.idASN),
      apiData.nipBaru,
      apiData.nama,
      apiData.nik,
      apiData.status_asn,
      {
        id: apiData.unor.id,
        nama: apiData.unor.nama
      },
      apiData.foto,
      apiData.roles || [],
      permissions
    );
  }
}

Model.children.user = User;
