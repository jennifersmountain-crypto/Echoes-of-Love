'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase, Message, Profile } from '@/lib/supabase';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, profile:profiles(*)')
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // For demo purposes, we'll use a placeholder user ID
    // In production, this would come from Supabase auth
    const userId = localStorage.getItem('userId') || 'anonymous-user';
    const name = displayName || 'Anonymous Friend';

    try {
      const { error } = await supabase.from('messages').insert({
        user_id: userId,
        content: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-cloud-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image src="/assets/logo.png" alt="Echoes of Love" fill className="object-contain" />
              </div>
              <span className="text-xl font-serif text-deep-slate hidden sm:block">Echoes of Love</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Chat Header */}
      <div className="bg-soft-gold text-cloud-white py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-serif mb-2">Community Chat</h1>
          <p className="text-cloud-white/80 text-sm">
            Share your thoughts, stories, and support with others who understand.
          </p>
        </div>
      </div>

      {/* Rules Banner */}
      <div className="bg-sky-blue/50 py-3 px-4 border-b border-warm-grey/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-deep-slate text-sm">
            <span className="font-medium text-soft-gold">Remember:</span> No judgment. No politics. This is a place of love.
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-ivory">
          {isLoading ? (
            <div className="text-center py-8 text-warm-grey">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="relative w-16 h-16 mx-auto mb-4 opacity-50">
                <Image src="/assets/icon-chat.png" alt="Chat" fill className="object-contain" />
              </div>
              <p className="text-warm-grey">No messages yet. Be the first to share.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="bg-cloud-white rounded-xl p-4 shadow-sm max-w-[85%]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-soft-gold/20 flex items-center justify-center">
                    <span className="text-soft-gold font-medium text-sm">
                      {(msg.profile?.display_name || 'Anonymous')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-deep-slate text-sm">
                      {msg.profile?.display_name || 'Anonymous Friend'}
                    </p>
                    <p className="text-xs text-warm-grey">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-deep-slate/90">{msg.content}</p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-cloud-white border-t border-warm-grey/20 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-4 py-2 rounded-lg border border-warm-grey/30 focus:outline-none focus:border-soft-gold bg-ivory"
            />
            <div className="flex gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share something with the community..."
                className="flex-1 px-4 py-3 rounded-lg border border-warm-grey/30 focus:outline-none focus:border-soft-gold bg-ivory resize-none"
                rows={2}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-6 py-3 bg-soft-gold text-cloud-white rounded-lg font-medium hover:bg-[#b8962e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}