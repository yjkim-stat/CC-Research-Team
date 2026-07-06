# TOOL — 사용자 승인 도구·기능 모음

이 파일은 이 저장소에서 반복적으로 쓰는 도구와 기능(설치·실행 방법)을 모아둔다. 담기는 내용은 **사용자(team-lead 위의 user)가 직접 지시하고 명시적으로 승인한 것만**으로 한정한다.

## 쓰기 규칙 (엄격)

1. **승인 없는 쓰기 금지.** Agent(team-lead 포함)는 사용자가 이 파일에 넣으라고 **직접 지시**한 항목만 추가·수정한다. 스스로 판단해서 유용해 보이는 내용을 임의로 기록하지 않는다.
2. **추가·수정·삭제 전 확인.** 기존 항목을 바꾸거나 지울 때는 반드시 사용자에게 먼저 확인받는다.
3. **검증된 것만.** 추측이나 미확인 정보를 넣지 않는다. 절차·명령은 실제로 동작을 확인한 뒤에만 기록한다.
4. **한 항목 = 한 도구/기능.** 각 항목은 확인 가능한 하나의 도구나 절차를 담고, 언제·왜 승인됐는지 맥락이 드러나게 쓴다.

이 규칙은 CLAUDE.md에서 참조된다. CLAUDE.md의 다른 규칙과 이 파일의 항목이 충돌하면, 사용자에게 확인받아 해소한다.

---

## LaTeX 컴파일

- **엔진: `tectonic`** (self-contained XeTeX). `pdflatex`/`latexmk`/`xelatex`는 PATH에 없다.
- 위치: `~/miniconda3/envs/p311/bin/tectonic` (conda `p311` env, 이미 PATH에 있음). conda-forge 패키지 `tectonic 0.15.0`.

### tectonic 설치 (언제 어디서든 컴파일 가능하도록)

tectonic은 단일 실행 파일이고 필요한 TeX 패키지·폰트를 처음 컴파일할 때 자동으로 내려받으므로, TeX Live 전체를 깔 필요 없이 이 바이너리 하나만 있으면 된다.

- **이 환경의 방식 (conda, 권장).** conda/mamba가 있으면 어느 OS에서든 동일하게 동작한다.

  ```bash
  conda install -c conda-forge tectonic
  # 격리된 전용 env로 두려면:
  conda create -n p311 -c conda-forge tectonic   # 그 뒤 conda activate p311
  ```

- **conda가 없을 때 대체 방법:**
  - 공식 설치 스크립트 (Linux/macOS, 홈에 바이너리 설치):
    ```bash
    curl --proto '=https' --tlsv1.2 -fsSL https://drop-sh.fullyjustified.net | sh
    ```
  - macOS: `brew install tectonic`
  - Rust가 있으면: `cargo install tectonic`
  - 그 외 정적 바이너리는 GitHub 릴리스(`tectonic-typesetting/tectonic`)에서 받아 PATH에 둔다.

- 설치 확인: `tectonic --version` (현재 `0.15.0`). 최초 컴파일 시 인터넷이 필요하며, 받은 리소스는 캐시되어 이후에는 오프라인 컴파일도 가능하다.

- 논문 소스는 LaTeX용 폴더에서 관리한다 (이 저장소의 경우 `aistats/`). 컴파일 명령 (해당 폴더에서 실행):

  ```bash
  cd <LaTeX용 폴더>
  tectonic -X compile <문서>.tex   # → <문서>.pdf
  ```

- 참고문헌(bib) 처리와 다중 패스는 tectonic이 자동으로 수행하므로 별도 `bibtex`/`latexmk` 호출이 필요 없다.
- `Underfull \hbox/\vbox (badness …)`, `algorithm.sty` UTF-8 경고, `stopping at 6 passes` 경고는 무해하며 PDF는 정상 생성된다. EXIT 0 이면 성공.

*(2026-07-05, 사용자 지시로 tectonic 컴파일 확인 후 기록)*

---

## PDF 페이지 이미지 캡쳐

컴파일한 PDF의 각 페이지를 이미지로 캡쳐하여, teammate가 글의 내용과 지면 상의 시각적 결과(레이아웃, figure/table 배치, 넘침, 여백)를 함께 파악할 수 있게 한다. Adversarial feedback은 이 이미지를 근거로 진행한다.

- **엔진: PyMuPDF (`fitz`)** — conda `p311` env에 `PyMuPDF 1.27.2` 설치됨. `pdftoppm`/`pdftocairo`/ImageMagick 없이도 페이지별 PNG 렌더가 가능하다. (`gs`(ghostscript)도 PATH에 있으나 기본은 PyMuPDF를 쓴다.)
- 설치가 필요하면: `pip install pymupdf` (또는 `conda install -c conda-forge pymupdf`).

- **헬퍼 스크립트 `./team/snapshot.py`** — LaTeX용 폴더의 최상위 문서(`\documentclass` 포함 `.tex`)를 tectonic으로 컴파일한 뒤, 각 페이지를 PNG로 렌더하여 `./team/snapshot/<세션 이름>/<문서 이름>/page_NN.png`에 저장한다. 하위 폴더는 대화 세션 이름으로 구분한다.

  ```bash
  python team/snapshot.py --session <세션 이름> --latex-dir <LaTeX용 폴더>
  # 특정 문서만: python team/snapshot.py --session <세션 이름> --latex-dir <LaTeX용 폴더> main.tex
  # 해상도 조정: --dpi 200 (기본 150)
  ```

- 스크립트 없이 직접 캡쳐할 때의 최소 코드:

  ```python
  import fitz  # PyMuPDF
  doc = fitz.open("main.pdf")
  for i, page in enumerate(doc, 1):
      page.get_pixmap(dpi=150).save(f"page_{i:02d}.png")
  ```

- `./team/`은 `.gitignore`에 포함되어 스냅샷 이미지는 저장소에 커밋되지 않는다. 수정 후에는 다시 실행하여 스냅샷을 갱신한다.

*(2026-07-05, 사용자 지시로 PyMuPDF 캡쳐 확인 후 기록)*
