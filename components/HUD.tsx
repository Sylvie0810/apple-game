'use client';

import { type MutableRefObject } from 'react';
import Timer from './Timer';
import styles from './HUD.module.css';
import { HINT_PENALTY, type Mode } from '@/lib/types';

type Props = {
  mode: Mode;
  running: boolean;
  clockRef: MutableRefObject<number>;
  runId: number;
  score: number;
  lastGain: number;
  showGain: boolean;
  onExit: () => void;
  onRestart: () => void;
  onTimeUp: () => void;
  hintsLeft: number;
  hintActive: boolean;
  onHint: () => void;
};

export default function HUD({
  mode,
  running,
  clockRef,
  runId,
  score,
  lastGain,
  showGain,
  onExit,
  onRestart,
  onTimeUp,
  hintsLeft,
  hintActive,
  onHint,
}: Props) {
  return (
    <div className={styles.bar} style={{ position: 'relative' }}>
      <button className={styles.iconBtn} onClick={onExit} aria-label="나가기">
        ←
      </button>

      <div className={styles.clock}>
        <span aria-hidden="true">⏰</span>
        <Timer
          mode={mode}
          running={running}
          clockRef={clockRef}
          runId={runId}
          onTimeUp={onTimeUp}
        />
      </div>

      <div className={styles.stat}>
        <span className={styles.statLabel}>점수</span>
        <span className={styles.statValue}>{score}</span>
      </div>

      <button
        className={styles.hintBtn}
        onClick={onHint}
        disabled={hintsLeft <= 0 || hintActive}
        aria-label={`힌트 보기, ${hintsLeft}회 남음, ${HINT_PENALTY}점 감점`}
      >
        <span aria-hidden="true">💡</span>
        <span className={styles.hintCount}>{hintsLeft}</span>
      </button>

      <button className={styles.iconBtn} onClick={onRestart} aria-label="재시작">
        ↻
      </button>

      {hintActive && (
        <span key={`hint-${hintsLeft}`} className={styles.penalty}>
          −{HINT_PENALTY}
        </span>
      )}

      {showGain && lastGain > 0 && (
        <span key={`${score}`} className={styles.gain}>
          +{lastGain}
        </span>
      )}
    </div>
  );
}
