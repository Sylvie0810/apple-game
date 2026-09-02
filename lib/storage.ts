import type { Best, Mode } from './types';

const BEST_KEY = 'apple-game.best.v1';
const MODE_KEY = 'apple-game.mode.v1';

export const EMPTY_BEST: Best = { timed: 0, endless: 0 };

export function loadBest(): Best {
  if (typeof window === 'undefined') return EMPTY_BEST;
  try {
    const raw = window.localStorage.getItem(BEST_KEY);
    if (!raw) return EMPTY_BEST;
    const parsed = JSON.parse(raw) as Partial<Best>;
    return {
      timed: Number(parsed.timed) || 0,
      endless: Number(parsed.endless) || 0,
    };
  } catch {
    return EMPTY_BEST;
  }
}

export function saveBest(best: Best): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(BEST_KEY, JSON.stringify(best));
  } catch {
    /* 사파리 프라이빗 모드 등 — 저장 실패는 게임을 막지 않는다 */
  }
}

export function loadMode(): Mode {
  if (typeof window === 'undefined') return 'timed';
  return window.localStorage.getItem(MODE_KEY) === 'endless' ? 'endless' : 'timed';
}

export function saveMode(mode: Mode): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MODE_KEY, mode);
  } catch {
    /* noop */
  }
}
