'use client';

import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isMusicReady, setIsMusicReady] = useState(false);
  const [musicUserPaused, setMusicUserPaused] = useState(false);
  const musicRef = useRef(null);
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio('/assets/audio/hero-we-need-epic-cinematic.mp3');
    audio.loop = true;
    audio.volume = 0.35;
    musicRef.current = audio;
    setIsMusicReady(true);

    // Try to autoplay on first user interaction
    const startOnInteraction = () => {
      if (!hasInteractedRef.current && musicRef.current && !musicUserPaused) {
        hasInteractedRef.current = true;
        musicRef.current.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(() => {});
      }
      // Remove after first trigger
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
      document.removeEventListener('scroll', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
    };

    document.addEventListener('click', startOnInteraction);
    document.addEventListener('touchstart', startOnInteraction);
    document.addEventListener('scroll', startOnInteraction);
    document.addEventListener('keydown', startOnInteraction);

    return () => {
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
      document.removeEventListener('scroll', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
    };
  }, []);

  const playMusic = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.play().then(() => {
        setIsMusicPlaying(true);
        setMusicUserPaused(false);
      }).catch(() => {});
    }
  }, []);

  const pauseMusic = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.pause();
      setIsMusicPlaying(false);
    }
  }, []);

  const toggleMusic = useCallback(() => {
    if (isMusicPlaying) {
      pauseMusic();
      setMusicUserPaused(true);
    } else {
      playMusic();
      setMusicUserPaused(false);
      hasInteractedRef.current = true;
    }
  }, [isMusicPlaying, pauseMusic, playMusic]);

  // Called when voice starts — pause music temporarily
  const pauseMusicForVoice = useCallback(() => {
    if (musicRef.current && isMusicPlaying) {
      musicRef.current.pause();
      setIsMusicPlaying(false);
    }
  }, [isMusicPlaying]);

  // Called when voice stops — resume music if user hasn't manually paused
  const resumeMusicAfterVoice = useCallback(() => {
    if (musicRef.current && !musicUserPaused) {
      musicRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(() => {});
    }
  }, [musicUserPaused]);

  return (
    <MusicContext.Provider value={{
      isMusicPlaying,
      isMusicReady,
      toggleMusic,
      playMusic,
      pauseMusic,
      pauseMusicForVoice,
      resumeMusicAfterVoice,
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}
