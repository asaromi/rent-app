# Data Models — Rent App

**Version:** 1.0.0  
**Date:** 2026-04-08

---

## Table of Contents

1. [Entity Relationship Diagram](#1-entity-relationship-diagram)
2. [User](#2-user)
3. [Unit](#3-unit)
4. [RentRequest](#4-rentrequest)
5. [Contract](#5-contract)
6. [AuditLog](#6-auditlog)

---

## 1. Entity Relationship Diagram

```
┌──────────────┐        ┌──────────────────┐        ┌──────────────┐
│     User     │        │   RentRequest    │        │     Unit     │
├──────────────┤        ├──────────────────┤        ├──────────────┤
│ id (PK)      │◄──────►│ id (PK)          │◄──────►│ id (PK)      │
│ name         │  1   N │ unit_id (FK)     │  N   1 │ name         │
│ email        │        │ renter_id (FK)   │        │ description  │
│ password_hash│        │ reviewed_by (FK) │        │ type         │
│ role         │        │ start_date       │        │ location     │
│ phone        │        │ end_date         │        │ price_per_day│
│ created_at   │        │ occupants        │        │ capacity     │
│ updated_at   │        │ purpose          │        │ amenities    │
└──────────────┘        │ notes            │        │ photos       │
                        │ status           │        │ is_available │
                        │ rejection_reason │        │ created_at   │
                        │ created_at       │        │ updated_at   │
                        │ updated_at       │        └──────────────┘
                        └────────┬─────────┘
                                 │ 1
                                 │
                                 ▼ 0..1
                        ┌──────────────────┐
                        │    Contract      │
                        ├──────────────────┤
                        │ id (PK)          │
                        │ request_id (FK)  │
                        │ document_url     │
                        │ signed_url       │
                        │ status           │
                        │ signed_at        │
                        │ expires_at       │
                        │ created_at       │
                        │ updated_at       │
                        └──────────────────┘
```

---

## 2. User

Represents all system users: renters/lessees and administrators.

```sql
CREATE TABLE users (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255)  NOT NULL,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    password_hash VARCHAR(512)  NOT NULL,
    role          VARCHAR(20)   NOT NULL DEFAULT 'renter'
                                CHECK (role IN ('renter', 'admin')),
    phone         VARCHAR(30),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `name` | VARCHAR(255) | Full name of the user |
| `email` | VARCHAR(255) | Unique email address used for login and notifications |
| `password_hash` | VARCHAR(512) | Bcrypt-hashed password (never stored in plain text) |
| `role` | ENUM | `renter` — standard user; `admin` — platform operator |
| `phone` | VARCHAR(30) | Optional contact phone number |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last modification timestamp |

---

## 3. Unit

Represents a rentable property listing.

```sql
CREATE TABLE units (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255)  NOT NULL,
    description   TEXT,
    type          VARCHAR(50)   NOT NULL
                                CHECK (type IN ('apartment', 'house', 'room', 'studio', 'commercial', 'other')),
    location      VARCHAR(512)  NOT NULL,
    price_per_day NUMERIC(12,2) NOT NULL CHECK (price_per_day > 0),
    capacity      SMALLINT      NOT NULL DEFAULT 1 CHECK (capacity > 0),
    amenities     JSONB,
    photos        TEXT[],
    is_available  BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `name` | VARCHAR(255) | Listing title (e.g., "2BR Apartment in Bandung") |
| `description` | TEXT | Detailed description of the unit |
| `type` | ENUM | Category of the property |
| `location` | VARCHAR(512) | Full address or area description |
| `price_per_day` | NUMERIC | Rental rate per day in the platform's base currency |
| `capacity` | SMALLINT | Maximum number of occupants allowed |
| `amenities` | JSONB | Key-value map of amenities (e.g., `{"wifi": true, "parking": 2}`) |
| `photos` | TEXT[] | Array of photo URLs |
| `is_available` | BOOLEAN | Whether the unit is accepting new rental requests |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last modification timestamp |

---

## 4. RentRequest

Represents a renter's formal request to occupy a unit.

```sql
CREATE TABLE rent_requests (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id          UUID         NOT NULL REFERENCES units(id),
    renter_id        UUID         NOT NULL REFERENCES users(id),
    reviewed_by      UUID         REFERENCES users(id),
    start_date       DATE         NOT NULL,
    end_date         DATE         NOT NULL,
    occupants        SMALLINT     NOT NULL DEFAULT 1 CHECK (occupants > 0),
    purpose          VARCHAR(30)  NOT NULL DEFAULT 'residential'
                                  CHECK (purpose IN ('residential', 'commercial', 'short_stay')),
    notes            TEXT,
    status           VARCHAR(30)  NOT NULL DEFAULT 'pending'
                                  CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    rejection_reason TEXT,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `unit_id` | UUID (FK) | The unit being requested |
| `renter_id` | UUID (FK) | The user who submitted the request |
| `reviewed_by` | UUID (FK) | Admin who approved or rejected the request |
| `start_date` | DATE | Desired rental start date |
| `end_date` | DATE | Desired rental end date |
| `occupants` | SMALLINT | Number of people who will occupy the unit |
| `purpose` | ENUM | Reason for rental |
| `notes` | TEXT | Optional additional notes from the renter |
| `status` | ENUM | Lifecycle status of the request (see below) |
| `rejection_reason` | TEXT | Required when status is `rejected` |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last modification timestamp |

### Status Lifecycle

```
         ┌──────────┐
  create │  PENDING │
  ──────►│          │
         └────┬─────┘
              │
     ┌────────┴────────┐
     │                 │
     ▼                 ▼
┌──────────┐     ┌──────────┐
│ APPROVED │     │ REJECTED │
└────┬─────┘     └──────────┘
     │
     │ renter declines contract
     ▼
┌──────────┐
│CANCELLED │
└──────────┘
```

---

## 5. Contract

Represents the rental agreement document generated after a request is approved.

```sql
CREATE TABLE contracts (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id   UUID         NOT NULL UNIQUE REFERENCES rent_requests(id),
    document_url TEXT         NOT NULL,
    signed_url   TEXT,
    status       VARCHAR(30)  NOT NULL DEFAULT 'pending_signature'
                              CHECK (status IN ('pending_signature', 'signed', 'declined', 'expired')),
    signed_at    TIMESTAMPTZ,
    expires_at   TIMESTAMPTZ  NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `request_id` | UUID (FK) | One-to-one reference to the approved RentRequest |
| `document_url` | TEXT | URL of the unsigned contract PDF in document storage |
| `signed_url` | TEXT | URL of the signed contract PDF (populated after signing) |
| `status` | ENUM | Signature lifecycle status (see below) |
| `signed_at` | TIMESTAMPTZ | Timestamp when the renter signed the contract |
| `expires_at` | TIMESTAMPTZ | Deadline for the renter to sign (system cancels if exceeded) |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last modification timestamp |

### Status Lifecycle

```
          ┌────────────────────┐
generate  │ PENDING_SIGNATURE  │
 ────────►│                    │
          └──────────┬─────────┘
                     │
       ┌─────────────┼──────────────────────┐
       │             │                      │
       │ renter      │ renter               │ expires_at
       │ signs       │ declines             │ exceeded
       ▼             ▼                      ▼
  ┌────────┐    ┌─────────┐          ┌─────────┐
  │ SIGNED │    │DECLINED │          │ EXPIRED │
  └────────┘    └─────────┘          └─────────┘
```

---

## 6. AuditLog

Immutable log of all state changes to `RentRequest` and `Contract` records.

```sql
CREATE TABLE audit_logs (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type  VARCHAR(50)  NOT NULL CHECK (entity_type IN ('rent_request', 'contract')),
    entity_id    UUID         NOT NULL,
    actor_id     UUID         REFERENCES users(id),
    action       VARCHAR(100) NOT NULL,
    old_state    JSONB,
    new_state    JSONB,
    notes        TEXT,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `entity_type` | VARCHAR | Type of entity being audited |
| `entity_id` | UUID | ID of the audited entity |
| `actor_id` | UUID (FK) | User who performed the action (null for system-initiated actions) |
| `action` | VARCHAR | Description of the action (e.g., `request.approved`, `contract.signed`) |
| `old_state` | JSONB | Snapshot of the record before the change |
| `new_state` | JSONB | Snapshot of the record after the change |
| `notes` | TEXT | Optional context or reason for the action |
| `created_at` | TIMESTAMPTZ | Timestamp of the action |
