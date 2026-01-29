import request from "supertest";

import app from "../../src/app.js"; // your Express app entry

describe("GET /items API", () => {
  test("returns first page of items", async () => {
    const res = await request(app).get("/items?page=1&limit=1");
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(1);
  });

  test("filters by category", async () => {
    const res = await request(app).get("/items?category=storage");
    expect(res.status).toBe(200);
    expect(res.body.items.every((item) => item.category === "storage")).toBe(
      true,
    );
  });

  test("filters by price range", async () => {
    const res = await request(app).get("/items?minPrice=1000&maxPrice=2000");
    expect(res.status).toBe(200);
    expect(
      res.body.items.every((item) => item.price >= 1000 && item.price <= 2000),
    ).toBe(true);
  });

  test("sorts by price descending", async () => {
    const res = await request(app).get("/items?sortBy=price&sortOrder=desc");
    expect(res.status).toBe(200);
    const prices = res.body.items.map((item) => item.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test("invalid query params return 400", async () => {
    const res = await request(app).get("/items?minPrice=-5");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid query parameters");
  });
});
