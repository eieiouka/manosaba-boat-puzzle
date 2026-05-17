import { useRef } from "react";

export function useVoice(volume = 1) {
  const audioContextRef = useRef(null);
  const gainRef = useRef(null);
  const bufferCacheRef = useRef(new Map());

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      audioContextRef.current = new AudioContextClass();

      const gain = audioContextRef.current.createGain();

      gain.gain.value = volume;
      gain.connect(audioContextRef.current.destination);

      gainRef.current = gain;
    }

    return audioContextRef.current;
  };

  const loadBuffer = async (src, audioContext) => {
    if (bufferCacheRef.current.has(src)) {
      return bufferCacheRef.current.get(src);
    }

    const response = await fetch(src);

    if (!response.ok) {
      throw new Error(`音声ファイルを読み込めませんでした: ${src}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    bufferCacheRef.current.set(src, audioBuffer);

    return audioBuffer;
  };

  const playVoice = async (src) => {
    try {
      const audioContext = getAudioContext();

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const audioBuffer = await loadBuffer(src, audioContext);

      const source = audioContext.createBufferSource();

      source.buffer = audioBuffer;
      source.connect(gainRef.current);
      source.start(0);
    } catch (e) {
      console.error("ボイス再生に失敗しました", e);
    }
  };

  return {
    playVoice,
  };
}