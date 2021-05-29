import axios, { AxiosResponse } from "axios";
import { randomUUID } from "crypto";
import { mocked } from "ts-jest/utils";
import { UpApiInterface } from "../..";
import { Account } from "./Account";
import { OkResponse } from "./GetAccount";

jest.mock("axios");

const mockedAxios = mocked(axios, true);
mockedAxios.create.mockImplementation(() => mockedAxios);

describe("Get Account [/accounts/{id}]", () => {
  let up: UpApiInterface | null = null;

  beforeEach(() => {
    up = new UpApiInterface("stub");
  });

  test("Get account with id", async () => {
    const mockAccount: Account = {
      id: randomUUID(),
      displayName: "My Test Account",
      createdAt: new Date(),
      balance: {
        currencyCode: "AUD",
        value: "100.00",
        valueInBaseUnits: 1000,
      },
      type: "TRANSACTIONAL",
    };

    const mockedResponse: AxiosResponse<OkResponse> = {
      status: 200,
      statusText: "OK",
      headers: {},
      data: {
        data: {
          id: mockAccount.id,
          attributes: {
            accountType: mockAccount.type,
            balance: mockAccount.balance,
            createdAt: mockAccount.createdAt.toISOString(),
            displayName: mockAccount.displayName,
          },
          type: "accounts",
          relationships: { transactions: {} },
        },
      },
      config: {},
    };

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const account = await up?.getAccount(mockAccount.id);
    expect(account).toEqual(mockAccount);
  });
});
