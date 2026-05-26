export type EqualityFn<T> = (a: T, b: T) => boolean;

export class GenericSet<T> {
  private readonly items: T[];
  readonly equalityFn: EqualityFn<T>;

  private constructor(items: T[], equalityFn: EqualityFn<T>) {
    this.items = items;
    this.equalityFn = equalityFn;
  }

  static of<T>(equalityFn: EqualityFn<T>): GenericSet<T> {
    return new GenericSet<T>([], equalityFn);
  }

  static from<T>(items: T[], equalityFn: EqualityFn<T>): GenericSet<T> {
    const uniqueItems: T[] = [];
    for (const item of items) {
      if (!uniqueItems.some((existing) => equalityFn(existing, item))) {
        uniqueItems.push(item);
      }
    }
    return new GenericSet<T>(uniqueItems, equalityFn);
  }

  add(...items: T[]): GenericSet<T> {
    const diff = items.filter((item) => !this.has(item));
    if (diff.length === 0) return this;
    return new GenericSet<T>([...this.items, ...diff], this.equalityFn);
  }

  has(item: T): boolean {
    return this.items.some((existing) => this.equalityFn(existing, item));
  }

  get size(): number {
    return this.items.length;
  }

  values(): T[] {
    return [...this.items];
  }

  union(other: GenericSet<T>): GenericSet<T> {
    const newItems = [...this.items];
    for (const item of other.items) {
      if (!newItems.some((existing) => this.equalityFn(existing, item))) {
        newItems.push(item);
      }
    }
    return new GenericSet<T>(newItems, this.equalityFn);
  }

  intersect(other: GenericSet<T>): GenericSet<T> {
    const newItems = this.items.filter((item) =>
      other.items.some((otherItem) => this.equalityFn(item, otherItem)),
    );
    return new GenericSet<T>(newItems, this.equalityFn);
  }

  map<U>(fn: (item: T) => U): GenericSet<U> {
    const newItems = this.items.map(fn);
    return new GenericSet<U>(newItems, (a, b) => a === b);
  }

  filter(predicate: (item: T) => boolean): GenericSet<T> {
    const newItems = this.items.filter(predicate);
    return new GenericSet<T>(newItems, this.equalityFn);
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.items.values();
  }
}
