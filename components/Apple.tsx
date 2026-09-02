import type { AppleValue } from '@/lib/types';

type Props = {
  value: AppleValue;
  selected?: boolean;
  ready?: boolean;
  /** 힌트가 가리키는 사과. 어느 사과가 포함인지 테두리로 못 박는다. */
  hinted?: boolean;
};

/** 사과 1개. 히트 판정은 셀 사각형이 하고, 이 SVG는 보이기만 한다. */
export default function Apple({ value, selected = false, ready = false, hinted = false }: Props) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true" focusable="false">
      <g
        style={{
          transformOrigin: '50px 50px',
          transform: selected || hinted ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 90ms ease-out',
        }}
      >
        <path d="M50 22 C50 14 55 8 64 6 C64 15 58 21 50 22 Z" fill="var(--leaf)" />
        {hinted && (
          <circle
            cx="50"
            cy="58"
            r="42"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="6"
          />
        )}
        <circle cx="50" cy="58" r="36" fill={ready ? 'var(--apple-shadow)' : 'var(--apple)'} />
        <text
          x="50"
          y="59"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          fontSize="40"
          fontWeight="800"
          fontFamily="inherit"
        >
          {value}
        </text>
      </g>
    </svg>
  );
}
