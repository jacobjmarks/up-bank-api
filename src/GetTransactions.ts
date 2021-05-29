import { Account } from "./Account";
import { UpApiInterface } from "./index";
import { paths } from "./models/up-banking-api";
import { Transaction } from "./Transaction";

type Root = paths["/transactions"]["get"];
export type QueryParams = Root["parameters"]["query"];
export type OkResponse = Root["responses"]["200"]["content"]["application/json"];

interface RequestConfig {
  pageSize?: number;
}

export async function getTransactions(this: UpApiInterface, config?: RequestConfig): Promise<Transaction[]> {
  let queryParams: QueryParams = {
    "page[size]": config?.pageSize,
    "filter[category]": undefined,
    "filter[since]": undefined,
    "filter[until]": undefined,
    "filter[status]": undefined,
    "filter[tag]": undefined,
  };

  const res = await this.agent.get<OkResponse>("/v1/transactions", {
    params: queryParams,
  });

  return res.data.data.map(txn => new Transaction(txn));
}
