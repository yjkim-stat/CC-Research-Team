# 평가 질문 풀 — 기준(criteria) 인덱스

이 파일은 현재 페이퍼를 점검·평가하는 기준(criterion) 목록이다. 각 criterion은 `questions/` 아래 개별 파일에 문항(question)을 갖는다. 풀은 **사용자 소유**이며, agent는 이 파일과 문항을 직접 수정하지 않고 `team/qpool-candidates.md`에 후보만 제안한다. 사용법·수정 규칙은 `README.md`를 따른다.

## 판정·점수 체계

- **문항 판정:** `pass` / `partial` / `fail`.
- **근거 필수:** 모든 판정은 line·figure 인용을 동반한다. 근거 없는 판정은 무효.
- **criterion "green"** = 그 criterion의 `active`·적용(applies_when 충족) 문항이 **전부 `pass`**.
- **완결 게이트:** 하나의 컴파일·스냅샷 상태에서 **모든 criterion이 동시에 green**. `partial`이나 `fail`이 하나라도 남으면 루프를 계속한다. 게이트는 수치 평균이 아니라 all-pass이다.
- **진행 추적용 수치(참고):** pass=2, partial=1, fail=0. 라운드 간 회귀 감지에만 쓰고 완결 판단에는 쓰지 않는다.

## 기준 목록

| ID | 이름 | 평가 목적 | 가중치 |
|---|---|---|---|
| C1 | 약어 규율 | 독자가 순서대로 읽지 않으므로, 섹션마다 약어를 풀네임으로 먼저 정의한 뒤 사용하게 한다 | high |
| C2 | main self-containment | main이 appendix 없이 자립하고, appendix 언급이 최소로 유지되게 한다 | high |
| C3 | formulation 완결성·정의 | 문제 풀이 방식을 상세히 서술하고, 기호를 적절히 정의하며, 배경지식 적은 독자에게 친절한 이론 서술을 보장한다 | high |
| C4 | figure 정당성·가독성 | 각 figure의 존재 이유·전달 메시지·축 정의·주장이 명확한지 객관적으로 평가한다 | high |
| C5 | 이론-실험 대응 | 이론에서 말한 것이 실험에서 각각 대응·검증되게 한다 | high |
| C6 | 실험 결과 서술 | 축 정의 → 사실적 결과 서술 → 의미 설명 순서를 지키게 한다 | high |

## 관리 메모

- 새 지적사항이 생기면 해당 criterion 파일에 다음 빈 ID로 문항을 추가한다. 없으면 새 criterion(C7 …)을 연다.
- 문항은 삭제하지 않고 `[deprecated]`로 은퇴시키며, 변경은 `CHANGELOG.md`에 기록한다.
