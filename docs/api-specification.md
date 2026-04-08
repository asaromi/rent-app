# API Specification — Rent App

**Version:** 1.0.0  
**Date:** 2026-04-08  
**Base URL:** `https://api.rent-app.example.com/v1`

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Common Response Format](#2-common-response-format)
3. [Auth Endpoints](#3-auth-endpoints)
4. [Unit Catalog Endpoints](#4-unit-catalog-endpoints)
5. [Rent Request Endpoints](#5-rent-request-endpoints)
6. [Contract Endpoints](#6-contract-endpoints)
7. [Admin Endpoints](#7-admin-endpoints)

---

## 1. Authentication

All protected endpoints require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Tokens are issued at login and expire after **24 hours** by default.

---

## 2. Common Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 100
  }
}
```

> `meta` is only present on paginated list responses.

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error description",
    "details": [
      { "field": "start_date", "message": "Start date must be in the future" }
    ]
  }
}
```

---

## 3. Auth Endpoints

### 3.1 Register

```
POST /auth/register
```

**Request Body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "S3cur3P@ss!",
  "phone": "+62812345678"
}
```

**Response `201 Created`**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "renter"
    },
    "token": "eyJhbGci..."
  }
}
```

---

### 3.2 Login

```
POST /auth/login
```

**Request Body**

```json
{
  "email": "john@example.com",
  "password": "S3cur3P@ss!"
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "renter"
    },
    "token": "eyJhbGci..."
  }
}
```

---

### 3.3 Get Current User

```
GET /auth/me
```

**Authorization:** Required

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "renter",
    "phone": "+62812345678",
    "createdAt": "2026-04-01T08:00:00Z"
  }
}
```

---

## 4. Unit Catalog Endpoints

### 4.1 List Units

```
GET /units
```

**Authorization:** Not required (public)

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `perPage` | integer | Items per page (default: 20, max: 100) |
| `type` | string | Filter by unit type (apartment, house, room, studio, commercial, other) |
| `location` | string | Free-text location search |
| `minPrice` | number | Minimum price per day |
| `maxPrice` | number | Maximum price per day |
| `minCapacity` | integer | Minimum required capacity |
| `startDate` | date | Availability start date filter (YYYY-MM-DD) |
| `endDate` | date | Availability end date filter (YYYY-MM-DD) |

**Response `200 OK`**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "2BR Apartment in Bandung",
      "type": "apartment",
      "location": "Bandung, West Java",
      "pricePerDay": 250000,
      "capacity": 4,
      "photos": ["https://storage.example.com/photo1.jpg"],
      "isAvailable": true
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 45
  }
}
```

---

### 4.2 Get Unit Detail

```
GET /units/:id
```

**Authorization:** Not required (public)

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "2BR Apartment in Bandung",
    "description": "A cozy 2-bedroom apartment...",
    "type": "apartment",
    "location": "Jl. Sudirman No. 10, Bandung",
    "pricePerDay": 250000,
    "capacity": 4,
    "amenities": {
      "wifi": true,
      "airConditioning": true,
      "parking": 1,
      "washer": true
    },
    "photos": [
      "https://storage.example.com/photo1.jpg",
      "https://storage.example.com/photo2.jpg"
    ],
    "isAvailable": true,
    "createdAt": "2026-01-15T00:00:00Z"
  }
}
```

**Errors:** `404 Not Found`

---

## 5. Rent Request Endpoints

### 5.1 Submit Rental Request

```
POST /rent-requests
```

**Authorization:** Optional  
The endpoint accepts three submission modes. The `Authorization` header is optional — if a valid JWT is provided, the server uses the token's identity and ignores any guest fields in the body.

#### Mode A — Guest (no account, no login)

```json
{
  "unitId": "uuid",
  "startDate": "2026-05-01",
  "endDate": "2026-05-15",
  "occupants": 2,
  "purpose": "residential",
  "notes": "We are a couple looking for a quiet place.",
  "guestName": "Jane Smith",
  "guestEmail": "jane@example.com",
  "guestPhone": "+62812345678"
}
```

#### Mode B — Registering Guest (guest who opts to create an account)

Includes all Mode A fields plus a `password` field. The system creates a new user account before saving the request.

```json
{
  "unitId": "uuid",
  "startDate": "2026-05-01",
  "endDate": "2026-05-15",
  "occupants": 2,
  "purpose": "residential",
  "notes": "We are a couple looking for a quiet place.",
  "guestName": "Jane Smith",
  "guestEmail": "jane@example.com",
  "guestPhone": "+62812345678",
  "password": "S3cur3P@ss!"
}
```

#### Mode C — Logged-In User (JWT provided)

The server auto-fills the submitter identity from the token. Guest fields in the body are ignored.

```json
{
  "unitId": "uuid",
  "startDate": "2026-05-01",
  "endDate": "2026-05-15",
  "occupants": 2,
  "purpose": "residential",
  "notes": "We are a couple looking for a quiet place."
}
```

**Validations**
- `startDate` must be a future date
- `endDate` must be after `startDate`
- `occupants` must not exceed the unit's `capacity`
- Unit must be `isAvailable: true`
- No overlapping approved requests exist for the unit and date range
- (Mode A/B) `guestName` and `guestEmail` are required when no JWT is present
- (Mode B) `password` must be at least 8 characters; `guestEmail` must not already belong to an existing account
- (Mode C) JWT must be valid and not expired

**Response `201 Created`**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "unitId": "uuid",
    "renterId": "uuid-or-null",
    "guestName": "Jane Smith",
    "guestEmail": "jane@example.com",
    "startDate": "2026-05-01",
    "endDate": "2026-05-15",
    "occupants": 2,
    "purpose": "residential",
    "notes": "We are a couple looking for a quiet place.",
    "status": "pending",
    "createdAt": "2026-04-08T10:00:00Z"
  }
}
```

> For Mode B, the response also includes a JWT so the newly created user is immediately logged in:
> ```json
> { "token": "eyJhbGci..." }
> ```

**Errors:** `400`, `404`, `409 Conflict` (date overlap), `422` (Mode B: email already registered)

---

### 5.2 List My Rent Requests

```
GET /rent-requests
```

**Authorization:** Required (role: renter)  
Returns only requests belonging to the authenticated user.

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: pending, approved, rejected, cancelled |
| `page` | integer | Page number (default: 1) |
| `perPage` | integer | Items per page (default: 20) |

**Response `200 OK`**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "unit": {
        "id": "uuid",
        "name": "2BR Apartment in Bandung"
      },
      "startDate": "2026-05-01",
      "endDate": "2026-05-15",
      "status": "pending",
      "createdAt": "2026-04-08T10:00:00Z"
    }
  ],
  "meta": { "page": 1, "perPage": 20, "total": 3 }
}
```

---

### 5.3 Get Rent Request Detail

```
GET /rent-requests/:id
```

**Authorization:** Required  
Renters may only access their own requests. Admins may access any.

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "unit": { "id": "uuid", "name": "2BR Apartment in Bandung", "location": "Bandung" },
    "renter": { "id": "uuid", "name": "John Doe", "email": "john@example.com" },
    "startDate": "2026-05-01",
    "endDate": "2026-05-15",
    "occupants": 2,
    "purpose": "residential",
    "notes": "We are a couple looking for a quiet place.",
    "status": "pending",
    "createdAt": "2026-04-08T10:00:00Z",
    "updatedAt": "2026-04-08T10:00:00Z"
  }
}
```

**Errors:** `401`, `403`, `404`

---

### 5.4 Cancel Rent Request

```
DELETE /rent-requests/:id
```

**Authorization:** Required (role: renter — own request only)  
Only requests with status `pending` can be cancelled.

**Response `200 OK`**

```json
{
  "success": true,
  "data": { "id": "uuid", "status": "cancelled" }
}
```

**Errors:** `401`, `403`, `404`, `422` (invalid status transition)

---

## 6. Contract Endpoints

### 6.1 Get Contract

```
GET /contracts/:id
```

**Authorization:** Required  
Renters may only access contracts linked to their own requests.

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "requestId": "uuid",
    "documentUrl": "https://storage.example.com/contracts/contract-uuid.pdf",
    "signedUrl": null,
    "status": "pending_signature",
    "expiresAt": "2026-04-15T10:00:00Z",
    "createdAt": "2026-04-08T10:00:00Z"
  }
}
```

---

### 6.2 Sign Contract

```
POST /contracts/:id/sign
```

**Authorization:** Required (renter — own contract only)  
Records the renter's acceptance and generates the signed contract PDF.

**Request Body**

```json
{
  "agreed": true
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "signed",
    "signedAt": "2026-04-08T11:30:00Z",
    "signedUrl": "https://storage.example.com/contracts/contract-uuid-signed.pdf"
  }
}
```

**Errors:** `400` (agreed must be true), `401`, `403`, `404`, `422` (already signed or expired)

---

### 6.3 Decline Contract

```
POST /contracts/:id/decline
```

**Authorization:** Required (renter — own contract only)

**Request Body**

```json
{
  "reason": "Found a different unit."
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": { "id": "uuid", "status": "declined" }
}
```

---

## 7. Admin Endpoints

### 7.1 List All Rent Requests (Admin)

```
GET /admin/rent-requests
```

**Authorization:** Required (role: admin)

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `unitId` | uuid | Filter by unit |
| `renterId` | uuid | Filter by renter |
| `page` | integer | Page number |
| `perPage` | integer | Items per page |

**Response `200 OK`** — same shape as `GET /rent-requests` but includes all users' requests.

---

### 7.2 Approve Rent Request

```
PUT /admin/rent-requests/:id/approve
```

**Authorization:** Required (role: admin)

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "request": { "id": "uuid", "status": "approved" },
    "contract": {
      "id": "uuid",
      "documentUrl": "https://storage.example.com/contracts/contract-uuid.pdf",
      "status": "pending_signature",
      "expiresAt": "2026-04-15T10:00:00Z"
    }
  }
}
```

**Errors:** `401`, `403`, `404`, `422` (request not in pending status)

---

### 7.3 Reject Rent Request

```
PUT /admin/rent-requests/:id/reject
```

**Authorization:** Required (role: admin)

**Request Body**

```json
{
  "reason": "Unit is under maintenance during the requested period."
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": { "id": "uuid", "status": "rejected", "rejectionReason": "Unit is under maintenance during the requested period." }
}
```

**Errors:** `400` (reason required), `401`, `403`, `404`, `422`

---

### 7.4 List Units (Admin)

```
GET /admin/units
```

**Authorization:** Required (role: admin)  
Same as public catalog but includes unavailable units.

---

### 7.5 Create Unit

```
POST /admin/units
```

**Authorization:** Required (role: admin)

**Request Body**

```json
{
  "name": "Studio Unit in Jakarta",
  "description": "Modern studio apartment...",
  "type": "studio",
  "location": "Jl. Gatot Subroto, Jakarta",
  "pricePerDay": 300000,
  "capacity": 2,
  "amenities": { "wifi": true, "airConditioning": true },
  "photos": ["https://storage.example.com/photo1.jpg"]
}
```

**Response `201 Created`** — full unit object.

---

### 7.6 Update Unit

```
PUT /admin/units/:id
```

**Authorization:** Required (role: admin)  
Partial updates accepted (PATCH semantics).

**Response `200 OK`** — updated unit object.

---

### 7.7 Toggle Unit Availability

```
PUT /admin/units/:id/availability
```

**Authorization:** Required (role: admin)

**Request Body**

```json
{ "isAvailable": false }
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": { "id": "uuid", "isAvailable": false }
}
```
