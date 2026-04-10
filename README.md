# rent-app

A property rental management platform that lets guests browse available units, submit rental requests, and receive approved rental contracts.

## Documentation

| Document | Description |
|----------|-------------|
| [Technical Specification](docs/technical-specification.md) | System overview, architecture, and high-level user flows |
| [Data Models](docs/data-models.md) | Entity definitions and database schema |
| [API Specification](docs/api-specification.md) | REST API endpoints for the platform |
| [Rental Contract Template](docs/rental-contract-template.md) | Contractual document template highlighting renter/lessee responsibilities |

## Quick Start

### High-Level Flow

```
Guest → Browse Catalog → Select Unit → Fill Rental Form → Submit Request
                                                                ↓
                                                     Admin Reviews Request
                                                                ↓
                                                     Approve / Reject
                                                                ↓
                                                     Generate & Send Contract
                                                                ↓
                                                     Renter Signs Contract
```

## License

MIT