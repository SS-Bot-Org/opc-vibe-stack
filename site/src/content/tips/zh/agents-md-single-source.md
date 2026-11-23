---
title: 规则只维护一份，并用 @AGENTS.md 引入
slug: agents-md-single-source
summary: 把共用规则放在 AGENTS.md。如果同时有 CLAUDE.md，用 @AGENTS.md 引入，以免 Claude Code 只读 CLAUDE.md、跳过共用文件。
locale: zh
tools:
  - claude-code
appliesTo: Claude Code。直接读取 AGENTS.md 需要 v2.1.277 或更高版本；引入写法以 2026-11-16 查阅的 memory 文档为准。
tags:
  - memory
  - agents-md
evidence: documentation-backed
wording: "@AGENTS.md"
wordingLang: markdown
effect: 如果仓库里既有 AGENTS.md，又在工作目录或其上级目录有 CLAUDE.md 或 CLAUDE.local.md，Claude Code 默认只读 CLAUDE.md，不读 AGENTS.md。若 CLAUDE.md 引入了 AGENTS.md，则会同时加载 CLAUDE.md 和被引入的 AGENTS.md。其他会读 AGENTS.md 的 agent 就可以共用同一份源文件。把引入行写在 CLAUDE.md 里；发现来源所写的做法，是让 CLAUDE.md 只保留一行 @AGENTS.md。
limits: 官方文档写明：在没有 CLAUDE.md 的情况下直接读取 AGENTS.md，需要 Claude Code v2.1.277 或更高版本；并且在某些会话里 Claude 无法直接读取 AGENTS.md，这时应从 CLAUDE.md 引入。CLAUDE.local.md 在这项检查里也算 CLAUDE.md，所以若项目本是靠 AGENTS.md，再添加一份 CLAUDE.local.md，就会让 Claude 不再读取 AGENTS.md，除非你再引入它，或把 Project instructions 设置改成例如 claude-md-and-agents-md。引入语法是 @path/to/import；若只想提到路径而不引入，请用反引号包起来。相对路径相对于包含引入语句的文件解析。本站未实测“CLAUDE.md 只留一行”在各种项目里是否都够用。
officialSource: &a1
  title: "Claude Code docs: How Claude remembers your project (AGENTS.md)"
  url: https://code.claude.com/docs/en/memory#agentsmd
  kind: docs
discoverySource: &a2
  title: Tcheav_, 2026-11-13
  url: https://x.com/Tcheav_/status/2120912148411072758
  kind: x
dateAdded: "2026-11-16"
lastVerified: "2026-11-22"
status: active
internalBriefing:
  - date: "2026-11-13"
    note: "Vibe Coding briefing: keep one rules file and import it from CLAUDE.md"
publicSources:
  - *a1
  - *a2
---
