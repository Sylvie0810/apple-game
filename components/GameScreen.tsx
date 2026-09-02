'use client';

import { useCallback, useRef } from 'react';
import GameBoard from './GameBoard';
import GameOverModal from './GameOverModal';
import HUD from './HUD';
import hudStyles from './HUD.module.css';
import styles from './GameScreen.module.css';
import type { Action } from '@/lib/gameReducer';
import { aliveCount } from '@/lib/solver';
import type { GameState, Rect } from '@/lib/types';

type Props = {
  state: GameState;
  dispatch: (action: Action) => void;
};

export default function GameScreen({ state, dispatch }: Props) {
  const clockRef = useRef(0);

  const onDragMove = useCallback((rect: Rect) => dispatch({ type: 'DRAG_MOVE', rect }), [dispatch]);
  const onDragEnd = useCallback(() => dispatch({ type: 'DRAG_END' }), [dispatch]);
  const onDragCancel = useCallback(() => dispatch({ type: 'DRAG_CANCEL' }), [dispatch]);
  const onGhostsDone = useCallback(() => dispatch({ type: 'CLEAR_GHOSTS' }), [dispatch]);
  const onTimeUp = useCallback(() => dispatch({ type: 'TIME_UP' }), [dispatch]);
  const onHint = useCallback(() => dispatch({ type: 'USE_HINT' }), [dispatch]);
  const onHintDone = useCallback(() => dispatch({ type: 'CLEAR_HINT' }), [dispatch]);

  const over = state.phase === 'over';

  return (
    <div className={styles.screen}>
      <HUD
        mode={state.mode}
        running={state.phase === 'playing'}
        clockRef={clockRef}
        runId={state.seed}
        score={state.score}
        lastGain={state.lastGain}
        showGain={state.vanishing.length > 0}
        onExit={() => dispatch({ type: 'EXIT' })}
        onRestart={() => dispatch({ type: 'RESTART' })}
        onTimeUp={onTimeUp}
        hintsLeft={state.hintsLeft}
        hintActive={state.hintRect !== null}
        onHint={onHint}
      />

      <div className={hudStyles.banner}>더 이상 합칠 수 있는 사과가 없으면 성공</div>

      <GameBoard
        cells={state.cells}
        selection={state.selection}
        selectionSum={state.selectionSum}
        ghosts={state.vanishing}
        hintRect={state.hintRect}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
        onGhostsDone={onGhostsDone}
        onHintDone={onHintDone}
      />

      {over && state.overReason && (
        <GameOverModal
          reason={state.overReason}
          mode={state.mode}
          score={state.score}
          best={state.best[state.mode]}
          isNewBest={state.newRecord}
          remaining={aliveCount(state.cells)}
          elapsedMs={clockRef.current}
          onRestart={() => dispatch({ type: 'RESTART' })}
          onExit={() => dispatch({ type: 'EXIT' })}
        />
      )}
    </div>
  );
}
