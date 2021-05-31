import { Page } from "./Page";

const TEST_DATA = ["first-element", "second-element", "last-element"];

class TestPage extends Page<string> {
  private indexFrom: number;
  private limit: number;

  constructor(indexFrom: number, limit: number) {
    super(TEST_DATA.slice(indexFrom, indexFrom + limit));
    this.indexFrom = indexFrom;
    this.limit = limit;
  }

  public hasNextPage(): boolean {
    return this.indexFrom + this.limit < TEST_DATA.length;
  }

  public hasPreviousPage(): boolean {
    return this.indexFrom > 0;
  }

  public getNextPage(): Promise<TestPage | null> {
    if (!this.hasNextPage()) return Promise.resolve(null);
    return Promise.resolve(new TestPage(this.indexFrom + this.limit, this.limit));
  }

  public getPreviousPage(): Promise<TestPage | null> {
    if (!this.hasPreviousPage()) return Promise.resolve(null);
    return Promise.resolve(new TestPage(this.indexFrom - this.limit, this.limit));
  }
}

describe("Page", () => {
  let firstPage: TestPage;
  let secondPage: TestPage;
  let lastPage: TestPage;

  beforeEach(() => {
    firstPage = new TestPage(0, 1);
    secondPage = new TestPage(1, 1);
    lastPage = new TestPage(2, 1);
  });

  test("Page with all data", async () => {
    const page = new TestPage(0, 3);
    expect(page.getData()).toEqual(TEST_DATA);
    expect([page.hasPreviousPage(), page.hasNextPage()]).toEqual([false, false]);
  });

  test("First page", async () => {
    expect(firstPage.getData()).toEqual([TEST_DATA[0]]);
    expect([firstPage.hasPreviousPage(), firstPage.hasNextPage()]).toEqual([false, true]);
  });

  test("Second page", async () => {
    expect(secondPage.getData()).toEqual([TEST_DATA[1]]);
    expect([secondPage.hasPreviousPage(), secondPage.hasNextPage()]).toEqual([true, true]);
  });

  test("Last page", async () => {
    expect(lastPage.getData()).toEqual([TEST_DATA[2]]);
    expect([lastPage.hasPreviousPage(), lastPage.hasNextPage()]).toEqual([true, false]);
  });

  test("Get remaining data from first page", async () => {
    expect(firstPage.getData()).toEqual([TEST_DATA[0]]);
    expect(await firstPage.getRemainingData()).toEqual(TEST_DATA);
    expect([firstPage.hasPreviousPage(), firstPage.hasNextPage()]).toEqual([false, true]);
  });

  test("Get remaining data from second page", async () => {
    expect(secondPage.getData()).toEqual([TEST_DATA[1]]);
    expect(await secondPage.getRemainingData()).toEqual(TEST_DATA.slice(1, 3));
    expect([secondPage.hasPreviousPage(), secondPage.hasNextPage()]).toEqual([true, true]);
  });

  test("Get remaining data from last page", async () => {
    expect(lastPage.getData()).toEqual([TEST_DATA[2]]);
    expect(await lastPage.getRemainingData()).toEqual(TEST_DATA.slice(2, 3));
    expect([lastPage.hasPreviousPage(), lastPage.hasNextPage()]).toEqual([true, false]);
  });

  test("Traversal from first page to last page", async () => {
    let currentPage = firstPage;
    expect([currentPage.hasPreviousPage(), currentPage.hasNextPage()]).toEqual([false, true]);

    expect((currentPage = await currentPage.getNextPage())).toEqual(secondPage);
    expect([currentPage.hasPreviousPage(), currentPage.hasNextPage()]).toEqual([true, true]);

    expect((currentPage = await currentPage.getNextPage())).toEqual(lastPage);
    expect([currentPage.hasPreviousPage(), currentPage.hasNextPage()]).toEqual([true, false]);
  });

  test("Traversal from last page to first page", async () => {
    let currentPage = lastPage;
    expect([currentPage.hasPreviousPage(), currentPage.hasNextPage()]).toEqual([true, false]);

    expect((currentPage = await currentPage.getPreviousPage())).toEqual(secondPage);
    expect([currentPage.hasPreviousPage(), currentPage.hasNextPage()]).toEqual([true, true]);

    expect((currentPage = await currentPage.getPreviousPage())).toEqual(firstPage);
    expect([currentPage.hasPreviousPage(), currentPage.hasNextPage()]).toEqual([false, true]);
  });
});
