🎯 Interview One-Liner (Very Important)

“I used PostgreSQL connection pooling via the pg library, with environment-based configuration to ensure secure, scalable, and efficient database access.”

**backend/server.js**
“This file initializes the Express server, applies security, logging, and CORS middleware, registers modular API routes, includes health and error handling endpoints, and starts the server using environment-based configuration.”

**backedn/authController.js**
“This file handles authentication using bcrypt for password hashing, JWT for stateless authentication, and PostgreSQL for persistent storage, following secure and scalable backend practices.”

**validationMiddleware.js**
“I used express-validator to validate incoming requests at the middleware level, ensuring data integrity and preventing invalid or malicious input from reaching the business logic.”

**authMiddleware.js**
“This route module defines authentication endpoints, applies request validation and JWT-based authorization middleware, and delegates business logic to controllers following a clean MVC-style architecture.”

**companyRoutes.js**
“This route module manages company-related endpoints, applies JWT authentication globally, validates input data, and delegates business logic to controllers for clean and secure API design.”

**slices/authSlice.js**
Beginner-safe interview answer:
“I used createAsyncThunk to handle API calls in Redux. It manages loading, success, and error states automatically when calling backend authentication APIs.”

# Backend Interview Questions & Answers

## 1️⃣ Project Overview

**Q:** _What does the `company-registration-app` backend provide?_  
**A:** It is a Node.js/Express API that handles user authentication, company profile management, and related CRUD operations. The backend exposes routes under `/api/auth/*` and `/api/company/*`, uses JWT for stateless authentication, and is designed to be consumed by a React/Vite front‑end.

---

## 2️⃣ Architecture & Design

### 2.1 Routing & Controllers

**Q:** _How are routes organized in this project?_  
**A:** Each domain (auth, company) has its own router ([authRoutes.js](cci:7://file:///Users/bishalkumarshah/company-registration-app/backend/src/routes/authRoutes.js:0:0-0:0), `companyRoutes.js`). Routers are mounted in [server.js](cci:7://file:///Users/bishalkumarshah/company-registration-app/backend/src/server.js:0:0-0:0) under a common `/api` prefix. Controllers (`authControlers.js`, `comapnyController.js`) contain the business logic, keeping routes thin.
**Q:** _Why separate routes from controllers?_  
**A:** It follows the **Separation of Concerns** principle—routes handle HTTP specifics (method, path, middle‑wares) while controllers focus on business rules, making the codebase easier to test and maintain.

### 2.2 Middleware

**Q:** _What middleware is used for authentication?_  
**A:** [authMiddleware.js](cci:7://file:///Users/bishalkumarshah/company-registration-app/backend/src/middleware/authMiddleware.js:0:0-0:0) verifies the JWT sent in the `Authorization` header, decodes the payload, and attaches the user object to `req.user`. If verification fails, it responds with `401 Unauthorized`.
**Q:** _How does request validation work?_  
**A:** `validationMiddleware.js` is a placeholder for libraries like `express‑validator` or `joi`. It would validate request bodies and return `400 Bad Request` on errors.

### 2.3 Database Layer

**Q:** _Where is the DB connection configured?_  
**A:** In [backend/src/config/database.js](cci:7://file:///Users/bishalkumarshah/company-registration-app/backend/src/config/database.js:0:0-0:0). The file should export a function that reads `process.env` (e.g., `MONGODB_URI`) and establishes a connection using Mongoose or Sequelize.
**Q:** _Why keep DB config separate from the server?_  
**A:** It allows the connection logic to be reused across different modules (e.g., background jobs) and makes environment‑specific configuration easier.

---

## 3️⃣ Security

### 3.1 JWT Handling

**Q:** _What claims are stored in the JWT?_  
**A:** Typically `sub` (user ID), `email`, `iat` (issued at), and `exp` (expiration). The token is signed with a secret stored in `.env`.
**Q:** _How do you protect routes?_  
**A:** By applying `authMiddleware` to routes that require a logged‑in user (e.g., `/company/*`). The middleware checks the token and aborts the request if it’s missing or invalid.

### 3.2 Password Storage

**Q:** _How are passwords stored securely?_  
**A:** Passwords should be hashed with `bcrypt` (or `argon2`) before persisting. The `register` controller hashes the plain password, and the `login` controller compares the hash using `bcrypt.compare`.

### 3.3 Rate Limiting & Brute‑Force Protection

**Q:** _What can be added to mitigate brute‑force attacks?_  
**A:** Use `express-rate-limit` on auth endpoints, lock accounts after several failed attempts, and implement CAPTCHA for critical actions.

---

## 4️⃣ Testing & Quality

### 4.1 Unit & Integration Tests

**Q:** _Which testing framework is suitable?_  
**A:** `Jest` for unit tests and `supertest` for integration tests of Express routes.
**Q:** _Example test case for the login route:_

```js
test("POST /auth/login returns JWT on valid credentials", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@example.com", password: "Password123!" });
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("token");
});
```
