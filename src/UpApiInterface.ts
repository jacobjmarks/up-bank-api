import axios, { AxiosInstance } from "axios";
import { UP_API_BASEURL } from "./config";
import { Account, getAccount, getAccounts } from "./modules/accounts";
import { getTransactions, Transaction } from "./modules/transactions";
import { ping } from "./modules/utility";

export class UpApiInterface {
  protected agent: AxiosInstance;

  /**
   * Create a new Up Banking API interface.
   * @param token Your {@link https://api.up.com.au/getting_started Personal Access Token}
   */
  public constructor(token: string) {
    this.agent = axios.create({
      baseURL: UP_API_BASEURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public ping = ping;
  public getAccounts = getAccounts;
  public getAccount = getAccount;
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
   * Get all transactions.
   * @warning This is a custom exhaustive fetch that may result in multiple API calls
   * @returns All transactions
   */
  public async getAllTransactions(): Promise<Transaction[]> {
    return await (await this.getTransactions()).getRemainingData();
  }
}
