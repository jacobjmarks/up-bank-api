import { AccountResource, AccountTypeEnum, MoneyObject } from "../../models";
import { InterfaceContext } from "../../UpApiInterface";

export class Account {
  public id: string;
  public displayName: string;
  public type: AccountTypeEnum;
  public createdAt: Date;
  public balance: MoneyObject;

  private ctx: InterfaceContext;

  constructor(data: AccountResource, ctx?: InterfaceContext) {
    this.id = data.id;
    this.type = data.attributes.accountType;
    this.createdAt = new Date(data.attributes.createdAt);
    this.balance = data.attributes.balance;
    this.displayName = data.attributes.displayName;

    this.ctx = ctx;
  }
}
