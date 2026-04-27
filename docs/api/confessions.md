# Confessions API Design

Endpoints for creating, viewing, and interacting with confessions.

---

## Data Schema

### Confession Object
```json
{
  "id": "uuid",
  "user": {
    "public_id": "ab12c34",
    "username": "dragon_234",
    "emoji": "🐲"
  },
  "content": "I actually like the traffic in Addis because it gives me time to think.",
  "tags": ["Secret", "AddisLife"],
  "stats": {
    "reactions": 42,
    "comments": 12,
    "reports": 0
  },
  "my_reaction": "🤫", // null if current user hasn't reacted
  "status": "published",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Comment Object
```json
{
  "id": "uuid",
  "confession_id": "uuid",
  "user": {
    "public_id": "xy98z76",
    "username": "tiger_789",
    "emoji": "🐯"
  },
  "content": "That's a very positive way to look at it!",
  "parent_id": null, // uuid if it's a reply
  "replies_count": 2,
  "reaction_count": 5,
  "my_reaction": "❤️",
  "status": "active",
  "created_at": "timestamp"
}
```

---

## Confession Endpoints

### List Confessions
`GET /api/confessions`
Retrieve a paginated list of confessions.

**Query Parameters:**
* `tag`: string (optional) - Filter by tag name.
* `sort`: `latest` | `popular` (default: `latest`)
* `page`: integer
* `limit`: integer

**Response:**
```json
{
  "data": [
    { ...confession_object }
  ],
  "meta": {
    "current_page": 1,
    "total": 500
  }
}
```

### Create Confession
`POST /api/confessions`
Post a new confession.

**Request Body:**
```json
{
  "content": "My secret confession text...",
  "tags": ["Secret", "Personal"]
}
```

**Response:**
`201 Created` with the new confession object.

### Get Confession Details
`GET /api/confessions/{id}`
Retrieve a single confession with full details.

**Response:**
`200 OK` with confession object.

### Delete Confession
`DELETE /api/confessions/{id}`
Delete a confession. (Only the creator or moderators can delete).

**Response:**
`204 No Content`

---

## Interaction Endpoints

### React to Confession
`POST /api/confessions/{id}/react`
Add or update a reaction to a confession.

**Request Body:**
```json
{
  "reaction": "🔥" // emoji from restricted list
}
```

**Response:**
`200 OK` with updated `reaction_count`.

### Remove Reaction
`DELETE /api/confessions/{id}/react`
Remove the current user's reaction from a confession.

**Response:**
`204 No Content`

---

## Comment Endpoints

### List Comments
`GET /api/confessions/{id}/comments`
Get all comments for a specific confession.

**Response:**
```json
{
  "data": [
    { ...comment_object }
  ]
}
```

### Post Comment
`POST /api/confessions/{id}/comments`
Add a comment or reply to a confession.

**Request Body:**
```json
{
  "content": "My comment text...",
  "parent_id": "uuid" // Optional: for nested replies
}
```

**Response:**
`201 Created` with comment object.

### Delete Comment
`DELETE /api/confessions/comments/{comment_id}`
Delete a comment. (Only the creator or moderators can delete).

**Response:**
`204 No Content`

### React to Comment
`POST /api/confessions/comments/{comment_id}/react`
Add or update a reaction to a comment.

**Request Body:**
```json
{
  "reaction": "👍"
}
```

**Response:**
`200 OK`

---

## Moderation

### Report Confession
`POST /api/confessions/{id}/report`
Flag a confession for moderation.

**Request Body:**
```json
{
  "reason": "inappropriate_content"
}
```

**Response:**
`204 No Content`
