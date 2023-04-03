import { Role } from '../roles.enum';

export enum Modules {
  changeRole = 'changeRole',
  removeComment = 'removeComment',
}

export const checkPermission = (module: Modules, role: Role) => {
  switch (module) {
    case Modules.changeRole:
      return role === Role.Admin;
    case Modules.removeComment:
      return role === Role.Admin;
    default:
      return false;
  }
};
