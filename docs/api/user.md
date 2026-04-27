# User API Design

Endpoints for managing users and authentication.

---

## Data Schema (User Object)
```json
{
  "id": "uuid",
  "public_id": "string (7 chars hex)",
  "username": "dragon_234",
  "emoji": "🐲",
  "bio": "Just a user from Addis",
  "city_code": "Addis Ababa",
  "is_online": true,
  "stats": {
    "positive_reactions": 10,
    "negative_reactions": 2,
    "confessions": 5
  },
  "status": "active",
  "created_at": "timestamp"
}
```

---

## Authentication

Authentication is based on a cryptographic challenge-response handshake. The client must have the **System Public Key** to encrypt the signed payload.

### Get Nonce
`GET /api/auth/nonce`


**Response:**
```json
{
  "public_key": "-----BEGIN PUBLIC KEY-----\n...",
  "nonce": "7f8e9a2b...",
  "expires_at": "timestamp"
}
```

### verify the nonce and login/signup
`GET /api/auth/verify`


**Request:**
```json
{
  "public_id": "ab12c34", //user public id
  "nonce": "7f8e9a2b...", //nonce from the server
  "signature": "base64_signature" //signed challenge with user's private key 
}
```

**Response:**
```json
{
  "token": "bearer_token_here",
  "user": { ...user_object }
}

```


---

## User Endpoints

### Get Current User
`GET /api/users/me`
Returns the authenticated user's profile.

**Response:**
```json
{
  "id": "uuid",
  "username": "dragon_234",
  "public_id": "ab12c34",
  "emoji": "🐲",
  "bio": "...",
  "city_code": "...",
  "is_online": true,
  "stats": {
    "positive_reactions": 10,
    "negative_reactions": 2,
    "confessions": 5
  },
  "status": "active",
  "created_at": "timestamp"
}
```

### Update Profile
`PATCH /api/users/me`
Update bio, avatar emoji, or city.

**Request Body:**
```json
{
  "bio": "New bio content",
  "emoji": "🦁",
  "city_code": "Bole"
}
```

**Response:**
`200 OK` with updated user object.

---

### Get User Profile
`GET /api/users/{id}`
Retrieve public profile information for a specific user.

**Response:**
```json
{
  "public_id": "ab12c34",
  "username": "dragon_234",
  "emoji": "🐲",
  "bio": "...",
  "city_code": "...",
  "is_online": true,
  "stats": { ... }
}
```

---

### Discovery (List Users)
`GET /api/users`
List users for the discovery feed. Supports filtering by online status or city.

**Query Parameters:**
* `online`: boolean (optional)
* `city`: string (optional)
* `page`: integer
* `limit`: integer

**Response:**
```json
{
  "data": [
    {
      "public_id": "ab12c34",
      "username": "dragon_234",
      "emoji": "🐲",
      "city_code": "Bole",
      "is_online": true
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 150
  }
}
```

---

## Moderation & Blocking

### Block User
`POST /api/users/{id}/block`
Prevents interaction between the current user and the target user.

**Response:**
`204 No Content`

### Unblock User
`DELETE /api/users/{id}/block`
Removes a block.

**Response:**
`204 No Content`
