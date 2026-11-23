---
title: 覆盖 Explore 子代理所用的模型
slug: explore-subagent-haiku
summary: 自定义一个名为 Explore 的用户级或项目级子代理，可以覆盖内置 Explore，并把 model 设为 haiku，以便用更低成本的模型做仓库搜索。
locale: zh
tools:
  - claude-code
appliesTo: Claude Code 自定义子代理。内置 Explore 使用的模型取决于父会话模型以及你如何连接，详见下方说明。
tags:
  - subagents
  - cost
evidence: documentation-backed
wording: |-
  name: Explore
  description: Fast, read-only search and analysis of the codebase.
  tools: Read, Grep, Glob
  model: haiku
wordingLang: yaml
effect: 内置 Explore 子代理是只读的，用于搜索和分析代码库。它的模型通常跟随父会话，但当父会话运行 Fable 时：若使用 Claude 订阅、Anthropic Console 账户，或通过 ANTHROPIC_BASE_URL 访问的 LLM 网关，Explore 会运行 opus 别名解析到的 Opus 模型；在 Amazon Bedrock、Google Cloud 的 Agent Platform、Microsoft Foundry、Claude Platform on AWS 或 Claude apps gateway 上，Explore 会留在 Fable。官方文档写明：名为 Explore 的用户级或项目级子代理会覆盖内置版本，并保留自己的 model 字段，因此把 model 设为 haiku，就可以让探索任务跑在成本更低的模型上。把上面的 YAML 作为子代理文件的 frontmatter（用 --- 包裹）保存即可；必填字段只有 name 和 description，model 用来指定 Haiku。
limits: 保留显式的 tools 白名单（Read、Grep、Glob）。自定义 Explore 会替换内置定义；省略 tools 时会继承可用工具，其中包括能写入的工具。仅在 description 中写“只读”并不能强制限制权限。文件可放在 ~/.claude/agents/（对你的所有项目生效），或项目里的 .claude/agents/。身份取决于 name 字段，而不是文件路径。只有 name、没有 description 的文件会被跳过。仅设置 CLAUDE_CODE_SUBAGENT_MODEL 并不会改变内置 Explore 和 Plan 的模型；若要让每个子代理都用同一个模型，官方文档另有强制标志说明。能节省多少费用取决于你的工作负载，本站未实测。第三方提到的固定倍数并不是官方数字，这里也不当作结果引用。
officialSource: &a1
  title: "Claude Code docs: Create custom subagents (Explore)"
  url: https://code.claude.com/docs/en/sub-agents
  kind: docs
discoverySource: &a2
  title: qyq5201314, 2026-11-12
  url: https://x.com/qyq5201314/status/2120751731034259714
  kind: x
dateAdded: "2026-11-16"
lastVerified: "2026-11-22"
status: active
internalBriefing:
  - date: "2026-11-12"
    note: "Vibe Coding briefing: override the Explore subagent model"
publicSources:
  - *a1
  - *a2
---
