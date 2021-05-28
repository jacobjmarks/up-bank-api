import { UpApiInterface } from ".";
import { components } from "./models/up-banking-api";

type AccountResource = components["schemas"]["AccountResource"];

export class Account {
  public id: string;
  public displayName: string;
  public type: components["schemas"]["AccountTypeEnum"];
  public createdAt: Date;
  public balance: components["schemas"]["MoneyObject"];

  constructor(data: AccountResource) {
    this.id = data.id;
    this.type = data.attributes.accountType;
    this.createdAt = new Date(data.attributes.createdAt);
    this.balance = data.attributes.balance;
    this.displayName = data.attributes.displayName;
  }
}
