'use client';

import { useEffect, useReducer } from 'react';
import GameScreen from '@/components/GameScreen';
import StartScreen from '@/components/StartScreen';
import { gameReducer, initialState } from '@/lib/gameReducer';
import { loadBest, loadMode, saveBest, saveMode } from '@/lib/storage';

export default function Page() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initialState);

  // 서버 렌더 결과와 어긋나지 않도록 저장값은 마운트 후에 읽는다.
  useEffect(() => {
    dispatch({ type: 'HYDRATE', best: loadBest(), mode: loadMode() });
  }, []);

  useEffect(() => {
    saveBest(state.best);
  }, [state.best]);

  useEffect(() => {
    saveMode(state.mode);
  }, [state.mode]);

  if (state.phase === 'start') {
    return (
      <StartScreen
        mode={state.mode}
        best={state.best}
        onSelectMode={(mode) => dispatch({ type: 'SET_MODE', mode })}
        onStart={() => dispatch({ type: 'START' })}
      />
    );
  }

  return <GameScreen state={state} dispatch={dispatch} />;
}
