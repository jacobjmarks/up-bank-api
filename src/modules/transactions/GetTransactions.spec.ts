import axios, { AxiosResponse } from "axios";
import { randomUUID } from "crypto";
import { mocked } from "ts-jest/utils";
import { UpApiInterface } from "../..";
import { OkResponse } from "./GetTransactions";
import { Transaction } from "./Transaction";

jest.mock("axios");

const mockedAxios = mocked(axios, true);
mockedAxios.create.mockImplementation(() => mockedAxios);

describe("Get Transactions [/transactions]", () => {
  let up: UpApiInterface | null = null;

  let mockTransactions: Transaction[] = [];

  beforeEach(() => {
    up = new UpApiInterface("stub");

    mockTransactions = [
      {
        id: randomUUID(),
        description: "My First Test Transaction",
        createdAt: new Date(),
        amount: {
          currencyCode: "AUD",
          value: "100.00",
          valueInBaseUnits: 10000,
        },
        status: "SETTLED",
        settledAt: new Date(),
      },
      {
        id: randomUUID(),
        description: "My Second Test Transaction",
        createdAt: new Date(),
        amount: {
          currencyCode: "AUD",
          value: "200.00",
          valueInBaseUnits: 20000,
        },
        status: "HELD",
      },
    ];
  });

  test("Get transactions", async () => {
    const mockedResponse: AxiosResponse<OkResponse> = {
      status: 200,
      statusText: "OK",
      headers: {},
      data: {
        data: mockTransactions.map(mockTransaction => ({
          id: mockTransaction.id,
          attributes: {
            description: mockTransaction.description,
            createdAt: mockTransaction.createdAt.toISOString(),
            amount: mockTransaction.amount,
            status: mockTransaction.status,
            settledAt: mockTransaction.settledAt?.toISOString(),
            rawText: null,
            holdInfo: null,
            message: null,
            roundUp: null,
            foreignAmount: null,
            cashback: null,
          },
          type: "transactions",
          relationships: {
            account: {
              data: {
                id: randomUUID(),
                type: "accounts",
              },
            },
            category: null,
            parentCategory: null,
            tags: { data: [] },
          },
        })),
        links: { prev: null, next: null },
      },
      config: {},
    };

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const transactions = await up?.getTransactions();
    expect(transactions).toEqual(mockTransactions);
  });
});
