# C3 · formulation 완결성 · 정의 (formulation completeness & definitions)

**평가 목적.** formulation은 현재 문제를 어떤 방식으로 풀고 있는지 하나하나 정의한 뒤 상세히 서술해야 한다. 기호가 많이 등장하므로 적절히 정의하고, 배경지식이 적은 독자에게 친절해야 하며, 이론적 결과의 직관은 remark로 설명한다.

### C3-Q01 · formulation이 "현재 문제를 어떤 방식으로 풀고 있는지"를 단계별로 상세히 서술하는가? [active] [severity: high]
- why:   풀이 방식을 정의 없이 건너뛰면 이후 이론·실험이 공중에 뜬다.
- check: 문제 설정 → 풀이 접근 → 각 구성요소가 순서대로, 정의를 동반해 서술되는지 확인. 접근을 뭉뚱그리면 partial 이하.
- applies_when: 항상.
- source: 사용자 지정 기준 (2026-07-26)

### C3-Q02 · formulation 이후 등장하는 모든 기호가 첫 사용 전에 정의되는가? [active] [severity: high]
- why:   미정의 기호는 이론 서술 전체의 신뢰를 무너뜨린다.
- check: 각 symbol의 첫 사용 위치를 찾아 그 이전에 정의가 있는지 확인. 미정의 callsite가 하나라도 있으면 fail.
- applies_when: 항상.
- source: 사용자 지정 기준 (2026-07-26)

### C3-Q03 · 사소한 기호는 inline으로, network 등 큰 대상은 formal definition 환경으로 적절히 구분해 정의했는가? [active] [severity: med]
- why:   정의 밀도가 대상 크기에 맞아야 가독성과 참조성이 함께 산다.
- check: 큰 구조(network, operator, 문제 클래스 등)가 \begin{definition}으로, 사소한 기호가 inline으로 정의됐는지 확인. 큰 대상이 inline에 묻혀 있거나 사소한 기호마다 definition을 남발하면 partial.
- applies_when: 항상.
- source: 사용자 지정 기준 (2026-07-26)

### C3-Q04 · 이론적 내용이 배경지식 적은 독자에게 친절하게 서술되며, formulation에 충분한 비중이 실렸는가? [active] [severity: high]
- why:   사용자는 formulation에 더 많은 비중을 두어 이론을 친절히 풀기를 요구한다.
- check: formulation 분량과 설명 밀도가 이론 결과를 이해하기에 충분한지, 도약이 없는지 확인. 정의·동기 없이 결과로 건너뛰면 partial 이하.
- applies_when: 페이퍼에 이론적 내용이 있을 때.
- source: 사용자 지정 기준 (2026-07-26)

### C3-Q05 · 이론적 결과의 직관·해석을 remark로 풀어 설명하는가? [active] [severity: med]
- why:   remark는 정리 진술을 건드리지 않고 독자에게 의미를 전달하는 친절한 장치다.
- check: 주요 lemma·theorem 뒤에 그 의미·적용 regime을 설명하는 remark가 있는지 확인. 결과만 던지고 해석이 없으면 partial.
- applies_when: 페이퍼에 numbered 이론 결과가 있을 때.
- source: 사용자 지정 기준 (2026-07-26)
