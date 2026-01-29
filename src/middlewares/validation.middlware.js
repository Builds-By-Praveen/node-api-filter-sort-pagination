/**
 * Validation Rules:
 * - page and limit must be positive integers
 * - limit must not exceed 50
 * - minPrice and maxPrice must be valid numbers
 * - minPrice ≤ maxPrice
 * - sortBy must be price or created_at
 * - order must be asc or desc
 */

import { MAX_LIMIT } from "../config/constants.js";
import listItemsSchema from "../validations/items.schema.js";

export const ManualValidateQuery = (req, res, next) => {
  const { page, limit, minPrice, maxPrice, sortBy, sortOrder } = req.query;

  if (page && (!Number.isInteger(Number(page)) || Number(page) <= 0)) {
    return res.status(400).json({ error: "page must be a positive integer" });
  }
  if (limit && (!Number.isInteger(Number(limit)) || Number(limit) <= 0)) {
    return res.status(400).json({ error: "limit must be a positive integer" });
  }
  if (limit && Number(limit) > MAX_LIMIT) {
    return res
      .status(400)
      .json({ error: `limit must not exceed MAX_LIMIT ${MAX_LIMIT}` });
  }

  if ((minPrice && isNaN(Number(minPrice))) || Number(minPrice) < 0) {
    return res
      .status(400)
      .json({ error: "minPrice must be a non-negative number" });
  }
  if (Number(maxPrice) < 0 || (maxPrice && isNaN(Number(maxPrice)))) {
    return res
      .status(400)
      .json({ error: "maxPrice must be a non-negative number" });
  }
  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    return res.status(400).json({ error: "minPrice must be ≤ maxPrice" });
  }

  if (sortBy && !["price", "created_at"].includes(sortBy)) {
    return res
      .status(400)
      .json({ error: "sortBy must be 'price' or 'created_at'" });
  }

  if (sortOrder && !["asc", "desc"].includes(sortOrder)) {
    return res.status(400).json({ error: "sortOrder must be 'asc' or 'desc'" });
  }

  next();
};

export const ZodValidateQuery = async (req, res, next) => {
  const parsed = listItemsSchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid query parameters",
      details: parsed.error.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  req.validatedQuery = parsed.data;
  next();
};
