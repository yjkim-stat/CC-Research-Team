# C2 · main self-containment (main 자립성 · appendix 최소 언급)

**평가 목적.** main 본문은 appendix를 읽지 않아도 그 자체로 이해되어야 하고, appendix 언급은 최소한으로 유지되어야 한다.

### C2-Q01 · main 본문이 appendix를 읽지 않아도 이해되는가 (self-contained)? [active] [severity: high]
- why:   리뷰어는 main만으로 판단하므로, appendix에 의존하는 main은 불완전하게 읽힌다.
- check: main의 각 정의·주장·결과가 main 안 텍스트만으로 이해되는지 확인. 이해에 appendix가 필수인 지점이 있으면 fail.
- applies_when: 항상.
- source: 사용자 지정 기준 (2026-07-26)

### C2-Q02 · appendix 참조("see Appendix", \ref{app:...})가 최소한으로 유지되며 각 참조가 정말 필요한가? [active] [severity: high]
- why:   잦은 appendix 포워딩은 main의 흐름을 끊고 자립성을 해친다.
- check: main의 모든 appendix 참조를 세고, 각각이 없어도 main이 성립하는지 검토. 불필요하거나 과다하면 partial 이하.
- applies_when: 항상.
- source: 사용자 지정 기준 (2026-07-26)

### C2-Q03 · main의 load-bearing 주장이 근거를 appendix에만 두고 있지 않은가? [active] [severity: high]
- why:   핵심 주장의 근거가 appendix에만 있으면 main 독자는 근거 없이 주장을 받아들여야 한다.
- check: main의 핵심 주장마다 그 근거(수치·figure·정의)가 main 안에 최소한이라도 제시되는지 확인. 근거가 전적으로 appendix에만 있으면 fail.
- applies_when: 항상.
- source: 사용자 지정 기준 (2026-07-26)
