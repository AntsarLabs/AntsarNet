# Inbox API Design

Endpoints for managing anonymous inbox messages received via personal links.

---

## Data Schema

### Inbox Message Object
```json
{
  "id": "uuid",
  "subject": "Secret Crush",
  "message": "I've liked you since our college days but never had the courage to say it.",
  "is_read": false,
  "created_at": "timestamp"
}
```

---

## Inbox Endpoints

### List Inbox Messages
`GET /api/inbox`
Retrieve a paginated list of anonymous messages for the authenticated user.

**Query Parameters:**
* `unread_only`: boolean (optional)
* `page`: integer
* `limit`: integer

**Response:**
```json
{
  "data": [
    { ...inbox_message_object }
  ],
  "meta": {
    "current_page": 1,
    "total": 25
  }
}
```

### Send Anonymous Message
`POST /api/inbox/{public_id}`
Send an anonymous message to a user using their public link ID. **Authentication is not required** for this endpoint as it's meant for public use.

**Request Body:**
```json
{
  "subject": "Feedback", // optional
  "message": "I really like your vibe on AddisNet!"
}
```

**Response:**
`201 Created`

### Get Message Detail
`GET /api/inbox/{id}`
Retrieve the full content of a specific message. This will automatically mark the message as read if not already.

**Response:**
`200 OK` with inbox message object.

### Mark as Read
`PATCH /api/inbox/{id}/read`
Manually mark a message as read.

**Response:**
`204 No Content`

### Delete Message
`DELETE /api/inbox/{id}`
Permanently delete an inbox message.

**Response:**
`204 No Content`
