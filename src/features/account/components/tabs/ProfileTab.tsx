import React, { useState } from 'react';
import { Save, MapPin } from 'lucide-react';
import EmojiPicker, { EmojiClickData, Theme, Categories } from 'emoji-picker-react';
import { useAuthStore } from '@/features/auth/store';
import { useMutation } from '@tanstack/react-query';
import { accountApi } from '../../api';


export const ProfileTab: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  
  const updateProfileMutation = useMutation({
    mutationFn: (updates: { bio?: string; username?: string; emoji?: string }) => 
      accountApi.updateProfile(updates),
    onSuccess: (data) => {
      updateUser(data);
    },
  });

  const [success, setSuccess] = useState(false);

  // default values of the username parts
  const username = user?.username || '';
  const lastUnderScoreIndex = username.lastIndexOf('_'); // used split the emoji name by last underscore  in username

  const defaultEmojiName = username.slice(0, lastUnderScoreIndex);
  const defaultSuffix = username.slice(lastUnderScoreIndex + 1);

  const [emoji, setEmoji] = useState(user?.emoji || '');
  const [emojiName, setEmojiName] = useState(defaultEmojiName);
  const [suffix, setSuffix] = useState(defaultSuffix);
  const [bio, setBio] = useState(user?.bio || '');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setEmoji(emojiData.emoji);

    // Get the first name and clean it up (lowercase, replace spaces/dashes with nothing or underscores)
    const name = emojiData.names?.at(0)?.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || '';

    setEmojiName(name);
    setShowEmojiPicker(false);
  };

  const fullUsername = `${emojiName}_${suffix}`;

  const handleSave = async () => {
    if (suffix.length !== 5) {
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        emoji,
        username: fullUsername,
        bio,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-4">
      {/* Avatar + Header Card */}
      <div className="relative z-20 bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm p-5 md:p-6">
        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-5">
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-20 h-20 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-3xl hover:border-pink-400 transition-colors shadow-sm"
              disabled={updateProfileMutation.isPending}
            >
              {emoji}
            </button>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white">
              ✎
            </span>

            {showEmojiPicker && (
              <>
                <div
                  className="fixed inset-0 z-[100]"
                  onClick={() => setShowEmojiPicker(false)}
                />
                <div className="absolute top-full left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 mt-2 z-[101] shadow-2xl">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    autoFocusSearch={false}
                    searchDisabled={true}
                    theme={Theme.LIGHT}
                    lazyLoadEmojis={true}
                    skinTonesDisabled={true}
                    width={320}
                    height={400}
                    categories={[
                      {
                        category: Categories.ANIMALS_NATURE,
                        name: 'Animals & Nature'
                      },
                      {
                        category: Categories.FOOD_DRINK,
                        name: 'Food & Drink'
                      }
                    ]}
                    previewConfig={{
                      showPreview: false
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900">Profile Settings</h2>
            <p className="text-slate-500 text-sm">Update your public persona</p>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {updateProfileMutation.error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-sm">
          {(updateProfileMutation.error as Error).message}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-2 rounded-lg text-sm">
          Profile updated successfully!
        </div>
      )}

      {/* Form Card */}
      <div className="relative z-10 bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm p-5 md:p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Your Username</label>
          <div className="flex items-center w-full bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm focus-within:border-pink-400 focus-within:ring-1 focus-within:ring-pink-400 transition-all">
            <div className="bg-slate-50 px-4 py-2.5 text-slate-400 font-mono border-r border-slate-100 select-none">
              @{emojiName}_
            </div>
            <input
              type="text"
              value={suffix}
              onChange={(e) => {
                const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
                if (val.length > 0 && !/[A-Z]/.test(val[0])) return;
                if (val.length > 1 && !/^[0-9]+$/.test(val.slice(1))) return;
                setSuffix(val);
              }}
              className="flex-1 bg-transparent px-4 py-2.5 text-slate-900 font-mono focus:outline-none"
              placeholder="A0001"
              disabled={updateProfileMutation.isPending}
            />
          </div>
          <div className="px-1 flex justify-between items-center">
            <p className="text-[10px] text-slate-400 font-medium">
              Full: <span className="text-slate-600 font-mono">@{fullUsername}</span>
            </p>
            <p className="text-[10px] text-slate-400 font-medium italic">
              * Capital letter + 4 digits (e.g., A0001)
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700">Bio / Mood</label>
            <span className="text-xs text-slate-400">{bio.length}/120</span>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 120))}
            rows={3}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all resize-none shadow-sm"
            disabled={updateProfileMutation.isPending}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={updateProfileMutation.isPending}
          className="flex items-center gap-2 bg-[#D82B7D] hover:bg-[#C0266F] active:bg-[#A82161] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
        >
          {updateProfileMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};
