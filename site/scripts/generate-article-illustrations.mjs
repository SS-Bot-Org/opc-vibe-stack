// Run from site/: node scripts/generate-article-illustrations.mjs
// Editorial diagrams, not screenshots. All wording summarizes the adjacent articles.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../public/illustrations/', import.meta.url));
const palettes = {
  light: { bg: '#fafaf8', ink: '#191b20', muted: '#555b66', line: '#cbd0d8', paper: '#ffffff', blue: '#1f4b99', blueFill: '#e8eef8', green: '#286341', greenFill: '#eaf6ee', amber: '#805a15', amberFill: '#fff6e5', red: '#953b3b', redFill: '#fdecec' },
  dark: { bg: '#16191e', ink: '#edf0f5', muted: '#b6becb', line: '#455061', paper: '#20252d', blue: '#a4c2ff', blueFill: '#24314a', green: '#9cd6ae', greenFill: '#20362a', amber: '#e8c783', amberFill: '#3b3020', red: '#efaaaa', redFill: '#3e252b' },
};
const escape = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function canvas(p, title, subtitle, height) {
  const parts = [];
  const text = (x, y, value, size = 18, color = p.ink, weight = 400, anchor = 'start') => {
    parts.push(`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}" text-anchor="${anchor}">${escape(value)}</text>`);
  };
  const rect = (x, y, w, h, fill = p.paper, stroke = p.line, radius = 10, dash = '') => {
    parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
  };
  const line = (d, color = p.line, arrow = false, dash = '') => {
    parts.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${arrow ? ' marker-end="url(#arrow)"' : ''}${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
  };
  const step = (y, number, heading, detail, tone = 'blue') => {
    rect(24, y, 372, 76, p[`${tone}Fill`], p[tone]);
    text(42, y + 30, number, 17, p[tone], 700);
    text(83, y + 30, heading, 21, p.ink, 650);
    text(83, y + 56, detail, 17, p.muted);
  };
  const note = (y, a, b, tone = 'green') => {
    rect(24, y, 372, b ? 70 : 48, p[`${tone}Fill`], 'none');
    text(42, y + 29, a, 18, p[tone], 650);
    if (b) text(42, y + 54, b, 17, p[tone]);
  };
  text(24, 31, 'OPC / FIELD GUIDE', 12, p.muted, 650);
  text(24, 68, title, 25, p.ink, 700);
  text(24, 96, subtitle, 17, p.muted);
  return { text, rect, line, step, note, finish: () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 ${height}" role="img" aria-labelledby="title desc">
<title id="title">${escape(title)}</title><desc id="desc">${escape(subtitle)}</desc>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="${p.muted}" stroke-width="1.5"/></marker></defs>
<rect width="420" height="${height}" rx="12" fill="${p.bg}"/>
<g font-family="system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif">${parts.join('\n')}</g>
</svg>\n` };
}

const diagrams = [
  {
    slug: '48h-mvp-agent-stack', height: 610,
    en: ['The 48-hour runway', 'Four timeboxes. One working outcome.', ['Scope', 'Build', 'Demo', 'Freeze'], ['One user · five tasks or fewer', 'One verified vertical slice', 'Public URL · one clear action', 'Blockers only · no new features'], 'At each boundary: cut scope.', 'Keep the deadline; reduce the work.'],
    zh: ['48 小时交付跑道', '四段时间，只交付一个可用结果。', ['冻结范围', '构建切片', '打通演示', '冻结功能'], ['一个用户 · 最多五项任务', '一条通过验证的完整路径', '公开链接 · 一个明确行动', '只修阻塞问题 · 不加新功能'], '每到截止点，就缩减范围。', '保留交付时间，减少未完成工作。'],
    draw(c, t, p) {
      let x = 24;
      for (const [hours, tone] of [[4, 'blue'], [24, 'green'], [12, 'amber'], [8, 'red']]) {
        const width = hours / 48 * 372;
        c.rect(x, 119, width, 12, p[tone], 'none', 0); x += width;
      }
      c.text(24, 151, '0h', 14, p.muted); c.text(396, 151, '48h', 14, p.muted, 400, 'end');
      ['0–4h', '4–28h', '28–40h', '40–48h'].forEach((time, i) => {
        const y = 174 + i * 85;
        c.text(24, y + 20, time, 17, p[['blue', 'green', 'amber', 'red'][i]], 700);
        c.text(128, y + 20, t[2][i], 22, p.ink, 650);
        c.text(128, y + 47, t[3][i], 16, p.muted);
        c.line(`M24 ${y + 65} H396`);
      });
      c.note(526, t[4], t[5], 'amber');
    },
  },
  {
    slug: 'spec-first-agent-loop', height: 630,
    en: ['Make done observable', 'Write the contract before the code.', ['User + outcome', 'Scope + non-goals', 'Acceptance + verify'], 'One bounded task', 'Implement → run the check', 'PASS', 'Review + commit', 'FAIL', 'Fix or refine spec', 'A green check closes the loop.'],
    zh: ['把「完成」变成可验证结果', '先写清约定，再开始改代码。', ['目标用户与结果', '范围与明确不做的事', '验收条件与验证命令'], '一次只做一个有边界的任务', '实现 → 执行检查', '通过', '审阅并提交', '失败', '修复或完善规格', '验证通过，才算完成本轮。'],
    draw(c, t, p) {
      c.rect(24, 120, 372, 160);
      t[2].forEach((s, i) => { c.text(43, 155 + i * 48, `0${i + 1}`, 15, p.blue, 700); c.text(84, 155 + i * 48, s, 20); if (i < 2) c.line(`M43 ${170 + i * 48} H376`); });
      c.line('M210 281 V311', p.muted, true);
      c.rect(24, 324, 372, 85, p.blueFill, p.blue);
      c.text(210, 358, t[3], 21, p.ink, 650, 'middle'); c.text(210, 387, t[4], 18, p.muted, 400, 'middle');
      c.line('M210 410 V436 H110 V456', p.muted, true); c.line('M210 436 H310 V456', p.muted, true);
      [[t[5], t[6], 'green', 24], [t[7], t[8], 'amber', 220]].forEach(([label, detail, tone, x]) => {
        c.rect(x, 468, 176, 84, p[`${tone}Fill`], p[tone]); c.text(x + 16, 499, label, 18, p[tone], 700); c.text(x + 16, 528, detail, 17);
      });
      c.text(210, 597, t[9], 18, p.muted, 400, 'middle');
    },
  },
  {
    slug: 'codex', height: 586,
    en: ['Split by file ownership', 'Parallel work needs independent slices.', 'PARALLEL', 'SEQUENTIAL', ['Isolated bugfix', 'Content slice'], ['Shared schema', 'Dependencies'], 'Disjoint files', 'Shared contracts', 'Verify each slice', 'Review sensitive diffs', 'One task brief → one reviewable diff'],
    zh: ['按文件归属拆分任务', '只有相互独立的切片，才适合并行。', '可并行', '需串行', ['独立缺陷修复', '内容切片'], ['共享数据结构', '依赖变更'], '文件互不重叠', '修改公共约定', '逐一验证每个切片', '人工审阅敏感改动', '一份任务说明 → 一份可审阅改动'],
    draw(c, t, p) {
      [[24, 'green', t[2], t[4], t[6]], [220, 'amber', t[3], t[5], t[7]]].forEach(([x, tone, title, rows, foot]) => {
        c.rect(x, 125, 176, 242, p[`${tone}Fill`], p[tone]);
        c.text(x + 16, 157, title, 16, p[tone], 700);
        rows.forEach((s, i) => { c.rect(x + 12, 177 + i * 66, 152, 50, p.paper, 'none', 6); c.text(x + 88, 209 + i * 66, s, 17, p.ink, 600, 'middle'); });
        c.text(x + 88, 344, foot, 17, p[tone], 400, 'middle');
      });
      c.line('M112 368 V392 H210 V412', p.muted, true); c.line('M308 368 V392 H210');
      c.rect(24, 425, 372, 90);
      c.text(210, 459, t[8], 22, p.ink, 650, 'middle'); c.text(210, 489, t[9], 18, p.muted, 400, 'middle');
      c.text(210, 556, t[10], 17, p.blue, 600, 'middle');
    },
  },
  {
    slug: 'claude-code', height: 556,
    en: ['Put checks at the right time', 'A repository session, with clear gates.', ['Before a tool call', 'After successful execution', 'Before finishing'], ['PreToolUse', 'PostToolUse', 'Stop'], ['Can reject the call', 'Checks work already done', 'Checks completion conditions'], 'After-the-fact checks cannot undo', 'an action that already ran.'],
    zh: ['把检查放在正确时机', '在仓库会话中，区分三种检查。', ['工具调用之前', '工具执行成功之后', '准备结束会话时'], ['PreToolUse', 'PostToolUse', 'Stop'], ['可在执行前拒绝调用', '检查已经完成的操作', '检查完成条件'], '事后检查无法撤销', '已经执行的操作。'],
    draw(c, t, p) {
      c.line('M43 155 V416', p.line);
      t[2].forEach((heading, i) => {
        const y = 124 + i * 108, tone = ['blue', 'amber', 'green'][i];
        c.rect(63, y, 333, 94, p[`${tone}Fill`], 'none');
        c.rect(35, y + 31, 16, 16, p[tone], 'none', 8);
        c.text(80, y + 27, heading, 17, p.muted);
        c.text(80, y + 55, t[3][i], 23, p[tone], 700);
        c.text(80, y + 80, t[4][i], 17);
      });
      c.note(463, t[5], t[6], 'amber');
    },
  },
  {
    slug: 'grok-build', height: 570,
    en: ['Bridge build and buyer', 'Give every handoff a concrete artifact.', ['Working product', 'Public offer', 'Cold visitor'], ['Verified routes + behavior', 'Honest proof + one CTA', 'Demo → action → recovery'], 'Repository', 'Launch surface', 'Smoke test', 'Release authority stays human.', 'Credentials · deploy · rollback'],
    zh: ['从可用产品到用户行动', '每次交接，都留下明确产物。', ['产品已经可用', '公开价值主张', '陌生访客验证'], ['已验证的路由与行为', '真实证据与一个主要行动', '演示 → 行动 → 错误恢复'], '仓库实现', '上线页面', '冒烟测试', '发版权限仍由人掌握。', '凭证 · 部署 · 回滚'],
    draw(c, t, p) {
      t[2].forEach((heading, i) => {
        const y = 123 + i * 112, tone = ['blue', 'amber', 'green'][i];
        c.rect(24, y, 372, 86, p[`${tone}Fill`], 'none');
        c.text(42, y + 25, t[4 + i], 14, p[tone], 700);
        c.text(42, y + 52, heading, 23, p.ink, 650);
        c.text(42, y + 76, t[3][i], 17, p.muted);
        if (i < 2) c.line(`M210 ${y + 88} V${y + 105}`, p.muted, true);
      });
      c.note(478, t[7], t[8]);
    },
  },
  {
    slug: 'hardware-soft-split', height: 614,
    en: ['Three independent releases', 'Core controls must work offline.', 'Cloud · optional', 'Backup / sync / opt-in telemetry', 'Companion app', 'Pairing / controls / diagnostics', 'BLE / USB contract + mock', 'Firmware', 'Device behavior / bench testing', 'Human-held signing keys', 'Hardware checks before release'],
    zh: ['三层架构，独立发版', '断开云服务，核心控制仍然可用。', '云服务 · 可选', '备份 / 同步 / 自愿诊断数据', '配套应用', '配对 / 控制 / 故障诊断', 'BLE / USB 协议与模拟器', '设备固件', '设备行为 / 实物台架测试', '签名密钥由人保管', '通过实物测试，再发布固件'],
    draw(c, t, p) {
      c.rect(24, 122, 372, 84, p.paper, p.line, 10, '6 5');
      c.text(42, 155, t[2], 23, p.ink, 650); c.text(42, 183, t[3], 17, p.muted);
      c.line('M210 207 V235', p.muted, true, '5 5');
      c.rect(24, 247, 372, 85, p.blueFill, p.blue);
      c.text(42, 280, t[4], 23, p.ink, 650); c.text(42, 308, t[5], 17, p.muted);
      c.line('M210 333 V355', p.muted, true); c.text(210, 381, t[6], 18, p.blue, 600, 'middle'); c.line('M210 392 V414', p.muted, true);
      c.rect(24, 426, 372, 85, p.greenFill, p.green);
      c.text(42, 459, t[7], 23, p.ink, 650); c.text(42, 487, t[8], 17, p.muted);
      c.note(531, t[9], t[10], 'amber');
    },
  },
  {
    slug: 'security-quickcheck', height: 641,
    en: ['Five surfaces to inspect', 'A defensive map, not incident proof.', ['Editor extensions', 'SSH authorized_keys', 'Agent sessions', 'Deploy credentials', 'MCP + skills'], ['Publisher + recent updates', 'Recognized owner for every key', 'Active sessions + token access', 'Scope + environment exposure', 'Scripts + connected services'], 'Suspected exposure?', 'Isolate → revoke → inspect → re-issue'],
    zh: ['五个需要检查的暴露面', '这是一张防护地图，不是事件证据。', ['编辑器扩展', 'SSH authorized_keys', 'Agent 会话', '部署凭证', 'MCP 与技能'], ['核对发布者与近期更新', '每把密钥都应有明确归属', '检查活跃会话与令牌权限', '检查权限范围与环境暴露', '审阅脚本与连接的服务'], '怀疑凭证已经暴露？', '隔离 → 撤销 → 排查 → 重新签发'],
    draw(c, t) {
      t[2].forEach((s, i) => c.step(122 + i * 85, `0${i + 1}`, s, t[3][i], i % 2 ? 'amber' : 'blue'));
      c.note(555, t[4], t[5], 'red');
    },
  },
  {
    slug: 'ship-demo-checklist', height: 664,
    en: ['A page that answers buyers', 'Concept wireframe · not a product UI.', ['Who is this for?', 'What pain does it solve?', 'Show the real outcome', 'Why should I believe it?', 'What do I do next?'], ['Audience + one-line offer', 'Recognizable status-quo friction', 'One input → output demo', 'Repository / docs / real results', 'One CTA + clear access terms'], 'The ≤90-second demo', 'Problem → workflow → result → CTA'],
    zh: ['让页面回答用户的问题', '概念线框图 · 非真实产品界面。', ['这是给谁用的？', '能解决什么问题？', '实际结果是什么？', '凭什么相信它？', '下一步做什么？'], ['目标用户与一句话价值', '用户能认出的现状痛点', '演示一条输入到输出路径', '仓库 / 文档 / 真实结果', '一个行动入口与明确使用条件'], '不超过 90 秒的演示', '问题 → 工作流 → 结果 → 行动'],
    draw(c, t, p) {
      c.rect(24, 121, 372, 423);
      c.rect(24, 121, 372, 26, p.line, 'none', 9);
      [39, 53, 67].forEach(x => c.rect(x, 132, 5, 5, p.muted, 'none', 3));
      t[2].forEach((heading, i) => {
        const y = 158 + i * 76;
        if (i === 4) c.rect(36, y, 348, 68, p.blueFill, 'none', 7);
        c.text(48, y + 25, `0${i + 1}`, 14, p.blue, 700);
        c.text(83, y + 25, heading, 20, p.ink, 650); c.text(83, y + 50, t[3][i], 16, p.muted);
        if (i < 4) c.line(`M43 ${y + 64} H377`);
      });
      c.text(24, 579, t[4], 21, p.ink, 650);
      c.text(24, 610, t[5], 17, p.muted);
      const segments = [10, 35, 25, 20]; let x = 24;
      segments.forEach((duration, i) => { const w = duration / 90 * 372; c.rect(x, 631, w - 2, 9, p[['blue', 'green', 'amber', 'red'][i]], 'none', 0); x += w; });
    },
  },
  {
    slug: 'weekly-content-site-refresh', height: 662,
    en: ['Publish only useful change', 'A weekly loop with an early exit.', 'Changes a real action?', 'NO', 'Record “no update”', 'YES', ['Verify primary sources', 'Revise + label evidence', 'Changelog + build gate', 'Release + smoke checks'], 'Keep the previous release.', 'A failed release needs a rollback.'],
    zh: ['只发布能改变实践的内容', '每周更新，也允许提前结束。', '是否改变实际行动？', '否', '记录「本周无更新」', '是', ['核实一手来源', '修改文章与证据标签', '更新日志与构建门禁', '发布并执行冒烟检查'], '保留上一个可用版本。', '发布失败时，有明确的回滚目标。'],
    draw(c, t, p) {
      c.rect(24, 122, 372, 56, p.blueFill, p.blue);
      c.text(210, 157, t[2], 22, p.ink, 650, 'middle');
      c.line('M301 179 V206', p.muted, true); c.text(331, 203, t[3], 15, p.amber, 700);
      c.rect(186, 218, 210, 49, p.amberFill, 'none'); c.text(291, 249, t[4], 17, p.amber, 600, 'middle');
      c.line('M64 179 V282', p.muted, true); c.text(77, 235, t[5], 15, p.green, 700);
      t[6].forEach((s, i) => {
        const y = 297 + i * 63;
        c.rect(24, y, 372, 47, i === 3 ? p.greenFill : p.paper, i === 3 ? p.green : p.line, 7);
        c.text(42, y + 30, `0${i + 1}`, 15, p.blue, 700); c.text(84, y + 30, s, 19, p.ink, 600);
        if (i < 3) c.line(`M210 ${y + 48} V${y + 57}`, p.muted, true);
      });
      c.note(567, t[7], t[8]);
    },
  },
];

for (const diagram of diagrams) {
  const dir = path.join(root, diagram.slug);
  await mkdir(dir, { recursive: true });
  for (const locale of ['en', 'zh']) {
    for (const [theme, palette] of Object.entries(palettes)) {
      const t = diagram[locale];
      const c = canvas(palette, t[0], t[1], diagram.height);
      diagram.draw(c, t, palette);
      const name = `overview${locale === 'zh' ? '.zh' : ''}.${theme}.svg`;
      await writeFile(path.join(dir, name), c.finish());
    }
  }
}
console.log(`Generated ${diagrams.length * 4} bilingual light/dark article diagrams.`);
