import { supabase } from '@/lib/supabase';
import type { Post, Tag, PostType } from './types';

export const postApi = {
  /**
   * Fetch paginated posts with joined user info and tags.
   * Optionally filter by post_type.
   */
  async getPosts(options: {
    page?: number;
    limit?: number;
    postType?: PostType | 'all';
    userId?: string;
    sort?: 'latest' | 'hot' | 'my';
  } = {}): Promise<Post[]> {
    const { page = 0, limit = 10, postType = 'all', userId, sort = 'latest' } = options;
    const from = page * limit;
    const to = from + limit - 1;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authUser = session?.user;
      console.log('API: Supabase Session:', session ? 'Active' : 'None');

      // 1. Fetch posts with joined data
      let query = supabase
        .from('posts')
        .select(`
          *,
          user:public_users!user_id ( emoji, username ),
          post_tags ( tag:tags ( id, name, count ) ),
          my_reaction:reactions!post_id(emoji)
        `)
        .eq('status', 'published');

      // Filter the joined reaction to only the current user
      if (authUser) {
        query = query.eq('my_reaction.user_id', authUser.id);
      }

      // Apply filters FIRST
      if (postType && postType !== 'all') {
        query = query.eq('post_type', postType);
      }

      if (userId) {
        query = query.eq('user_id', userId);
      }

      // Apply ordering and range LAST
      if (sort === 'hot') {
        query = query
          .order('reaction_count', { ascending: false })
          .order('comment_count', { ascending: false })
          .order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('API Error: fetching posts:', error);
        throw new Error(error.message);
      }

      const posts = data || [];
      console.log(`API: Fetched ${posts.length} posts for type ${postType}`);
      const postIds = posts.map((p: any) => p.id);

      // 2. Fetch reaction counts from the view
      const { data: countsRes } = await supabase
        .from('post_reaction_counts')
        .select('post_id, emoji, count')
        .in('post_id', postIds);

      const reactionCountsMap = new Map<string, Record<string, number>>();
      (countsRes || []).forEach((r: any) => {
        const pId = r.post_id;
        if (!reactionCountsMap.has(pId)) {
          reactionCountsMap.set(pId, {});
        }
        reactionCountsMap.get(pId)![r.emoji] = r.count;
      });

      // 3. Merge posts with data
      return posts.map((row: any) => {
        const counts = reactionCountsMap.get(row.id) || {};
        const topEmojis = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([emoji]) => emoji);

        const totalReactions = Object.values(counts).reduce((sum, count) => sum + count, 0);

        // Extract user reaction from joined data
        const userReaction = row.my_reaction && row.my_reaction.length > 0 
          ? row.my_reaction[0].emoji 
          : null;

        return {
          id: row.id,
          user_id: row.user_id,
          post_type: row.post_type,
          content: row.content,
          status: row.status,
          created_at: row.created_at,
          updated_at: row.updated_at,
          user: row.user || { emoji: '😶', username: 'Anonymous' },
          tags: (row.post_tags || []).map((pt: any) => pt.tag).filter(Boolean),
          reaction_count: totalReactions,
          reaction_counts: counts,
          comment_count: row.comment_count || 0,
          user_reaction: userReaction,
          top_reactions: topEmojis,
        };
      });
    } catch (err: any) {
      console.error('API Critical Error in getPosts:', err);
      throw err;
    }
  },

  /**
   * Create a new post with tags.
   */
  async createPost(params: {
    content: string;
    postType: PostType;
    tagIds: string[];
  }): Promise<Post> {
    console.log('API: Creating post', params);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 1. Insert the post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        post_type: params.postType,
        content: params.content,
        status: 'published',
      })
      .select('*')
      .single();

    if (postError) {
      console.error('API Error: creating post:', postError);
      throw new Error(postError.message);
    }

    // 2. Insert post_tags junction rows
    if (params.tagIds.length > 0) {
      const tagRows = params.tagIds.map((tagId) => ({
        post_id: post.id,
        tag_id: tagId,
      }));

      const { error: tagError } = await supabase
        .from('post_tags')
        .insert(tagRows);

      if (tagError) {
        console.error('API Error: inserting post tags:', tagError);
        // Non-fatal: post was created, tags just failed
      }
    }

    const { data: profile } = await supabase
      .from('public_users')
      .select('emoji, username')
      .eq('id', user.id)
      .single();

    return {
      ...post,
      user: profile || { emoji: '😶', username: 'Anonymous' },
      tags: [],
      reaction_count: 0,
      comment_count: 0,
      user_reaction: null,
      top_reactions: [],
    };
  },

  /**
   * Delete a post (soft delete - sets status to 'deleted').
   */
  async deletePost(postId: string): Promise<void> {
    console.log('API: Soft deleting post', postId);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('posts')
      .update({ status: 'deleted', updated_at: new Date().toISOString() })
      .eq('id', postId)
      .eq('user_id', user.id); // Extra safety, RLS handles this too

    if (error) {
      console.error('API Error: soft deleting post:', error);
      throw new Error(error.message);
    }
  },

  /**
   * Update a post's content.
   */
  async updatePost(params: { postId: string; content: string }): Promise<void> {
    console.log('API: Updating post', params.postId);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('posts')
      .update({ content: params.content, updated_at: new Date().toISOString() })
      .eq('id', params.postId)
      .eq('user_id', user.id);

    if (error) {
      console.error('API Error: updating post:', error);
      throw new Error(error.message);
    }
  },

  /**
   * Fetch all available tags.
   */
  async getTags(): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('id, name, count')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching tags:', error);
      throw new Error(error.message);
    }

    return data || [];
  },

  /**
   * Add a comment to a post.
   */
  async addComment(params: {
    postId: string;
    content: string;
    parentCommentId?: string;
  }): Promise<Comment> {
    console.log('API: Adding comment', params);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: params.postId,
        user_id: user.id,
        content: params.content,
        parent_comment_id: params.parentCommentId || null,
        status: 'active'
      })
      .select(`
        *,
        user:public_users ( emoji, username )
      `)
      .single();

    if (error) {
      console.error('API Error: adding comment:', error);
      throw new Error(error.message);
    }
    return data;
  },

  /**
   * Fetch comments for a post with engagement data.
   */
  async getComments(postId: string): Promise<any[]> {
    console.log('API: Fetching comments for post', postId);
    const { data: { user: authUser } } = await supabase.auth.getUser();

    // 1. Fetch comments with joined data
    const { data: comments, error } = await supabase
      .from('post_comments')
      .select('*, user:public_users ( emoji, username ), my_reaction:reactions!comment_id(emoji)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    // Filter the joined reaction to only the current user
    if (authUser) {
      // Note: We can't easily filter the join with .eq() on the main query for comments 
      // if we want to fetch all comments. PostgREST filtering on joins is best done 
      // in the select string or using !inner if we want to filter the top level.
      // Since we want ALL comments, we use the select string filter if supported 
      // or keep the current approach but simplify it.
    }

    if (error) {
      console.error('API Error: fetching comments:', error);
      throw error;
    }

    if (!comments || comments.length === 0) return [];

    const commentIds = comments.map(c => c.id);

    // 2. Fetch reaction counts from the view
    const { data: countsRes } = await supabase
      .from('comment_reaction_counts')
      .select('comment_id, emoji, count')
      .in('comment_id', commentIds);

    const commentReactionsMap = new Map<string, Record<string, number>>();
    (countsRes || []).forEach((r: any) => {
      const cId = r.comment_id;
      if (!commentReactionsMap.has(cId)) {
        commentReactionsMap.set(cId, {});
      }
      commentReactionsMap.get(cId)![r.emoji] = r.count;
    });

    // 3. Merge data
    return comments.map(c => {
      const reactionCounts = commentReactionsMap.get(c.id) || {};
      const topEmojis = Object.entries(reactionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([emoji]) => emoji);

      const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);

      // Extract user reaction from joined data
      const userReaction = c.my_reaction && c.my_reaction.length > 0 
        ? c.my_reaction[0].emoji 
        : null;

      return {
        ...c,
        reaction_count: totalReactions,
        reaction_counts: reactionCounts,
        user_reaction: userReaction,
        top_reactions: topEmojis
      };
    });
  },

  /**
   * Toggle a reaction on a post or comment.
   */
  async toggleReaction(params: {
    postId?: string;
    commentId?: string;
    emoji: string;
  }): Promise<void> {
    console.log('API: Toggling reaction', params);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const targetField = params.postId ? 'post_id' : 'comment_id';
    const targetValue = params.postId || params.commentId;

    // 1. Check if user already reacted with THIS emoji
    const { data: existing, error: fetchError } = await supabase
      .from('reactions')
      .select('id')
      .eq('user_id', user.id)
      .eq(targetField, targetValue)
      .eq('emoji', params.emoji)
      .maybeSingle();

    if (fetchError) {
      console.error('API Error: fetching existing reaction:', fetchError);
    }

    if (existing) {
      console.log('API: Removing existing reaction', existing.id);
      // Remove it
      const { error: deleteError } = await supabase.from('reactions').delete().eq('id', existing.id);
      if (deleteError) console.error('API Error: deleting reaction:', deleteError);
    } else {
      // 2. Check if user reacted with ANY emoji
      const { data: anyExisting } = await supabase
        .from('reactions')
        .select('id')
        .eq('user_id', user.id)
        .eq(targetField, targetValue)
        .maybeSingle();

      if (anyExisting) {
        console.log('API: Updating reaction emoji to', params.emoji);
        // Update it
        const { error: updateError } = await supabase
          .from('reactions')
          .update({ emoji: params.emoji })
          .eq('id', anyExisting.id);
        if (updateError) console.error('API Error: updating reaction:', updateError);
      } else {
        console.log('API: Inserting new reaction', params.emoji);
        // Add new
        const { error: insertError } = await supabase
          .from('reactions')
          .insert({
            user_id: user.id,
            [targetField]: targetValue,
            emoji: params.emoji
          });
        if (insertError) console.error('API Error: inserting reaction:', insertError);
      }
    }
  },

  /**
   * Update a comment's content.
   */
  async updateComment(params: {
    commentId: string;
    content: string;
  }): Promise<void> {
    console.log('API: Updating comment', params.commentId);
    const { error } = await supabase
      .from('post_comments')
      .update({ 
        content: params.content,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.commentId);

    if (error) {
      console.error('API Error: updating comment:', error);
      throw error;
    }
  },
};
