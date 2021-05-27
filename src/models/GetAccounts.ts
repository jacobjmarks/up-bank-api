import { paths } from "./up-banking-api";

type Root = paths["/accounts"]["get"];

export type QueryParams = Root["parameters"]["query"];
export type OkResponse = Root["responses"]["200"]["content"]["application/json"];

export class RequestConfig {
  pageSize?: number;
}
