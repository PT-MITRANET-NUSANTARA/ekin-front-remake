import { Action } from '@/constants';
import env from '@/utils/env';
import Model, { ModelChildren } from './Model';

export type ApiData = string;

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Permission extends Model {
  constructor(
    public name: string,
    public action: Action,
    public model: ModelChildren | null
  ) {
    super();

    // ✅ fix: allow null model
    if (model && !(model.prototype instanceof Model)) {
      throw new Error('Model must be an instance of Model');
    }
  }

  can(action: Action, model: ModelChildren) {
    // ✅ global permission (tanpa model)
    if (!this.model) {
      return this.action.name === action.name;
    }

    return this.action.name === action.name && this.model === model;
  }

  private static actionAlias: Record<string, Action> = {
    add: Action.CREATE,
    create: Action.CREATE,

    read: Action.READ,
    view: Action.READ,

    update: Action.UPDATE,
    edit: Action.UPDATE,

    delete: Action.DELETE,
    remove: Action.DELETE
  };

  private static actions = {
    // 🔥 CRUD dari backend
    crud: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE]
  };

  static fromApiData<T extends ApiData | ApiData[]>(apiData: T): ReturnType<T, ApiData, Permission> {
    // 🔁 handle array
    if (Array.isArray(apiData)) {
      return apiData.flatMap((item) => this.fromApiData(item)) as ReturnType<T, ApiData, Permission>;
    }

    // 🔥 CASE 1: authority TANPA underscore → global
    if (!apiData.includes('_')) {
      const action = Action.get(apiData.toLowerCase());
      return new Permission(apiData, action, null) as ReturnType<T, ApiData, Permission>;
    }

    // 🔥 parsing normal
    const [rawAction, ...rest] = apiData.split('_');

    const actionsString = rawAction?.toLowerCase() ?? '';
    const modelString = rest.join('_').toLowerCase();

    let actions: Action[] = [];

    // 🔥 HANDLE CRUD
    if (actionsString in this.actions) {
      actions = this.actions[actionsString as keyof typeof this.actions];
    } else {
      // fallback: READ, CREATE, dll
      const normalized = this.actionAlias[actionsString] ?? Action.get(actionsString);

      actions = [normalized];
    }

    // 🔍 DEBUG
    env.dev(() => {
      if (!(modelString in Model.children)) {
        console.warn(`Key "${modelString}" not found in Model.children`);
      }

      if (!Model.children[modelString as keyof typeof Model.children]) {
        console.warn(`Model "${modelString}" is undefined`);
      }
    });

    const models = Model.children[modelString as keyof typeof Model.children];

    // 🔥 CASE 2: model tidak ada → tetap jadi permission global
    if (!models || (Array.isArray(models) && models.length === 0)) {
      return actions.map((action) => new Permission(apiData, action, null)) as ReturnType<T, ApiData, Permission>;
    }

    // 🔥 SINGLE ACTION
    if (actions.length === 1) {
      if (Array.isArray(models)) {
        return models.map((model) => new Permission(apiData, actions[0], model)) as ReturnType<T, ApiData, Permission>;
      }

      return new Permission(apiData, actions[0], models) as ReturnType<T, ApiData, Permission>;
    }

    // 🔥 MULTI ACTION (CRUD)
    return actions.flatMap((action) => {
      if (Array.isArray(models)) {
        return models.map((model) => new Permission(apiData, action, model));
      }

      return new Permission(apiData, action, models);
    }) as ReturnType<T, ApiData, Permission>;
  }

  static toApiData<T extends Permission | Permission[]>(permission: T): ReturnType<T, Permission, ApiData> {
    if (Array.isArray(permission)) {
      return permission.map((item) => this.toApiData(item)) as ReturnType<T, Permission, ApiData>;
    }

    return permission.name as ReturnType<T, Permission, ApiData>;
  }
}
