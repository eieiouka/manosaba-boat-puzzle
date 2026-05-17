import { useRef } from "react";

export function useBgm(src, volume = 0.45) {
  const audioContextRef = useRef(null);
  const bgmBufferRef = useRef(null);
  const bgmSourceRef = useRef(null);
  const bgmGainRef = useRef(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      audioContextRef.current = new AudioContextClass();
    }

    return audioContextRef.current;
  };

  const loadBgmBuffer = async (audioContext) => {
    if (bgmBufferRef.current) {
      return bgmBufferRef.current;
    }

    const response = await fetch(src);

    if (!response.ok) {
      throw new Error("BGMファイルを読み込めませんでした。");
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    bgmBufferRef.current = audioBuffer;

    return audioBuffer;
  };

  const playBgm = async () => {
    const audioContext = getAudioContext();

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    if (bgmSourceRef.current) {
      return;
    }

    const bgmBuffer = await loadBgmBuffer(audioContext);

    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();

    source.buffer = bgmBuffer;
    source.loop = true;

    gain.gain.value = volume;

    source.connect(gain);
    gain.connect(audioContext.destination);

    source.start(0);

    bgmSourceRef.current = source;
    bgmGainRef.current = gain;

    source.onended = () => {
      bgmSourceRef.current = null;
      bgmGainRef.current = null;
    };
  };

  const stopBgm = () => {
    if (bgmSourceRef.current) {
      bgmSourceRef.current.stop();
      bgmSourceRef.current = null;
      bgmGainRef.current = null;
    }
  };

  const setBgmVolume = (nextVolume) => {
    if (bgmGainRef.current) {
      bgmGainRef.current.gain.value = nextVolume;
    }
  };

  return {
    playBgm,
    stopBgm,
    setBgmVolume,
  };
}