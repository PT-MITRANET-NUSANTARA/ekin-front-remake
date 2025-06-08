import { Action, Role } from '@/constants';
import Model, { ModelChildren } from './Model';
import Permission from './Permission';

export interface IncomingApiData {
  id: number;
  email: string;
  name: string;
  role: {
    id: number;
    name: string;
    permissions: string[];
  };
  permissions: string[];
}

export interface untranslatedIncoming {}

interface OutgoingApiData {
  email: IncomingApiData['email'];
}

export default class User extends Model {
  constructor(
    public id: number,
    public email: string,
    public name: string,
    public token: string,
    public role: Role,
    public roleId: number,
    public permissions: Permission[] = []
  ) {
    super();
  }

  is(role: Role) {
    return this.role === role;
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

  cantDoAny(...permissions: [Action, ModelChildren][]) {
    return !this.eitherCan(...permissions);
  }

  static fromApiData(apiData: IncomingApiData, token: string): User {
    const roles = {
      admin: Role.ADMIN,
      opd_provinsi: Role.PEGAWAI
    };
    const role = roles[apiData.role.name as keyof typeof roles] || null;
    const permissions = Permission.fromApiData([...apiData.role.permissions, ...apiData.permissions]);
    return new User(apiData.id, apiData.email, apiData.name, token, role, apiData.role.id, permissions);
  }

  static toApiData(user: User): OutgoingApiData {
    return {
      email: user.email
    };
  }
}

Model.children.pengguna = User;
