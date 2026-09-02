'use client';

import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { TIMED_MS, type Mode } from '@/lib/types';

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

type Props = {
  mode: Mode;
  running: boolean;
  /** 게임오버 화면이 읽어갈 현재 시각(ms). 리렌더 없이 공유한다. */
  clockRef: MutableRefObject<number>;
  runId: number;
  onTimeUp: () => void;
};

/**
 * 타이머는 자기 상태만 갱신한다.
 * 부모에 매초 알리면 사과 112개가 통째로 다시 그려지므로 그렇게 하지 않는다.
 */
export default function Timer({ mode, running, clockRef, runId, onTimeUp }: Props) {
  const [ms, setMs] = useState(mode === 'timed' ? TIMED_MS : 0);
  const firedRef = useRef(false);

  useEffect(() => {
    const start = mode === 'timed' ? TIMED_MS : 0;
    firedRef.current = false;
    clockRef.current = start;
    setMs(start);
  }, [runId, mode, clockRef]);

  useEffect(() => {
    if (!running) return;
    const startedAt = performance.now();
    const base = clockRef.current;
    const id = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const next = mode === 'timed' ? Math.max(0, base - elapsed) : base + elapsed;
      clockRef.current = next;
      setMs(next);
      if (mode === 'timed' && next <= 0 && !firedRef.current) {
        firedRef.current = true;
        onTimeUp();
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [running, mode, runId, clockRef, onTimeUp]);

  return <>{formatClock(ms)}</>;
}
