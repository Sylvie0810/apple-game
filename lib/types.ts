export const BOARD = { cols: 8, rows: 14 } as const;
export const TOTAL_CELLS = BOARD.cols * BOARD.rows;
export const TARGET = 10;
export const TIMED_MS = 120_000;

/** 한 판에 쓸 수 있는 힌트 횟수와, 한 번 볼 때마다 깎이는 점수 */
export const HINTS_PER_GAME = 3;
export const HINT_PENALTY = 3;

export type AppleValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Cell = {
  id: string;
  row: number;
  col: number;
  value: AppleValue;
  removed: boolean;
};

export type Rect = { r0: number; c0: number; r1: number; c1: number };

export type Mode = 'timed' | 'endless';
export type Phase = 'start' | 'playing' | 'over';
export type OverReason = 'timeup' | 'nomoves' | 'perfect';

export type Ghost = { id: string; row: number; col: number; value: AppleValue };

export type Best = { timed: number; endless: number };

export type GameState = {
  phase: Phase;
  mode: Mode;
  seed: number;
  cells: Cell[];
  score: number;
  selection: Rect | null;
  selectionSum: number;
  hintsLeft: number;
  hintRect: Rect | null;
  /** 방금 지워진 사과 — 제거 애니메이션용 잔상 */
  vanishing: Ghost[];
  lastGain: number;
  overReason: OverReason | null;
  newRecord: boolean;
  best: Best;
};
