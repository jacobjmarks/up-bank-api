import axios, { AxiosResponse } from "axios";
import { randomUUID } from "crypto";
import { mocked } from "ts-jest/utils";
import { UpApiInterface } from "../..";
import { Account } from "./Account";
import { OkResponse } from "./GetAccounts";

jest.mock("axios");

const mockedAxios = mocked(axios, true);
mockedAxios.create.mockImplementation(() => mockedAxios);

describe("Get Accounts [/accounts]", () => {
  let up: UpApiInterface | null = null;

  let mockAccounts: Account[] = [];

  beforeEach(() => {
    up = new UpApiInterface("stub");

    mockAccounts = [
      {
        id: randomUUID(),
        displayName: "My First Test Account",
        createdAt: new Date(),
        balance: {
          currencyCode: "AUD",
          value: "100.00",
          valueInBaseUnits: 1000,
        },
        type: "TRANSACTIONAL",
      },
      {
        id: randomUUID(),
        displayName: "My Second Test Account",
        createdAt: new Date(),
        balance: {
          currencyCode: "AUD",
          value: "200.00",
          valueInBaseUnits: 2000,
        },
        type: "SAVER",
      },
    ];
  });

  test("Get accounts", async () => {
    const mockedResponse: AxiosResponse<OkResponse> = {
      status: 200,
      statusText: "OK",
      headers: {},
      data: {
        data: mockAccounts.map(mockAccount => ({
          id: mockAccount.id,
          attributes: {
            accountType: mockAccount.type,
            balance: mockAccount.balance,
            createdAt: mockAccount.createdAt.toISOString(),
            displayName: mockAccount.displayName,
          },
          type: "accounts",
          relationships: { transactions: {} },
        })),
        links: { prev: null, next: null },
      },
      config: {},
    };

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const accounts = await up?.getAccounts();
    expect(accounts).toEqual(mockAccounts);
  });

  test("Get paged accounts", async () => {
    const pageSize = 1;
    const mockAccountSlice = mockAccounts.slice(0, pageSize);
    const mockedResponse: AxiosResponse<OkResponse> = {
      status: 200,
      statusText: "OK",
      headers: {},
      data: {
        data: mockAccountSlice.map(mockAccount => ({
          id: mockAccount.id,
          attributes: {
            accountType: mockAccount.type,
            balance: mockAccount.balance,
            createdAt: mockAccount.createdAt.toISOString(),
            displayName: mockAccount.displayName,
          },
          type: "accounts",
          relationships: { transactions: {} },
        })),
        links: { prev: null, next: null },
      },
      config: {},
    };

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const accounts = await up?.getAccounts({ pageSize });
    expect(accounts).toEqual(mockAccountSlice);
  });
});
