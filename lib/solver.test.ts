import assert from 'node:assert/strict';
import test from 'node:test';
import { createBoard, mulberry32 } from './board.ts';
import { aliveCount, findMove, hasAnyMove } from './solver.ts';
import { sumRect } from './selection.ts';
import { BOARD, TARGET, type Cell } from './types.ts';

/** 누적합을 쓰지 않는 독립 계산. solver 가 틀리면 여기서 걸린다. */
function bruteSum(cells: Cell[], r0: number, c0: number, r1: number, c1: number): number {
  let s = 0;
  for (let r = r0; r <= r1; r += 1) {
    for (let c = c0; c <= c1; c += 1) {
      const cell = cells[r * BOARD.cols + c];
      if (!cell.removed) s += cell.value;
    }
  }
  return s;
}

function bruteHasMove(cells: Cell[]): boolean {
  for (let r0 = 0; r0 < BOARD.rows; r0 += 1)
    for (let r1 = r0; r1 < BOARD.rows; r1 += 1)
      for (let c0 = 0; c0 < BOARD.cols; c0 += 1)
        for (let c1 = c0; c1 < BOARD.cols; c1 += 1)
          if (bruteSum(cells, r0, c0, r1, c1) === TARGET) return true;
  return false;
}

test('힌트가 가리키는 직사각형의 합은 언제나 정확히 10이다', () => {
  for (let seed = 1; seed <= 60; seed += 1) {
    const rnd = mulberry32(seed * 7919);
    const cells = createBoard(seed);

    // 판이 비어갈 때까지 지워가며 매 단계 힌트를 검증한다
    for (let step = 0; step < 40; step += 1) {
      const rect = findMove(cells);
      if (!rect) {
        assert.equal(bruteHasMove(cells), false, `seed ${seed}: 수가 남았는데 못 찾았다`);
        break;
      }
      const s = bruteSum(cells, rect.r0, rect.c0, rect.r1, rect.c1);
      assert.equal(s, TARGET, `seed ${seed} step ${step}: 힌트 합이 ${s}`);
      assert.equal(sumRect(cells, rect), TARGET);

      // 힌트대로 지우거나, 사람처럼 다른 수를 두거나
      const useHint = rnd() < 0.5;
      const target = useHint ? rect : (findMove(cells) ?? rect);
      for (let r = target.r0; r <= target.r1; r += 1)
        for (let c = target.c0; c <= target.c1; c += 1)
          cells[r * BOARD.cols + c].removed = true;
    }
  }
});

test('hasAnyMove 는 완전탐색과 항상 같은 답을 낸다', () => {
  for (let seed = 1; seed <= 30; seed += 1) {
    const rnd = mulberry32(seed * 104729);
    const cells = createBoard(seed);
    // 무작위로 절반쯤 지운 뒤 비교 (빈칸이 섞인 상태가 진짜 위험 구간)
    for (const cell of cells) if (rnd() < 0.5) cell.removed = true;
    assert.equal(hasAnyMove(cells), bruteHasMove(cells), `seed ${seed}`);
  }
});

test('빈칸은 합계에 0으로 기여한다', () => {
  const cells = createBoard(42);
  const before = sumRect(cells, { r0: 0, c0: 0, r1: 1, c1: 1 });
  const removedValue = cells[0].value;
  cells[0].removed = true;
  assert.equal(sumRect(cells, { r0: 0, c0: 0, r1: 1, c1: 1 }), before - removedValue);
});

test('새 판은 사과 112개, 전체 합이 10의 배수다', () => {
  for (let seed = 1; seed <= 20; seed += 1) {
    const cells = createBoard(seed);
    assert.equal(cells.length, 112);
    assert.equal(aliveCount(cells), 112);
    const total = cells.reduce((a, c) => a + c.value, 0);
    assert.equal(total % 10, 0, `seed ${seed}: 총합 ${total}`);
    assert.ok(cells.every((c) => c.value >= 1 && c.value <= 9));
  }
});
