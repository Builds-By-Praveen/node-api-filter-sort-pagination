# Node.js Search, Filter, Sort, and Pagination API

A simple Express.js API demonstrating pagination, filtering, sorting, and query parameter validation.

---

## 📂 Folder Structure

```sh
node-api-filter-sort-pagination/
├── src/
│   ├── app.js                # Express app entry
│   ├── routes/
│   │   └── index.js          # Routes
│   ├── controllers/
│   │   └── items.controller.js
│   ├── services/
│   │   └── items.service.js  # Business logic
│   ├── middlewares/
│   │   └── validation.middleware.js
│   └── validations/
│       └── items.schema.js   # Zod schema
├── package.json
├── README.md
```

---

## How to Run

```bash
npm install
npm start
```

- Access server at: http://localhost:3000.

## Pagination Logic

- **Inputs**: `page`, `limit`
- **Process**:
  - `startIndex = (page - 1) * limit`
  - `endIndex = page * limit`
  - Slice array: `items.slice(startIndex, endIndex)`
- **Outputs**:
  - `page`,
  - `limit`
  - `total_items`
  - `total_pages = Math.ceil(total_items / limit)`
  - `items`

---

## Validation Rules

- `page` and `limit` must be positive integers.
- `limit` must not exceed **50**.
- `minPrice` and `maxPrice` must be valid numbers.
- `minPrice` ≤ maxPrice.
- `sortBy` must be `price` or `created_at`.
- `sortOrder` must be `asc` or `desc`.

### Two validation approaches are implemented, for demonstration:

- **Manual middleware** → explicit checks
- **Zod middleware** → schema validation
- Note:
  - Both APIs are having same routes. So, at the `src\routes\index.js` file, uncomment one which is to be tested and comment theother one. Like below:
    ```js
    // router.get("/items", ManualValidateQuery, ListItems); // Manual Validation
    router.get("/items", ZodValidateQuery, ListItems); // Zod Validation
    ```

---

## HTTP Status Codes

- 200 OK → Success (empty list allowed).
- 400 Bad Request → Invalid query parameters.
- 500 Internal Server Error → Unexpected errors.

---

## Example CURL Requests

- Get first page of items
  ```bash
  curl "http://localhost:3000/items?page=1&limit=1"
  ```
- Filter by category
  ```bash
  curl "http://localhost:3000/items?category=electronics"
  ```
- Filter by price range
  ```bash
  curl "http://localhost:3000/items?minPrice=1000&maxPrice=2000"
  ```
- Sort by price descending
  ```bash
  curl "http://localhost:3000/items?sortBy=price&sortOrder=desc"
  ```
- Search by name
  ```bash
  curl "http://localhost:3000/items?q=mouse"
  ```

---

## Edge Cases Handled

- Invalid `page`/`limit` → 400
- `limit > 50` → 400
  - The maximum page size (`limit`) is configurable via `MAX_LIMIT` constant (default: 50).
- Non-numeric or negative `minPrice`/`maxPrice` → 400
- `minPrice > maxPrice` → 400
- Invalid `sortBy` or `sortOrder` → 400
- Page out of range → 200 with empty list
- Case-insensitive category filter
- Search by name (`q` parameter)

## Sample Responses

- Success Responses:
  1. URL: `http://localhost:3000/items?page=1&limit=1`
     ```json
     {
       "page": 1,
       "limit": 1,
       "total_items": 20,
       "total_pages": 20,
       "items": [
         {
           "id": 1,
           "name": "Wireless Mouse",
           "category": "electronics",
           "price": 999,
           "created_at": "2025-01-01T10:00:00Z"
         }
       ]
     }
     ```
  2. URL: `http://localhost:3000/items?category=storage`
     ```json
     {
       "page": 1,
       "limit": 10,
       "total_items": 2,
       "total_pages": 1,
       "items": [
         {
           "id": 13,
           "name": "External SSD",
           "category": "storage",
           "price": 1899,
           "created_at": "2025-01-13T22:00:00Z"
         },
         {
           "id": 20,
           "name": "Portable SSD",
           "category": "storage",
           "price": 2199,
           "created_at": "2025-01-20T13:00:00Z"
         }
       ]
     }
     ```
- Error Responses:
  1. URL: `http://localhost:3000/items?minPrice=-2&maxPrice=-1`
     ```json
     {
       "error": "Invalid query parameters",
       "details": [
         {
           "path": "minPrice",
           "message": "minPrice must be a non-negative number"
         },
         {
           "path": "maxPrice",
           "message": "maxPrice must be a non-negative number"
         }
       ]
     }
     ```
  2. URL: `http://localhost:3000/items?sortBy=minPrice&sortOrder=0`
     ```json
     {
       "error": "Invalid query parameters",
       "details": [
         {
           "path": "sortBy",
           "message": "Invalid option: expected one of \"price\"|\"created_at\""
         },
         {
           "path": "sortOrder",
           "message": "Invalid option: expected one of \"asc\"|\"desc\""
         }
       ]
     }
     ```
