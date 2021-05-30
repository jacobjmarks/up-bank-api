import {
  CashbackObject,
  HoldInfoObject,
  MoneyObject,
  RoundUpObject,
  TransactionResource,
  TransactionStatusEnum,
} from "../../models";

export class Transaction {
  public id: string;
  public amount: MoneyObject;
  public description: string;
  public status: TransactionStatusEnum;
  public createdAt: Date;
  public settledAt?: Date;
  public rawText?: string;
  public message?: string;
  public holdInfo?: HoldInfoObject;
  public roundUp?: RoundUpObject;
  public cashback?: CashbackObject;
  public foreignAmount?: MoneyObject;

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
