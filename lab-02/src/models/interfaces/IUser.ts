import type { IEntity } from './IEntity';

export interface IUser extends IEntity {
  name: string;
  email: string;
  readonly borrowedBookIds: readonly string[];
}
