import { UpApiInterface } from "../..";
import { paths } from "../../models/up-banking-api";
import { AccountPage } from "./AccountPage";

type Root = paths["/accounts"]["get"];
export type QueryParams = Root["parameters"]["query"];
export type OkResponse = Root["responses"]["200"]["content"]["application/json"];

interface RequestConfig {
  pageSize?: number;
}

export async function getAccounts(this: UpApiInterface, config?: RequestConfig): Promise<AccountPage> {
  let queryParams: QueryParams = {
    "page[size]": config?.pageSize,
  };

  const res = await this.agent.get<OkResponse>("/v1/accounts", {
    params: queryParams,
  });

  return new AccountPage({ agent: this.agent }, res.data);
}
