import { AxiosInstance, AxiosResponse } from "axios";

export abstract class Page<T> {
  protected data: T[];

  protected nextPage: string | null = null;
  protected prevPage: string | null = null;

  protected agent: AxiosInstance;

  protected constructor(
    ctx: { agent: AxiosInstance },
    { data, links }: { data: T[]; links: { prev: string | null; next: string | null } }
  ) {
    this.agent = ctx.agent;
    this.data = data;
    this.prevPage = links.prev;
    this.nextPage = links.next;
  }

  public getData(): T[] {
    return this.data;
  }

  public hasNextPage(): boolean {
    return this.nextPage != null;
  }

  public hasPreviousPage(): boolean {
    return this.prevPage != null;
  }

  protected async fetchNextPage<R>(): Promise<AxiosResponse<R> | null> {
    if (this.nextPage == null) return Promise.resolve(null);
    return await this.agent.get<R>(this.nextPage);
  }

  protected async fetchPreviousPage<R>(): Promise<AxiosResponse<R> | null> {
    if (this.prevPage == null) return Promise.resolve(null);
    return await this.agent.get<R>(this.prevPage);
  }

  public abstract getNextPage(): Promise<Page<T> | null>;

  public abstract getPreviousPage(): Promise<Page<T> | null>;
}
