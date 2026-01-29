import itemsService from "../services/items.service.js";

export const ListItems = async (req, res) => {
  try {
    const { q, page, limit, sortBy, sortOrder, category, minPrice, maxPrice } =
      req.validatedQuery || req.query;

    const result = await itemsService.ListItems({
      q,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      category,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    });

    if (result.items.length === 0) {
      return res.status(200).json({
        ...result,
      });
    }

    res.status(200).json({
      page: result.page,
      limit: result.limit,
      total_items: result.total_items,
      total_pages: result.total_pages,
      items: result.items,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
