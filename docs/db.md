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

## tags
A collection of available tags.
*   `id`: primary key 
*   `name`: String (e.g., "Crush", "Secret", "Vent").
*   `count`: Integer
*   created_at: Timestamp
*   updated_at: Timestamp

## posts
Anonymous or semi-anonymous posts shared by users in the Discovery feed.
*   `id`: Primary key.
*   `user_id`: Foreign key to Users (The creator).
*   `post_type`: `confession` | `vent` | `question` | `advice`
*   `content`: The text body.
*   `status`: `deleted` | `flagged` | `published` | `pening`
*   created_at: Timestamp
*   updated_at: Timestamp

### post tags
Category tags for posts used for filtering.
*   `post_id`: Foreign key to Posts.
*   `tag_id`: String

### post comments
Threads on posts.
*   `id`: Primary key.
*   `post_id`: Foreign key to Posts.
*   `user_id`: Foreign key to Users.
*   `parent_comment_id`: Self-referencing ID for replies (null for top-level).
*   `content`: Comment text.
*   `status`: `active` | `deleted` | `flagged`.
*   created_at: Timestamp
*   updated_at: Timestamp

### reactions
Shared reactions across both posts and comments.
*   `id`: Primary key.
*   `user_id`: Foreign key to Users.
*   `post_id`: Foreign key to Posts.
*   `comment_id`: Foreign key to Post Comments.
*   `emoji`: String
*   created_at: Timestamp
*   updated_at: Timestamp


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
*   `message`: Detailed content (encrypted).
*   `nonce`: Encryption nonce.
*   `is_read`: Boolean status.
*   `created_at`: Timestamp.