import axios, { AxiosInstance } from "axios";
import { UP_API_BASEURL } from "./config";
import { MoneyObject } from "./models";
import { Account, getAccount, getAccounts } from "./modules/accounts";
import { getTransaction, getTransactions, Transaction } from "./modules/transactions";
import { ping } from "./modules/utility";

export interface InterfaceContext {
  agent: AxiosInstance;
}

export class UpApiInterface {
  protected ctx: InterfaceContext;

  /**
   * Create a new Up Banking API interface.
   * @param token Your {@link https://api.up.com.au/getting_started Personal Access Token}
   */
  public constructor(token: string) {
    this.ctx = {
      agent: axios.create({
        baseURL: UP_API_BASEURL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    };
  }

  public ping = ping;
  public getAccounts = getAccounts;
  public getAccount = getAccount;
  public getTransaction = getTransaction;
  public getTransactions = getTransactions;

  /**
   * Get all accounts.
   * @warning This is a custom exhaustive fetch that may result in multiple API calls
   * @returns All accounts
   */
  public async getAllAccounts(): Promise<Account[]> {
    return await (await this.getAccounts()).getRemainingData();
  }

  /**
   * Calculate the total balance accross all accounts.
   * @warning This is a custom exhaustive fetch that may result in multiple API calls
   * @returns Total account balance.
   */
  public async getTotalBalance(): Promise<MoneyObject | null> {
    const accounts = await this.getAllAccounts();
    if (accounts.length === 0) return null;

    let grandTotal: MoneyObject = undefined;
    for (const account of accounts) {
      if (grandTotal === undefined) {
        grandTotal = account.balance;
        continue;
      }

      grandTotal.valueInBaseUnits += account.balance.valueInBaseUnits;
    }

    grandTotal.value = (grandTotal.valueInBaseUnits / 100.0).toString();

    return grandTotal;
  }

  /**
   * Get all transactions.
   * @warning This is a custom exhaustive fetch that may result in multiple API calls
   * @returns All transactions
   */
  public async getAllTransactions(): Promise<Transaction[]> {
    return await (await this.getTransactions()).getRemainingData();
  }
}
