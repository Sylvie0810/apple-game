import { BOARD, type Cell, type Rect } from './types.ts';

export type Point = { x: number; y: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * 보드 기준 좌표 두 점 → 격자 인덱스 직사각형.
 * 픽셀이 아니라 격자로 다루면 판정이 흔들리지 않는다.
 */
export function toRect(a: Point, b: Point, boardW: number, boardH: number): Rect {
  const cellW = boardW / BOARD.cols;
  const cellH = boardH / BOARD.rows;
  const left = Math.min(a.x, b.x);
  const right = Math.max(a.x, b.x);
  const top = Math.min(a.y, b.y);
  const bottom = Math.max(a.y, b.y);
  return {
    c0: clamp(Math.floor(left / cellW), 0, BOARD.cols - 1),
    c1: clamp(Math.floor(right / cellW), 0, BOARD.cols - 1),
    r0: clamp(Math.floor(top / cellH), 0, BOARD.rows - 1),
    r1: clamp(Math.floor(bottom / cellH), 0, BOARD.rows - 1),
  };
}

export function inRect(rect: Rect, row: number, col: number): boolean {
  return row >= rect.r0 && row <= rect.r1 && col >= rect.c0 && col <= rect.c1;
}

/** 빈칸은 0으로 기여한다 = 그냥 건너뛴다. */
export function sumRect(cells: Cell[], rect: Rect): number {
  let s = 0;
  for (let r = rect.r0; r <= rect.r1; r += 1) {
    for (let c = rect.c0; c <= rect.c1; c += 1) {
      const cell = cells[r * BOARD.cols + c];
      if (!cell.removed) s += cell.value;
    }
  }
  return s;
}

export function idsInRect(cells: Cell[], rect: Rect): string[] {
  const ids: string[] = [];
  for (let r = rect.r0; r <= rect.r1; r += 1) {
    for (let c = rect.c0; c <= rect.c1; c += 1) {
      const cell = cells[r * BOARD.cols + c];
      if (!cell.removed) ids.push(cell.id);
    }
  }
  return ids;
}
