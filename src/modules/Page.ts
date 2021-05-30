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

  /**
   * Get all remaining data. Includes the current page.
   * @returns Remaining data
   */
  public async getRemainingData(): Promise<T[]> {
    let page = <Page<T>>this;
    const data = page.getData();

    while (page.hasNextPage()) {
      page = await page.getNextPage();
      data.push(...page.getData());
    }

    return Promise.resolve(data);
  }
}
