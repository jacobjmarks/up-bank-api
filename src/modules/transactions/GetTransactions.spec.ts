import axios, { AxiosResponse } from "axios";
import { randomUUID } from "crypto";
import { mocked } from "ts-jest/utils";
import { TransactionResource } from "../../models";
import { UpApiInterface } from "../../UpApiInterface";
import { OkResponse } from "./GetTransactions";
import { Transaction } from "./Transaction";
import { TransactionPage } from "./TransactionPage";

jest.mock("axios");

const mockedAxios = mocked(axios, true);
mockedAxios.create.mockImplementation(() => mockedAxios);

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

describe("Get Transactions [/transactions]", () => {
  let up: UpApiInterface | null = null;

  let mockTransactions: Transaction[];
  let mockTransactionData: TransactionResource[];

  beforeEach(() => {
    up = new UpApiInterface("stub");

    mockTransactions = [
      {
        id: randomUUID(),
        description: "My First Test Transaction",
        amount: {
          currencyCode: "AUD",
          value: "100.00",
          valueInBaseUnits: 10000,
        },
        createdAt: new Date(),
        status: "SETTLED",
      },
      {
        id: randomUUID(),
        description: "My Second Test Transaction",
        amount: {
          currencyCode: "AUD",
          value: "200.00",
          valueInBaseUnits: 20000,
        },
        createdAt: new Date(),
        status: "SETTLED",
      },
      {
        id: randomUUID(),
        description: "My Third Test Transaction",
        amount: {
          currencyCode: "AUD",
          value: "300.00",
          valueInBaseUnits: 30000,
        },
        createdAt: new Date(),
        status: "SETTLED",
      },
    ];

    mockTransactionData = mockTransactions.map(mockTransaction => ({
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
    }));
  });

  test("Get all transactions", async () => {
    const mockedResponse = createAxiosResponse<OkResponse>({
      data: mockTransactionData,
      links: { prev: null, next: null },
    });

    const mockTransactionPage = new TransactionPage(null, mockedResponse.data);

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const transactionPage = await up?.getTransactions();
    expect(transactionPage.getData()).toEqual(mockTransactionPage.getData());
    expect(transactionPage.hasPreviousPage()).toBe(false);
    expect(transactionPage.hasNextPage()).toBe(false);
  });

  test("Get first page", async () => {
    const mockedResponse = createAxiosResponse<OkResponse>({
      data: [mockTransactionData[0]],
      links: { prev: null, next: "next-page-link" },
    });

    const mockedTransactionPage = new TransactionPage(null, mockedResponse.data);

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const transactionPage = await up?.getTransactions({ pageSize: 1 });
    expect(transactionPage.getData()).toEqual(mockedTransactionPage.getData());
    expect(transactionPage.hasPreviousPage()).toBe(false);
    expect(transactionPage.hasNextPage()).toBe(true);
  });

  test("Get second page", async () => {
    const mockedResponse = createAxiosResponse<OkResponse>({
      data: [mockTransactionData[1]],
      links: { prev: "prev-page-link", next: "next-page-link" },
    });

    const mockTransactionPage = new TransactionPage(null, mockedResponse.data);

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const transactionPage = await up?.getTransactions({ pageSize: 1 });
    expect(transactionPage.getData()).toEqual(mockTransactionPage.getData());
    expect(transactionPage.hasPreviousPage()).toBe(true);
    expect(transactionPage.hasNextPage()).toBe(true);
  });

  test("Get last page", async () => {
    const mockedResponse = createAxiosResponse<OkResponse>({
      data: [mockTransactionData[2]],
      links: { prev: "prev-page-link", next: null },
    });

    const mockTransactionPage = new TransactionPage(null, mockedResponse.data);

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const transactionPage = await up?.getTransactions({ pageSize: 1 });
    expect(transactionPage.getData()).toEqual(mockTransactionPage.getData());
    expect(transactionPage.hasPreviousPage()).toBe(true);
    expect(transactionPage.hasNextPage()).toBe(false);
  });

  describe("Traversal", () => {
    let mockedFirstPageResponse: AxiosResponse<OkResponse>;
    let mockedFirstPage: TransactionPage;

    let mockedSecondPageResponse: AxiosResponse<OkResponse>;
    let mockedSecondPage: TransactionPage;

    let mockedLastPageResponse: AxiosResponse<OkResponse>;
    let mockedLastPage: TransactionPage;

    beforeEach(() => {
      mockedFirstPageResponse = createAxiosResponse<OkResponse>({
        data: [mockTransactionData[0]],
        links: { prev: null, next: "next-page-link" },
      });
      mockedFirstPage = new TransactionPage(null, mockedFirstPageResponse.data);

      mockedSecondPageResponse = createAxiosResponse<OkResponse>({
        data: [mockTransactionData[1]],
        links: { prev: "prev-page-link", next: "next-page-link" },
      });
      mockedSecondPage = new TransactionPage(null, mockedSecondPageResponse.data);

      mockedLastPageResponse = createAxiosResponse<OkResponse>({
        data: [mockTransactionData[2]],
        links: { prev: "prev-page-link", next: null },
      });
      mockedLastPage = new TransactionPage(null, mockedLastPageResponse.data);
    });

    test("first to last page", async () => {
      mockedAxios.get.mockResolvedValueOnce(mockedFirstPageResponse);
      const firstTransactionPage = await up?.getTransactions({ pageSize: 1 });
      expect(firstTransactionPage.getData()).toEqual(mockedFirstPage.getData());
      expect(firstTransactionPage.hasPreviousPage()).toBe(false);
      expect(await firstTransactionPage.getPreviousPage()).toBe(null);
      expect(firstTransactionPage.hasNextPage()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce(mockedSecondPageResponse);
      const nextTransactionPage = await firstTransactionPage.getNextPage();
      expect(nextTransactionPage.getData()).toEqual(mockedSecondPage.getData());
      expect(nextTransactionPage.hasPreviousPage()).toBe(true);
      expect(nextTransactionPage.hasNextPage()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce(mockedLastPageResponse);
      const lastTransactionPage = await firstTransactionPage.getNextPage();
      expect(lastTransactionPage.getData()).toEqual(mockedLastPage.getData());
      expect(lastTransactionPage.hasPreviousPage()).toBe(true);
      expect(lastTransactionPage.hasNextPage()).toBe(false);
      expect(await lastTransactionPage.getNextPage()).toBe(null);
    });

    test("last to first page", async () => {
      mockedAxios.get.mockResolvedValueOnce(mockedLastPageResponse);
      const lastTransactionPage = await up?.getTransactions({ pageSize: 1 });
      expect(lastTransactionPage.getData()).toEqual(mockedLastPage.getData());
      expect(lastTransactionPage.hasPreviousPage()).toBe(true);
      expect(lastTransactionPage.hasNextPage()).toBe(false);
      expect(await lastTransactionPage.getNextPage()).toBe(null);

      mockedAxios.get.mockResolvedValueOnce(mockedSecondPageResponse);
      const nextTransactionPage = await lastTransactionPage.getPreviousPage();
      expect(nextTransactionPage.getData()).toEqual(mockedSecondPage.getData());
      expect(nextTransactionPage.hasPreviousPage()).toBe(true);
      expect(nextTransactionPage.hasNextPage()).toBe(true);

      mockedAxios.get.mockResolvedValueOnce(mockedFirstPageResponse);
      const firstTransactionPage = await nextTransactionPage.getPreviousPage();
      expect(firstTransactionPage.getData()).toEqual(mockedFirstPage.getData());
      expect(firstTransactionPage.hasPreviousPage()).toBe(false);
      expect(await firstTransactionPage.getPreviousPage()).toBe(null);
      expect(firstTransactionPage.hasNextPage()).toBe(true);
    });
  });
});
