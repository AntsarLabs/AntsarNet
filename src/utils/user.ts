export const getEmojiName = (emoji: string): string => {
  const names: Record<string, string> = {
    '🦊': 'Fox',
    '🦉': 'Owl',
    '🐯': 'Tiger',
    '🐻': 'Bear',
    '🐬': 'Dolphin',
    '🐺': 'Wolf',
    '🐱': 'Cat',
    '🦅': 'Eagle'
  };
  return names[emoji] || 'User';
};

export const getStableRandom = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const num = Math.abs(hash % 9989) + 1;
  return num.toString().padStart(4, '0');
};

export const getFullUsername = (emoji: string, friendId: string): string => {
  return `@${getEmojiName(emoji)}_${getStableRandom(friendId)}`;
};
