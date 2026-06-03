# CCTT — Thinktank Project Rules

## Project Structure

- `./workspace/{topic}/` — 연구 주제별 폴더. 각 topic은 독립된 workspace로 관리한다.
- `./team/` — agent team 협업 시 의사소통, rubric, 피드백 자료를 정리하는 폴더.
- `./template/` — ICLR 2026 LaTeX 템플릿 원본. writing 시 이 폴더를 topic 폴더에 복사하여 사용한다.
- `./writing_examples/` — 논문 writing 스타일 참고 예시 (ex1: CCG, ex2: VSGD).

## Workspace Isolation

각 topic의 workspace는 엄격히 격리한다. Topic 간 의존성이나 충돌이 없어야 한다. Topic A에서 작업하는 teammate는 Topic B 폴더에 접근하지 않는다.

## Workflow

1. 새 연구 주제를 시작하면 `./workspace/{topic}/`을 생성한다.
2. 각 task마다 **여러 teammate를 병렬로 spawn**하여 해당 topic 폴더 안에서 작업을 진행한다. 한 task에 단일 teammate로 끝내지 않고, 서로 다른 관점·접근의 산출물을 비교·통합하여 품질을 끌어올린다.
3. Writing 단계에서는 `./template/`을 topic 폴더에 복사한 뒤 `iclr2026_conference.tex`에 결과를 정리한다.
4. Writing 시 `research-paper-writing` skill을 활용한다.
5. 각 topic의 최종 판정 기준은 **사용자(team-lead 위의 user)의 요구사항과 수정 방향**이다. Rubric 점수나 teammate 합의가 아니라, 사용자의 의도와 부합하는지가 완결의 기준이다.

## Writing Rules

1. **문장 위주 서술.** `()`, `;`, `:`, `-` 같은 기호를 구조적 연결자로 사용하지 않는다. 완전한 문장으로 글을 작성한다.
2. **Section 구조.** Introduction → Related Work → Formulation → (Theoretical Results) → Experimental Results → Conclusion.
3. **Experimental Results 패턴.** figure/table 언급 → 의미 설명 → 결과 서술 → "This result shows/demonstrates/indicates/suggests …"로 마무리.
4. **Theoretical Results 패턴.** 핵심 lemma, theorem을 main body에서 서사 흐름에 맞게 제시한다. 상세 증명과 유도는 appendix에서 서술한다.
5. **스타일 참고.** `writing_examples/*.tex` 파일을 gold-standard 스타일로 따른다.

## Agent Team & Rubric

### Team 구조
- **User**가 최상위 판정자이며, 모든 rubric과 산출물은 궁극적으로 user의 요구사항·수정 방향에 정렬되어야 한다.
- **Team-lead** (main agent)가 각 topic에 대해 multi-aspect rubric을 생성하고 매 라운드마다 의도적으로 고도화한다. Team-lead가 산출물을 직접 substantively 수정하지 않으며, rubric과 피드백을 통해 teammate가 고치도록 유도한다.
- **Teammates** (spawned agents)는 task마다 여러 명을 병렬 spawn하며, rubric 기반 피드백을 받고 반복적으로 개선한다.
- Rubric은 `./team/` 또는 해당 topic 폴더에 저장하여 모든 teammate가 참조할 수 있도록 한다.

### Rubric 구조 (multi-aspect)
각 평가 aspect는 반드시 다음 세 가지를 명시한다:
1. **평가 목적** — 해당 aspect가 무엇을 측정하며 왜 중요한지
2. **평가 기준** — 각 점수 수준에 대한 구체적 기준
3. **점수 체계** — 명확한 anchor가 있는 수치 척도

평가 aspect는 실험적 완결성과 이론적 완결성을 모두 포괄해야 한다.

### Team 운영 흐름
1. Topic 시작 시 team-lead가 초기 rubric을 작성한다.
2. 한 task마다 **여러 teammate를 병렬 spawn**하여 산출물(실험, 증명, writing)을 생산한다.
3. Team-lead가 rubric에 따라 각 산출물을 평가하고 서면 피드백을 제공한다. 비교 가능한 다중 산출물의 차이도 피드백 자료로 활용한다.
4. Teammates가 피드백을 반영하여 수정한다.
5. **매 라운드 rubric을 의도적으로 고도화한다.** Teammate가 현재 기준을 충족했다고 안주하지 않도록, 새로운 평가 축을 추가하거나 기존 anchor의 기준치를 상향한다. "충분히 좋다"는 정지점을 만들지 않는다.
6. 산출물이 사용자(user)의 요구사항·수정 방향과 부합하는지를 매 라운드 점검한다. Rubric 점수가 높아도 user 의도와 어긋나면 rubric 자체를 재설계한다.
7. Topic이 완결(실험 + 이론 + user 의도 정렬 모두 충족)될 때까지 이 루프를 반복한다.
