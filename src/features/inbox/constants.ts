import { InboxMessage } from './types';

export const MOCK_INBOX_MESSAGES: InboxMessage[] = [
  {
    id: 'i1',
    from: '🕵️ Anonymous',
    subject: 'Your Style',
    message: 'I saw you at the coffee shop today, your outfit was amazing! Especially that jacket.',
    createdAt: '2 hours ago',
    isRead: false
  },
  {
    id: 'i2',
    from: 'Someone nearby',
    subject: 'Liked your post',
    message: 'Hey, I really liked your recent confession about the barista. Totally relate to it, I have the same problem at my local cafe!',
    createdAt: '1 day ago',
    isRead: true,
    repliedAt: '1 day ago'
  },
  {
    id: 'i3',
    from: 'Secret Admirer',
    subject: 'Compliment',
    message: 'You have a great smile 😊 Just wanted to brighten your day a bit.',
    createdAt: '3 days ago',
    isRead: true
  },
  {
    id: 'i4',
    from: 'Night Owl',
    subject: 'Late night thoughts',
    message: 'Do you ever feel like the city is more alive at 3 AM than at 3 PM? Just wondering if anyone else is awake right now.',
    createdAt: '1 hour ago',
    isRead: false
  },
  {
    id: 'i5',
    from: 'Coffee Enthusiast',
    subject: 'Recommendation',
    message: 'If you like that shop, you should try the one on 5th street. Their cold brew is actually life-changing.',
    createdAt: '5 hours ago',
    isRead: false
  },
  {
    id: 'i6',
    from: 'A Friend',
    subject: 'Check-in',
    message: "Hey, hope your week is going well. You've seemed a bit busy lately!",
    createdAt: '2 days ago',
    isRead: true
  },
  {
    id: 'i7',
    from: 'Anonymous',
    subject: 'Quick question',
    message: 'What was the name of that song you were humming earlier? It sounded so familiar but I couldn\'t place it.',
    createdAt: '10 hours ago',
    isRead: false
  },
  {
    id: 'i8',
    from: 'Neighbor',
    subject: 'Plant advice',
    message: 'Your balcony garden looks amazing! What do you use for your succulents? Mine always seem to struggle.',
    createdAt: '4 days ago',
    isRead: true
  }];
