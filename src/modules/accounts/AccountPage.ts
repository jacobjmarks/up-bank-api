import { AxiosInstance } from "axios";
import { components } from "../../models/up-banking-api";
import { Page } from "../Page";
import { Account } from "./Account";
import { OkResponse } from "./GetAccounts";

type ListAccountsResponse = components["schemas"]["ListAccountsResponse"];

export class AccountPage extends Page<Account> {
  private cursors: { prev: string | null; next: string | null };
  private agent: AxiosInstance;

  constructor(agent: AxiosInstance, { data, links }: ListAccountsResponse) {
    super(data.map(resource => new Account(resource)));
    this.agent = agent;
    this.cursors = links;
  }

  public hasNextPage(): boolean {
    return this.cursors.next != null;
  }

  public hasPreviousPage(): boolean {
    return this.cursors.prev != null;
  }

  public async getNextPage(): Promise<AccountPage | null> {
    if (!this.hasNextPage()) return null;
    const res = await this.agent.get<OkResponse>(this.cursors.next);
    return new AccountPage(this.agent, res.data);
  }

  public async getPreviousPage(): Promise<AccountPage | null> {
    if (!this.hasPreviousPage()) return null;
    const res = await this.agent.get<OkResponse>(this.cursors.prev);
    return new AccountPage(this.agent, res.data);
  }
}
