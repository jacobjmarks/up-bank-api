import axios, { AxiosResponse } from "axios";
import { mocked } from "ts-jest/utils";
import { MoneyObject } from "./models";
import { Account } from "./modules/accounts";
import { OkResponse as GetAccountsOkResponse } from "./modules/accounts/GetAccounts";
import { Transaction } from "./modules/transactions";
import { OkResponse as GetTransactionsOkResponse } from "./modules/transactions/GetTransactions";
import { UpApiInterface } from "./UpApiInterface";

jest.mock("axios");
const mockedAxios = mocked(axios, true);
mockedAxios.create.mockImplementation(() => mockedAxios);

const balanceInBaseUnits = (account: Account) => account.balance.valueInBaseUnits;
const sum = (total: number, value: number) => (total += value);

describe("UpApiInterface", () => {
  let up: UpApiInterface;

  beforeEach(() => {
    up = new UpApiInterface("stub");
  });

  test("Get total balance", async () => {
    const TEST_ACCOUNTS: Account[] = [
      {
        id: "1",
        balance: { currencyCode: "AUD", value: "123.45", valueInBaseUnits: 12345 },
        displayName: "Test account 1",
        createdAt: new Date(),
        type: "SAVER",
      },
      {
        id: "2",
        balance: { currencyCode: "AUD", value: "428.12", valueInBaseUnits: 42812 },
        displayName: "Test account 2",
        createdAt: new Date(),
        type: "SAVER",
      },
      {
        id: "3",
        balance: { currencyCode: "AUD", value: "599.11", valueInBaseUnits: 59911 },
        displayName: "Test account 3",
        createdAt: new Date(),
        type: "SAVER",
      },
    ];

    jest.spyOn(up, "getAllAccounts").mockReturnValue(Promise.resolve(TEST_ACCOUNTS));
    const expectedTotalAccountBalanceInBaseUnits = TEST_ACCOUNTS.map(balanceInBaseUnits).reduce(sum, 0);
    const expectedTotalAccountBalance: MoneyObject = {
      currencyCode: "AUD",
      value: (expectedTotalAccountBalanceInBaseUnits / 100).toString(),
      valueInBaseUnits: expectedTotalAccountBalanceInBaseUnits,
    };

    expect(await up.getTotalBalance()).toEqual(expectedTotalAccountBalance);
  });

  test("Get total balance (no accounts)", async () => {
    jest.spyOn(up, "getAllAccounts").mockReturnValue(Promise.resolve([]));
    expect(await up.getTotalBalance()).toEqual(null);
  });

  test("Get all Accounts", async () => {
    const getAccountsResponse: AxiosResponse<GetAccountsOkResponse>[] = [
      {
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
        data: {
          data: [
            {
              id: "1",
              type: "accounts",
              attributes: {
                displayName: "My First Account",
                accountType: "TRANSACTIONAL",
                balance: { currencyCode: "AUD", value: "13.41", valueInBaseUnits: 1341 },
                createdAt: new Date().toISOString(),
              },
              relationships: {
                transactions: {},
              },
            },
          ],
          links: {
            prev: null,
            next: "page-two",
          },
        },
      },
      {
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
        data: {
          data: [
            {
              id: "2",
              type: "accounts",
              attributes: {
                displayName: "My Second Account",
                accountType: "SAVER",
                balance: { currencyCode: "AUD", value: "193.51", valueInBaseUnits: 19351 },
                createdAt: new Date().toISOString(),
              },
              relationships: {
                transactions: {},
              },
            },
          ],
          links: {
            prev: "page-one",
            next: "page-three",
          },
        },
      },
      {
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
        data: {
          data: [
            {
              id: "3",
              type: "accounts",
              attributes: {
                displayName: "My Third Account",
                accountType: "SAVER",
                balance: { currencyCode: "AUD", value: "152.12", valueInBaseUnits: 152.12 },
                createdAt: new Date().toISOString(),
              },
              relationships: {
                transactions: {},
              },
            },
          ],
          links: {
            prev: "page-two",
            next: null,
          },
        },
      },
    ];

    const expectedAccounts: Account[] = [
      new Account(getAccountsResponse[0].data.data[0], { agent: mockedAxios }),
      new Account(getAccountsResponse[1].data.data[0], { agent: mockedAxios }),
      new Account(getAccountsResponse[2].data.data[0], { agent: mockedAxios }),
    ];

    jest
      .spyOn(mockedAxios, "get")
      .mockReturnValueOnce(Promise.resolve(getAccountsResponse[0]))
      .mockReturnValueOnce(Promise.resolve(getAccountsResponse[1]))
      .mockReturnValueOnce(Promise.resolve(getAccountsResponse[2]));

    const accounts = await up.getAllAccounts();
    expect(accounts).toEqual(expectedAccounts);
  });

  test("Get all Transactions", async () => {
    const getTransactionsResponse: AxiosResponse<GetTransactionsOkResponse>[] = [
      {
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
        data: {
          data: [
            {
              id: "1",
              type: "accounts",
              attributes: {
                description: "My First Transaction",
                status: "SETTLED",
                amount: { currencyCode: "AUD", value: "13.41", valueInBaseUnits: 1341 },
                createdAt: new Date().toISOString(),
                settledAt: null,
                rawText: null,
                message: null,
                holdInfo: null,
                roundUp: null,
                cashback: null,
                foreignAmount: null,
              },
              relationships: {
                account: { data: { id: "stub", type: "accounts" } },
                category: { data: { id: "stub", type: "categories" } },
                parentCategory: { data: { id: "stub", type: "categories" } },
                tags: { data: [] },
              },
            },
          ],
          links: {
            prev: null,
            next: "page-two",
          },
        },
      },
      {
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
        data: {
          data: [
            {
              id: "2",
              type: "accounts",
              attributes: {
                description: "My Second Transaction",
                status: "SETTLED",
                amount: { currencyCode: "AUD", value: "193.51", valueInBaseUnits: 19351 },
                createdAt: new Date().toISOString(),
                settledAt: null,
                rawText: null,
                message: null,
                holdInfo: null,
                roundUp: null,
                cashback: null,
                foreignAmount: null,
              },
              relationships: {
                account: { data: { id: "stub", type: "accounts" } },
                category: { data: { id: "stub", type: "categories" } },
                parentCategory: { data: { id: "stub", type: "categories" } },
                tags: { data: [] },
              },
            },
          ],
          links: {
            prev: "page-one",
            next: "page-three",
          },
        },
      },
      {
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
        data: {
          data: [
            {
              id: "3",
              type: "accounts",
              attributes: {
                description: "My Third Transaction",
                status: "SETTLED",
                amount: { currencyCode: "AUD", value: "152.12", valueInBaseUnits: 152.12 },
                createdAt: new Date().toISOString(),
                settledAt: null,
                rawText: null,
                message: null,
                holdInfo: null,
                roundUp: null,
                cashback: null,
                foreignAmount: null,
              },
              relationships: {
                account: { data: { id: "stub", type: "accounts" } },
                category: { data: { id: "stub", type: "categories" } },
                parentCategory: { data: { id: "stub", type: "categories" } },
                tags: { data: [] },
              },
            },
          ],
          links: {
            prev: "page-two",
            next: null,
          },
        },
      },
    ];

    const expectedTransactions: Transaction[] = [
      new Transaction(getTransactionsResponse[0].data.data[0], { agent: mockedAxios }),
      new Transaction(getTransactionsResponse[1].data.data[0], { agent: mockedAxios }),
      new Transaction(getTransactionsResponse[2].data.data[0], { agent: mockedAxios }),
    ];

    jest
      .spyOn(mockedAxios, "get")
      .mockReturnValueOnce(Promise.resolve(getTransactionsResponse[0]))
      .mockReturnValueOnce(Promise.resolve(getTransactionsResponse[1]))
      .mockReturnValueOnce(Promise.resolve(getTransactionsResponse[2]));

    const accounts = await up.getAllTransactions();
    expect(accounts).toEqual(expectedTransactions);
  });
});
