# C4 · figure 정당성 · 가독성 (figure justification & readability)

**평가 목적.** 각 figure는 존재해야 하는 타당한 이유가 있어야 하고, 전달 메시지가 설득되어야 하며, 각 축이 정의·구분되어 독자가 해석 방법을 알 수 있어야 한다. 주장이 명확히 드러나야 한다.

### C4-Q01 · 각 figure가 존재해야 하는 타당한 이유가 있는가? [active] [severity: high]
- why:   근거 없이 자리만 차지하는 figure는 제거 대상이다. 존재 이유를 객관적으로 평가해야 한다.
- check: 각 figure에 대해 "이 figure가 없으면 본문이 무엇을 잃는가"를 답할 수 있는지 확인. 답이 약하면 제거·병합 후보로 fail 또는 partial.
- applies_when: 페이퍼에 figure가 있을 때.
- source: 사용자 지정 기준 (2026-07-26)

### C4-Q02 · figure가 전달하는 메시지·주장이 명확하고 설득되는가? [active] [severity: high]
- why:   figure는 하나의 명확한 메시지를 설득해야 하며, 무엇을 읽어내야 하는지 모호하면 실패다.
- check: figure가 주장하는 한 문장 메시지를 특정할 수 있는지, 그 메시지가 그림으로 실제 뒷받침되는지 확인. 메시지가 여럿이거나 불명확하면 partial 이하.
- applies_when: 페이퍼에 figure가 있을 때.
- source: 사용자 지정 기준 (2026-07-26)

### C4-Q03 · figure의 각 축이 정의·구분되어 독자가 해석 방법을 아는가? [active] [severity: high]
- why:   축 정의가 없으면 독자가 무엇을 보는지 몰라 figure가 설득력을 잃는다.
- check: 각 축의 라벨·단위·범위가 캡션이나 본문에 정의됐는지, 여러 계열이면 색·마커 구분이 명시됐는지 확인. 미정의 축이 있으면 fail.
- applies_when: 페이퍼에 figure가 있을 때.
- source: 사용자 지정 기준 (2026-07-26)

### C4-Q04 · 본문이 그 figure에서 무엇을 읽어내야 하는지 명시하는가? [active] [severity: med]
- why:   figure는 본문이 take-away를 짚어줄 때 비로소 값을 한다.
- check: 각 figure가 본문에서 인용되며, 독자가 취해야 할 결론을 명시하는 문장이 있는지 확인. 인용만 하고 해석이 없으면 partial.
- applies_when: 페이퍼에 figure가 있을 때.
- source: 사용자 지정 기준 (2026-07-26)
