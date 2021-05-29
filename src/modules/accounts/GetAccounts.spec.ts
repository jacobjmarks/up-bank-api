import axios, { AxiosResponse } from "axios";
import { randomUUID } from "crypto";
import { mocked } from "ts-jest/utils";
import { UpApiInterface } from "../..";
import { components } from "../../models/up-banking-api";
import { Account } from "./Account";
import { AccountPage } from "./AccountPage";
import { OkResponse } from "./GetAccounts";

jest.mock("axios");

const mockedAxios = mocked(axios, true);
mockedAxios.create.mockImplementation(() => mockedAxios);

const mockContext = {
  agent: mockedAxios,
};

const createAxiosResponse = <T = any>(data: T, res?: AxiosResponse<T>): AxiosResponse<T> => {
  return {
    status: 200,
    statusText: "OK",
    headers: {},
    config: {},
    data,
    ...res,
  } as AxiosResponse<T>;
};

describe("Get Accounts [/accounts]", () => {
  let up: UpApiInterface | null = null;

  let mockAccounts: Account[];
  let mockAccountData: components["schemas"]["AccountResource"][];

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
      {
        id: randomUUID(),
        displayName: "My Third Test Account",
        createdAt: new Date(),
        balance: {
          currencyCode: "AUD",
          value: "300.00",
          valueInBaseUnits: 3000,
        },
        type: "SAVER",
      },
    ];

    mockAccountData = mockAccounts.map(mockAccount => ({
      id: mockAccount.id,
      attributes: {
        accountType: mockAccount.type,
        balance: mockAccount.balance,
        createdAt: mockAccount.createdAt.toISOString(),
        displayName: mockAccount.displayName,
      },
      type: "accounts",
      relationships: { transactions: {} },
    }));
  });

  test("Get all accounts", async () => {
    const mockedResponse = createAxiosResponse<OkResponse>({
      data: mockAccountData,
      links: { prev: null, next: null },
    });

    const mockAccountPage = new AccountPage(mockContext, mockedResponse.data);

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const accountPage = await up?.getAccounts();
    expect(accountPage.getData()).toEqual(mockAccountPage.getData());
    expect(accountPage.hasPreviousPage()).toBe(false);
    expect(accountPage.hasNextPage()).toBe(false);
  });

  test("Get first page", async () => {
    const mockedResponse = createAxiosResponse<OkResponse>({
      data: [mockAccountData[0]],
      links: { prev: null, next: "next-page-link" },
    });

    const mockedAccountPage = new AccountPage(mockContext, mockedResponse.data);

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const accountPage = await up?.getAccounts({ pageSize: 1 });
    expect(accountPage.getData()).toEqual(mockedAccountPage.getData());
    expect(accountPage.hasPreviousPage()).toBe(false);
    expect(accountPage.hasNextPage()).toBe(true);
  });

  test("Get second page", async () => {
    const mockedResponse = createAxiosResponse<OkResponse>({
      data: [mockAccountData[1]],
      links: { prev: "prev-page-link", next: "next-page-link" },
    });

    const mockAccountPage = new AccountPage(mockContext, mockedResponse.data);

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const accountPage = await up?.getAccounts({ pageSize: 1 });
    expect(accountPage.getData()).toEqual(mockAccountPage.getData());
    expect(accountPage.hasPreviousPage()).toBe(true);
    expect(accountPage.hasNextPage()).toBe(true);
  });

  test("Get last page", async () => {
    const mockedResponse = createAxiosResponse<OkResponse>({
      data: [mockAccountData[2]],
      links: { prev: "prev-page-link", next: null },
    });

    const mockAccountPage = new AccountPage(mockContext, mockedResponse.data);

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const accountPage = await up?.getAccounts({ pageSize: 1 });
    expect(accountPage.getData()).toEqual(mockAccountPage.getData());
    expect(accountPage.hasPreviousPage()).toBe(true);
    expect(accountPage.hasNextPage()).toBe(false);
  });

  describe("Traversal", () => {
    let mockedFirstPageResponse: AxiosResponse<OkResponse>;
    let mockedFirstPage: AccountPage;

    let mockedSecondPageResponse: AxiosResponse<OkResponse>;
    let mockedSecondPage: AccountPage;

    let mockedLastPageResponse: AxiosResponse<OkResponse>;
    let mockedLastPage: AccountPage;

    beforeEach(() => {
      mockedFirstPageResponse = createAxiosResponse<OkResponse>({
        data: [mockAccountData[0]],
        links: { prev: null, next: "next-page-link" },
      });
      mockedFirstPage = new AccountPage(mockContext, mockedFirstPageResponse.data);

      mockedSecondPageResponse = createAxiosResponse<OkResponse>({
        data: [mockAccountData[1]],
        links: { prev: "prev-page-link", next: "next-page-link" },
      });
      mockedSecondPage = new AccountPage(mockContext, mockedSecondPageResponse.data);

      mockedLastPageResponse = createAxiosResponse<OkResponse>({
        data: [mockAccountData[2]],
        links: { prev: "prev-page-link", next: null },
      });
      mockedLastPage = new AccountPage(mockContext, mockedLastPageResponse.data);
    });

    test("first to last page", async () => {
      mockedAxios.get.mockResolvedValueOnce(mockedFirstPageResponse);
      const firstAccountPage = await up?.getAccounts({ pageSize: 1 });
      expect(firstAccountPage.getData()).toEqual(mockedFirstPage.getData());
      expect(firstAccountPage.hasPreviousPage()).toBe(false);
      expect(await firstAccountPage.getPreviousPage()).toBe(null);
      expect(firstAccountPage.hasNextPage()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce(mockedSecondPageResponse);
      const nextAccountPage = await firstAccountPage.getNextPage();
      expect(nextAccountPage.getData()).toEqual(mockedSecondPage.getData());
      expect(nextAccountPage.hasPreviousPage()).toBe(true);
      expect(nextAccountPage.hasNextPage()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce(mockedLastPageResponse);
      const lastAccountPage = await firstAccountPage.getNextPage();
      expect(lastAccountPage.getData()).toEqual(mockedLastPage.getData());
      expect(lastAccountPage.hasPreviousPage()).toBe(true);
      expect(lastAccountPage.hasNextPage()).toBe(false);
      expect(await lastAccountPage.getNextPage()).toBe(null);
    });

    test("last to first page", async () => {
      mockedAxios.get.mockResolvedValueOnce(mockedLastPageResponse);
      const lastAccountPage = await up?.getAccounts({ pageSize: 1 });
      expect(lastAccountPage.getData()).toEqual(mockedLastPage.getData());
      expect(lastAccountPage.hasPreviousPage()).toBe(true);
      expect(lastAccountPage.hasNextPage()).toBe(false);
      expect(await lastAccountPage.getNextPage()).toBe(null);

      mockedAxios.get.mockResolvedValueOnce(mockedSecondPageResponse);
      const nextAccountPage = await lastAccountPage.getPreviousPage();
      expect(nextAccountPage.getData()).toEqual(mockedSecondPage.getData());
      expect(nextAccountPage.hasPreviousPage()).toBe(true);
      expect(nextAccountPage.hasNextPage()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce(mockedFirstPageResponse);
      const firstAccountPage = await nextAccountPage.getPreviousPage();
      expect(firstAccountPage.getData()).toEqual(mockedFirstPage.getData());
      expect(firstAccountPage.hasPreviousPage()).toBe(false);
      expect(await firstAccountPage.getPreviousPage()).toBe(null);
      expect(firstAccountPage.hasNextPage()).toBe(true);
    });
  });
});
