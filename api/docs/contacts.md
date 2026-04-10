# Contact API Specs

## Create Contact
- Request
```http
POST /api/contacts
Content-Type: application/json

{
    "first_name": "Eko Kurniawan",
    "last_name": "Khannedy",
    "email": "eko@example.com",
    "phone": "081111111111"
}
```

## Get Contact

- Request
```http
GET /api/contacts/:contactId
Content-Type: application/json
```

- Response
```json
{
    "data": {
      "id": "62xxxxxxxxxxx",
      "first_name": "Eko Kurniawan",
      "last_name": "Khannedy",
      "email": "eko@example.com",
      "phone": "081111111111"
    }
}
```

## Update Contact

- Request
```http
PATCH /api/contacts/:contactId
Content-Type: application/json

{
    "first_name": "Eko Kurniawan",
    "last_name": "Khannedy",
    "email": "eko@example.com"
}
```

- Response
```json
{
    "data": {
      "id": "62xxxxxxxxxxx",
      "first_name": "Eko Kurniawan",
      "last_name": "Khannedy",
      "email": "eko@example.com",
      "phone": "081111111111"
    }
}
```

## Remove Contact

- Request
```http
DELETE /api/contacts/:contactId
Content-Type: application/json
```

- Response
```json
{
    "data": true
}
```

## Search Contact
- Query Params
    - name: string, optional
    - phone: string, optional
    - email: string. optional
    - page: number, default = 1
    - limit: number, default = 10

- Request
```http
GET /api/contacts
    ?page=
    &limit=
    &name=
    &phone=
    &email=
Content-Type: application/json
```

- Response
```json
{
  "data": [
    {
      "id": "621xxxxxxxxxx",
      "first_name": "Eko Kurniawan",
      "last_name": "Khannedy",
      "email": "eko@example.com",
      "phone": "081111111111"
    },
    {
      "id": "622xxxxxxxxxx",
      "first_name": "Eko Kurniawan",
      "last_name": "Khannedy 02",
      "email": "eko+02@example.com",
      "phone": "082222222222"
    }
  ],
  "meta": {
    "current_page": 1,
    "total_page": 1,
    "size": 10
  }
}
```