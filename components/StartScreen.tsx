'use client';

import Apple from './Apple';
import styles from './StartScreen.module.css';
import { HINTS_PER_GAME, HINT_PENALTY, type AppleValue, type Best, type Mode } from '@/lib/types';

const DEMO: AppleValue[] = [6, 4, 9, 8, 1, 5, 5, 1, 3];
/** 데모에서 지워지는 두 칸: 6 + 4 = 10 */
const DEMO_VANISH = new Set([0, 1]);

type Props = {
  mode: Mode;
  best: Best;
  onSelectMode: (mode: Mode) => void;
  onStart: () => void;
};

export default function StartScreen({ mode, best, onSelectMode, onStart }: Props) {
  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
      <div className={styles.center}>
      <h1 className={styles.title}>사과게임</h1>
      <p className={styles.subtitle}>사과를 합쳐서 10을 만드세요!</p>

      <div className={styles.demoCard}>
        <div className={styles.demoGrid} aria-hidden="true">
          {DEMO.map((v, i) => (
            <div
              key={i}
              className={`${styles.demoCell} ${DEMO_VANISH.has(i) ? styles.demoVanish : ''}`}
            >
              <Apple value={v} />
            </div>
          ))}
          <div className={styles.demoBox} />
        </div>
        <p className={styles.demoHint}>사각형으로 드래그해서 합을 10으로!</p>
        <p className={styles.demoSub}>사과를 많이 지울수록 점수가 높아져요.</p>
        <p className={styles.demoSub}>
          막히면 💡 힌트 {HINTS_PER_GAME}번 · 볼 때마다 {HINT_PENALTY}점 감점
        </p>
      </div>

      <div className={styles.modes}>
        <button
          className={`${styles.modeCard} ${mode === 'endless' ? styles.modeCardOn : ''}`}
          onClick={() => onSelectMode('endless')}
          aria-pressed={mode === 'endless'}
        >
          <span className={styles.modeIcon} aria-hidden="true">∞</span>
          무제한 모드
          {mode === 'endless' && <span className={styles.check} aria-hidden="true">✓</span>}
        </button>

        <button
          className={`${styles.modeCard} ${mode === 'timed' ? styles.modeCardOn : ''}`}
          onClick={() => onSelectMode('timed')}
          aria-pressed={mode === 'timed'}
        >
          <span className={styles.modeIcon} aria-hidden="true">★</span>
          일반 모드
          {mode === 'timed' && <span className={styles.check} aria-hidden="true">✓</span>}
        </button>
      </div>

      <p className={styles.best}>
        최고 점수 · 일반 {best.timed} · 무제한 {best.endless}
      </p>
      </div>

      <button className={styles.startBtn} onClick={onStart}>
        게임 시작
      </button>
      </div>
    </div>
  );
}
