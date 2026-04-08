# Technical Specification — Rent App

**Version:** 1.0.0  
**Date:** 2026-04-08  
**Status:** Draft

---

## Table of Contents

1. [Overview](#1-overview)
2. [Goals and Non-Goals](#2-goals-and-non-goals)
3. [System Architecture](#3-system-architecture)
4. [User Roles](#4-user-roles)
5. [High-Level User Flows](#5-high-level-user-flows)
6. [Feature Descriptions](#6-feature-descriptions)
7. [Security and Authorization](#7-security-and-authorization)
8. [Error Handling](#8-error-handling)
9. [Glossary](#9-glossary)

---

## 1. Overview

**Rent App** is a web-based property rental management platform. It enables guests to browse a catalog of available rental units, submit rental requests, and—upon approval—receive a signed contractual document that formally establishes their responsibilities as a renter/lessee.

The system provides a streamlined workflow covering:

- Unit catalog discovery (public/unauthenticated)
- Rental request submission (authenticated guest)
- Request review and approval by administrators
- Automated generation of a rental contract document

---

## 2. Goals and Non-Goals

### Goals

| # | Goal |
|---|------|
| G1 | Allow any visitor (guest) to browse available rental units without authentication |
| G2 | Allow registered guests to submit a rental request for a selected unit |
| G3 | Provide administrators with tools to review, approve, or reject rental requests |
| G4 | Automatically generate a legally-formatted rental contract upon approval |
| G5 | Ensure the contract clearly states the responsibilities of the renter/lessee |
| G6 | Maintain a full audit trail of requests and contract actions |

### Non-Goals

| # | Non-Goal |
|---|----------|
| N1 | Online payment processing (out of scope for v1) |
| N2 | Property owner self-service portal (out of scope for v1) |
| N3 | Mobile native application |

---

## 3. System Architecture

### 3.1 Component Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Client (Browser)                           │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  Catalog UI  │  │  Rental Form UI  │  │  Admin Dashboard UI  │  │
│  └──────┬───────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└─────────┼───────────────────┼────────────────────────┼─────────────┘
          │                   │                        │
          ▼                   ▼                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          REST API Layer                             │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  Catalog API │  │  Rent Request API│  │     Contract API     │  │
│  └──────┬───────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└─────────┼───────────────────┼────────────────────────┼─────────────┘
          │                   │                        │
          ▼                   ▼                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Service Layer                               │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Unit Service │  │ Request Service  │  │  Contract Service    │  │
│  └──────┬───────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└─────────┼───────────────────┼────────────────────────┼─────────────┘
          │                   │                        │
          ▼                   ▼                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Persistence Layer                            │
│              ┌──────────────────────────────────┐                   │
│              │         Database (SQL/NoSQL)      │                   │
│              └──────────────────────────────────┘                   │
│              ┌──────────────────────────────────┐                   │
│              │       File/Document Storage       │                   │
│              └──────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Technology Stack (Recommended)

| Layer | Technology |
|-------|-----------|
| Frontend | React / Next.js |
| Backend API | Node.js + Express **or** Golang |
| Database | PostgreSQL |
| Document Generation | PDF library (e.g., PDFKit, Puppeteer) |
| Authentication | JWT (JSON Web Tokens) |
| File Storage | S3-compatible object storage |

---

## 4. User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **Guest (unauthenticated)** | Any visitor to the platform | Browse catalog |
| **Registered User / Renter** | A guest who has created an account | Browse catalog, submit rental requests, view own requests and contracts |
| **Admin** | Platform operator/manager | All renter permissions + review/approve/reject requests, generate contracts, manage units |

---

## 5. High-Level User Flows

### 5.1 Catalog Browse Flow (Guest)

```
[Guest visits site]
        │
        ▼
[Browse unit catalog]
  - Filter by: location, price range, unit type, availability dates
        │
        ▼
[View unit detail page]
  - Photos, description, amenities, pricing, availability calendar
        │
        ├──── [Not interested] ──► [Return to catalog]
        │
        └──── [Interested] ──────► [Proceed to Rental Request Flow]
```

### 5.2 Rental Request Flow (Registered User)

```
[User selects a unit to rent]
        │
        ▼
[Authentication gate]
  ├── [Not logged in] ──► [Login / Register] ──► [Return to unit]
  └── [Logged in] ──────────────────────────────────────┐
                                                        │
                                                        ▼
                                              [Fill Rental Request Form]
                                                - Desired start date
                                                - Desired end date
                                                - Number of occupants
                                                - Additional notes/requests
                                                        │
                                                        ▼
                                              [Submit Request]
                                                        │
                                                        ▼
                                              [System validates form]
                                                        │
                                          ┌─────────────┴──────────────┐
                                          │                            │
                                    [Validation fails]         [Validation passes]
                                          │                            │
                                    [Show errors]             [Request saved with
                                          │                     status: PENDING]
                                          │                            │
                                    [User corrects]           [Email notification
                                          │                    sent to admin]
                                          │                            │
                                          └───────────────────────────┘
```

### 5.3 Admin Review Flow

```
[Admin views pending requests dashboard]
        │
        ▼
[Select a request to review]
  - View: unit details, renter profile, requested dates
        │
        ├──── [Reject] ──► [Enter rejection reason] ──► [Notify renter] ──► [Status: REJECTED]
        │
        └──── [Approve] ─────────────────────────────────────────────────────┐
                                                                             │
                                                                             ▼
                                                               [System generates rental contract]
                                                                 - Populated with renter info
                                                                 - Unit info & agreed dates
                                                                 - Renter responsibilities
                                                                 - Terms & conditions
                                                                             │
                                                                             ▼
                                                               [Contract sent to renter via email]
                                                                             │
                                                                             ▼
                                                               [Status: APPROVED, awaiting signature]
```

### 5.4 Contract Signing Flow (Renter)

```
[Renter receives contract email]
        │
        ▼
[Opens contract link / portal]
        │
        ▼
[Reviews contract document]
        │
        ├──── [Decline] ──► [Notify admin] ──► [Request re-opened or cancelled]
        │
        └──── [Sign / Accept] ──► [Signature recorded with timestamp] ──► [Status: ACTIVE]
                                                                               │
                                                                               ▼
                                                               [Signed contract PDF generated]
                                                               [Stored for both parties]
```

---

## 6. Feature Descriptions

### 6.1 Unit Catalog

- Public listing of all available rental units
- Each unit has: name, description, type (apartment, house, room, etc.), location, price per period (day/week/month), photos, amenities, and availability status
- Search and filter functionality
- Pagination support

### 6.2 Rental Request Form

Fields collected from the renter:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Unit ID | UUID | Yes | Pre-filled from catalog selection |
| Desired Start Date | Date | Yes | Must be in the future |
| Desired End Date | Date | Yes | Must be after start date |
| Number of Occupants | Integer | Yes | Must not exceed unit capacity |
| Purpose of Rental | Enum | No | Residential / Commercial / Short-stay |
| Additional Notes | Text | No | Max 500 characters |

### 6.3 Request Approval Workflow

- Requests queue in admin dashboard with status `PENDING`
- Admin can change status to `APPROVED` or `REJECTED`
- Rejection requires a reason (stored and communicated to renter)
- Approval triggers contract generation

### 6.4 Contract Generation

On approval the system:

1. Resolves the unit, renter, and request data
2. Populates the [rental contract template](rental-contract-template.md) with actual values
3. Renders the contract as a PDF document
4. Stores the PDF in document storage
5. Creates a `Contract` record in the database
6. Sends the contract link to the renter via email

### 6.5 Audit Trail

Every state change on a `RentRequest` or `Contract` is recorded with:

- Timestamp
- Actor (user ID + role)
- Previous state → New state
- Notes/reason (if applicable)

---

## 7. Security and Authorization

| Endpoint Group | Guest | Renter | Admin |
|----------------|-------|--------|-------|
| `GET /units` (catalog) | ✅ | ✅ | ✅ |
| `GET /units/:id` | ✅ | ✅ | ✅ |
| `POST /rent-requests` | ❌ | ✅ | ✅ |
| `GET /rent-requests` (own) | ❌ | ✅ | ✅ |
| `GET /rent-requests` (all) | ❌ | ❌ | ✅ |
| `PUT /rent-requests/:id/approve` | ❌ | ❌ | ✅ |
| `PUT /rent-requests/:id/reject` | ❌ | ❌ | ✅ |
| `GET /contracts/:id` | ❌ | Own only | ✅ |
| `POST /contracts/:id/sign` | ❌ | Own only | ❌ |

All authenticated requests must include a valid JWT in the `Authorization: Bearer <token>` header.

---

## 8. Error Handling

| HTTP Status | Scenario |
|-------------|----------|
| `400 Bad Request` | Invalid input / form validation failure |
| `401 Unauthorized` | Missing or invalid authentication token |
| `403 Forbidden` | Authenticated but insufficient permissions |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Unit already booked for requested dates |
| `422 Unprocessable Entity` | Business rule violation (e.g., end date before start date) |
| `500 Internal Server Error` | Unexpected server-side error |

---

## 9. Glossary

| Term | Definition |
|------|-----------|
| **Unit** | A rentable property (apartment, house, room, commercial space, etc.) |
| **Guest** | An unauthenticated visitor browsing the catalog |
| **Renter / Lessee** | A registered user who has submitted or been approved for a rental |
| **Lessor** | The property owner or the platform acting on behalf of the owner |
| **RentRequest** | A formal request by a renter to occupy a unit for a specified period |
| **Contract** | The legally binding rental agreement generated after request approval |
| **Admin** | A platform operator with authority to review requests and manage units |
