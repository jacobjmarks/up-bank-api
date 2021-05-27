import axios, { AxiosInstance } from "axios";
import { UP_API_BASEURL } from "./config";
import { GetAccount, GetAccounts, Ping } from "./models";

export class UpApiInterface {
  /** Person Access Token associated with this interface instance. */
  private PAT: string;

  protected agent: AxiosInstance;

  /**
   * Create a new Up Banking API interface.
   * @param pat Your {@link https://api.up.com.au/getting_started Personal Access Token}
   */
  public constructor(pat: string) {
    this.PAT = pat;
    this.agent = axios.create({
      baseURL: UP_API_BASEURL,
      headers: {
        Authorization: `Bearer ${pat}`,
      },
    });
  }

  public async ping(): Promise<boolean> {
    const res = await this.agent.get<Ping.OkResponse>("/v1/util/ping");
    return res.status === 200;
  }

  public async getAccounts(config?: GetAccounts.RequestConfig): Promise<GetAccounts.OkResponse> {
    let queryParams: GetAccounts.QueryParams = {
      "page[size]": config?.pageSize,
    };

    const res = await this.agent.get<GetAccounts.OkResponse>("/v1/accounts", {
      params: queryParams,
    });

    return res.data;
  }

  public async getAccount(id: string): Promise<GetAccount.OkResponse> {
    const res = await this.agent.get<GetAccount.OkResponse>(`/v1/accounts/${id}`);
    return res.data;
  }
}
