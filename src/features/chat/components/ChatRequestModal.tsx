import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, XCircle, UserPlus } from 'lucide-react';
import type { PendingChatRequest } from '../types';

interface ChatRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: PendingChatRequest[];
  onAccept: (chatId: string) => void;
  onDecline: (chatId: string) => void;
  isPending: boolean;
}

export function ChatRequestModal({
  isOpen,
  onClose,
  requests,
  onAccept,
  onDecline,
  isPending,
}: ChatRequestModalProps) {
  // Separate incoming and outgoing requests
  const incomingRequests = requests.filter((r) => r.isIncoming);
  const outgoingRequests = requests.filter((r) => !r.isIncoming);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Chat Requests</h2>
                  <p className="text-sm text-slate-500">
                    {incomingRequests.length > 0
                      ? `${incomingRequests.length} pending request${incomingRequests.length !== 1 ? 's' : ''}`
                      : 'Manage your chat requests'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[60vh] p-4 space-y-4">
                {/* Incoming Requests */}
                {incomingRequests.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
                      Incoming Requests
                    </h3>
                    <div className="space-y-2">
                      {incomingRequests.map((request) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-pink-50/50 border border-pink-100 rounded-2xl p-4"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-white border border-pink-200 flex items-center justify-center text-2xl shadow-sm">
                              {request.requester.emoji}
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">
                                @{request.requester.username}
                              </h4>
                              <p className="text-xs text-slate-500">
                                wants to chat with you
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onAccept(request.id)}
                              disabled={isPending}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                            >
                              <Check size={16} />
                              Accept
                            </button>
                            <button
                              onClick={() => onDecline(request.id)}
                              disabled={isPending}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                            >
                              <XCircle size={16} />
                              Decline
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outgoing Requests */}
                {outgoingRequests.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
                      Waiting For Response
                    </h3>
                    <div className="space-y-2">
                      {outgoingRequests.map((request) => (
                        <div
                          key={request.id}
                          className="bg-slate-50 border border-slate-100 rounded-2xl p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-2xl">
                              {request.requester.emoji}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900">
                                @{request.requester.username}
                              </h4>
                              <p className="text-xs text-slate-500">
                                Request sent • Waiting for response...
                              </p>
                            </div>
                            <ClockIcon />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {requests.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <UserPlus size={28} className="text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium">No pending requests</p>
                    <p className="text-sm text-slate-400 mt-1">
                      When someone wants to chat, you'll see it here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ClockIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
      <svg
        className="w-4 h-4 text-amber-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}

export default ChatRequestModal;
