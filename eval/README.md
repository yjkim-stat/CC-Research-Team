# 평가 질문 풀 (question pool)

이 폴더는 현재 페이퍼를 여러 기준에서 점검·평가하는 **질문 은행**이다. 사용자가 지적한 문제들을 문항 단위로 축적해, 매 피드백 라운드에서 같은 기준으로 반복 평가하고 "전부 동시에 해결"됐는지 추적한다.

## 구조

```
eval/
├── README.md          # 이 파일. 사용법·ID 규칙·lifecycle
├── criteria.md        # 기준(criterion) 인덱스 + 판정·완결 게이트 정의
├── CHANGELOG.md       # 모든 추가/수정/폐기 이력 (날짜별)
└── questions/
    ├── C1-acronym.md
    ├── C2-self-contained.md
    ├── C3-formulation.md
    ├── C4-figure.md
    ├── C5-theory-experiment.md
    └── C6-experiment-narration.md
```

풀은 git으로 추적되어 기준이 어떻게 강화됐는지 히스토리가 남는다. 매 실행의 답변·점수(스코어카드)는 풀이 아니라 `team/`(gitignore)에 쓰며, 풀과 결과를 절대 섞지 않는다.

## 문항 포맷

문항 하나는 안정적 ID를 헤딩으로 갖는 markdown 블록이다.

```markdown
### C4-Q03 · figure의 각 축이 정의·구분되어 독자가 해석 방법을 아는가? [active] [severity: high]
- why:   축 정의가 없으면 독자가 무엇을 보는지 몰라 figure가 설득력을 잃는다.
- check: 각 축의 라벨·단위·범위가 캡션이나 본문에 정의됐는지, 여러 계열이면 구분이 명시됐는지 확인.
- applies_when: 페이퍼에 figure가 있을 때.
- source: 사용자 지정 기준 (2026-07-26)
```

필드 의미:
- **ID** — `C<기준번호>-Q<두자리>`. 안정적이며 **한 번 쓰면 재사용 금지**. 스코어카드가 이 ID로 답을 달아 라운드 간 추적이 된다.
- **status 태그** — `[active]` / `[draft]` / `[deprecated]`. 은퇴는 삭제가 아니라 `[deprecated]` + 사유.
- **severity 태그** — `[severity: high|med|low]`. 실패 시 영향.
- **why** — 이 문항이 잡아내는 문제(평가 목적).
- **check** — *어떻게* 판정하는지. 이게 있어야 어떤 agent가 돌려도 판정이 일관된다.
- **applies_when** — 적용 조건. 풀은 superset이고 매 실행이 해당 페이퍼에 맞는 문항만 필터링한다.
- **source** — 출처(사용자 지정 / 반복된 reviewer objection / exemplar gap).

## 관리 규칙 (사용자 소유)

1. **사용자가 write를 소유한다.** agent는 이 폴더를 직접 수정하지 않는다. 실행 중 발견한 새 약점은 `team/qpool-candidates.md`에 후보로 append하고, 사용자가 검토 후 승인한 것만 풀로 승격한다.
2. **삭제 대신 폐기.** 문항을 없앨 때는 `[deprecated]` + 날짜 + 사유. ID는 영구 은퇴.
3. **ID 재사용 금지.** 새 문항은 그 criterion의 다음 빈 번호로.
4. **모든 변경을 `CHANGELOG.md`에 기록.**
5. **문항은 원자적으로.** 한 문항 = 하나의 check. yes/no·등급으로 답할 수 있게 서술한다.

## 소비 방법

`question-pool-review` skill이 이 풀을 읽어 적용 문항을 추리고, adversarial reviewer/defender를 spawn해 각 문항을 `pass/partial/fail`로 판정한 뒤, 모든 문항이 동시에 `pass`가 될 때까지 correction 루프를 돌린다. 세부 절차는 그 skill에 있다.
