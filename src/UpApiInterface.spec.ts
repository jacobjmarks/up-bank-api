import axios from "axios";
import { mocked } from "ts-jest/utils";
import { MoneyObject } from "./models";
import { Account } from "./modules/accounts";
import { UpApiInterface } from "./UpApiInterface";

jest.mock("axios");
const mockedAxios = mocked(axios, true);
mockedAxios.create.mockImplementation(() => mockedAxios);

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

const balanceInBaseUnits = (account: Account) => account.balance.valueInBaseUnits;
const sum = (total: number, value: number) => (total += value);

describe("UpApiInterface", () => {
  let up: UpApiInterface;

  beforeEach(() => {
    up = new UpApiInterface("stub");
  });

  test("Get total balance", async () => {
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
});
