---
title: "规则文件 + hooks：别只靠 AGENTS.md"
slug: rules-hooks
summary: "常规约定放 AGENTS.md/CLAUDE.md，标准作业放 SKILL.md，硬红线交 permissions.deny/ask 与 hooks/CI 拦截，MCP 按工具各配。"
locale: zh
category: checklist
stage: build
tools: [claude-code, codex]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Claude Code hooks/skills/MCP；Codex config.toml 与 mcp_servers — 具体键名请对照当前已安装版本的官方文档"
updated: "2026-11-09"
internalBriefing:
  - date: "2026-11-02"
    note: "Hooks vs AGENTS.md alone"
  - date: "2026-11-03"
    note: "Shared SKILL.md across agents"
  - date: "2026-11-05"
    note: "One MCP server, per-tool config files"
  - date: "2026-11-07"
    note: "Lean CLAUDE.md; manual-only side-effect skills"
  - date: "2026-11-08"
    note: "One shared rules file; permissions enforce, prompts don't"
publicSources:
  - title: "Automate actions with hooks (Claude Code)"
    url: "https://code.claude.com/docs/en/hooks-guide"
    kind: docs
  - title: "Hooks reference (Claude Code)"
    url: "https://code.claude.com/docs/en/hooks"
    kind: docs
  - title: "How Claude remembers your project (CLAUDE.md, AGENTS.md, imports)"
    url: "https://code.claude.com/docs/en/memory"
    kind: docs
  - title: "Configure permissions (Claude Code)"
    url: "https://code.claude.com/docs/en/permissions"
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

自然语言规则文件（`AGENTS.md`、`CLAUDE.md`）能校准默认习惯，**但长上下文下模型依然会遗忘文字叮嘱**。把 agent 控制面拆成职责分明的五层：常驻上下文放规则文件、可复用多步作业抽成 `SKILL.md`、在文字规则与 hooks 之间用工具强制执行的 **权限规则**（`permissions.deny` / `ask`，不是沙箱）、再交给确定性的 **生命周期 hooks**，最后由 **CI** 构建门禁兜底。共用 MCP 服务器则按各工具原生格式分别配置。

> [!FLOW] 五层 Agent 控制与拦截管线
>
> 1. **常驻规则（`AGENTS.md` / `CLAUDE.md`）** — 每次会话加载精简目录导航、验证命令与代码风格约定。
> 2. **按需技能（`SKILL.md`）** — 把多步重复SOP按需挂载，避免撑爆日常上下文窗口。
> 3. **权限规则（`permissions.deny` / `ask`）** — 由工具在每次调用时强制执行（拒绝读取 `.env*`、`git push` 前询问）；不是沙箱。
> 4. **生命周期 Hooks（`PreToolUse` / `PostToolUse`）** — `PreToolUse` 在匹配调用执行前拒绝；`PostToolUse` 只做调用成功后的检查，不能阻止已发生的读写。
> 5. **CI 终审门禁（`npm run check && npm test && npm run build`）** — 合并或部署前分别执行类型检查、回归测试、schema 与产物校验。

> [!IMPORTANT] 文字只负责提醒；权限规则、hooks 与退出码才负责执法
> 凡是一旦违规就会泄露密钥、改坏数据库迁移或发出死链的底线规则，**绝不能**只写在 `AGENTS.md` 里。必须同时配上权限规则（`permissions.deny` / `ask`）、生命周期 hook（`PreToolUse` / `PostToolUse` / `Stop`）或返回非零退出码的构建门禁。

## 五层 Agent 控制面分工

<figure class="article-figure">
  <div class="theme-diagram" role="img" aria-label="五层 Agent 控制面：常驻规则、按需技能、权限规则、生命周期 Hooks、CI 终审门禁，从软建议到强制执行。">
    <img class="theme-diagram__light" src="/illustrations/rules-hooks/five-layer-control.zh.light.svg" alt="" data-decorative="true" width="720" height="420" />
    <img class="theme-diagram__dark" src="/illustrations/rules-hooks/five-layer-control.zh.dark.svg" alt="" data-decorative="true" width="720" height="420" />
  </div>
  <figcaption>五层结构：从软建议的规则与技能，经工具强制的权限规则（不是沙箱），到确定性的 hooks 与 CI 门禁。图中中文标签与下表一致；代码标识符保持原文。</figcaption>
</figure>


| 控制层 | 是否硬强制？ | 加载时机 | 该放什么内容 |
|---|---|---|---|
| **`AGENTS.md` / `CLAUDE.md`** | 软建议 | 每次会话常驻 | 目录结构、构建/测试命令、代码风格、核心禁区清单 |
| **`SKILL.md` 技能目录** | 流程引导 | 任务匹配时按需加载 | 可复用的多步 SOP（如周更入库、发版核查、迁移步骤） |
| **权限规则（`permissions.deny` / `ask`）** | **由工具强制执行** | 每次工具调用 | 拒绝读取 `.env*`、`git push` 前询问；不是沙箱 |
| **生命周期 Hooks** | **确定性硬拦截** | 固定工具调用/结束节点 | 拒绝读写受保护文件、跑快速静态检查、拦截未验证收工 |
| **CI / `npm run build`** | **确定性硬拦截** | 合并前与发版前 | 构建执行 schema 与链接/锚点校验；CI 另行执行类型检查与回归测试 |

## 把「口头希望」改造成自动门禁

| 脆弱的纯文字叮嘱 | 确定性的 Hook / 构建门禁替代方案 |
|---|---|
| *「请绝对不要读取或修改 `.env` 和私钥」* | `permissions.deny` 规则如 `Read(./.env)` / `Edit(./.env)`，再配 `PreToolUse` hook 覆盖规则表达不了的模式，并配合 `.gitignore` |
| *在 `CLAUDE.md` 里写「绝对别碰生产」* | 对你实际使用的部署命令配置 `deny` 或 `ask`（例如 `Bash(git push *)`），并把生产凭证放在 agent 够不到的机器外 |
| *「汇报完成前请务必跑一遍类型检查」* | `Stop` hook 执行 `npm run check`，把失败映射为退出码 `2`，并检查 `stop_hook_active`；编辑后检查不能撤销编辑 |
| *「翻译文章不要漏配 slug 或写错更新日志链接」* | 由 `scripts/validate.mjs` 与 `scripts/validate-output.mjs` 在构建期自动卡死 |

## 前置条件

- 已按当前厂商文档安装 [Claude Code](/zh/articles/claude-code/) 和/或 [Codex](/zh/articles/codex/)
- 具备足够快的验证命令（编辑期 hook 建议 `<15 秒`，完整发版门禁 `<60 秒`）
- 接入任何第三方 skill 包或外部 MCP 服务器前，已完成人工信任审阅

## 步骤

1. **给 `AGENTS.md` / `CLAUDE.md` 瘦身。** Anthropic 的[记忆文档](https://code.claude.com/docs/en/memory)建议每份 `CLAUDE.md` 控制在 200 行以内，并指出 `@path` 导入能整理文件结构，但**不会**降低上下文占用。我们的目标是约 80 行：目录说明、精确命令、编码规范与最高优先级边界。只针对仓库某一部分的说明，挪到按路径作用域的规则或 skill。
2. **全工具共用一份规则源文件。** Codex 与多数其他 agent 读 `AGENTS.md`；Claude Code 读 `CLAUDE.md`，若不存在 `CLAUDE.md`，也可直接读 `AGENTS.md`（文档写明自 v2.1.277 起）。若仍保留 `CLAUDE.md`，把首行写成 `@AGENTS.md`，其下只放 Claude 专属备注，避免两份文件漂移。`CLAUDE.md` → `AGENTS.md` 符号链接也能用，但官方文档在有人会在 Windows 上克隆时更推荐 import。跑 `/context all`，确认文件出现在 **Memory files** 下。
3. **挑出前 3 条「绝对不能出事」的红线**（触碰 `.env*`、篡改历史迁移、跳过验证直接收工），逐条补上权限规则、hook 或构建脚本校验。[权限文档](https://code.claude.com/docs/en/permissions)写得很清楚：规则由 Claude Code 强制执行，不是靠模型自觉，`CLAUDE.md` 里的文字改变不了它允许什么。deny 优先于 allow。Bash 规则匹配的是 Claude 写出的命令文本，因此换一种写法（如 `git -C . push`）就能绕过 `Bash(git push *)`；需要真正边界时用沙箱或 `PreToolUse` hook。Claude Code 的 `PreToolUse` 可在执行前拒绝工具调用；`PostToolUse` 在成功后运行，不能阻止或撤销操作；`Stop` 只能阻止结束，不能逆转此前动作。
4. **严控 Hook 耗时。** 高频触发的编辑期 hook 只跑路径白名单或单文件语法检查；全量构建与集成测试放到 `Stop` 阶段或提交前门禁，避免因太慢而自己动手关掉保护。
5. **把重复干三次以上的活抽成 `SKILL.md`。** 遵循 [Agent Skills](https://agentskills.io/) 开放结构（YAML 头部的 `name` + `description` + 正文执行步骤）。Claude Code 默认读取 `.claude/skills/<skill-name>/SKILL.md`；跨工具共用前先查清各工具当前版本的目录约定。对有副作用的 skill（部署、发布、发送），加上 `disable-model-invocation: true`，只有你输入 `/skill-name` 才会运行；`context: fork` 会在独立子 agent 上下文中跑 skill，适合重搜索类任务。
6. **跨工具共用同一台 MCP 服务器时，各写各的原生配置文件。** 服务可以只跑一份，但切勿幻想所有 CLI 自动共读同一份配置：
   - **Claude Code：** 项目 `.mcp.json`（或 `claude mcp add --scope project ...`）
   - **Codex：** `~/.codex/config.toml`（或受信任项目配置）中的 `[mcp_servers.<name>]`
   - **Cursor（若辅助使用）：** `.cursor/mcp.json`
   配完后分别在各工具自带的 MCP 状态页确认连通，密钥一律走环境变量引用，严禁明文入库。
7. **犯错当天闭环。** 每次踩坑复盘后，当天补一行规则、收紧对应 `SKILL.md` 或加一条拦截规则。

## 可直接复制的实用模板

### 1. 可复用 `SKILL.md` 骨架（`.claude/skills/weekly-refresh/SKILL.md`）

```markdown
---
name: weekly-refresh
description: 执行周日简报到站点的周更流程，核验原文链接与证据标签，并跑通完整静态构建门禁。
disable-model-invocation: true  # 会改内容且可能发布；仅通过 /weekly-refresh 手动触发
---

# 内容周更标准作业（SOP）

1. 过滤本周输入，只保留可复用的 OPC 实操动作、工具状态变化或安全告警。
2. 逐条打开引用的公开 URL；对社交帖中的效率数字保留「发帖人主张、未验证」限定。
3. 同步更新 `en` 与 `zh` 对应文章，保持相同 `slug` 并更新 `updated` 日期。
4. 新增周更记录，确认每条 `affectedPages` 在本版构建产物中真实存在。
5. 执行 `cd site && npm run check && npm test && npm run build`，全部零报错后才可收工。
```

### 2. 一份共用规则源 + 强制权限规则

```markdown
<!-- CLAUDE.md — AGENTS.md 仍是全工具唯一规则源 -->
@AGENTS.md

## 仅 Claude Code
对 `site/src/lib/` 下的改动使用计划模式。
```

保存为 `.claude/settings.json` — 由 Claude Code 强制执行，与提示词无关：

```json
{
  "permissions": {
    "deny": ["Read(./.env)", "Read(./.env.*)", "Edit(./.env)", "Edit(./.env.*)"],
    "ask": ["Bash(git push *)"]
  }
}
```

### 3. 同一 MCP 服务器在不同工具中的原生配置（零明文密钥）

Claude Code — 项目根目录 `.mcp.json`（仅引用环境变量，严禁提交真实密钥）：

```json
{
  "mcpServers": {
    "docs-lookup": {
      "command": "npx",
      "args": ["-y", "@example/docs-mcp-server"],
      "env": {
        "DOCS_API_TOKEN": "${DOCS_API_TOKEN}"
      }
    }
  }
}
```

```toml
# OpenAI Codex — ~/.codex/config.toml（遵循 Codex 官方 TOML 表结构）
[mcp_servers.docs-lookup]
command = "npx"
args = ["-y", "@example/docs-mcp-server"]
env_vars = ["DOCS_API_TOKEN"]
```

### 4. 控制面盘点工作表

```text
单一规则源（AGENTS.md）+ CLAUDE.md import，已用 /context 确认：
硬性禁区（必须自动报错阻断）：
权限 deny/ask 规则：
Hook 触发事件 + 匹配规则（Claude Code / CLI）：
快速 Hook 校验命令（<15 秒）：
完整发版门禁命令：
项目 Skills 目录与已启用技能列表：
共用 MCP 服务器名称与信任审阅日期：
  - Claude Code 配置位置：
  - Codex config.toml 条目：
```

> [!WARNING] 把第三方 Skills 与 MCP 当成可执行代码审阅
> 外部 `SKILL.md` 附带脚本以及会抓取外网网页的 MCP 服务器，都可能引入提示词注入或任意命令执行风险。启用前务必通读源码，并对照[安全速查](/zh/articles/security-quickcheck/)做好隔离。

### 5. 把 npm 失败转换为阻断退出码的 Stop 检查

Claude Code 命令 hook **不是任意非零退出都会阻断**：支持阻断的事件使用退出码 `2`；普通退出码 `1` 且无有效 JSON 决策时通常只是非阻断错误。另一种方式是以退出码 `0` 返回事件专属 JSON 决策（例如 `PreToolUse` 使用 `hookSpecificOutput.permissionDecision: "deny"`；`Stop` 使用顶层 `decision: "block"` 和 `reason`）。详见[退出码与事件参考](https://code.claude.com/docs/en/hooks#exit-code-2-behavior-per-event)。

以下示例针对本站仓库的 POSIX 目录结构，保存为仓库根目录下的 `.claude/hooks/stop-check.cjs`（先创建目录）。要求 PATH 中有 Node/npm，且 `site/` 已安装依赖。其他项目必须替换成自己的检查命令与目录；并非每个项目都有 `npm run check`。

```javascript
// stop-check.cjs — POSIX Node/npm example for this repository layout
const { readFileSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  if (input.hook_event_name !== 'Stop') throw new Error('Expected a Stop event');
  if (input.stop_hook_active === true) process.exit(0);
  const root = process.env.CLAUDE_PROJECT_DIR;
  if (!root) throw new Error('CLAUDE_PROJECT_DIR is required');
  const result = spawnSync('npm', ['--prefix', 'site', 'run', 'check'], {
    cwd: root, stdio: ['ignore', 2, 2], timeout: 45000,
  });
  if (result.error || result.status !== 0) {
    console.error('Typecheck failed or could not run. Inspect the output, fix it, and rerun verification.');
    process.exit(2);
  }
} catch {
  console.error('Stop check could not validate its input or run; inspect the hook configuration.');
  process.exit(2);
}
```

子进程的 stdout 与 stderr 都转写到 hook 的 **stderr**（`stdio: ['ignore', 2, 2]`）：退出码为 `2` 时 Claude Code 只把 stderr 回传给模型，类型检查打印在 stdout 的诊断信息否则模型看不到。

把以下 `Stop` 条目合并到现有 `.claude/settings.json` 的 `hooks` 对象中，不要覆盖其他 hooks：

```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "node",
        "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/stop-check.cjs"],
        "timeout": 60
      }]
    }]
  }
}
```

stdin 中的 `stop_hook_active` 防循环检查遵循[官方指引](https://code.claude.com/docs/en/hooks-guide#stop-hook-hits-the-block-cap)：后续停止请求会放行，避免无限循环。因此它只是反馈，**不是**所有检查已通过的证明，也不是安全权限边界。仍需独立的 CI 类型检查/测试/构建门禁与进程、文件权限。`PostToolUse` 无法撤销已经泄露的密钥；路径匹配还须覆盖 shell、MCP 等其他访问通道。依赖 hook 前请实测自己的工具/事件配置。本地回归测试只在隔离 npm 夹具中验证此包装器，未连接真实 Claude 会话。

## 完成定义

- [ ] `AGENTS.md` / `CLAUDE.md` 精炼清晰，写明了可直接执行的构建、类型检查与测试命令
- [ ] `CLAUDE.md` 通过 import 引入 `AGENTS.md`（或不保留 `CLAUDE.md`），保证各工具读到同一份规则
- [ ] 每条「绝不能发生」的底线都由权限规则、生命周期 hook 或非零退出的构建/CI 脚本兜底，而非只靠文字祈祷
- [ ] 重复性多步任务已抽成独立 `SKILL.md`，触发描述具体不撞车
- [ ] 所用的每个 agent 都通过各自原生配置文件连上共享 MCP，且 Git 仓库中零密钥残留
- [ ] 无关任务切换时主动清空上下文，避免旧指令残留污染

## 反模式

- **手写维护两份互不同步的 `AGENTS.md` 与 `CLAUDE.md`** —— 必然漂移；用 import 让一份指向另一份。
- **把 `AGENTS.md` 当成权限防火墙** —— 自然语言只能减少误操作，不能替代文件权限与进程隔离。
- **每次保存文件都触发耗时 3 分钟的全量测试 hook** —— 卡顿会逼你亲手关掉所有校验；高频 hook 务必控制在 15 秒内。
- **塞一个包罗万象的「团队开发总纲」巨型 Skill** —— 匹配边界模糊会导致乱触发；坚持一 Skill 一具体活。
- **把 JSON 硬塞进 Codex 的 `config.toml`** —— 跨工具复用时务必转换成对应 CLI 的原生配置方言，并在工具升级后复查文档。
