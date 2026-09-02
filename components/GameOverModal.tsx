'use client';

import styles from './GameOverModal.module.css';
import { formatClock } from './Timer';
import type { Mode, OverReason } from '@/lib/types';

const HEADLINE: Record<OverReason, string> = {
  timeup: '시간 종료',
  nomoves: '더 이상 없어요',
  perfect: '퍼펙트!',
};

type Props = {
  reason: OverReason;
  mode: Mode;
  score: number;
  best: number;
  isNewBest: boolean;
  remaining: number;
  elapsedMs: number;
  onRestart: () => void;
  onExit: () => void;
};

export default function GameOverModal({
  reason,
  mode,
  score,
  best,
  isNewBest,
  remaining,
  elapsedMs,
  onRestart,
  onExit,
}: Props) {
  const sub =
    reason === 'perfect'
      ? `사과를 전부 지웠어요 · ${formatClock(elapsedMs)}`
      : reason === 'nomoves'
        ? `합이 10이 되는 자리가 없어요 · 남은 사과 ${remaining}개`
        : mode === 'timed'
          ? '2분이 다 됐어요'
          : '';

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.card}>
        <h2 className={styles.headline}>{HEADLINE[reason]}</h2>
        {sub && <p className={styles.sub}>{sub}</p>}

        <div className={styles.scoreRow}>
          <div>
            <div className={styles.scoreLabel}>점수</div>
            <div className={styles.scoreValue}>{score}</div>
          </div>
          <div>
            <div className={styles.scoreLabel}>최고</div>
            <div className={styles.scoreValue}>{best}</div>
          </div>
        </div>

        {isNewBest && <div className={styles.newBest}>신기록!</div>}

        <div className={styles.actions}>
          <button className={styles.primary} onClick={onRestart}>
            다시하기
          </button>
          <button className={styles.secondary} onClick={onExit}>
            처음으로
          </button>
        </div>
      </div>
    </div>
  );
}
