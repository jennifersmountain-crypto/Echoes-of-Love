'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase, Voicemail } from '@/lib/supabase';

export default function VoicemailPage() {
  const [voicemails, setVoicemails] = useState<Voicemail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchVoicemails();
  }, []);

  const fetchVoicemails = async () => {
    try {
      const { data, error } = await supabase
        .from('voicemails')
        .select('*, profile:profiles(*)')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setVoicemails(data || []);
    } catch (error) {
      console.error('Error fetching voicemails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        
        try {
          const userId = localStorage.getItem('userId') || 'anonymous-user';
          
          const { error } = await supabase.from('voicemails').insert({
            user_id: userId,
            url: url,
            is_public: isPublic,
          });

          if (error) throw error;
          
          if (isPublic) {
            fetchVoicemails();
          }
        } catch (error) {
          console.error('Error saving voicemail:', error);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playVoicemail = (voicemail: Voicemail) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = new Audio(voicemail.url);
    audioRef.current = audio;
    setCurrentlyPlaying(voicemail.id);
    
    audio.onended = () => {
      setCurrentlyPlaying(null);
    };
    
    audio.play();
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentlyPlaying(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

      {/* Voicemail Header */}
      <div className="bg-soft-gold text-cloud-white py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-serif mb-2">Voicemails for the Heart</h1>
          <p className="text-cloud-white/80 text-sm">
            Record a message for someone you've lost. Share it with the community or keep it private.
          </p>
        </div>
      </div>

      {/* Recording Section */}
      <div className="bg-cloud-white border-b border-warm-grey/20 py-8 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-ivory rounded-2xl p-6 text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image src="/assets/icon-voicemail.png" alt="Voicemail" fill className="object-contain" />
            </div>
            
            <h3 className="font-serif text-xl text-deep-slate mb-2">
              {isRecording ? 'Recording...' : 'Leave a Voicemail'}
            </h3>
            
            {isRecording && (
              <p className="text-2xl font-mono text-soft-gold mb-4">
                {formatTime(recordingTime)}
              </p>
            )}
            
            <div className="flex justify-center gap-4 mb-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-16 h-16 rounded-full bg-soft-gold text-cloud-white flex items-center justify-center hover:bg-[#b8962e] transition-colors shadow-lg"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-16 h-16 rounded-full bg-red-500 text-cloud-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg animate-pulse"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-2">
              <input
                type="checkbox"
                id="public-toggle"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 accent-soft-gold"
              />
              <label htmlFor="public-toggle" className="text-sm text-deep-slate">
                {isPublic ? 'This voicemail will be shared publicly' : 'Keep this voicemail private'}
              </label>
            </div>
            
            {!isPublic && (
              <p className="text-xs text-warm-grey mt-2">
                Private voicemails are saved but not visible to others.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Public Voicemails Section */}
      <div className="flex-1 bg-ivory py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-xl text-deep-slate mb-6">Voicemails from the Community</h2>
          
          {isLoading ? (
            <div className="text-center py-8 text-warm-grey">Loading voicemails...</div>
          ) : voicemails.length === 0 ? (
            <div className="text-center py-8 bg-cloud-white rounded-xl">
              <div className="relative w-16 h-16 mx-auto mb-4 opacity-50">
                <Image src="/assets/icon-voicemail.png" alt="Voicemail" fill className="object-contain" />
              </div>
              <p className="text-warm-grey">No voicemails yet.</p>
              <p className="text-sm text-warm-grey/70">Be the first to share a message.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {voicemails.map((voicemail) => (
                <div key={voicemail.id} className="bg-cloud-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => currentlyPlaying === voicemail.id ? stopPlayback() : playVoicemail(voicemail)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        currentlyPlaying === voicemail.id 
                          ? 'bg-soft-gold text-cloud-white' 
                          : 'bg-sky-blue text-soft-gold hover:bg-soft-gold hover:text-cloud-white'
                      }`}
                    >
                      {currentlyPlaying === voicemail.id ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <p className="font-medium text-deep-slate">
                        {voicemail.profile?.display_name || 'Anonymous Friend'}
                      </p>
                      <p className="text-xs text-warm-grey">
                        {new Date(voicemail.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {currentlyPlaying === voicemail.id && (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-soft-gold rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                        <span className="w-2 h-2 bg-soft-gold rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                        <span className="w-2 h-2 bg-soft-gold rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cleanup Notice */}
      <div className="bg-sky-blue/30 py-4 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-warm-grey">
            Voicemails are automatically removed after 30 days to keep the space fresh and meaningful.
          </p>
        </div>
      </div>
    </div>
  );
}