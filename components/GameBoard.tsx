'use client';

import { useCallback, useEffect, useRef } from 'react';
import Apple from './Apple';
import SelectionBox from './SelectionBox';
import styles from './GameBoard.module.css';
import { toRect, inRect, type Point } from '@/lib/selection';
import { BOARD, TARGET, type Cell, type Ghost, type Rect } from '@/lib/types';

type Props = {
  cells: Cell[];
  selection: Rect | null;
  selectionSum: number;
  ghosts: Ghost[];
  hintRect: Rect | null;
  onDragMove: (rect: Rect) => void;
  onDragEnd: () => void;
  onDragCancel: () => void;
  onGhostsDone: () => void;
  onHintDone: () => void;
};

export default function GameBoard({
  cells,
  selection,
  selectionSum,
  ghosts,
  hintRect,
  onDragMove,
  onDragEnd,
  onDragCancel,
  onGhostsDone,
  onHintDone,
}: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<DOMRect | null>(null);
  const startRef = useRef<Point | null>(null);
  const pendingRef = useRef<Point | null>(null);
  const rafRef = useRef<number | null>(null);
  const readyRef = useRef(false);

  const localPoint = (e: React.PointerEvent): Point | null => {
    const box = boxRef.current;
    if (!box) return null;
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };

  const flush = useCallback(() => {
    rafRef.current = null;
    const box = boxRef.current;
    const start = startRef.current;
    const now = pendingRef.current;
    if (!box || !start || !now) return;
    onDragMove(toRect(start, now, box.width, box.height));
  }, [onDragMove]);

  const handleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = boardRef.current;
    if (!el) return;
    boxRef.current = el.getBoundingClientRect();
    const p = localPoint(e);
    if (!p) return;
    // 손가락이 보드 밖으로 나가도 드래그를 놓치지 않게 잡아둔다.
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* 일부 환경에서 캡처가 거부돼도 드래그 자체는 계속된다 */
    }
    startRef.current = p;
    pendingRef.current = p;
    flush();
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!startRef.current) return;
    const p = localPoint(e);
    if (!p) return;
    pendingRef.current = p;
    // 포인터 이벤트는 초당 60~120회 온다. 한 프레임에 한 번만 반영한다.
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(flush);
  };

  const stopDrag = (commit: boolean) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const wasDragging = startRef.current !== null;
    startRef.current = null;
    pendingRef.current = null;
    if (!wasDragging) return;
    if (commit) onDragEnd();
    else onDragCancel();
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // 합계가 10에 처음 닿는 순간에만 짧은 진동
  const ready = selectionSum === TARGET;
  useEffect(() => {
    if (ready && !readyRef.current && typeof navigator !== 'undefined') {
      navigator.vibrate?.(10);
    }
    readyRef.current = ready;
  }, [ready]);

  useEffect(() => {
    if (ghosts.length === 0) return;
    const t = window.setTimeout(onGhostsDone, 200);
    return () => window.clearTimeout(t);
  }, [ghosts, onGhostsDone]);

  // 힌트는 잠깐 보여주고 스스로 사라진다
  useEffect(() => {
    if (!hintRect) return;
    const t = window.setTimeout(onHintDone, 2200);
    return () => window.clearTimeout(t);
  }, [hintRect, onHintDone]);

  return (
    <div className={styles.wrap}>
      <div
        ref={boardRef}
        className={styles.board}
        style={
          {
            '--cols': BOARD.cols,
            '--rows': BOARD.rows,
          } as React.CSSProperties
        }
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={() => stopDrag(true)}
        onPointerCancel={() => stopDrag(false)}
        role="application"
        aria-label="사과 보드. 직사각형으로 드래그해 합이 10인 사과를 지웁니다."
      >
        {cells.map((cell) => {
          const selected = selection ? inRect(selection, cell.row, cell.col) : false;
          const hinted = hintRect && !selection ? inRect(hintRect, cell.row, cell.col) : false;
          return (
            <div
              key={cell.id}
              className={`${styles.cell} ${cell.removed ? styles.empty : ''}`}
            >
              {!cell.removed && (
                <Apple
                  value={cell.value}
                  selected={selected}
                  ready={selected && ready}
                  hinted={hinted}
                />
              )}
            </div>
          );
        })}

        {ghosts.map((g) => (
          <div
            key={`ghost-${g.id}`}
            className={styles.ghost}
            style={{
              left: `${(g.col / BOARD.cols) * 100}%`,
              top: `${(g.row / BOARD.rows) * 100}%`,
              width: `${100 / BOARD.cols}%`,
              height: `${100 / BOARD.rows}%`,
            }}
          >
            <Apple value={g.value} />
          </div>
        ))}

        {hintRect && !selection && <SelectionBox rect={hintRect} variant="hint" />}
        {selection && <SelectionBox rect={selection} ready={ready} />}
      </div>
    </div>
  );
}
