import type { IEntity } from '../models/interfaces/IEntity';

export class Library<T extends IEntity> {
  private readonly items: Map<string, T>;

  public constructor(initialItems: Iterable<T> = []) {
    this.items = new Map();

    for (const item of initialItems) {
      this.add(item);
    }
  }

  public add(item: T): void {
    if (this.items.has(item.id)) {
      throw new Error(`Об'єкт з ідентифікатором ${item.id} уже існує`);
    }

    this.items.set(item.id, item);
  }

  public remove(id: string): T | null {
    const item = this.findById(id);

    if (!item) {
      return null;
    }

    this.items.delete(id);
    return item;
  }

  public findById(id: string): T | null {
    return this.items.get(id) ?? null;
  }

  public find(predicate: (item: T) => boolean): T[] {
    return this.getAll().filter(predicate);
  }

  public getAll(): T[] {
    return [...this.items.values()];
  }

  public get size(): number {
    return this.items.size;
  }
}
