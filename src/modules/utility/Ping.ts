import { paths } from "../../models/generated";
import { UpApiInterface } from "../../UpApiInterface";

type Root = paths["/util/ping"]["get"];
export type OkResponse = Root["responses"]["200"]["content"]["application/json"];
export type NotAuthorizedResponse = Root["responses"]["401"]["content"]["application/json"];

export async function ping(this: UpApiInterface): Promise<boolean> {
  const res = await this.ctx.agent.get<OkResponse>("/v1/util/ping");
  return res.status === 200;
}
