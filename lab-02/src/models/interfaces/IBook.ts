import type { IEntity } from './IEntity';

export interface IBook extends IEntity {
  title: string;
  author: string;
  publicationYear: number;
  readonly isBorrowed: boolean;
  readonly borrowedBy: string | null;
}
