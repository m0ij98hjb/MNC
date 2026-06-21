'use client';

import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicReady, setIsMusicReady] = useState(false);
  const [musicUserPaused, setMusicUserPaused] = useState(false);
  const musicRef = useRef(null);
  const wasMusicPlayingRef = useRef(false);
  const musicUserPausedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio('/assets/audio/divine-music.mp3');
    audio.loop = true;
    audio.volume = 0.35;
    musicRef.current = audio;
    setIsMusicReady(true);

    const onFirstInteraction = () => {
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('touchend', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
      if (!musicRef.current || musicUserPausedRef.current) return;
      musicRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    };

    audio.play().then(() => {
      setIsMusicPlaying(true);
    }).catch(() => {
      window.addEventListener('click', onFirstInteraction);
      window.addEventListener('touchstart', onFirstInteraction, { passive: true });
      window.addEventListener('touchend', onFirstInteraction, { passive: true });
      window.addEventListener('keydown', onFirstInteraction);
    });

    return () => {
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('touchend', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
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
      musicUserPausedRef.current = true;
      setMusicUserPaused(true);
    } else {
      playMusic();
      musicUserPausedRef.current = false;
      setMusicUserPaused(false);
    }
  }, [isMusicPlaying, pauseMusic, playMusic]);

  // Called when voice starts — pause music temporarily
  const pauseMusicForVoice = useCallback(() => {
    if (musicRef.current && isMusicPlaying) {
      wasMusicPlayingRef.current = true;
      musicRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      wasMusicPlayingRef.current = false;
    }
  }, [isMusicPlaying]);

  // Called when voice stops — resume only if music was playing before voice started
  const resumeMusicAfterVoice = useCallback(() => {
    if (musicRef.current && wasMusicPlayingRef.current && !musicUserPaused) {
      wasMusicPlayingRef.current = false;
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
