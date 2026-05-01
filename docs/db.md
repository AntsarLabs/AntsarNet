# Database Schema

List of tables and their relationships based on the AddisNet application structure.

---

## Users
The core entity representing an account on AddisNet.
*   `id`: Primary key (UUID/String)
*   `public_key`: 
*   `username`: <avater_name>_<random_number>
*   `emoji`: Current avatar emoji.
*   `is_online`: Boolean status.
*   `bio`: User's profile description
*   `city_code`: City or neighborhood name
*  status: `active` | `suspended` | `banned` | `deleted`
* postive_reaction_count: Integer
* negative_reaction_count: Integer
* confession_count: Integer
*  ip_address: hashed(String)
*  created_at: Timestamp
*  updated_at: Timestamp

### User Blocks
Managing blocked interactions between users.
*   `blocker_id`: Foreign key to Users (The person who blocked).
*   `blocked_id`: Foreign key to Users (The person who is blocked).
*   `created_at`: Timestamp.

---

## Confessions
Anonymous or semi-anonymous posts shared by users in the Discovery feed.
*   `id`: Primary key.
*   `user_id`: Foreign key to Users (The creator).
*   `content`: The text body.
*   `status`: `deleted` | `flagged` | `published`.
*   `reaction_count`: Denormalized count for performance.
*   `comment_count`: Denormalized count for performance.
*   `report_count`: Safety metric used for moderation.

### Confession Tags
Category tags for confessions used for filtering.
*   `confession_id`: Foreign key to Confessions.
*   `tag_name`: String (e.g., "Crush", "Secret", "Vent").
*   `count`: Integer

### Confession Comments
Threads on confessions.
*   `id`: Primary key.
*   `confession_id`: Foreign key to Confessions.
*   `user_id`: Foreign key to Users.
*   `parent_comment_id`: Self-referencing ID for replies (null for top-level).
*   `content`: Comment text.
*   `status`: `active` | `deleted` | `flagged`.

### Reactions
Shared reactions across both confessions and comments.
*   `id`: Primary key.
*   `user_id`: Foreign key to Users.
*   `confession_id`: Foreign key to Confessions.
*   `comment_id`: Foreign key to Confession Comments.
*   `reaction`: Enum (...list of allowed emojis).

---

## Chat
Conversational links between two users. Users can only have one active session at a time.
*   `id`: Primary key.
*   `user_1_id`: Initiator of the session.
*   `user_2_id`: Participant receiving the session.
*   `status`: `active` | `ended`.
*   `total_messages`: Denormalized count.
*   `unreplied_count`: Number of messages waiting for a response from the current viewer.
*   `started_at`: Timestamp.
*   `last_message_at`: Timestamp.

### Messages
Individual messages within a specific chat session.
*   `id`: Primary key.
*   `chat_id`: Foreign key to Chat Sessions.
*   `sender_id`: Foreign key to Users
*   `text`: Message content.
*   `created_at`: Timestamp.

---

## Inbox Messages
Individual anonymous messages received via a user's unique inbox link.
*   `id`: Primary key.
*   `user_id`: Foreign key to Users (linked via `friend_id` on the frontend).
*   `subject`: Message subject.
*   `message`: Detailed content.
*   `is_read`: Boolean status.
*   `created_at`: Timestamp.