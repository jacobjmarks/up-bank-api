export abstract class Page<T> {
  protected data: T[];

  protected constructor(data: T[]) {
    this.data = data;
  }

  public getData(): T[] {
    return this.data;
  }

  public abstract hasNextPage(): boolean;
  public abstract hasPreviousPage(): boolean;
  public abstract getNextPage(): Promise<Page<T> | null>;
  public abstract getPreviousPage(): Promise<Page<T> | null>;
}
