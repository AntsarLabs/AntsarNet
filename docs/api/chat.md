# Chat API Design

Endpoints for real-time messaging sessions between users.

---

## Data Schema

### Chat Session Object
```json
{
  "id": "uuid",
  "participant": {
    "public_id": "ab12c34",
    "username": "dragon_234",
    "emoji": "🐲",
    "is_online": true
  },
  "status": "active",
  "total_messages": 15,
  "unread_count": 2, // messages sent by other user that I haven't replied to
  "last_message": {
    "text": "See you there!",
    "created_at": "timestamp"
  },
  "started_at": "timestamp",
  "last_message_at": "timestamp"
}
```

### Message Object
```json
{
  "id": "uuid",
  "chat_id": "uuid",
  "sender_id": "uuid",
  "is_me": true,
  "text": "Hey, how are you?",
  "created_at": "timestamp"
}
```

---

## Chat Endpoints

### List Chat Sessions
`GET /api/chats`
Retrieve all active and ended chat sessions for the current user. Usually sorted by `last_message_at`.

**Query Parameters:**
* `status`: `active` | `ended` (optional)
* `page`: integer
* `limit`: integer

**Response:**
```json
{
  "data": [
    { ...chat_session_object }
  ],
  "meta": {
    "current_page": 1,
    "total": 10
  }
}
```

### Start Chat Session
`POST /api/chats`
Initiate a new chat session with a user. If a session already exists between the two users, it returns the existing session.

**Note:** According to business rules, users can only have one active session at a time (this usually refers to one-on-one sessions, but we'll reflect the schema).

**Request Body:**
```json
{
  "user_id": "uuid" // The ID of the user to start a chat with
}
```

**Response:**
`201 Created` or `200 OK` with the chat session object.

### Get Message History
`GET /api/chats/{id}/messages`
Retrieve paginated messages for a specific session.

**Query Parameters:**
* `before`: uuid (optional) - For cursor-based pagination (last message ID).
* `limit`: integer (default: 50)

**Response:**
```json
{
  "data": [
    { ...message_object }
  ],
  "meta": {
      "has_more": true
  }
}
```

### Send Message
`POST /api/chats/{id}/messages`
Send a text message in an active session.

**Request Body:**
```json
{
  "text": "Hello, I wanted to talk about..."
}
```

**Response:**
`201 Created` with the message object.

### End Chat Session
`DELETE /api/chats/{id}`
End an active chat session. This changes the status to `ended`.

**Response:**
`204 No Content`

---

## Real-time Events (WebSockets/SSE)

While not strictly REST, the chat system expects real-time updates.

* `chat.message.new`: Received when a new message arrives in a session.
* `chat.session.started`: Received when someone starts a chat with you.
* `chat.session.ended`: Received when the other user ends the session.
* `user.typing`: (Optional) Transient event when the other user is typing.
