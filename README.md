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

## 배포

`main` 에 push 하면 GitHub Actions 가 정적 빌드(`output: 'export'`)해서 GitHub Pages 로 올린다.

- 공개 주소: https://sylvie0810.github.io/apple-game/
- 워크플로: `.github/workflows/deploy.yml`
- 하위 경로 대응: 빌드 때 `NEXT_PUBLIC_BASE_PATH=/<저장소이름>` 을 넘긴다

### 소스는 여기, 공개는 저기

이 수업 저장소는 **비공개**라 Pages 를 켤 수 없다. 그래서 게임 폴더만 공개 저장소
`Sylvie0810/apple-game` 로 밀어 올린다. 코드의 정본은 계속 이 폴더다.

수정한 뒤 배포를 갱신하려면 **저장소 루트에서**:

```bash
git subtree push --prefix=projects/apple-game pages main
```

`pages` 리모트가 없으면 한 번만:

```bash
git remote add pages https://github.com/Sylvie0810/apple-game.git
```

로컬에서 배포본과 똑같이 확인하려면:

```bash
NEXT_PUBLIC_BASE_PATH=/apple-game npm run build
npx serve out   # 또는 out 을 apple-game 이라는 폴더로 두고 정적 서버 실행
```

## 기획서

[사과게임 모바일 MVP PRD](../../docs/plans/20260902_apple-game_prd_mobile-mvp.md)
