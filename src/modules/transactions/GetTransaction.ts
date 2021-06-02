import { paths } from "../../models/generated";
import { UpApiInterface } from "../../UpApiInterface";
import { Transaction } from "./Transaction";

type Root = paths["/transactions/{id}"]["get"];
export type OkResponse = Root["responses"]["200"]["content"]["application/json"];

export async function getTransaction(this: UpApiInterface, id: string): Promise<Transaction> {
  const res = await this.ctx.agent.get<OkResponse>(`/v1/transactions/${id}`);
  return new Transaction(res.data.data);
}
