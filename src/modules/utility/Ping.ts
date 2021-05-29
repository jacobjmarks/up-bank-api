import { UpApiInterface } from "../..";
import { paths } from "../../models/up-banking-api";

type Root = paths["/util/ping"]["get"];
export type OkResponse = Root["responses"]["200"]["content"]["application/json"];
export type NotAuthorizedResponse = Root["responses"]["401"]["content"]["application/json"];

export async function ping(this: UpApiInterface): Promise<boolean> {
  const res = await this.agent.get<OkResponse>("/v1/util/ping");
  return res.status === 200;
}
