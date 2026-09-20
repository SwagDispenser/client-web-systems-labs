interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

export class Storage<T> {
  public constructor(
    private readonly key: string,
    private readonly storage: StorageAdapter = window.localStorage,
  ) {}

  public save(value: T): void {
    this.storage.setItem(this.key, JSON.stringify(value));
  }

  public load(): T | null {
    const serializedValue = this.storage.getItem(this.key);

    if (serializedValue === null) {
      return null;
    }

    try {
      return JSON.parse(serializedValue) as T;
    } catch {
      this.remove();
      return null;
    }
  }

  public remove(): void {
    this.storage.removeItem(this.key);
  }

  public clear(): void {
    this.storage.clear();
  }
}
