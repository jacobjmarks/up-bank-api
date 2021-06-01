import { components } from "../../models/generated";
import { InterfaceContext } from "../../UpApiInterface";
import { Page } from "../Page";
import { OkResponse } from "./GetTransactions";
import { Transaction } from "./Transaction";

type ListTransactionsResponse = components["schemas"]["ListTransactionsResponse"];

export class TransactionPage extends Page<Transaction> {
  private cursors: { prev: string | null; next: string | null };

  private ctx?: InterfaceContext;

  constructor({ data, links }: ListTransactionsResponse, ctx?: InterfaceContext) {
    super(data.map(resource => new Transaction(resource, ctx)));
    this.cursors = links;
    this.ctx = ctx;
  }

  public hasNextPage(): boolean {
    return this.cursors.next != null;
  }

  public hasPreviousPage(): boolean {
    return this.cursors.prev != null;
  }

  public async getNextPage(): Promise<TransactionPage | null> {
    if (!this.hasNextPage()) return null;
    const res = await this.ctx.agent.get<OkResponse>(this.cursors.next);
    return new TransactionPage(res.data, this.ctx);
  }

  public async getPreviousPage(): Promise<TransactionPage | null> {
    if (!this.hasPreviousPage()) return null;
    const res = await this.ctx.agent.get<OkResponse>(this.cursors.prev);
    return new TransactionPage(res.data, this.ctx);
  }
}
