---
title: "规则文件 + hooks：别只靠 AGENTS.md"
slug: rules-hooks
summary: "硬约束写进 hooks 与验证命令；可复用活写成 SKILL.md；MCP 按工具各自配置。"
locale: zh
category: checklist
stage: build
tools: [claude-code, codex]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Claude Code hooks/skills/MCP；Codex hooks/MCP（config.toml）— 以你已安装版本的厂商文档为准"
updated: "2026-11-06"
internalBriefing:
  - date: "2026-11-02"
    note: "Hooks vs AGENTS.md alone"
  - date: "2026-11-03"
    note: "Shared SKILL.md across agents"
  - date: "2026-11-05"
    note: "One MCP server, per-tool config files"
publicSources:
  - title: "Automate actions with hooks (Claude Code)"
    url: "https://code.claude.com/docs/en/hooks-guide"
    kind: docs
  - title: "Hooks reference (Claude Code)"
    url: "https://code.claude.com/docs/en/hooks"
    kind: docs
  - title: "Extend Claude with skills (SKILL.md)"
    url: "https://code.claude.com/docs/en/skills"
    kind: docs
  - title: "Agent Skills open standard"
    url: "https://agentskills.io/"
    kind: docs
  - title: "Connect Claude Code to tools via MCP"
    url: "https://code.claude.com/docs/en/mcp"
    kind: docs
  - title: "Codex configuration reference (mcp_servers)"
    url: "https://developers.openai.com/codex/config-reference"
    kind: docs
  - title: "AGENTS.md instructions are not always reliable; agent hooks are"
    url: "https://x.com/twannl/status/2117204333146034342"
    kind: x
  - title: "Agent hooks in Claude Code, Cursor, and Codex explained"
    url: "https://www.avanderlee.com/ai-development/agent-hooks-claude-code-cursor-codex/"
    kind: blog
  - title: "Write a job once as SKILL.md"
    url: "https://x.com/RohanBhanotAI/status/2117624435452653720"
    kind: x
  - title: "One MCP server across Claude Code, Cursor, and Codex"
    url: "https://x.com/brandononchain/status/2118102874626433286"
    kind: x
tags: [build, hooks, skills, mcp, safety]
---

## 结论

散文规则有用；**hooks 与验证命令才强制**。把 AGENTS.md / CLAUDE.md 当常开指引。可重复活放进 skills（`SKILL.md`）。绝不能失手的检查放进 hooks 或 CI。跨工具共用一台 MCP 服务器时，配置**每个工具自己的文件**——别幻想有一份所有 CLI 都会魔法读取的共享配置。

## 前置条件

- 支持项目规则和/或生命周期 hooks 的 agent CLI
- 一条够快的 lint/测试/冒烟命令
- 可选：skills 目录、以及你真正信任的 MCP 服务器

## 步骤

1. 列出**硬禁区**（例如永不改 migrations、永不提交密钥、永不关掉鉴权测试）。
2. 禁区写进规则文件，**同时**写进会让改动失败的 hook 或 CI。Claude Code hooks 在固定生命周期点运行（如 `PreToolUse` / `PostToolUse`），可拒绝工具调用——别指望模型「记住」一段话。
3. 要求 agent 声称完成前跑验证命令；可行时用 `Stop` 或编辑后 hook 跑同一命令。
4. **把重复活抽成 skills。** skill 是带 `SKILL.md`（名称 + 描述 + 步骤）的文件夹。Claude Code 文档写项目 skills 在 `.claude/skills/`；Agent Skills 开放标准提供共享的 `SKILL.md` 形状。一 skill 一活；常开说明放 AGENTS.md / CLAUDE.md。跨工具目录布局不同——复制社交片段前先重读各厂商文档。
5. **按工具各配一次 MCP。** 同一服务器、不同文件：Claude Code 常用项目 `.mcp.json`（`claude mcp add` / `--scope project`）；Codex 用 `~/.codex/config.toml` 或可信项目配置里的 `[mcp_servers.*]`；Cursor 用自己的 MCP JSON（常在 `.cursor/`）。每个工具分别加服务器，改掉方言字段差异，再用该工具的 MCP 状态界面确认。永不提交原始 API 密钥。会拉外网内容的服务器有注入风险——先核实信任。
6. agent 犯错后，当天把教训追加进规则文件或相关 skill。
7. 无关任务之间清空或重置上下文，避免指令污染。

## 模板字段

```text
硬禁区：
Hook 事件 + matcher（或 CI 检查）：
验证命令：
Skills 目录 / skill 名称：
MCP 服务器名：
Claude Code 配置路径（.mcp.json 或 settings）：
Codex mcp_servers 条目（config.toml）：
Cursor MCP 配置路径：
教训日志位置：
```

## 完成定义

禁止改动会自动失败（hook/CI），而不是只靠模型「记住」。重复活在可按名调用的 skills 里。你用的每个 agent 都能列出已连接的共享 MCP 服务器，且仓库里没有密钥副本。

## 反模式

- 规则文件是唯一控制面
- hooks 太慢，大家干脆关掉
- 一个巨大「我们怎么干活」skill 对所有任务都松松匹配
- 把同一份 MCP JSON 粘进错误工具的文件格式就算胜利
- 启用未读过的市场 skills/脚本（把它们当你会跑的代码）

## 来源

frontmatter 列出 Claude Code hooks/skills/MCP 文档、Codex MCP 配置参考、Agent Skills，以及促使本版修订的简报相关帖/博客。Cursor/Codex 的精确 hook 文件名会变——复制社交片段前务必重读当前厂商文档。
