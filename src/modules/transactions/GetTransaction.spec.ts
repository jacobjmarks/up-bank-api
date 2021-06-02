import axios, { AxiosResponse } from "axios";
import { randomUUID } from "crypto";
import { mocked } from "ts-jest/utils";
import { UpApiInterface } from "../../UpApiInterface";
import { OkResponse } from "./GetTransaction";
import { Transaction } from "./Transaction";

jest.mock("axios");

const mockedAxios = mocked(axios, true);
mockedAxios.create.mockImplementation(() => mockedAxios);

describe("Get Transaction [/transactions/{id}]", () => {
  let up: UpApiInterface | null = null;

  beforeEach(() => {
    up = new UpApiInterface("stub");
  });

  test("Get transaction with id", async () => {
    const mockTransaction: Transaction = {
      id: randomUUID(),
      description: "My Test Transaction",
      amount: {
        currencyCode: "AUD",
        value: "100.00",
        valueInBaseUnits: 10000,
      },
      createdAt: new Date(),
      status: "SETTLED",
    };

    const mockedResponse: AxiosResponse<OkResponse> = {
      status: 200,
      statusText: "OK",
      headers: {},
      data: {
        data: {
          id: mockTransaction.id,
          attributes: {
            amount: mockTransaction.amount,
            description: mockTransaction.description,
            status: mockTransaction.status,
            createdAt: mockTransaction.createdAt.toISOString(),
            cashback: mockTransaction.cashback || null,
            foreignAmount: mockTransaction.foreignAmount || null,
            holdInfo: mockTransaction.holdInfo || null,
            message: mockTransaction.message || null,
            rawText: mockTransaction.rawText || null,
            roundUp: mockTransaction.roundUp || null,
            settledAt: mockTransaction.settledAt?.toISOString() || null,
          },
          type: "transactions",
          relationships: {
            account: {
              data: { id: "stub", type: "accounts" },
            },
            category: {
              data: { id: "stub", type: "categories" },
            },
            parentCategory: {
              data: { id: "stub", type: "categories" },
            },
            tags: {
              data: [],
            },
          },
        },
      },
      config: {},
    };

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const transaction = await up?.getTransaction(mockTransaction.id);
    expect(transaction).toEqual(mockTransaction);
  });
});
