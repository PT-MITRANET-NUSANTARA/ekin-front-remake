import { Action } from '@/constants';
import env from '@/utils/env';
import Model, { ModelChildren } from './Model';

export type ApiData = string;

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Permission extends Model {
  constructor(
    public name: string,
    public action: Action,
    public model: ModelChildren
  ) {
    super();
    if (!(model.prototype instanceof Model)) {
      throw new Error('Model must be an instance of Model');
    }
  }

  can(action: Action, model: ModelChildren) {
    return this.action.name === action.name && this.model === model;
  }

  private static actions = {
    manajemen: [Action.READ, Action.UPDATE, Action.DELETE, Action.CREATE]
  };

  static fromApiData<T extends ApiData | ApiData[]>(apiData: T): ReturnType<T, ApiData, Permission> {
    if (Array.isArray(apiData)) return apiData.flatMap((object) => this.fromApiData(object)) as ReturnType<T, ApiData, Permission>;

    const arrays = apiData.split('_');
    const actionsString = arrays.shift();
    const modelString = arrays.join('_');

    const actions = this.actions[actionsString as keyof typeof this.actions] || [Action.NONE];

    env.dev(() => {
      const modelKeyDoesNotExist = !(modelString in Model.children);
      if (modelKeyDoesNotExist) console.warn(`Key "${modelString}" is not found in Model.children`);
      const modelDoesNotExist = !Model.children[modelString as keyof typeof Model.children];
      if (modelDoesNotExist) console.warn(`Model "${modelString}" is undefined in Model.children`);
    });

    const models = Model.children[modelString as keyof typeof Model.children];
    const modelsIsUndefined = models === undefined;
    const modelsIsArray = Array.isArray(models);
    const modelsIsEmptyArray = modelsIsArray && models.length === 0;
    if (modelsIsUndefined || modelsIsEmptyArray) return [] as unknown as ReturnType<T, ApiData, Permission>;

    if (actions.length === 1) {
      if (modelsIsArray) return models.map((model) => new Permission(apiData, actions[0], model)) as ReturnType<T, ApiData, Permission>;
      return new Permission(apiData, actions[0], models) as ReturnType<T, ApiData, Permission>;
    }

    return actions.flatMap((action) => {
      if (modelsIsArray) return models.map((model) => new Permission(apiData, action, model));
      else return new Permission(apiData, action, models);
    }) as ReturnType<T, ApiData, Permission>;
  }

  static toApiData<T extends Permission | Permission[]>(permission: T): ReturnType<T, Permission, ApiData> {
    if (Array.isArray(permission)) return permission.map((object) => this.toApiData(object)) as ReturnType<T, Permission, ApiData>;

    return permission.name as ReturnType<T, Permission, ApiData>;
  }
}

// Model.children.permission = Permission;
