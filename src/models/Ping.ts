import { paths } from "./up-banking-api";

type Root = paths["/util/ping"]["get"];

export type OkResponse = Root["responses"]["200"]["content"]["application/json"];
export type NotAuthorizedResponse = Root["responses"]["401"]["content"]["application/json"];
