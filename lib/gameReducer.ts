import { createBoard, newSeed } from './board';
import { idsInRect, sumRect } from './selection';
import { aliveCount, findMove, hasAnyMove } from './solver';
import { EMPTY_BEST } from './storage';
import {
  BOARD,
  HINTS_PER_GAME,
  HINT_PENALTY,
  TARGET,
  type Best,
  type Cell,
  type GameState,
  type Ghost,
  type Mode,
  type Rect,
} from './types';

export type Action =
  | { type: 'HYDRATE'; best: Best; mode: Mode }
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'START' }
  | { type: 'TIME_UP' }
  | { type: 'DRAG_MOVE'; rect: Rect }
  | { type: 'DRAG_CANCEL' }
  | { type: 'DRAG_END' }
  | { type: 'USE_HINT' }
  | { type: 'CLEAR_HINT' }
  | { type: 'CLEAR_GHOSTS' }
  | { type: 'RESTART' }
  | { type: 'EXIT' };

export function initialState(): GameState {
  return {
    phase: 'start',
    mode: 'timed',
    seed: 0,
    cells: [],
    score: 0,
    selection: null,
    selectionSum: 0,
    hintsLeft: HINTS_PER_GAME,
    hintRect: null,
    vanishing: [],
    lastGain: 0,
    overReason: null,
    newRecord: false,
    best: EMPTY_BEST,
  };
}

function freshGame(state: GameState, mode: Mode): GameState {
  const seed = newSeed();
  return {
    ...state,
    phase: 'playing',
    mode,
    seed,
    cells: createBoard(seed),
    score: 0,
    selection: null,
    selectionSum: 0,
    hintsLeft: HINTS_PER_GAME,
    hintRect: null,
    vanishing: [],
    lastGain: 0,
    overReason: null,
    newRecord: false,
  };
}

function withBest(state: GameState): Best {
  const current = state.best[state.mode];
  if (state.score <= current) return state.best;
  return { ...state.best, [state.mode]: state.score };
}

function finish(state: GameState, reason: GameState['overReason']): GameState {
  return {
    ...state,
    phase: 'over',
    overReason: reason,
    newRecord: state.score > state.best[state.mode],
    selection: null,
    selectionSum: 0,
    hintRect: null,
    best: withBest(state),
  };
}

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, best: action.best, mode: action.mode };

    case 'SET_MODE':
      return { ...state, mode: action.mode };

    case 'START':
      return freshGame(state, state.mode);

    case 'RESTART':
      return freshGame(state, state.mode);

    case 'EXIT':
      return { ...initialState(), best: state.best, mode: state.mode };

    case 'TIME_UP':
      if (state.phase !== 'playing') return state;
      return finish(state, 'timeup');

    case 'DRAG_MOVE': {
      if (state.phase !== 'playing') return state;
      return {
        ...state,
        selection: action.rect,
        selectionSum: sumRect(state.cells, action.rect),
        hintRect: null,
      };
    }

    case 'DRAG_CANCEL':
      return { ...state, selection: null, selectionSum: 0 };

    case 'DRAG_END': {
      if (state.phase !== 'playing' || !state.selection) {
        return { ...state, selection: null, selectionSum: 0 };
      }
      if (state.selectionSum !== TARGET) {
        return { ...state, selection: null, selectionSum: 0 };
      }

      const ids = new Set(idsInRect(state.cells, state.selection));
      const ghosts: Ghost[] = [];
      const cells: Cell[] = state.cells.map((cell) => {
        if (!ids.has(cell.id)) return cell;
        ghosts.push({ id: cell.id, row: cell.row, col: cell.col, value: cell.value });
        return { ...cell, removed: true };
      });

      const next: GameState = {
        ...state,
        cells,
        score: state.score + ids.size,
        lastGain: ids.size,
        vanishing: ghosts,
        selection: null,
        selectionSum: 0,
      };

      if (aliveCount(cells) === 0) return finish(next, 'perfect');
      if (!hasAnyMove(cells)) return finish(next, 'nomoves');
      return next;
    }

    case 'USE_HINT': {
      if (state.phase !== 'playing' || state.hintsLeft <= 0 || state.hintRect) return state;
      const rect = findMove(state.cells);
      if (!rect) return state;
      return {
        ...state,
        hintRect: rect,
        hintsLeft: state.hintsLeft - 1,
        // 점수는 0 아래로 내려가지 않는다
        score: Math.max(0, state.score - HINT_PENALTY),
      };
    }

    case 'CLEAR_HINT':
      return state.hintRect === null ? state : { ...state, hintRect: null };

    case 'CLEAR_GHOSTS':
      return state.vanishing.length === 0 ? state : { ...state, vanishing: [] };

    default:
      return state;
  }
}

export { BOARD };
