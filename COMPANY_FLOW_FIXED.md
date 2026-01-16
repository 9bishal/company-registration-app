# Company Setup Flow - Fixed

## Overview
The system now properly checks if a user has a company registered and redirects accordingly.

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Visits App (/)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
         ┌─────────────────────────┐
         │  Is User Authenticated? │
         └────────┬────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
       NO                  YES
        │                   │
        ↓                   ↓
   ┌─────────┐    ┌───────────────────┐
   │ Login   │    │ Check if Company  │
   │  Page   │    │    Exists (API)   │
   └─────────┘    └───────┬───────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
            Company              No Company
             Exists               Found
                │                   │
                ↓                   ↓
        ┌─────────────┐    ┌──────────────────┐
        │  Dashboard  │    │  Company Setup   │
        │             │    │                  │
        │ • View all  │    │ • Multi-step     │
        │   company   │    │   form           │
        │   details   │    │ • Logo upload    │
        │ • Edit info │    │ • Social links   │
        └─────────────┘    └──────────────────┘
```

---

## Components Updated

### 1. **CompanyCheck.jsx** (NEW)
- Checks if logged-in user has a company
- Redirects based on current route and company status:
  - On `/dashboard` without company → redirect to `/company-setup`
  - On `/company-setup` with company → redirect to `/dashboard`

### 2. **RootRedirect.jsx** (UPDATED)
- Root route handler
- Checks authentication and company status
- Smart redirection:
  - Not logged in → `/login`
  - Logged in + No company → `/company-setup`
  - Logged in + Has company → `/dashboard`

### 3. **routes.jsx** (UPDATED)
- Wrapped protected routes with both `ProtectedRoute` and `CompanyCheck`
- Ensures proper flow enforcement

---

## User Flows

### New User Registration
```
1. User registers at /register
2. Account created successfully
3. Redirect to /company-setup
4. User fills company details
5. Company created
6. Redirect to /dashboard
```

### Existing User Login (No Company)
```
1. User logs in at /login
2. System checks company status
3. No company found
4. Redirect to /company-setup
5. User creates company
6. Redirect to /dashboard
```

### Existing User Login (Has Company)
```
1. User logs in at /login
2. System checks company status
3. Company found
4. Redirect to /dashboard
5. User sees their company details
```

### Direct URL Access
```
# Try to access /dashboard without company
1. User authenticated ✓
2. Check company status
3. No company found
4. → Redirect to /company-setup

# Try to access /company-setup with existing company
1. User authenticated ✓
2. Check company status
3. Company found
4. → Redirect to /dashboard

# Try to access any protected page without login
1. Not authenticated
2. → Redirect to /login
```

---

## API Integration

### Check Company Endpoint
```javascript
GET /api/company/profile

// Success (200) - Company exists
{
  "success": true,
  "data": {
    "id": 1,
    "company_name": "Example Corp",
    "company_email": "info@example.com",
    // ... other company data
  }
}

// Not Found (404) - No company
{
  "success": false,
  "message": "Company profile not found"
}
```

### Create Company Endpoint
```javascript
POST /api/company/create

// Request
{
  "company_name": "Example Corp",
  "company_email": "info@example.com",
  // ... other company data
}

// Success (201)
{
  "success": true,
  "message": "Company profile created successfully",
  "data": { /* company data */ }
}

// Already Exists (400)
{
  "success": false,
  "message": "You already have a company registered"
}
```

---

## Code Implementation

### CompanyCheck Component
```jsx
// Wraps protected routes to check company status
<ProtectedRoute>
  <CompanyCheck>
    <DashboardEnhanced />
  </CompanyCheck>
</ProtectedRoute>
```

**Logic**:
1. Check if user is authenticated
2. Fetch company profile from API
3. If 404 → no company
4. Redirect based on current route:
   - `/dashboard` + no company → `/company-setup`
   - `/company-setup` + has company → `/dashboard`

### RootRedirect Component
```jsx
// Root route (/) handler
<Route index element={<RootRedirect />} />
```

**Logic**:
1. Check authentication
2. If not authenticated → `/login`
3. Fetch company profile
4. If no company → `/company-setup`
5. If has company → `/dashboard`

---

## Testing Scenarios

### Scenario 1: New User
```bash
# Steps
1. Go to /register
2. Fill form and submit
3. ✓ Should redirect to /company-setup
4. Fill company details
5. ✓ Should redirect to /dashboard
6. Refresh page
7. ✓ Should stay on /dashboard
```

### Scenario 2: User Without Company
```bash
# Steps
1. Login with existing account (no company)
2. ✓ Should redirect to /company-setup
3. Try to manually go to /dashboard
4. ✓ Should redirect back to /company-setup
5. Complete company setup
6. ✓ Should redirect to /dashboard
```

### Scenario 3: User With Company
```bash
# Steps
1. Login with account that has company
2. ✓ Should redirect to /dashboard
3. Try to manually go to /company-setup
4. ✓ Should redirect back to /dashboard
5. View company details on dashboard
```

### Scenario 4: Unauthenticated Access
```bash
# Steps
1. Logout or clear localStorage
2. Try to go to /dashboard
3. ✓ Should redirect to /login
4. Try to go to /company-setup
5. ✓ Should redirect to /login
```

---

## Error Handling

### API Errors
- **404 Not Found**: Treated as "no company exists"
- **400 Bad Request**: Company already exists error shown
- **401 Unauthorized**: Token expired, redirect to login
- **500 Server Error**: Show error message

### Loading States
- Shows `CircularProgress` spinner while checking company status
- Prevents flickering by waiting for API response before redirect

---

## Benefits

✅ **Smart Routing**: Automatically directs users to the right page
✅ **No Duplicate Companies**: Backend prevents multiple companies per user
✅ **Better UX**: Users don't get stuck or confused
✅ **Proper Flow**: New users → Setup, Existing users → Dashboard
✅ **Security**: All checks happen server-side, client just follows

---

## Files Modified

| File | Changes |
|------|---------|
| `frontend/src/components/CompanyCheck.jsx` | NEW - Company existence checker |
| `frontend/src/components/RootRedirect.jsx` | UPDATED - Added company check |
| `frontend/src/routes.jsx` | UPDATED - Wrapped routes with CompanyCheck |

---

## Summary

**Before**: 
- ❌ Users could access dashboard without company
- ❌ Users could try to create multiple companies
- ❌ No proper flow enforcement

**After**:
- ✅ Users redirected to company-setup if no company exists
- ✅ Users redirected to dashboard if company already exists
- ✅ Backend prevents duplicate companies
- ✅ Proper flow: Register → Setup → Dashboard

---

**Status**: ✅ FIXED
**Date**: January 16, 2026
