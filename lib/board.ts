import { BOARD, TOTAL_CELLS, type AppleValue, type Cell } from './types.ts';

/** 시드 고정 난수. 같은 시드 = 같은 판. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 1~9 가중치. 작은 수를 조금 더 자주 뽑는다.
 * 균등 분포면 큰 숫자만 남아 후반이 막힌다.
 */
const WEIGHTS = [14, 14, 14, 12, 12, 12, 10, 10, 10]; // 합 108
const WEIGHT_TOTAL = WEIGHTS.reduce((a, b) => a + b, 0);

function pickValue(rnd: () => number): AppleValue {
  let t = rnd() * WEIGHT_TOTAL;
  for (let i = 0; i < WEIGHTS.length; i += 1) {
    t -= WEIGHTS[i];
    if (t <= 0) return (i + 1) as AppleValue;
  }
  return 9;
}

/**
 * 전체 합을 10의 배수로 맞춘다 — "이론상 전부 지울 수 있는 판"에 가깝게.
 *
 * 한 칸에서 한 번에 빼면 안 된다. 남는 수가 9일 때 값 10짜리 사과가 없어
 * 영원히 못 맞춘다(실제로 seed 3 에서 총합 559 로 실패했다).
 * 그래서 여러 칸에서 1씩 나눠 뺀다.
 */
function normalizeTotal(cells: Cell[], rnd: () => number) {
  let need = cells.reduce((acc, c) => acc + c.value, 0) % 10;
  let guard = 0;
  while (need > 0 && guard < 5000) {
    guard += 1;
    const cell = cells[Math.floor(rnd() * cells.length)];
    if (cell.value > 1) {
      cell.value = (cell.value - 1) as AppleValue;
      need -= 1;
    }
  }
  return cells;
}

export function createBoard(seed: number): Cell[] {
  const rnd = mulberry32(seed);
  const cells: Cell[] = new Array(TOTAL_CELLS);
  for (let row = 0; row < BOARD.rows; row += 1) {
    for (let col = 0; col < BOARD.cols; col += 1) {
      cells[row * BOARD.cols + col] = {
        id: `r${row}c${col}`,
        row,
        col,
        value: pickValue(rnd),
        removed: false,
      };
    }
  }
  return normalizeTotal(cells, rnd);
}

export function newSeed(): number {
  return Math.floor(Math.random() * 0xffffffff);
}
