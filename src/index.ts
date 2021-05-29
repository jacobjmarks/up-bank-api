import axios, { AxiosInstance } from "axios";
import { UP_API_BASEURL } from "./config";
import { getAccount, getAccounts } from "./modules/accounts";
import { getTransactions } from "./modules/transactions";
import { ping } from "./modules/utility";

export class UpApiInterface {
  /** Person Access Token associated with this interface instance. */
  private token: string;

  protected agent: AxiosInstance;

  /**
   * Create a new Up Banking API interface.
   * @param token Your {@link https://api.up.com.au/getting_started Personal Access Token}
   */
  public constructor(token: string) {
    this.token = token;

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
}
