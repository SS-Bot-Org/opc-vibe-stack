import type { Locale } from './site';

export type JourneyStage = 'research' | 'build' | 'sell';

export type StageCopy = {
  /** Short H1 / nav-aligned name */
  heading: string;
  /** Intent-clear document title (SiteLayout appends the brand). */
  title: string;
  description: string;
  lede: string;
  questionHeading: string;
  questions: string[];
  deliverableHeading: string;
  deliverables: string[];
  readingHeading: string;
  primaryHeading: string;
  supplementaryHeading: string;
  supplementaryLede: string;
  empty: string;
};

export const stageReadingOrder: Record<JourneyStage, string[]> = {
  research: ['spec-first-agent-loop'],
  build: ['rules-hooks'],
  sell: ['ship-demo-checklist'],
};

/** Shared cross-stage guides, shown as supplementary references — editorial reading order. */
export const supplementaryReadingOrder = [
  '48h-mvp-agent-stack',
  'weekly-content-site-refresh',
  'security-quickcheck',
  'hardware-soft-split',
] as const;

export const stageCopy: Record<Locale, Record<JourneyStage, StageCopy>> = {
  en: {
    research: {
      heading: 'Research',
      title: 'Research Before Coding: Specs and Acceptance Checks',
      description: 'Before an agent edits your repo, write the outcome, boundaries, and a verify command a stranger could run.',
      lede: 'Start here when the job is still fuzzy: lock the slice in writing, then let an agent change code.',
      questionHeading: 'Entry questions',
      questions: [
        'What observable outcome would prove this slice is done?',
        'Which files, routes, and non-goals must stay frozen?',
        'What command will fail the work if the agent drifts?',
      ],
      deliverableHeading: 'What you should leave with',
      deliverables: [
        'A short slice brief (user, pain, success signal, non-goals, timebox)',
        'Stranger-testable acceptance checks (URLs, exit codes, or named tests)',
        'A task list small enough for one-diff human review',
      ],
      readingHeading: 'Suggested reading order',
      primaryHeading: 'Research guides',
      supplementaryHeading: 'Supplementary references',
      supplementaryLede: 'These cross-stage guides also help during research, but they are not this stage’s primary path.',
      empty: 'No published research articles yet.',
    },
    build: {
      heading: 'Build',
      title: 'Build With Agents: Rules, Hooks, and Verify Gates',
      description: 'Turn writing and conventions into enforceable checks so agents can edit a repo without silent drift.',
      lede: 'Start here when you already know the slice and need the repo to refuse unsafe or unfinished work.',
      questionHeading: 'Entry questions',
      questions: [
        'Where do conventions live, and which tool actually reads them?',
        'Which failures must be blocked before a tool runs, not after?',
        'What hook, permission rule, or CI check fails the release if a rule is broken?',
      ],
      deliverableHeading: 'What you should leave with',
      deliverables: [
        'A single rules source the tools you use will load',
        'Permission rules or pre-execution hooks for hard no-gos',
        'A verify command and CI/build gate that exit nonzero on forbidden or broken output',
      ],
      readingHeading: 'Suggested reading order',
      primaryHeading: 'Build guides',
      supplementaryHeading: 'Supplementary references',
      supplementaryLede: 'These cross-stage guides also apply while building; use them as references, not as this stage’s outline.',
      empty: 'No published build articles yet.',
    },
    sell: {
      heading: 'Sell',
      title: 'Sell the Work: Landing Pages and Demo Checklists',
      description: 'Turn a working repo into a stranger-ready offer: an honest page, a short demo path, and a single call to action.',
      lede: 'Start here when the slice already works and you need a visitor to understand the offer without you narrating.',
      questionHeading: 'Entry questions',
      questions: [
        'Can a cold visitor grasp the offer on one screen?',
        'What is the one action you want them to take, and does it work?',
        'Which claims on the page can you demonstrate or source—and which should come out?',
      ],
      deliverableHeading: 'What you should leave with',
      deliverables: [
        'A five-block landing path (pain, proof, offer, CTA, recovery)',
        'A ≤90-second demo storyboard on a real URL',
        'A pass of the ship/demo checklist, including honest copy and staging-safe capture',
      ],
      readingHeading: 'Suggested reading order',
      primaryHeading: 'Sell guides',
      supplementaryHeading: 'Supplementary references',
      supplementaryLede: 'These cross-stage guides support a public launch, but they are not this stage’s primary reading path.',
      empty: 'No published sell articles yet.',
    },
  },
  zh: {
    research: {
      heading: '调研',
      title: '动手写代码前：先写规格与验收标准',
      description: '在编码 agent 改仓库之前，先写清要达成的结果、冻结的边界，以及陌生人也能独立跑通的验证命令。',
      lede: '当任务还不够清楚时从这里开始：先把切片写下来，再让 agent 改代码。',
      questionHeading: '入口问题',
      questions: [
        '怎样的可观察结果，才能证明这个切片已经完成？',
        '哪些文件、路由和不做事项必须先冻结？',
        '如果 agent 写偏了，哪一条命令会让这次工作失败？',
      ],
      deliverableHeading: '这一阶段应带走的交付物',
      deliverables: [
        '一份简短的切片说明（用户、痛点、成功信号、非目标、时间盒）',
        '陌生人可验证的验收条件（URL、退出码或具名测试）',
        '小到人类可以审完一个 diff 的任务列表',
      ],
      readingHeading: '建议阅读顺序',
      primaryHeading: '调研指南',
      supplementaryHeading: '补充参考',
      supplementaryLede: '这些跨阶段指南在调研时也有用，但不是本栏目的主路径。',
      empty: '暂无已发布的调研文章。',
    },
    build: {
      heading: '构建',
      title: '用 Agent 构建：规则、Hooks 与验证门禁',
      description: '把仓库约定写成权限规则、hooks 与构建门禁，避免编码 agent 改代码时出现无声漂移。',
      lede: '当切片已经明确、需要仓库拒绝不安全或未完成的改动时，从这里开始。',
      questionHeading: '入口问题',
      questions: [
        '约定写在哪里，你使用的工具会不会真正读到？',
        '哪些失败必须在工具执行前拦截，而不是事后补救？',
        '规则被打破时，哪一条权限规则、hook 或 CI 检查会让发布失败？',
      ],
      deliverableHeading: '这一阶段应带走的交付物',
      deliverables: [
        '一份你在用的工具都会加载的规则源',
        '针对硬红线的权限规则或执行前 hook',
        '一条在禁止改动或产物损坏时非零退出的验证命令与构建/CI 门禁',
      ],
      readingHeading: '建议阅读顺序',
      primaryHeading: '构建指南',
      supplementaryHeading: '补充参考',
      supplementaryLede: '这些跨阶段指南在构建过程中同样适用，请当作参考，而不是本栏目的提纲。',
      empty: '暂无已发布的构建文章。',
    },
    sell: {
      heading: '销售',
      title: '把作品卖出去：落地页与演示清单',
      description: '把已经跑通的仓库变成陌生人能看懂的供给：诚实的页面、短演示路径，以及一个主行动号召。',
      lede: '当切片已经能跑、需要访客在没有你旁白的情况下看懂供给时，从这里开始。',
      questionHeading: '入口问题',
      questions: [
        '冷访客能否在一屏内看懂你的供给？',
        '你希望对方采取的唯一行动是什么，这条路径现在通不通？',
        '页面上的哪些主张可以当场演示或给出出处，哪些应该删掉？',
      ],
      deliverableHeading: '这一阶段应带走的交付物',
      deliverables: [
        '五段式落地路径（痛点、证据、供给、主 CTA、恢复说明）',
        '一条在真实 URL 上不超过 90 秒的演示分镜（这是建议时长，不是实测平均值）',
        '通过上线/演示清单，包括诚实文案与预发环境安全录屏',
      ],
      readingHeading: '建议阅读顺序',
      primaryHeading: '销售指南',
      supplementaryHeading: '补充参考',
      supplementaryLede: '这些跨阶段指南对公开上线有帮助，但不是本栏目的主阅读路径。',
      empty: '暂无已发布的销售文章。',
    },
  },
};
