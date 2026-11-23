---
title: "Google Antigravity"
seoTitle: "Google Antigravity 实战：上线前在浏览器里走查买家路径"
subtitle: "规划一处页面改动、在浏览器里测试，并留下可审阅 walkthrough 的 agent 工作流"
slug: antigravity
summary: "Google 的 agent 应用与 CLI。本站用它规划一处面向买家的改动、在浏览器里走查路径，并留下可审阅的 walkthrough。"
locale: zh
category: stack
stage: sell
tools: [antigravity]
priority: P0
status: published
evidence: documentation-backed
applicableToolsVersions: "Google Antigravity App v2.30.0+（个人 Google 账号的内置浏览器 agent）与 Antigravity CLI（agy）的 /browser；已于 2026-11-22 对照官方文档和 App v2.34.0 changelog 核对。请按你的方案和账号类型确认可用性"
published: "2026-11-22"
updated: "2026-11-22"
internalBriefing:
  - date: "2026-11-19"
    note: "Gemini 4 Neon and Orchestrator in Antigravity; shared AGENTS.md caution"
  - date: "2026-11-20"
    note: "Antigravity 2.34.0 changelog"
publicSources:
  - title: "Google Antigravity docs: Get started"
    url: "https://antigravity.google/docs/getting-started/"
    kind: docs
  - title: "Google Antigravity docs: Browser use"
    url: "https://antigravity.google/docs/browser/"
    kind: docs
  - title: "Google Antigravity docs: Browser command (/browser)"
    url: "https://antigravity.google/docs/commands/browser/"
    kind: docs
  - title: "Google Antigravity docs: Implementation plan"
    url: "https://antigravity.google/docs/implementation-plan/"
    kind: docs
  - title: "Google Antigravity docs: Walkthrough"
    url: "https://antigravity.google/docs/walkthrough/"
    kind: docs
  - title: "Google Antigravity docs: Agent permissions"
    url: "https://antigravity.google/docs/permissions/"
    kind: docs
  - title: "Google Antigravity docs: Rules"
    url: "https://antigravity.google/docs/rules/"
    kind: docs
  - title: "Google Antigravity docs: Choose a model"
    url: "https://antigravity.google/docs/models/"
    kind: docs
  - title: "Google Antigravity changelog"
    url: "https://antigravity.google/docs/changelog/"
    kind: docs
tags: [stack, sell, browser, launch]
toolId: antigravity
toolAvailability: active
bestFor: "在真实浏览器里检查一处面向买家的改动，并保留计划、walkthrough 和截图供审阅。"
poorFit: "把 agent 的浏览器报告当成已部署或陌生访客测试；无法观察或中止浏览器操作的工作环境。"
caveats: "浏览器功能因界面、账号类型和版本而异。销售阶段的分工是本站的工作流选择，不是厂商排名。"
---

## 结论

Google Antigravity 包括 agent 桌面应用、CLI（`agy`）和一组编辑器扩展。本指南只用它做销售阶段的一件事：为面向买家的页面规划一处小改动，让 agent 在浏览器里走一遍路径，并把计划、walkthrough 和截图留作由你审阅的证据。这个分工是**编辑选择**。同样的页面改动，Claude Code 或 Codex 也能完成；agent 的浏览器报告也不能代替你亲自检查已部署的页面。

## 第一次实践：检查一个页面和它的主 CTA

**准备：** 一个落地页或定价页已能在本地运行的仓库、主要行动按钮（CTA：开启买家目标任务的按钮或链接），以及项目的构建命令。

1. 按[官方入门指南](https://antigravity.google/docs/getting-started/)安装应用或 CLI 并登录。打开项目文件夹；只有你确实打算信任的仓库，才在工作区信任提示中确认。
2. 先要计划，再改代码。在 Planning 模式下或使用 `/plan`，agent 会写出[实施计划](https://antigravity.google/docs/implementation-plan/)并等你审阅。在计划上留评论来收窄范围：不改后端、登录鉴权、依赖和部署。
3. 改完后，自己跑构建、启动本地预览，再让 agent 在浏览器里检查页面：桌面宽度和 390px 宽度，点击 CTA、完成目标操作，并报告控制台错误和失败的网络请求。
4. 阅读 agent 完成任务后写的 [walkthrough](https://antigravity.google/docs/walkthrough/)，要求它嵌入检查时截的图。然后在一个全新的浏览器会话里，亲自再点一次 CTA。

**保留：** 审阅过的计划、diff、带截图的 walkthrough，以及你自己对 CTA 的通过/失败记录。如果你的账号还没有内置浏览器，就用 Chrome 配合 `/browser`（见前置条件），或者手动测试。两条路径都不会部署任何东西。

> [!FLOW] 单条买家路径：从计划到证据
> 1. **先看计划** — 审阅实施计划，删掉页面和 CTA 以外的一切。
> 2. **只改一个页面** — 批准一处小的文案或布局 diff；构建命令由你自己运行。
> 3. **走查预览** — 让 agent 检查桌面与 390px、CTA、控制台和失败请求。
> 4. **审阅证据** — 读 walkthrough 和截图，然后亲自再点一次 CTA。

## 它在工具栈里的位置

<figure class="article-figure article-figure--overview">
  <div class="theme-diagram" role="img" aria-label="检查买家实际走的路径">
    <img class="theme-diagram__light" src="/illustrations/antigravity/overview.zh.light.svg" alt="" data-decorative="true" width="420" height="580" loading="lazy" decoding="async" />
    <img class="theme-diagram__dark" src="/illustrations/antigravity/overview.zh.dark.svg" alt="" data-decorative="true" width="420" height="580" loading="lazy" decoding="async" />
  </div>
  <figcaption><strong>检查买家实际走的路径</strong> 改代码前先审阅计划，让 agent 浏览本地预览，阅读 walkthrough 和截图；部署、DNS 与回滚始终由人掌握。agent 的报告不等于已上线。</figcaption>
</figure>

| 工作层 | 主要负责方 | 交接产物 |
|---|---|---|
| 核心逻辑、数据结构、hooks 与回归测试 | [Claude Code](/zh/articles/claude-code/) / [Codex](/zh/articles/codex/) | 构建与测试命令全部通过 |
| 一处面向买家的页面改动及其浏览器检查 | **Google Antigravity** 或你选定的仓库 agent | 审阅过的计划 + diff + 带截图的 walkthrough |
| 录制演示与上线清单 | 人工 + [发布与演示清单](/zh/articles/ship-demo-checklist/) | 你自己录制的演示与移动端冒烟记录 |
| 凭证、DNS/CDN、生产部署与回滚 | **创始人本人** | 已验证的探测结果与回滚目标 |

## 官方文档怎么说（官方事实）

| 能力 | 文档出处 | 条件 |
|---|---|---|
| 用自然语言请求即可启动内置浏览器 agent | [Browser use](https://antigravity.google/docs/browser/) | Antigravity App v2.30.0+，正向个人 Google 账号（Free、Plus、Google AI Pro、Ultra）逐步推出。商务/企业账号、Remote Agents 和 SSH 窗口暂不可用 |
| 在你自己的 Chrome 上运行 `/browser` 子 agent | [Browser command](https://antigravity.google/docs/commands/browser/) | CLI、Antigravity IDE v2.6.0+，以及应用中的商务/企业账号。Chrome v144+ 须已在同一台机器上运行并允许远程调试；CLI 和 IDE 还需要 Node.js（`npx`） |
| 观察、停止并接管 agent 标签页；登录交接 | [Browser use](https://antigravity.google/docs/browser/) | 应用内置浏览器。遇到登录、多因素认证、passkey 或验证码时，agent 会暂停等你处理 |
| 为浏览器子 agent 可打开的网站设置 Allow / Ask / Deny 规则 | [Browser use](https://antigravity.google/docs/browser/) | 设置 > Browser > Browser Actuation Rules |
| 实施计划会等待审阅 | [Implementation plan](https://antigravity.google/docs/implementation-plan/) | 应用与 IDE 扩展；`/plan` 总会停下等你批准 |
| 实施完成后生成 walkthrough，可按要求附截图 | [Walkthrough](https://antigravity.google/docs/walkthrough/) | 应用与 IDE 扩展。浏览器录屏是可选的，且不保证生成 |
| 桌面应用的权限预设 | [Agent permissions](https://antigravity.google/docs/permissions/) | Default 在沙箱中运行终端命令。命令需要在沙箱外运行时会请求批准，已有规则允许的命令除外。 |
| `AGENTS.md` / `GEMINI.md` 与 `.agents/rules/` 作为规则加载 | [Rules](https://antigravity.google/docs/rules/) | 从工作区文件夹向上加载到仓库根目录，不加载其下的子文件夹；单文件上限 24,000 字节 |

## 前置条件

- 按[官方指南](https://antigravity.google/docs/getting-started/)安装桌面应用或 CLI 并登录。桌面应用用户可在 **设置 > Browser** 查看当前账号使用的浏览器。
- 所改页面的本地预览命令和构建命令
- 一份写明精确命令与边界的共享 `AGENTS.md`（见[规则文件 + hooks](/zh/articles/rules-hooks/)）
- 桌面应用启用内置浏览器后，自然语言请求和 `/browser` 都直接使用侧栏。只有通过 Chrome DevTools 连接本机 Chrome 时，才需要先启动 Chrome v144+ 并在 `chrome://inspect/#remote-debugging` 允许远程调试。CLI 和 IDE 还需要能在 `PATH` 中找到 Node.js（`npx`）。

## 步骤

1. **确认终端命令由谁批准。** 在桌面应用的权限选择器里查看当前预设，沙箱可用时可为本次任务选择 **Default**。在 CLI 中，用 `/config` 查看当前模式。CLI 1.5.7+ 在支持的环境中默认使用 `auto`，被判定为安全且可逆的命令可能无需确认就能在沙箱外运行。需要逐条审阅命令时，选择 `default` 模式并使用 `request-review` 工具策略，同时检查已有的权限规则，因为它们优先生效。[官方权限说明](https://antigravity.google/docs/permissions/)
2. **沿用现有的 `AGENTS.md`。** Antigravity 会把它当作始终生效的规则加载，同时也加载 `GEMINI.md` 和 `.agents/rules/*.md`。指令要保持与工具无关。编辑建议：工具专属的说明放进该工具自己的文件，不要在共享文件里写“如果你是某某工具”这类分支。有用户反映项目因为这样一行指令卡住，本站未复现。
3. **先出计划，再留评论。** 用 `/plan` 或 Planning 模式，在[实施计划](https://antigravity.google/docs/implementation-plan/)上留评论，直到它只涉及该页面、样式和 CTA。
4. **构建由你自己运行。** 使用项目自己的构建和预览命令。在过期的开发服务器上通过浏览器检查，证明不了发布构建没问题。
5. **给浏览器检查写好脚本。** 写明 URL、视口宽度、CTA、预期的最终状态，以及一个失败或空状态；要求报告控制台错误和失败的网络请求。用 Browser Actuation Rules 限制子 agent 能打开的网站。
6. **像审 PR 一样审 walkthrough。** 逐张核对截图是否对应它声称的步骤。如果 agent 在某处登录过，确认它用的是哪个账号。
7. **按方案选模型，别只看默认值。** 官方事实（[模型文档](https://antigravity.google/docs/models/)）：Free 和 Plus 方案不能用 Gemini 4 Neon。Orchestrator 用一个模型做规划、把步骤交给更快的模型执行；在 Google AI Pro 和 Ultra 上可以用 Neon 做规划，在 Gemini Enterprise 上则固定为 Gemini 4 Carbon 搭配 Gemini 4 Hydrogen。本站没有比较过模型质量或成本。

> [!NOTE] 本指南没有测试什么
> 本次更新没有在本仓库上实际运行 Antigravity。上文所有工具行为都来自 2026-11-22 打开的官方文档。浏览器功能按账号类型和版本逐步推出，桌面应用用户规划任务前可在 **设置 > Browser** 确认可用性。

## 入门模板

### 浏览器检查请求

```text
Start the preview with: <your preview command>
Open: http://localhost:<port>/<page>
Check at desktop width and at 390px:
1. The headline and the primary CTA are visible without scrolling on desktop.
2. Click the CTA and complete: <intended action>. Expected end state: <what success looks like>.
3. Try one failure or empty state: <e.g. submit the form empty>. Expected: <message>.
Report console errors and failed network requests.
Do not change backend, auth, dependencies, or deployment files.
Put screenshots of each step in the walkthrough.
```

### 你自己保留的通过/失败记录

```text
日期 / 提交：
页面 + CTA：
已审阅 agent 的 walkthrough（是/否）：
我在全新会话中亲自点击 CTA（通过/失败）：
未解决问题：
```

## 完成定义

- [ ] 实施计划已审阅，且只涉及该页面、样式和 CTA
- [ ] 项目自己的构建命令由你运行并通过
- [ ] walkthrough 包含桌面与 390px 截图、CTA 的最终状态，以及一个失败或空状态
- [ ] 你在全新浏览器会话里亲自再点了一次 CTA
- [ ] 部署、DNS、凭证与回滚都没有交给 agent 会话

## 反模式

- **为了不再弹确认就把桌面应用切到 Turbo** — 它会移除终端沙箱、放开整个文件系统；应改为添加具体的 allow 规则。
- **把 agent 的浏览器检查当成上线检查** — 它跑的是本地预览，用的是 agent 的浏览器配置；陌生访客访问已部署 URL 是另一项测试。
- **让浏览器子 agent 登录生产后台** — 只让它访问本地预览和预发布环境；登录交接意味着你把那个会话的权限交给了它。
