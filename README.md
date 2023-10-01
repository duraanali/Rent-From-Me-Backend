# API Documentation for Rent From Me

This document provides detailed information about the API endpoints and their usage for a rental management system. The API allows owners and renters to register, login, manage profiles, create, update, and delete items, and perform rental operations.

``BASE_URL: https://rent-from-me-f11e9aa3a1c2.herokuapp.com``

## Authentication

Most endpoints in the API require authentication using JSON Web Tokens (JWT). To authenticate, include the `Authorization` header in the request with the JWT. The header should be in the format: `Bearer <token>`, where `<token>` is the JWT obtained during the login process.

## Endpoints

### Owner Registration

**Endpoint:** `POST /api/owner/register`

Register a new owner in the system.

#### Request Body

| Parameter   | Type     | Required | Description                      |
| ----------- | -------- | -------- | -------------------------------- |
| `first_name`| string   | Yes      | First name of the owner.         |
| `last_name` | string   | Yes      | Last name of the owner.          |
| `email`     | string   | Yes      | Email address of the owner.      |
| `password`  | string   | Yes      | Password for the owner's account.|
| `date`      | string   | no       | The date the user is created     |

#### Response

```json
{
  "message": "Owner registered successfully",
  "owner_id": 1,
  "token": "<JWT>"
}
```

### Owner Login

**Endpoint:** `POST /api/owner/login`

Login as an owner.

#### Request Body

| Parameter   | Type     | Required | Description                      |
| ----------- | -------- | -------- | -------------------------------- |
| `email`     | string   | Yes      | Email address of the owner.      |
| `password`  | string   | Yes      | Password for the owner's account.|

#### Response

```json
{
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@example.com",
    "password": "<hashed_password>"
  },
  "token": "<JWT>"
}
```

### Renter Registration

**Endpoint:** `POST /api/renter/register`

Register a new renter in the system.

#### Request Body

| Parameter   | Type     | Required | Description                      |
| ----------- | -------- | -------- | -------------------------------- |
| `first_name`| string   | Yes      | First name of the renter.        |
| `last_name` | string   | Yes      | Last name of the renter.         |
| `email`     | string   | Yes      | Email address of the renter.     |
| `password`  | string   | Yes      | Password for the renter's account.|

#### Response

```json
{
  "message": "Renter registered successfully",
  "renter_id": 1,
  "token": "<JWT>"
}
```

### Renter Login

**Endpoint:** `POST /api/renter/login`

Login as a renter.

#### Request Body

| Parameter   | Type     | Required | Description                      |
| ----------- | -------- | -------- | -------------------------------- |
| `email`     | string   | Yes      | Email address of the renter.     |
| `password`  | string   | Yes      | Password for the renter's account.|

#### Response

```json
{
  "user": {
    "id": 1,
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "janesmith@example.com",
    "password": "<hashed_password>"
  },
  "token": "<JWT>"
}
```

### Get Owner Profile

**Endpoint:** `GET /api/owner/profile`

Retrieve the profile information of the authenticated owner.

#### Response

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "johndoe@example.com",
  "password": "<hashed_password>"
}
```

### Get Renter Profile

**Endpoint:** `GET /api/renter/profile`

Retrieve the profile information of the authenticated renter.

#### Response

```json
{
  "id": 1,
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "janesmith@example.com",
  "password": "<hashed_password>"
}
```

### Update Owner Profile

**Endpoint:** `PUT /api/owner/update_profile`

Update the profile information of the authenticated owner.

#### Request Body

| Parameter     | Type     | Required | Description                            |
| ------------- | -------- | -------- | -------------------------------------- |
| `first_name`  | string   | No       | Updated first name of the owner.        |
| `last_name`   | string   | No       | Updated last name of the owner.         |
| `email`       | string   | No       | Updated email address of the owner.     |
| `password`    | string   | No       | Updated password for the owner's account.|

#### Response

```json
{
  "message": "Owner updated successfully"
}
```

### Update Renter Profile

**Endpoint:** `PUT /api/renter/update_profile`

Update the profile information of the authenticated renter.

#### Request Body

| Parameter     | Type     | Required | Description                            |
| ------------- | -------- | -------- | -------------------------------------- |
| `first_name`  | string   | No       | Updated first name of the renter.       |
| `last_name`   | string   | No       | Updated last name of the renter.        |
| `email`       | string   | No       | Updated email address of the renter.    |
| `password`    | string   | No       | Updated password for the renter's account.|

#### Response

```json
{
  "message": "Renter updated successfully"
}
```

### Delete Owner Profile

**Endpoint:** `DELETE /api/owner/delete_profile`

Delete the profile of the authenticated owner.

#### Response

```json
{
  "message": "Owner deleted successfully"
}
```

### Delete Renter Profile

**Endpoint:** `DELETE /api/renter/delete_profile`

Delete the profile of the authenticated renter.

#### Response

```json
{
  "message": "Renter deleted successfully"
}
```

### Get All Items

**Endpoint:** `GET /api/items`

Retrieve a list of all items available for rent.

#### Response

```json
[
  {
    "id": 1,
    "owner_id": 1,
    "title": "Item 1",
    "description": "Description of item 1",
    "make": "Make of item 1",
    "model": "

Model of item 1",
    "img_url": "https://example.com/item1.jpg",
    "daily_cost": 10.0,
    "available": 1,
    "condition": "Good"
  },
  {
    "id": 2,
    "owner_id": 2,
    "title": "Item 2",
    "description": "Description of item 2",
    "make": "Make of item 2",
    "model": "Model of item 2",
    "img_url": "https://example.com/item2.jpg",
    "daily_cost": 15.0,
    "available": 1,
    "condition": "Excellent"
  },
  ...
]
```

### Get Item by ID

**Endpoint:** `GET /api/items/:id`

Retrieve the details of a specific item by its ID.

#### Response

```json
{
  "id": 1,
  "owner_id": 1,
  "title": "Item 1",
  "description": "Description of item 1",
  "make": "Make of item 1",
  "model": "Model of item 1",
  "img_url": "https://example.com/item1.jpg",
  "daily_cost": 10.0,
  "available": 1,
  "condition": "Good"
}
```

### Get Items by Owner ID

**Endpoint:** `GET /api/items/:owner_id`

Retrieve a list of items owned by a specific owner.

#### Response

```json
[
  {
    "id": 1,
    "owner_id": 1,
    "title": "Item 1",
    "description": "Description of item 1",
    "make": "Make of item 1",
    "model": "Model of item 1",
    "img_url": "https://example.com/item1.jpg",
    "daily_cost": 10.0,
    "available": 1,
    "condition": "Good"
  },
  {
    "id": 2,
    "owner_id": 1,
    "title": "Item 2",
    "description": "Description of item 2",
    "make": "Make of item 2",
    "model": "Model of item 2",
    "img_url": "https://example.com/item2.jpg",
    "daily_cost": 15.0,
    "available": 1,
    "condition": "Excellent"
  },
  ...
]
```

### Create Item

**Endpoint:** `POST /api/items/create`

Create a new item owned by the authenticated owner.

#### Request Body

| Parameter       | Type     | Required | Description                            |
| --------------- | -------- | -------- | -------------------------------------- |
| `title`         | string   | Yes      | Title of the item.                      |
| `description`   | string   | Yes      | Description of the item.                |
| `make`          | string   | Yes      | Make of the item.                       |
| `model`         | string   | Yes      | Model of the item.                      |
| `img_url`       | string   | Yes      | URL of an image representing the item.  |
| `daily_cost`    | number   | Yes      | Daily cost for renting the item.        |
| `available`     | boolean  | Yes      | Availability status of the item.        |
| `condition`     | string   | Yes      | Condition of the item.                  |

#### Response

```json
{
  "message": "Item created successfully",
  "item_id": 1
}
```

### Update Item

**Endpoint:** `PUT /api/items/update/:id`

Update the details of a specific item owned by the authenticated owner.

#### Request Parameters

| Parameter   | Type     | Required | Description                      |
| ----------- | -------- | -------- | -------------------------------- |
| `id`        | integer  | Yes      | ID of the item to update.         |

#### Request Body

| Parameter       | Type     | Required | Description                            |
| --------------- | -------- | -------- | -------------------------------------- |
| `title`         | string   | No       | Updated title of the item.              |
| `description`   | string   | No       | Updated description of the item.        |
| `make`          | string   | No       | Updated make of the item.               |
| `model`         | string   | No       | Updated model of the item.              |
| `img_url`       | string   | No       | Updated URL of the item's image.        |
| `daily_cost`    | number   | No       | Updated daily cost for renting the item.|
| `available`     | boolean  | No       | Updated availability status of the item.|
| `condition`     | string   | No       | Updated condition of the item.           |

#### Response

```json
{
  "message": "Item updated successfully",
  "item": {
    "id": 1,
    "title": "Updated Item",
    "description": "Updated description of item",
    "make": "Updated make",
    "model": "Updated model",
    "img_url": "https://example.com/updated_item.jpg",
    "daily_cost": 12.0,
    "available": 1,
    "condition": "Good"
  }
}
```

### Delete Item

**Endpoint:** `DELETE /api/items/delete/:id`

Delete a specific item owned by the authenticated owner.

#### Request Parameters

| Parameter   | Type     | Required | Description                      |
| ----------- | -------- | -------- | -------------------------------- |
| `id`        | integer  | Yes      | ID of the item to delete.         |

#### Response

```json
{
  "message": "Item deleted successfully"
}
```

### Get All Rented Items

**Endpoint:** `GET /api/rented_items`

Retrieve a list of all items rented by the authenticated renter.

#### Response

```json
[
  {
    "id": 1,
    "start_date": "2023-07-09",
    "end_date": "2023-07-16",
    "total_cost": 70.0,
    "tool_id": 1,
    "renter_id": 1
  },
  {
    "id": 2,
    "start_date": "2023-07-11",
    "end_date": "2023-07-14",
    "total_cost": 45.0,
    "tool_id": 2,
    "renter_id": 1
  },
  ...
]
```

### Get Rentals by Renter ID

**Endpoint:** `GET /api/rentals/:renter_id`

Retrieve a list of all rentals

made by a specific renter.

#### Request Parameters

| Parameter   | Type     | Required | Description                      |
| ----------- | -------- | -------- | -------------------------------- |
| `renter_id` | integer  | Yes      | ID of the renter.                |

#### Response

```json
[
  {
    "id": 1,
    "start_date": "2023-07-09",
    "end_date": "2023-07-16",
    "total_cost": 70.0,
    "tool_id": 1,
    "renter_id": 1
  },
  {
    "id": 2,
    "start_date": "2023-07-11",
    "end_date": "2023-07-14",
    "total_cost": 45.0,
    "tool_id": 2,
    "renter_id": 1
  },
  ...
]
```

### Rent Item

**Endpoint:** `POST /api/rentals/rent_item/:item_id`

Rent an item by the authenticated renter.

#### Request Parameters

| Parameter   | Type     | Required | Description                      |
| ----------- | -------- | -------- | -------------------------------- |
| `item_id`   | integer  | Yes      | ID of the item to rent.          |

#### Request Body

| Parameter       | Type     | Required | Description                            |
| --------------- | -------- | -------- | -------------------------------------- |
| `start_date`    | string   | Yes      | Start date of the rental (YYYY-MM-DD). |
| `end_date`      | string   | Yes      | End date of the rental (YYYY-MM-DD).   |
| `total_cost`    | number   | Yes      | Total cost of the rental.              |

#### Response

```json
{
  "message": "Item rented successfully",
  "rental_id": 1
}
```

### Remove Item from Rentals

**Endpoint:** `DELETE /api/rentals/remove_item/:item_id`

Remove an item from the rentals of the authenticated renter.

#### Request Parameters

| Parameter   | Type     | Required | Description                      |
| ----------- | -------- | -------- | -------------------------------- |
| `item_id`   | integer  | Yes      | ID of the item to remove.        |

#### Response

```json
{
  "message": "Item removed from rentals successfully"
}
```

## Authentication

This API uses JSON Web Tokens (JWT) for authentication. To access protected endpoints, include the `Authorization` header in your requests with the value `Bearer <token>`, where `<token>` is the JWT obtained during the login process.

## Error Responses

If an error occurs, the API will respond with an appropriate HTTP status code and an error message in the response body.

Example error response:

```json
{
  "error": "Invalid email or password"
}
```

Possible error messages:

- `No token provided`: The request is missing the `Authorization` header or the token.
- `Invalid token`: The provided token is invalid or expired.
- `Invalid email or password`: The email or password provided in the login request is incorrect.
- `Authentication required`: The request requires authentication, but the user is not authenticated.
- `An error occurred`: An internal server error occurred.
