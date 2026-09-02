import { BOARD, TARGET, type Rect } from '@/lib/types';
import styles from './GameBoard.module.css';

type Props = { rect: Rect; ready?: boolean; variant?: 'select' | 'hint' };

export default function SelectionBox({ rect, ready = false, variant = 'select' }: Props) {
  const left = (rect.c0 / BOARD.cols) * 100;
  const width = ((rect.c1 - rect.c0 + 1) / BOARD.cols) * 100;
  const top = (rect.r0 / BOARD.rows) * 100;
  const height = ((rect.r1 - rect.r0 + 1) / BOARD.rows) * 100;
  const cls =
    variant === 'hint' ? styles.hintBox : `${styles.selectBox} ${ready ? styles.ready : ''}`;
  return (
    <div
      className={cls}
      style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
    >
      {variant === 'hint' && <span className={styles.hintBadge}>= {TARGET}</span>}
    </div>
  );
}
