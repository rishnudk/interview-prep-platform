# Adding Questions to the Platform

This guide documents the two methods for adding coding problems/questions to the platform:

1. **Bulk Seeding (Recommended for development/initial setup)**
2. **Admin API (Recommended for production/live additions)**

---

## Method 1: Bulk Seeding (Development & Local Setup)

Seeding is ideal for developers who want to batch-insert a set of questions, test cases, and code templates in local or staging environments.

### Step 1: Define Questions in the Seed Scripts

There are two main seed scripts:

- **Core Questions:** [seed.ts](file:///D:/interview-prep-platform/apps/backend-api/src/infrastructure/database/prisma/seed.ts)
- **JavaScript Array Questions:** [seed-arrays.ts](file:///D:/interview-prep-platform/apps/backend-api/src/infrastructure/database/prisma/seed-arrays.ts)

You can define problem objects matching this format:

```typescript
{
  title: "Problem Title",
  slug: "problem-slug",
  description: "## Rich Markdown Description...",
  difficulty: "EASY" | "MEDIUM" | "HARD",
  category: "JAVASCRIPT" | "REACT" | "NODEJS" | "TYPESCRIPT" | "SQL" | "MONGODB",
  starterCode: "function solve() { }",
  solutionCode: "function solve() { return true; }",
  tags: ["arrays"],
  order: 101, // Use unique ordering to control position in listings
  isPublished: true,
  testCases: [
    { input: '[[1, 2]]', expectedOutput: '3', isHidden: false, order: 1 },
    { input: '[[3, 4]]', expectedOutput: '7', isHidden: true, order: 2 }
  ]
}
```

> [!IMPORTANT]
> **Input / Output Format for Test Cases:**
>
> - `input` must be a JSON array string representing the function parameters spread. E.g., for a function `add(a, b)`: `'[1, 2]'`. For a function taking a single array: `'[[1, 2, 3]]'`.
> - `expectedOutput` must be a valid JSON representation of the returned value. E.g., `'5'`, `'[1, 2]'`, or `'true'`.

### Step 2: Run the Seeds

From the backend directory `apps/backend-api`:

- Run core seeds (warning: willy-nilly runs of core seed will clear all existing submissions/users!):
  ```bash
  npm run seed
  ```
- Run JavaScript array questions seed (idempotent, does not clear other problems or users):
  ```bash
  npm run db:seed:arrays
  ```

---

## Method 2: Admin API (Production/Live Setup)

To add questions dynamically to a live production database without wiping records or restarting the server, use the Admin API.

### Step 1: Authenticate as Admin

Generate an admin JWT by signing in as an admin user. Include this token in the header of all admin endpoints:

```http
Authorization: Bearer <admin_jwt>
```

### Step 2: Create the Problem (Draft)

```http
POST /api/admin/problems
Content-Type: application/json

{
  "title": "My New Array Problem",
  "slug": "my-new-array-problem",
  "description": "## Description\n\nGiven an array...",
  "difficulty": "EASY",
  "category": "JAVASCRIPT",
  "starterCode": "function solve(arr) {\n  // your code\n}",
  "solutionCode": "function solve(arr) {\n  return arr.filter(x => x > 0);\n}",
  "tags": ["arrays"],
  "isPublished": false
}
```

**Response:**

```json
{
  "id": "cm12345abcde",
  "title": "My New Array Problem",
  "slug": "my-new-array-problem",
  ...
}
```

### Step 3: Add Test Cases

For each test case, post to `/api/admin/test-cases` referencing the created problem's ID:

```http
POST /api/admin/test-cases
Content-Type: application/json

{
  "problemId": "cm12345abcde",
  "input": "[[1, -2, 3, -4]]",
  "expectedOutput": "[1, 3]",
  "isHidden": false,
  "order": 1
}
```

### Step 4: Publish the Problem

Once all test cases are configured and verified, make the problem visible to students:

```http
PUT /api/admin/problems/cm12345abcde
Content-Type: application/json

{
  "isPublished": true
}
```
