import { paths } from "../../models/generated";
import { UpApiInterface } from "../../UpApiInterface";
import { Account } from "./Account";

type Root = paths["/accounts/{id}"]["get"];
export type OkResponse = Root["responses"]["200"]["content"]["application/json"];

export async function getAccount(this: UpApiInterface, id: string): Promise<Account> {
  const res = await this.ctx.agent.get<OkResponse>(`/v1/accounts/${id}`);
  return new Account(res.data.data);
}
