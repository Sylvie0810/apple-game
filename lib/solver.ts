import { BOARD, TARGET, type Cell, type Rect } from './types';

/**
 * 2D 누적합. removed 셀은 0으로 친다.
 * ps[(r+1)*(cols+1) + (c+1)] = (0,0)~(r,c) 직사각형 합
 */
export function buildPrefixSum(cells: Cell[]): Int32Array {
  const { cols, rows } = BOARD;
  const w = cols + 1;
  const ps = new Int32Array(w * (rows + 1));
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const cell = cells[r * cols + c];
      const v = cell.removed ? 0 : cell.value;
      ps[(r + 1) * w + (c + 1)] =
        v + ps[r * w + (c + 1)] + ps[(r + 1) * w + c] - ps[r * w + c];
    }
  }
  return ps;
}

export function rectSum(ps: Int32Array, rect: Rect): number {
  const w = BOARD.cols + 1;
  const { r0, c0, r1, c1 } = rect;
  return (
    ps[(r1 + 1) * w + (c1 + 1)] -
    ps[r0 * w + (c1 + 1)] -
    ps[(r1 + 1) * w + c0] +
    ps[r0 * w + c0]
  );
}

/** 합이 정확히 10인 직사각형이 하나라도 남았는가. 약 3,780회 O(1) 조회. */
export function hasAnyMove(cells: Cell[]): boolean {
  const ps = buildPrefixSum(cells);
  const { cols, rows } = BOARD;
  for (let r0 = 0; r0 < rows; r0 += 1) {
    for (let r1 = r0; r1 < rows; r1 += 1) {
      for (let c0 = 0; c0 < cols; c0 += 1) {
        for (let c1 = c0; c1 < cols; c1 += 1) {
          const s = rectSum(ps, { r0, c0, r1, c1 });
          if (s === TARGET) return true;
          if (s > TARGET) break; // 오른쪽으로 넓히면 더 커지기만 한다
        }
      }
    }
  }
  return false;
}

/** 합이 10인 직사각형 하나를 고른다. 여러 개면 그중 무작위. */
export function findMove(cells: Cell[]): Rect | null {
  const ps = buildPrefixSum(cells);
  const { cols, rows } = BOARD;
  const found: Rect[] = [];
  for (let r0 = 0; r0 < rows; r0 += 1) {
    for (let r1 = r0; r1 < rows; r1 += 1) {
      for (let c0 = 0; c0 < cols; c0 += 1) {
        for (let c1 = c0; c1 < cols; c1 += 1) {
          const s = rectSum(ps, { r0, c0, r1, c1 });
          if (s === TARGET) found.push({ r0, c0, r1, c1 });
          if (s > TARGET) break;
        }
      }
    }
  }
  if (found.length === 0) return null;
  return found[Math.floor(Math.random() * found.length)];
}

export function aliveCount(cells: Cell[]): number {
  let n = 0;
  for (const c of cells) if (!c.removed) n += 1;
  return n;
}
