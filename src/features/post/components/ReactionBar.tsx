import React from 'react';
import { motion } from 'framer-motion';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { ReactionBarProps } from '../types';

// Curated list of high-quality Apple-style emojis from reference code
const CURATED_REACTIONS = [
  { id: "1f601", names: ["grinning"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f601.png" },
  { id: "1f606", names: ["laughing"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f606.png" },
  { id: "1f60d", names: ["heart_eyes"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60d.png" },
  { id: "1f970", names: ["smiling_hearts"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f970.png" },
  { id: "1f608", names: ["horns"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f608.png" },
  { id: "1f914", names: ["thinking"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f914.png" },
  { id: "1f92f", names: ["mind_blown"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f92f.png" },
  { id: "1f631", names: ["scared"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f631.png" },
  { id: "1f92c", names: ["swearing"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f92c.png" },
  { id: "1f621", names: ["angry"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f621.png" },
  { id: "1f622", names: ["crying"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f622.png" },
  { id: "1f44d", names: ["thumbs_up"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44d.png" },
  { id: "1f44e", names: ["thumbs_down"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44e.png" },
  { id: "1f44f", names: ["clapping"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44f.png" },
  { id: "2764-fe0f", names: ["heart"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2764-fe0f.png" },
  { id: "1f494", names: ["broken_heart"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f494.png" },
  { id: "1f525", names: ["fire"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f525.png" },
  { id: "1f389", names: ["party"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f389.png" },
  { id: "1f47b", names: ["ghost"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f47b.png" },
  { id: "1f648", names: ["see_no_evil"], imgUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f648.png" },
];

export function ReactionBar({ onReact, onClose, position }: ReactionBarProps) {
  return (
    <div className={`absolute ${position}-full left-0 mb-3 z-[1000]`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[-1]" 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="relative shadow-2xl rounded-2xl overflow-hidden border border-white/60 bg-white/95 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <EmojiPicker
          theme={Theme.LIGHT}
          onEmojiClick={(emojiData) => {
            // If it's a custom emoji, emojiData.emoji might be different, 
            // but emoji-picker-react handles custom emoji click by returning the emoji symbol if available
            // or we might need to handle the name/id.
            onReact(emojiData.emoji);
            onClose();
          }}
          autoFocusSearch={false}
          reactionsDefaultOpen={true}
          searchDisabled={true}
          skinTonesDisabled={true}
          previewConfig={{ showPreview: false }}
          height={320}
          width={300}
          customEmojis={CURATED_REACTIONS}
          categories={[
            {
              category: 'custom' as any,
              name: 'Reactions'
            }
          ]}
        />
      </motion.div>
    </div>
  );
}
