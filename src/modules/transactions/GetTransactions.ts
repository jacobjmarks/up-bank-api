import { UpApiInterface } from "../../index";
import { paths } from "../../models/up-banking-api";
import { Transaction } from "./Transaction";

type Root = paths["/transactions"]["get"];
export type QueryParams = Root["parameters"]["query"];
export type OkResponse = Root["responses"]["200"]["content"]["application/json"];

interface RequestConfig {
  pageSize?: number;
  category?: string;
  tag?: string;
  status?: "HELD" | "SETTLED";
  since?: Date;
  until?: Date;
}

export async function getTransactions(this: UpApiInterface, config?: RequestConfig): Promise<Transaction[]> {
  let params: QueryParams = {
    "page[size]": config?.pageSize,
    "filter[category]": config?.category,
    "filter[tag]": config?.tag,
    "filter[status]": config?.status,
    "filter[since]": config?.since.toISOString(),
    "filter[until]": config?.until.toISOString(),
  };

  const res = await this.agent.get<OkResponse>("/v1/transactions", { params });
  return res.data.data.map(txn => new Transaction(txn));
}
