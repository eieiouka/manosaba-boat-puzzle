import { useRef } from "react";

export function useVoice(volume = 1) {
  const audioContextRef = useRef(null);
  const gainRef = useRef(null);
  const bufferCacheRef = useRef(new Map());
  const sourcesRef = useRef(new Set());
  const voiceGenerationRef = useRef(0);

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

  const unlockVoice = async () => {
    const audioContext = getAudioContext();

    if (audioContext.state !== "running") {
      await audioContext.resume();
    }

    const silentBuffer = audioContext.createBuffer(
      1,
      1,
      audioContext.sampleRate
    );

    const source = audioContext.createBufferSource();

    source.buffer = silentBuffer;
    source.connect(gainRef.current);
    source.start(0);
  };

  const loadBuffer = async (src, audioContext) => {
    if (bufferCacheRef.current.has(src)) {
      return bufferCacheRef.current.get(src);
    }

    const response = await fetch(src);

    if (!response.ok) {
      throw new Error(
        `音声ファイルを読み込めませんでした: ${src}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    const audioBuffer =
      await audioContext.decodeAudioData(arrayBuffer);

    bufferCacheRef.current.set(src, audioBuffer);

    return audioBuffer;
  };

  const stopAllVoices = () => {
    voiceGenerationRef.current += 1;

    sourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch (e) {
        // すでに停止済みなら無視
      }
    });

    sourcesRef.current.clear();
  };

  const playVoice = async (
    src,
    volumeMultiplier = 1
  ) => {
    const myGeneration =
      voiceGenerationRef.current;

    try {
      const audioContext = getAudioContext();

      if (audioContext.state !== "running") {
        await audioContext.resume();
      }

      const audioBuffer = await loadBuffer(
        src,
        audioContext
      );

      if (
        myGeneration !==
        voiceGenerationRef.current
      ) {
        return;
      }

      const source =
        audioContext.createBufferSource();

      source.buffer = audioBuffer;

      const localGain =
        audioContext.createGain();

      localGain.gain.value = volumeMultiplier;

      source.connect(localGain);
      localGain.connect(gainRef.current);

      sourcesRef.current.add(source);

      source.onended = () => {
        sourcesRef.current.delete(source);
      };

      source.start(0);
    } catch (e) {
      console.error("ボイス再生に失敗しました", e);
    }
  };

  return {
    playVoice,
    unlockVoice,
    stopAllVoices,
  };
}