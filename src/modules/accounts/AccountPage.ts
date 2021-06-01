import { ListAccountsResponse } from "../../models";
import { InterfaceContext } from "../../UpApiInterface";
import { Page } from "../Page";
import { Account } from "./Account";
import { OkResponse } from "./GetAccounts";

export class AccountPage extends Page<Account> {
  private cursors: { prev: string | null; next: string | null };

  private ctx?: InterfaceContext;

  constructor({ data, links }: ListAccountsResponse, ctx?: InterfaceContext) {
    super(data.map(resource => new Account(resource, ctx)));
    this.cursors = links;
    this.ctx = ctx;
  }

  public hasNextPage(): boolean {
    return this.cursors.next != null;
  }

  public hasPreviousPage(): boolean {
    return this.cursors.prev != null;
  }

  public async getNextPage(): Promise<AccountPage | null> {
    if (!this.hasNextPage()) return null;
    const res = await this.ctx.agent.get<OkResponse>(this.cursors.next);
    return new AccountPage(res.data, this.ctx);
  }

  public async getPreviousPage(): Promise<AccountPage | null> {
    if (!this.hasPreviousPage()) return null;
    const res = await this.ctx.agent.get<OkResponse>(this.cursors.prev);
    return new AccountPage(res.data, this.ctx);
  }
}
