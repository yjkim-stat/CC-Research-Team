# C6 · 실험 결과 서술 (experimental results narration)

**평가 목적.** 실험 결과는 축(metric)에 대한 정의와 결과를 사실적으로 서술한 뒤 의미를 설명하는 순서를 지켜야 한다.

### C6-Q01 · 각 실험 결과가 축·지표(metric)의 정의부터 제시하는가? [active] [severity: high]
- why:   무엇을 재는지 모른 채 결과를 읽으면 수치의 의미가 서지 않는다.
- check: 각 결과 서술이 해당 metric·축이 무엇을 측정하는지 먼저 밝히는지 확인. 정의 없이 수치부터 나오면 partial 이하.
- applies_when: 페이퍼에 실험 결과가 있을 때.
- source: 사용자 지정 기준 (2026-07-26)

### C6-Q02 · 결과를 먼저 사실적으로 서술한 뒤 그 다음에 의미를 설명하는가? [active] [severity: high]
- why:   사실 서술과 해석을 뒤섞으면 독자가 무엇이 관측이고 무엇이 주장인지 구분하지 못한다.
- check: 각 결과 문단이 "관측된 사실(수치·경향)" → "그 의미" 순서인지 확인. 해석이 사실보다 앞서거나 사실 없이 의미만 있으면 partial 이하.
- applies_when: 페이퍼에 실험 결과가 있을 때.
- source: 사용자 지정 기준 (2026-07-26)

### C6-Q03 · figure/table 언급 → 측정 대상 설명 → 결과 서술 → "This result shows/…" 마무리 패턴을 따르는가? [active] [severity: med]
- why:   CCTT 실험 서술 규칙의 표준 4단계로, 각 결과가 근거와 결론을 함께 갖게 한다.
- check: 각 실험 결과가 (1) figure/table 언급, (2) 측정 대상 설명, (3) 결과 서술, (4) "This result shows/demonstrates/indicates/suggests …" 마무리를 갖추는지 확인.
- applies_when: 페이퍼에 실험 결과가 있을 때.
- source: 사용자 지정 기준 (2026-07-26) · CLAUDE.md Experimental Results 패턴
