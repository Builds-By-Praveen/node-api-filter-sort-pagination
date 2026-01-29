import listItemsSchema from "../../src/validations/items.schema.js";

describe("listItemsSchema validation", () => {
  test("valid query passes", () => {
    const parsed = listItemsSchema.safeParse({ page: "1", limit: "10" });
    expect(parsed.success).toBe(true);
    expect(parsed.data.page).toBe(1);
    expect(parsed.data.limit).toBe(10);
  });

  test("negative minPrice fails", () => {
    const parsed = listItemsSchema.safeParse({ minPrice: "-5" });
    expect(parsed.success).toBe(false);
    expect(parsed.error.issues[0].message).toBe(
      "minPrice must be a non-negative number",
    );
  });

  test("minPrice > maxPrice fails", () => {
    const parsed = listItemsSchema.safeParse({
      minPrice: "2000",
      maxPrice: "1000",
    });
    expect(parsed.success).toBe(false);
    expect(parsed.error.issues[0].message).toBe(
      "minPrice must be less than or equal to maxPrice",
    );
  });

  test("invalid sortBy fails", () => {
    const parsed = listItemsSchema.safeParse({ sortBy: "invalid" });
    expect(parsed.success).toBe(false);
    expect(parsed.error.issues[0].path).toContain("sortBy");
  });

  test("invalid sortOrder fails", () => {
    const parsed = listItemsSchema.safeParse({ sortOrder: "upwards" });
    expect(parsed.success).toBe(false);
    expect(parsed.error.issues[0].path).toContain("sortOrder");
  });

  test("limit greater than MAX_LIMIT fails", () => {
    const parsed = listItemsSchema.safeParse({ limit: "1000" });
    expect(parsed.success).toBe(false);
    expect(parsed.error.issues[0].message).toMatch(/limit must be between/);
  });
});
