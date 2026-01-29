import { z } from "zod";

import { MAX_LIMIT } from "../config/constants.js";

const listItemsSchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 1))
      .refine((n) => Number.isInteger(n) && n > 0, {
        message: "page must be a positive integer",
      }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 10))
      .refine((n) => Number.isInteger(n) && n > 0 && n <= MAX_LIMIT, {
        message: `limit must be between 1 and ${MAX_LIMIT}`,
      }),
    minPrice: z
      .string()
      .optional()
      .transform((val) => (val !== undefined ? Number(val) : undefined))
      .refine((n) => n === undefined || n >= 0, {
        message: "minPrice must be a non-negative number",
      }),
    maxPrice: z
      .string()
      .optional()
      .transform((val) => (val !== undefined ? Number(val) : undefined))
      .refine((n) => n === undefined || n >= 0, {
        message: "maxPrice must be a non-negative number",
      }),
    sortBy: z.enum(["price", "created_at"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    category: z.string().optional(),
    q: z.string().optional(),
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message: "minPrice must be less than or equal to maxPrice",
      path: ["minPrice"],
    },
  );

export default listItemsSchema;
