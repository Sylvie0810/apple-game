# 사과게임 (Apple Game)

직사각형을 드래그해서, 그 안 사과 숫자의 합이 **정확히 10**이면 사과가 사라지는 모바일 퍼즐게임.

- 보드 **8열 × 14행 = 112개**
- 지운 사과 1개 = **1점**
- 사라진 자리는 **다시 채우지 않는다** (빈칸은 합계에 0으로 기여)
- **일반 모드** 2분 카운트다운 / **무제한 모드** 카운트업
- **힌트 3회**, 한 번 볼 때마다 **−3점** (점수는 0 아래로 안 내려감)

## 실행

```bash
cd projects/apple-game
npm install
npm run dev
```

`http://localhost:3000` 접속. 모바일 세로 화면 기준으로 만들었으니
브라우저 개발자도구에서 iPhone 크기로 보는 게 정확하다.

## 명령어

| 명령 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run typecheck` | 타입 검사 |

> `npm run build` 는 `.next` 를 갈아엎으므로, 개발 서버를 켜둔 채로 돌리지 않는다.

## 구조

```
app/         page(화면 전환) · layout · manifest · icon
components/  StartScreen · GameScreen · GameBoard · Apple · SelectionBox · HUD · Timer · GameOverModal
lib/         board(판 생성) · selection(좌표→격자) · solver(누적합·힌트) · gameReducer · storage
```

핵심은 `components/GameBoard.tsx` 의 포인터 이벤트 3개와 `lib/solver.ts` 의 2D 누적합이다.

## 기획서

[사과게임 모바일 MVP PRD](../../docs/plans/20260902_apple-game_prd_mobile-mvp.md)
