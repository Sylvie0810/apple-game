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
  const readyRef = useRef(false);

  // 콜백을 ref 에 담아 두면 네이티브 리스너를 한 번만 붙여도 항상 최신 함수를 부른다.
  const cb = useRef({ onDragMove, onDragEnd, onDragCancel });
  cb.current = { onDragMove, onDragEnd, onDragCancel };

  /*
   * 왜 React 의 onPointer* 를 안 쓰나:
   * 모바일 인앱 브라우저(카카오톡·인스타 등)와 일부 iOS Safari 조합에서
   * 위임된 passive 리스너로는 브라우저의 스크롤/당겨서 새로고침 제스처를
   * 막지 못해 드래그가 중간에 취소된다.
   * 보드 엘리먼트에 직접 { passive: false } 로 붙이고 preventDefault 한다.
   */
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    let box: DOMRect | null = null;
    let start: Point | null = null;
    let pending: Point | null = null;
    let raf: number | null = null;
    let activeId: number | null = null;

    const flush = () => {
      raf = null;
      if (!box || !start || !pending) return;
      cb.current.onDragMove(toRect(start, pending, box.width, box.height));
    };

    const local = (clientX: number, clientY: number): Point | null => {
      if (!box) return null;
      return { x: clientX - box.left, y: clientY - box.top };
    };

    const begin = (clientX: number, clientY: number) => {
      box = el.getBoundingClientRect();
      const p = local(clientX, clientY);
      if (!p) return;
      start = p;
      pending = p;
      flush();
    };

    const move = (clientX: number, clientY: number) => {
      if (!start) return;
      const p = local(clientX, clientY);
      if (!p) return;
      pending = p;
      // 포인터 이벤트는 초당 60~120회 온다. 한 프레임에 한 번만 반영한다.
      if (raf === null) raf = requestAnimationFrame(flush);
    };

    const stop = (commit: boolean) => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      const was = start !== null;
      start = null;
      pending = null;
      activeId = null;
      if (!was) return;
      if (commit) cb.current.onDragEnd();
      else cb.current.onDragCancel();
    };

    const opts = { passive: false } as const;
    const cleanups: Array<() => void> = [];
    const on = (
      target: EventTarget,
      type: string,
      fn: (e: Event) => void,
      o: AddEventListenerOptions = opts,
    ) => {
      target.addEventListener(type, fn as EventListener, o);
      cleanups.push(() => target.removeEventListener(type, fn as EventListener, o));
    };

    const hasTouch = typeof window !== 'undefined' && 'ontouchstart' in window;

    if (hasTouch) {
      // 터치 기기: 터치 이벤트만 쓴다. 포인터 이벤트와 섞으면 중복 처리된다.
      on(el, 'touchstart', (ev) => {
        const e = ev as TouchEvent;
        if (start !== null) return;
        const t = e.changedTouches[0];
        if (!t) return;
        activeId = t.identifier;
        e.preventDefault(); // 스크롤·당겨서 새로고침·길게눌러 선택 차단
        begin(t.clientX, t.clientY);
      });
      on(el, 'touchmove', (ev) => {
        const e = ev as TouchEvent;
        if (start === null) return;
        const t = Array.from(e.changedTouches).find((x) => x.identifier === activeId);
        if (!t) return;
        e.preventDefault();
        move(t.clientX, t.clientY);
      });
      // 손가락이 보드 밖에서 떨어져도 끝을 놓치지 않도록 window 에서 받는다.
      on(window, 'touchend', (ev) => {
        const e = ev as TouchEvent;
        if (start === null) return;
        if (!Array.from(e.changedTouches).some((x) => x.identifier === activeId)) return;
        stop(true);
      });
      on(window, 'touchcancel', () => stop(false));

      // 터치 기기에서도 마우스가 붙을 수 있다(아이패드+트랙패드, 터치 노트북).
      on(el, 'mousedown', (ev) => {
        const e = ev as MouseEvent;
        if (e.button !== 0 || start !== null) return;
        e.preventDefault();
        begin(e.clientX, e.clientY);
      });
      on(window, 'mousemove', (ev) => {
        const e = ev as MouseEvent;
        if (start === null) return;
        move(e.clientX, e.clientY);
      });
      on(window, 'mouseup', () => {
        if (start === null) return;
        stop(true);
      });
    } else {
      on(el, 'pointerdown', (ev) => {
        const e = ev as PointerEvent;
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        if (start !== null) return;
        activeId = e.pointerId;
        e.preventDefault();
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* 캡처가 거부돼도 window 리스너가 이어받는다 */
        }
        begin(e.clientX, e.clientY);
      });
      on(window, 'pointermove', (ev) => {
        const e = ev as PointerEvent;
        if (start === null || e.pointerId !== activeId) return;
        e.preventDefault();
        move(e.clientX, e.clientY);
      });
      on(window, 'pointerup', (ev) => {
        const e = ev as PointerEvent;
        if (start === null || e.pointerId !== activeId) return;
        stop(true);
      });
      on(window, 'pointercancel', () => stop(false));
    }

    // 탭 전환·앱 전환으로 드래그가 붕 뜨는 것을 막는다.
    on(window, 'blur', () => stop(false));
    on(el, 'contextmenu', (e) => e.preventDefault());

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
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

  const noop = useCallback(() => {}, []);

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
        onDragStart={noop}
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
