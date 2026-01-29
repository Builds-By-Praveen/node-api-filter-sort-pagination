import { ListItems } from "../../src/services/items.service.js";

describe("ItemsService.ListItems", () => {
  test("returns first item when page=1 & limit=1", async () => {
    const result = await ListItems({ page: 1, limit: 1 });
    expect(result.items).toHaveLength(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(1);
  });

  test("returns empty list when page is too high", async () => {
    const result = await ListItems({ page: 999, limit: 10 });
    expect(result.items).toHaveLength(0);
    expect(result.total_items).toBeGreaterThan(0);
  });

  test("filters by category", async () => {
    const result = await ListItems({ category: "storage" });
    expect(result.items.every((item) => item.category === "storage")).toBe(
      true,
    );
  });

  test("filters by price range", async () => {
    const result = await ListItems({
      minPrice: 1000,
      maxPrice: 2000,
    });
    expect(
      result.items.every((item) => item.price >= 1000 && item.price <= 2000),
    ).toBe(true);
  });

  test("sorts by price ascending", async () => {
    const result = await ListItems({
      sortBy: "price",
      sortOrder: "asc",
    });
    const prices = result.items.map((item) => item.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test("sorts by created_at descending", async () => {
    const result = await ListItems({
      sortBy: "created_at",
      sortOrder: "desc",
    });
    const dates = result.items.map((item) => new Date(item.created_at));
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });
});
