---
name: Codex verification after Claude development
description: Always run Codex to verify Claude-built code before reporting task complete
type: feedback
---

Claude로 개발한 뒤에는 반드시 Codex 검증을 돌려야 한다.

**Why:** 사용자가 "클로드로 개발 → Codex 검증" 워크플로우를 공식 지침으로 도입했음. 검증 없이 완료 보고하면 안 됨.

**How to apply:** 코드/HTML/JS 작성 또는 수정이 완료되면, 완료 선언 전에 항상 `codex:codex-rescue` 또는 `codex:rescue` 스킬로 Codex 검증을 실행할 것.
