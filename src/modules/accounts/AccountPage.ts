import { AxiosInstance } from "axios";
import { components } from "../../models/up-banking-api";
import { Page } from "../Page";
import { Account } from "./Account";
import { OkResponse } from "./GetAccounts";

export class AccountPage extends Page<Account> {
  constructor(ctx: { agent: AxiosInstance }, { data, links }: components["schemas"]["ListAccountsResponse"]) {
    super(ctx, {
      data: data.map(resource => new Account(resource)),
      links,
    });
  }

  public async getNextPage(): Promise<AccountPage | null> {
    const res = await this.fetchNextPage<OkResponse>();
    if (res == null) return Promise.resolve(null);
    return new AccountPage({ agent: this.agent }, res.data);
  }

  public async getPreviousPage(): Promise<AccountPage | null> {
    const res = await this.fetchPreviousPage<OkResponse>();
    if (res == null) return Promise.resolve(null);
    return new AccountPage({ agent: this.agent }, res.data);
  }
}
