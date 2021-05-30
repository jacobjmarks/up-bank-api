import { AxiosInstance } from "axios";
import { components } from "../../models/generated";
import { Page } from "../Page";
import { OkResponse } from "./GetTransactions";
import { Transaction } from "./Transaction";

type ListTransactionsResponse = components["schemas"]["ListTransactionsResponse"];

export class TransactionPage extends Page<Transaction> {
  private cursors: { prev: string | null; next: string | null };
  private agent: AxiosInstance;

  constructor(agent: AxiosInstance, { data, links }: ListTransactionsResponse) {
    super(data.map(resource => new Transaction(resource)));
    this.agent = agent;
    this.cursors = links;
  }

  public hasNextPage(): boolean {
    return this.cursors.next != null;
  }

  public hasPreviousPage(): boolean {
    return this.cursors.prev != null;
  }

  public async getNextPage(): Promise<TransactionPage | null> {
    if (!this.hasNextPage()) return null;
    const res = await this.agent.get<OkResponse>(this.cursors.next);
    return new TransactionPage(this.agent, res.data);
  }

  public async getPreviousPage(): Promise<TransactionPage | null> {
    if (!this.hasPreviousPage()) return null;
    const res = await this.agent.get<OkResponse>(this.cursors.prev);
    return new TransactionPage(this.agent, res.data);
  }
}
