#!/usr/bin/env python3
"""Typographic Open Graph cards (1200×630). Self-made, no AI art, no screenshots."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parents[1] / 'public' / 'og'
FONT_REG = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
FONT_BOLD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
BG, BAR, INK, MUTED, RULE = (250, 250, 248), (31, 75, 153), (26, 26, 26), (92, 92, 92), (232, 238, 248)
W, H = 1200, 630

def font(path, size):
    return ImageFont.truetype(path, size=size, index=0)

def wrap(draw, text, fnt, max_width):
    words = text.split()
    # For CJK-heavy strings with few spaces, wrap by characters when needed.
    if len(words) <= 2 and len(text) > 18:
        lines, cur = [], ''
        for ch in text:
            trial = cur + ch
            if draw.textlength(trial, font=fnt) <= max_width or not cur:
                cur = trial
            else:
                lines.append(cur)
                cur = ch
        if cur:
            lines.append(cur)
        return lines
    lines, cur = [], ''
    for word in words:
        trial = word if not cur else f'{cur} {word}'
        if draw.textlength(trial, font=fnt) <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines

def card(path, kicker, title, subtitle):
    img = Image.new('RGB', (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, 36, H), fill=BAR)
    draw.rectangle((36, 0, W, 36), fill=RULE)
    brand = font(FONT_BOLD, 28)
    kick = font(FONT_REG, 26)
    title_f = font(FONT_BOLD, 64)
    sub_f = font(FONT_REG, 30)
    foot = font(FONT_REG, 22)
    draw.text((80, 70), 'OPC Vibe Stack', font=brand, fill=BAR)
    draw.text((80, 120), kicker, font=kick, fill=MUTED)
    y = 200
    for line in wrap(draw, title, title_f, W - 160)[:4]:
        draw.text((80, y), line, font=title_f, fill=INK)
        y += 76
    y += 8
    for line in wrap(draw, subtitle, sub_f, W - 180)[:3]:
        draw.text((80, y), line, font=sub_f, fill=MUTED)
        y += 42
    draw.rectangle((80, H - 86, 280, H - 82), fill=BAR)
    draw.text((80, H - 70), 'opcvibestack.com', font=foot, fill=MUTED)
    OUT.mkdir(parents=True, exist_ok=True)
    dest = OUT / path
    img.save(dest, 'PNG', optimize=True, compress_level=9)
    print(f'{dest.name} {dest.stat().st_size}')

CARDS = [
    ('claude-code.en.png', 'Tool guide', 'Claude Code', 'Plan-first refactors and enforceable hooks'),
    ('claude-code.zh.png', '工具指南', 'Claude Code', '先计划后改码，并用 hooks 约束行为'),
    ('codex.en.png', 'Tool guide', 'Codex', 'From task specs to verifiable code changes'),
    ('codex.zh.png', '工具指南', 'Codex', '从任务规格到可验证的代码改动'),
    ('grok-build.en.png', 'Tool guide', 'Grok Build', 'Buyer-facing pages, honest proof, and a CTA'),
    ('grok-build.zh.png', '工具指南', 'Grok Build', '面向买家的页面、诚实证据与主 CTA'),
    ('spec-first-agent-loop.en.png', 'Research guide', 'Spec first, then let the agent change code', 'Outcomes, boundaries, and a verify command before edits'),
    ('spec-first-agent-loop.zh.png', '调研指南', '先写规格，再让 agent 改代码', '先写清结果、边界和验收命令，再改仓库'),
    ('rules-hooks.en.png', 'Build checklist', 'Rules files + hooks', 'Don’t rely on AGENTS.md alone'),
    ('rules-hooks.zh.png', '构建清单', '规则文件 + hooks', '别只靠 AGENTS.md'),
    ('48h-mvp-agent-stack.zh.png', 'Playbook', '48 小时 MVP', '建议的时间预算：规格、切片、验证、演示'),
    ('hardware-soft-split.zh.png', '硬件指南', '固件 vs 配套 App', '拆分发版节奏，供应链与合规需人工核实'),
]

if __name__ == '__main__':
    for item in CARDS:
        card(*item)
