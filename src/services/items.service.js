import items from "../data/items.js";

const ListItems = async ({
  q,
  page = 1,
  limit = 10,
  category,
  minPrice,
  maxPrice,
  sortBy,
  sortOrder = "asc",
}) => {
  let filteredItems = items;

  // Search by name
  if (q) {
    filteredItems = filteredItems.filter((item) =>
      item.name.toLowerCase().includes(q.toLowerCase()),
    );
  }

  // Filter by category
  if (category) {
    filteredItems = filteredItems.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase(),
    );
  }
  // Filter by price range
  if (minPrice) {
    filteredItems = filteredItems.filter((item) => item.price >= minPrice);
  }
  if (maxPrice) {
    filteredItems = filteredItems.filter((item) => item.price <= maxPrice);
  }

  // Sort items
  if (sortBy) {
    if (sortBy === "created_at") {
      filteredItems.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    } else {
      filteredItems.sort((a, b) => {
        if (sortOrder === "asc") {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      });
    }
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return {
    page,
    limit,
    total_items: filteredItems.length,
    total_pages: Math.ceil(filteredItems.length / limit),
    items: paginatedItems,
  };
};

export default { ListItems };
