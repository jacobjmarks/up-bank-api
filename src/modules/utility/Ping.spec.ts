import axios from "axios";
import { mocked } from "ts-jest/utils";
import { UpApiInterface } from "../../UpApiInterface";

jest.mock("axios");

const mockedAxios = mocked(axios, true);
mockedAxios.create.mockImplementation(() => mockedAxios);

describe("Ping", () => {
  let up: UpApiInterface | null = null;

  beforeEach(() => {
    up = new UpApiInterface("stub");
  });

  test("200 OK", async () => {
    mockedAxios.get.mockResolvedValueOnce({ status: 200 });
    const successful = await up?.ping();
    expect(successful).toBe(true);
  });

  test("401 Not Authorized", async () => {
    mockedAxios.get.mockResolvedValueOnce({ status: 401 });
    const successful = await up?.ping();
    expect(successful).toBe(false);
  });
});
