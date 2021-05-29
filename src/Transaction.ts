import { components } from "./models/up-banking-api";

type TransactionResource = components["schemas"]["TransactionResource"];

export class Transaction {
  public id: string;
  public amount: components["schemas"]["MoneyObject"];
  public description: string;
  public status: components["schemas"]["TransactionStatusEnum"];
  public createdAt: Date;
  public settledAt?: Date;
  public rawText?: string;
  public message?: string;
  public holdInfo?: components["schemas"]["HoldInfoObject"];
  public roundUp?: components["schemas"]["RoundUpObject"];
  public cashback?: components["schemas"]["CashbackObject"];
  public foreignAmount?: components["schemas"]["MoneyObject"];

  constructor({
    id,
    attributes: {
      createdAt,
      amount,
      status,
      description,
      rawText,
      message,
      holdInfo,
      roundUp,
      cashback,
      settledAt,
      foreignAmount,
    },
  }: TransactionResource) {
    this.id = id;
    this.amount = amount;
    this.description = description;
    this.status = status;
    this.createdAt = new Date(createdAt);
    if (settledAt) this.settledAt = new Date(settledAt);
    if (rawText) this.rawText = rawText;
    if (message) this.message = message;
    if (holdInfo) this.holdInfo = holdInfo;
    if (roundUp) this.roundUp = roundUp;
    if (cashback) this.cashback = cashback;
    if (foreignAmount) this.foreignAmount = foreignAmount;
  }
}
