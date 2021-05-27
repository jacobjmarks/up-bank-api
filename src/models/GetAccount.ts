import { paths } from "./up-banking-api";

type Root = paths["/accounts/{id}"]["get"];

export type OkResponse = Root["responses"]["200"]["content"]["application/json"];
