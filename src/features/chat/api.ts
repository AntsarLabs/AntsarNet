import { supabase } from '@/lib/supabase';
import { E2EE } from '@/utils/e2ee';
import { useAuthStore } from '../auth/store';
import type { Message, Chat, ChatWithLastMessage } from './types';

export const chatApi = {
  /**
   * Get all chats for the current user (both as sender and receiver)
   * Includes block status information
   */
  async getChats(options: { limit?: number } = {}): Promise<Chat[]> {
    const { limit = 50 } = options;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const userId = session.user.id;
    const { data, error } = await supabase
      .from('chats')
      .select(
        `
        id,
        sender_id,
        receiver_id,
        status,
        sender_deleted_at,
        receiver_deleted_at,
        created_at,
        updated_at,
        sender:public_users!sender_id(id, username, emoji,bio,created_at,updated_at,is_online, user_blocks!user_id(blocked_id)),
        receiver:public_users!receiver_id(id, username, emoji,bio,created_at,updated_at,is_online, user_blocks!user_id(blocked_id))
      `
      )
      .or(`and(sender_id.eq.${userId},sender_deleted_at.is.null),and(receiver_id.eq.${userId},receiver_deleted_at.is.null)`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return (data || []).map((chat: any) => {
      return {
        id: chat.id,
        senderId: chat.sender_id,
        receiverId: chat.receiver_id,
        status: chat.status,
        senderDeletedAt: chat.sender_deleted_at,
        receiverDeletedAt: chat.receiver_deleted_at,
        createdAt: chat.created_at,
        updatedAt: chat.updated_at,
        sender: chat.sender ? {
          id: chat.sender.id,
          username: chat.sender.username,
          emoji: chat.sender.emoji,
          is_online: chat.sender.is_online,
          bio: chat.sender.bio,
          created_at: chat.sender.created_at,
          updated_at: chat.sender.updated_at,
          blockStatus: chat.sender.user_blocks?.some(
            (block: any) => block.blocked_id === userId
          ) ? 'blocked_by_you' : null
        } : undefined,
        receiver: chat.receiver ? {
          id: chat.receiver.id,
          username: chat.receiver.username,
          emoji: chat.receiver.emoji,
          is_online: chat.receiver.is_online,
          bio: chat.receiver.bio,
          created_at: chat.receiver.created_at,
          updated_at: chat.receiver.updated_at,
          blockStatus: chat.receiver.user_blocks?.some(
            (block: any) => block.blocked_id === userId
          ) ? 'blocked_by_you' : null
        } : undefined
      };
    });
  },

  /**
   * Get chats with last message info for the chat list
   */
  async getChatsWithLastMessage(options: { limit?: number } = {}): Promise<ChatWithLastMessage[]> {
    const { limit = 50 } = options;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const userId = session.user.id;

    // Get chats with user info
    const { data: chatsData, error: chatsError } = await supabase
      .from('chats')
      .select(`
        id,
        sender_id,
        receiver_id,
        status,
        sender_deleted_at,
        receiver_deleted_at,
        created_at,
        updated_at,
        sender:public_users!sender_id(id, username, emoji, bio, created_at, updated_at, is_online, user_blocks!user_id(blocked_id)),
        receiver:public_users!receiver_id(id, username, emoji, bio, created_at, updated_at, is_online, user_blocks!user_id(blocked_id))
      `)
      .or(`and(sender_id.eq.${userId},sender_deleted_at.is.null),and(receiver_id.eq.${userId},receiver_deleted_at.is.null)`)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (chatsError) throw new Error(chatsError.message);

    if (!chatsData || chatsData.length === 0) return [];

    const chatIds = chatsData.map((c: any) => c.id);

    // Get last messages for these chats
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('chat_id, encrypted_texts, from, created_at')
      .in('chat_id', chatIds)
      .order('created_at', { ascending: false });

    if (messagesError) throw new Error(messagesError.message);

    // Get unread counts
    const { data: unreadData } = await supabase
      .from('messages')
      .select('chat_id', { count: 'exact', head: false })
      .in('chat_id', chatIds)
      .is('seen_at', null)
      .neq('from', userId);

    // Group unread by chat
    const unreadMap = new Map<string, number>();
    if (unreadData) {
      unreadData.forEach((msg: any) => {
        unreadMap.set(msg.chat_id, (unreadMap.get(msg.chat_id) || 0) + 1);
      });
    }

    // Get auth state for decryption
    const authState = useAuthStore.getState();
    const privateKeyBase64 = authState.privateKey;
    const myPublicKeyBase64 = authState.publicKey;
    const myUserId = userId;
    if (!privateKeyBase64 || !myPublicKeyBase64) throw new Error('Keys not found');
    const privateKey = E2EE.toUint8Array(privateKeyBase64);

    // Get unique sender IDs to fetch their public keys from users table (others only)
    const senderIds = messagesData
      ? [...new Set(messagesData.map((msg: any) => msg.from))]
      : [];

    // Fetch other senders' public keys from users table
    const { data: usersData } = await supabase
      .from('users')
      .select('id, public_key')
      .in('id', senderIds);

    // Build lookup map for public keys (others only, not ourselves)
    const publicKeyMap = new Map<string, string>();
    usersData?.forEach((user: any) => {
      publicKeyMap.set(user.id, user.public_key);
    });

    // Get last message per chat
    const lastMessageMap = new Map<string, any>();
    if (messagesData && privateKey) {
      messagesData.forEach((msg: any) => {
        if (!lastMessageMap.has(msg.chat_id)) {
          try {
            // Get the encrypted data for current user
            const encryptedData = msg.encrypted_texts?.[myUserId];
            if (!encryptedData?.ciphertext || !encryptedData?.nonce) {
              throw new Error('Encrypted data not found');
            }

            // Determine whose public key to use for decryption
            // If I'm the sender: use my public key (from auth store)
            // If I'm the receiver: use sender's public key (from users table)
            const isSender = msg.from === myUserId;
            const senderPublicKeyBase64 = isSender
              ? myPublicKeyBase64 // use from auth store
              : publicKeyMap.get(msg.from); // fetch from users table

            if (!senderPublicKeyBase64) throw new Error('Sender public key not found');

            const senderPublicKey = E2EE.toUint8Array(senderPublicKeyBase64);
            const sharedKey = E2EE.generateSharedKey(senderPublicKey, privateKey);
            const encryptedMessage = E2EE.toUint8Array(encryptedData.ciphertext);
            const nonce = E2EE.toUint8Array(encryptedData.nonce);
            const text = E2EE.decryptMsg(encryptedMessage, sharedKey, nonce);

            lastMessageMap.set(msg.chat_id, {
              text,
              createdAt: msg.created_at,
              senderId: msg.from
            });
          } catch {
            // If decryption fails, use placeholder
            lastMessageMap.set(msg.chat_id, {
              text: 'Message',
              createdAt: msg.created_at,
              senderId: msg.from
            });
          }
        }
      });
    }

    return chatsData.map((chat: any) => {
      const lastMsg = lastMessageMap.get(chat.id);

      return {
        id: chat.id,
        senderId: chat.sender_id,
        receiverId: chat.receiver_id,
        status: chat.status,
        senderDeletedAt: chat.sender_deleted_at,
        receiverDeletedAt: chat.receiver_deleted_at,
        createdAt: chat.created_at,
        updatedAt: chat.updated_at,
        sender: chat.sender ? {
          id: chat.sender.id,
          username: chat.sender.username,
          emoji: chat.sender.emoji,
          is_online: chat.sender.is_online,
          bio: chat.sender.bio,
          created_at: chat.sender.created_at,
          updated_at: chat.sender.updated_at,
          blockStatus: (chat.sender.user_blocks?.some(
            (block: any) => block.blocked_id === userId
          ) ? 'blocked_by_you' : null) as 'blocked_by_you' | null
        } : undefined,
        receiver: chat.receiver ? {
          id: chat.receiver.id,
          username: chat.receiver.username,
          emoji: chat.receiver.emoji,
          is_online: chat.receiver.is_online,
          bio: chat.receiver.bio,
          created_at: chat.receiver.created_at,
          updated_at: chat.receiver.updated_at,
          blockStatus: (chat.receiver.user_blocks?.some(
            (block: any) => block.blocked_id === userId
          ) ? 'blocked_by_you' : null) as 'blocked_by_you' | null
        } : undefined,
        lastMessage: lastMsg || null,
        unreadCount: unreadMap.get(chat.id) || 0
      };
    });
  },

  /**
   * create a chat session with a user (only pass userId)
   * Stores both peer's public keys in the chat record
   */
  async createChat(receiverId: string): Promise<Chat> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const authState = useAuthStore.getState();
    const senderPublicKey = authState.publicKey;
    if (!senderPublicKey) throw new Error('Public key not found');

    const userId = session.user.id;

    // Create new chat with both public keys
    const { data, error } = await supabase
      .from('chats')
      .insert({
        sender_id: userId,
        receiver_id: receiverId,
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /**
   * Get messages for a chat (only pass chatId)
   * Decrypts messages using current user's private key
   * Fetches sender public keys from chats table
   */
  async getMessages(
    chatId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<Message[]> {
    const { limit = 50, offset = 0 } = options;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .select(
        `
        id,
        from,
        to,
        encrypted_texts,
        seen_at,
        created_at,
        updated_at
      `
      )
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    // Get current user's keys from auth store
    const authState = useAuthStore.getState();
    const privateKeyBase64 = authState.privateKey;
    const myPublicKeyBase64 = authState.publicKey;
    const myUserId = session.user.id;
    if (!privateKeyBase64 || !myPublicKeyBase64) throw new Error('Keys not found');
    const privateKey = E2EE.toUint8Array(privateKeyBase64);

    // Get unique sender IDs to fetch their public keys from users table (others only)
    const senderIds = [...new Set((data || []).map((msg: any) => msg.from))];

    // Fetch other senders' public keys from users table
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, public_key')
      .in('id', senderIds);

    if (usersError) throw new Error(usersError.message);

    // Build lookup map for public keys (others only, not ourselves)
    const publicKeyMap = new Map<string, string>();
    usersData?.forEach((user: any) => {
      publicKeyMap.set(user.id, user.public_key);
    });

    return (data || []).map((msg: any) => {
      try {
        // Get the encrypted data for current user (sender or receiver entry)
        const encryptedData = msg.encrypted_texts?.[myUserId];
        console.log('Message:', msg.id, 'from:', msg.from, 'to:', msg.to, 'encrypted_texts keys:', Object.keys(msg.encrypted_texts || {}));
        console.log('myUserId:', myUserId, 'encryptedData:', encryptedData);

        if (!encryptedData?.ciphertext || !encryptedData?.nonce) {
          throw new Error(`Encrypted data not found for user ${myUserId}`);
        }

        // Determine whose public key to use for decryption
        // If I'm the sender: use my public key (from auth store) + my private key
        // If I'm the receiver: use sender's public key (from users table) + my private key
        const isSender = msg.from === myUserId;
        const senderPublicKeyBase64 = isSender
          ? myPublicKeyBase64 // use from auth store
          : publicKeyMap.get(msg.from); // fetch from users table

        console.log('isSender:', isSender, 'senderPublicKey found:', !!senderPublicKeyBase64);

        if (!senderPublicKeyBase64) {
          throw new Error(`Sender public key not found for ${isSender ? 'myself' : msg.from}`);
        }

        // Generate shared key using sender's public key + our private key
        const senderPublicKey = E2EE.toUint8Array(senderPublicKeyBase64);
        const sharedKey = E2EE.generateSharedKey(senderPublicKey, privateKey);

        // Decrypt message
        const encryptedMessage = E2EE.toUint8Array(encryptedData.ciphertext);
        const nonce = E2EE.toUint8Array(encryptedData.nonce);
        const text = E2EE.decryptMsg(encryptedMessage, sharedKey, nonce);

        return {
          id: msg.id,
          senderId: msg.from,
          text,
          seenAt: msg.seen_at,
          createdAt: msg.created_at,
          updatedAt: msg.updated_at
        };
      } catch (err) {
        console.error('Decryption failed for message:', msg.id, 'Error:', err);
        // Return placeholder instead of throwing so other messages can load
        return {
          id: msg.id,
          senderId: msg.from,
          text: '[Unable to decrypt]',
          seenAt: msg.seen_at,
          createdAt: msg.created_at,
          updatedAt: msg.updated_at
        };
      }
    });
  },

  /**
   * Send a message to a user (only pass chatId and text)
   * Fetches recipient's public key from users table and encrypts message
   */
  async sendMessage(chatId: string, text: string): Promise<Message> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    // Get current user's keys from auth store
    const authState = useAuthStore.getState();
    const privateKeyBase64 = authState.privateKey;
    const publicKeyBase64 = authState.publicKey;
    if (!privateKeyBase64 || !publicKeyBase64) throw new Error('Keys not found');

    const privateKey = E2EE.toUint8Array(privateKeyBase64);

    // Get chat details to find recipient
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .select('sender_id, receiver_id')
      .eq('id', chatId)
      .single();

    if (chatError) throw new Error(chatError.message);

    // Determine recipient
    const recipientId = chatData.sender_id === session.user.id
      ? chatData.receiver_id
      : chatData.sender_id;

    if (!recipientId) {
      throw new Error('Recipient not found in chat');
    }

    // Fetch recipient's public key from users table
    const { data: recipientData, error: recipientError } = await supabase
      .from('users')
      .select('public_key')
      .eq('id', recipientId)
      .single();

    if (recipientError || !recipientData?.public_key) {
      throw new Error('Recipient public key not found');
    }

    //a b
    //encr [bPubkey,aPrivatKey]
    //b a
    //ec [aPubkey,bPrivateKey]

    const recipientPublicKeyBase64 = recipientData.public_key;
    const senderPublicKeyBase64 = publicKeyBase64;

    // Encrypt for receiver (recipient's public key + my private key)
    const receiverNonce = E2EE.generateNonce();
    const receiverPublicKey = E2EE.toUint8Array(recipientPublicKeyBase64);
    const receiverSharedKey = E2EE.generateSharedKey(receiverPublicKey, privateKey);
    const encryptedForReceiver = E2EE.encryptMsg(text, receiverSharedKey, receiverNonce);

    // Encrypt for sender (my public key + my private key)
    const senderNonce = E2EE.generateNonce();
    const senderPublicKey = E2EE.toUint8Array(senderPublicKeyBase64);
    const senderSharedKey = E2EE.generateSharedKey(senderPublicKey, privateKey);
    const encryptedForSender = E2EE.encryptMsg(text, senderSharedKey, senderNonce);

    // Build encrypted_texts JSON
    const encryptedTexts = {
      [session.user.id]: {
        ciphertext: E2EE.toBase64(encryptedForSender.message),
        nonce: E2EE.toBase64(senderNonce)
      },
      [recipientId]: {
        ciphertext: E2EE.toBase64(encryptedForReceiver.message),
        nonce: E2EE.toBase64(receiverNonce)
      }
    };

    // Insert message with from/to
    const { data, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        from: session.user.id,
        to: recipientId,
        encrypted_texts: encryptedTexts
      })
      .select('id, created_at')
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      senderId: session.user.id,
      text,
      createdAt: data.created_at
    };
  },

  /**
   * Mark message as seen
   */
  async markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ seen_at: new Date().toISOString() })
      .eq('id', messageId);

    if (error) throw new Error(error.message);
  },

  /**
   * Update chat status (accept or decline pending chat)
   */
  async updateChatStatus(chatId: string, status: 'accepted' | 'declined'): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('chats')
      .update({ status })
      .eq('id', chatId)
      .eq('receiver_id', session.user.id);

    if (error) throw new Error(error.message);
  }
};
