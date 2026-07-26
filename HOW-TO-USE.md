# HOW TO USE — CCTT 연구팀 harness 사용법

이 문서는 이 저장소를 clone한 사용자가 처음부터 무엇을, 어떤 순서로 하면 되는지 안내한다. 세부 규칙은 `CLAUDE.md`, 도구 설치·실행은 `TOOL.md`, 질문 풀 관리는 `eval/README.md`를 참조한다.

## 0. 이 저장소가 무엇인가

CCTT는 Claude Code 위에서 도는 **multi-agent 연구 협업 harness**이다. 사용자가 최상위 판정자이고, main agent가 team-lead로서 여러 teammate를 병렬 spawn해 적대적 피드백으로 산출물을 끌어올린다. **이 저장소 루트 자체가 하나의 연구 주제 workspace**이며, 별도 `workspace/{topic}/` 하위 폴더를 만들지 않는다. 커밋되는 것은 협업을 굴리는 골격(규칙·agent·skill·hook·질문 풀)이고, 실험·writing 산출물 폴더는 `.gitignore`로 제외된다.

## 1. Clone 직후 준비

1. **도구 확인.** LaTeX 컴파일은 `tectonic`, PDF 페이지 캡쳐는 PyMuPDF를 쓴다(conda `p311` env). 설치·명령은 `TOOL.md`를 따른다. `pdflatex`/`latexmk`는 이 환경에 없다.
2. **폴더 역할 알려주기.** 이 케이스에서 어느 폴더가 **LaTeX용(writing)** 이고 어느 폴더가 **GitHub용(실험 코드)** 인지 agent에게 알려준다. CLAUDE.md 규칙상 agent는 폴더 구분이 불확실하면 임의로 추측하지 않고 반드시 사용자에게 확인한다.
3. **주제 파악 자료 제공.** 참고 markdown이나 링크가 있으면 넘겨준다. 이런 자료와 웹 검색 결과는 `docs/resources/`에 출처별로 정리된다.

## 2. 제공되는 skill set

작업을 지시하면 team-lead가 상황에 맞는 것을 tool search로 찾아 쓴다. 아래 문구는 발동을 돕는 예시일 뿐, 정확히 외울 필요는 없다.

| Skill | 언제 쓰나 | 발동 예시 |
|---|---|---|
| **bootstrap-research-project** | 새 연구 주제를 처음 세팅할 때. `.claude` 골격 + wiki/team/docs/handoff/docs/resources 구조를 세운다 | "새 주제 harness 세팅해줘" |
| **question-pool-review** | `eval/` 질문 풀로 페이퍼를 점검하고, 모든 문항이 동시에 pass될 때까지 고칠 때 | "질문 풀로 점검하고 전부 통과할 때까지 고쳐줘" |
| **adversarial-review-loop** | 적대적 리뷰어를 세워 페이퍼를 근본적으로 방어·강화하고 점수를 올릴 때 | "reviewer/defender 루프로 점수 올려줘" |
| **research-paper-writing** | 섹션 초안·개선(Abstract/Intro/Method/Experiments 등)의 구조·흐름·근거 정렬 | "이 섹션 리뷰어 친화적으로 다듬어줘" |
| **extend-experimental-results** | 결과를 부풀리지 않고 실험 섹션을 확장·강화 | "실험 더 확장해줘" |
| **polish-thy-main** | main을 lean하게 두고 부차 내용을 appendix로 재배치 | "main 압축하고 appendix로 옮겨줘" |
| **iterative-revision-collaboration** | 짧은 방향 지시로 문장 단위 후보안을 여러 개 받아 반복 수정 | "이 문장 후보 몇 개 만들어봐" |

추가로 대형 fan-out 자동화가 필요할 때 쓰는 workflow 두 개가 `.claude/workflows/`에 있다. 이론 감사·수리는 `research-phase-polish-thy`, 실험·figure·서술 개선은 `research-phase-polish-exps`.

Agent 역할은 `.claude/agents/`에 있다. `writer`(유일하게 LaTeX 편집), `critic`(문항·문장 채점), `professor`(구조·스토리라인), `judge`(gold-standard 대비 비교), `reviewer`(적대적 리뷰어), `defender`(반박·보강).

## 3. 대표 작업 흐름 (recipe)

### A. 새 연구 주제 시작
"이 주제를 탐색·공부하려고 해. harness 세팅해줘"라고 지시하면 `bootstrap-research-project`가 최소 agent + wiki 업데이트/질문 skill + PreCompact handoff hook + 폴더 구조를 세운다. 이후 team-lead가 여러 teammate를 병렬로 굴리는 자기 개선형 adversarial loop로 주제를 디벨롭한다.

### B. 내 기준(질문 풀)으로 피드백 → 수정 (핵심 흐름)
1. 어느 폴더가 LaTeX용인지 알려준다.
2. "`eval/` 질문 풀로 이 페이퍼를 점검하고, 모든 문항이 pass될 때까지 고쳐줘"라고 지시하면 `question-pool-review`가 발동한다.
3. 루프는 이렇게 돈다. 풀의 `active` 문항을 페이퍼에 맞게 필터링 → tectonic 컴파일 + 페이지 스냅샷 → reviewer/defender를 spawn해 각 문항을 `pass`/`partial`/`fail`로 판정(근거 인용 필수) → `team/`에 문항 ID별 스코어카드 → 모든 지적사항을 **한꺼번에** 푸는 correction 계획 → writer가 적용 → 재컴파일·재스냅샷·재채점.
4. **완결은 하나의 스냅샷에서 모든 적용 문항이 동시에 `pass`일 때**다. 점수 평균이 아니라 all-pass이며, 하나라도 `partial`/`fail`이면 루프가 계속된다.
5. 고치지 말고 점검만 원하면 "점검만 해서 스코어카드 뽑아줘"라고 하면 된다.

### C. 적대적 리뷰 방어로 강화
"어떻게든 까내리는 리뷰어를 세우고 다 방어하게 점수 올려줘"라고 지시하면 `adversarial-review-loop`가 hostile `reviewer`와 `defender`를 병렬로 세워 debate하고, team-lead가 중재하며 근본 개선(근거 추가·appendix 선제 방어·main 압축)을 반복한다. overclaim 없이 진행하고 매 상태를 컴파일·스냅샷으로 확인한다.

### D. main 압축 / 문장 다듬기
main이 비대하면 `polish-thy-main`으로 부차 내용을 appendix로 옮긴다. 문장 단위로 후보안을 받아 고르며 다듬고 싶으면 `iterative-revision-collaboration`을 쓴다.

## 4. 질문 풀(eval/) 관리

`eval/`은 사용자가 지정한 평가 기준을 문항 단위로 쌓아 매 라운드 같은 기준으로 추적하는 **사용자 소유** 질문 은행이다.

- 구조: `criteria.md`(기준 인덱스), `questions/C*.md`(criterion별 문항), `README.md`(규칙), `CHANGELOG.md`(이력).
- **수정 권한은 사용자에게 있다.** agent는 `eval/`를 직접 고치지 않고, 새 지적사항을 `team/qpool-candidates.md`에 후보로 제안한다. 사용자가 승인한 것만 풀에 편입하고 `CHANGELOG.md`에 기록한다.
- 문항은 삭제 대신 `[deprecated]`로 은퇴시키고 ID는 재사용하지 않는다. 스코어카드가 문항 ID로 답을 달아 라운드 간 추적이 된다.
- 새 기준을 바로 넣고 싶으면 "이 지적도 질문 풀에 추가해줘"라고 지시하면 된다. 사용자가 소유자이므로 이 지시는 곧 편입 승인으로 처리된다.

세부 관리 규칙은 `eval/README.md`를 참조한다.

## 5. 팀 운영과 완결 기준

- team-lead(main agent)는 산출물을 직접 substantively 수정하지 않고, rubric·질문 풀과 피드백으로 teammate가 고치게 유도하며 매 라운드 기준을 고도화한다.
- teammate 간 피드백은 **적대적**으로, writing 검토는 **항상 렌더링된 PDF 스냅샷을 근거로** 한다. 통신·rubric·피드백 로그는 `team/`(gitignore)에 쌓인다.
- 세션이 바뀌어도 맥락이 이어지도록 PreCompact hook이 세션 내용을 `docs/handoff/`에 세션별 markdown으로 정리한다.
- **최종 판정자는 사용자다.** rubric 점수나 질문 풀 all-pass가 높아도 사용자 의도와 어긋나면 기준 자체를 재설계한다.

## 6. LaTeX 컴파일·스냅샷 빠른 참조

```bash
cd <LaTeX용 폴더>
tectonic -X compile <문서>.tex          # → <문서>.pdf

python team/snapshot.py --session <세션 이름> --latex-dir <LaTeX용 폴더>   # 컴파일 + 페이지 PNG 캡쳐
```

설치·경고 해석 등 상세는 `TOOL.md`를 본다.
