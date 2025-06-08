export default class Action {
  constructor(public name: string) {}

  public static readonly READ = new Action('read');
  public static readonly CREATE = new Action('create');
  public static readonly UPDATE = new Action('update');
  public static readonly DELETE = new Action('delete');
  public static readonly NONE = new Action('none');

  public static get(name: string) {
    const actions = {
      read: Action.READ,
      create: Action.CREATE,
      update: Action.UPDATE,
      delete: Action.DELETE,
      none: Action.NONE
    };
    if (name in actions) return actions[name as keyof typeof actions];

    return new Action(name);
  }
}
