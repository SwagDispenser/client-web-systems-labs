import { expect } from 'chai';

import { Storage } from '../src/services/Storage';

class MemoryStorage {
  private readonly values = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  public removeItem(key: string): void {
    this.values.delete(key);
  }

  public clear(): void {
    this.values.clear();
  }
}

describe('Storage<T>', () => {
  it('saves and restores typed data', () => {
    const storage = new Storage<{ value: number }>('test', new MemoryStorage());

    storage.save({ value: 42 });

    expect(storage.load()).to.deep.equal({ value: 42 });
  });

  it('removes invalid JSON instead of throwing', () => {
    const memoryStorage = new MemoryStorage();
    const storage = new Storage<{ value: number }>('test', memoryStorage);
    memoryStorage.setItem('test', '{invalid');

    expect(storage.load()).to.equal(null);
    expect(memoryStorage.getItem('test')).to.equal(null);
  });

  it('removes one value and can clear all values', () => {
    const memoryStorage = new MemoryStorage();
    const firstStorage = new Storage<number>('first', memoryStorage);
    const secondStorage = new Storage<number>('second', memoryStorage);
    firstStorage.save(1);
    secondStorage.save(2);

    firstStorage.remove();
    expect(firstStorage.load()).to.equal(null);
    expect(secondStorage.load()).to.equal(2);

    secondStorage.clear();
    expect(secondStorage.load()).to.equal(null);
  });
});
