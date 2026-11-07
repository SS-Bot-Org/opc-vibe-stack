---
title: "固件 vs 配套 App：OPC 硬件软硬拆分"
slug: hardware-soft-split
summary: "分开固件、配套 App 与云端；供应链与合规用「自行核实」清单——不是店面。"
locale: zh
category: guide
stage: cross
tools: []
priority: P1
status: published
evidence: documentation-backed
applicableToolsVersions: "与具体工具无关；请按产品类别核对当地法规与厂商文档"
updated: "2026-11-06"
internalBriefing: []
publicSources:
  - title: "FCC Equipment Authorization (overview)"
    url: "https://www.fcc.gov/oet/ea/fccid"
    kind: docs
  - title: "CISA Secure by Design"
    url: "https://www.cisa.gov/securebydesign"
    kind: docs
tags: [hardware, firmware, compliance, supply-chain]
---

## 结论

若 OPC 要出货实体设备，把**固件**、**配套 App**、可选**云端**当作三条产品线、各自发版节奏。软件侧可用 agent；认证、工厂与射频规则是**自行核实**工作——本站不销售也不代为认证。

## 前置条件

- 产品类别清晰（BLE 小工具、USB 配件、简单 IoT 等）
- 愿意阅读目标市场的一级监管 / 标准页面
- 配套 App 有验证命令的软件仓库（适用时含固件构建）

## 拆分

| 层 | 负责 | Agent 适配 | 糊在一起的高风险 |
|---|---|---|---|
| 固件 | 启动、驱动、射频、OTA | 中——需要板级闭环 | 变砖；未签名 OTA |
| 配套 App | 配对、体验、本地设置 | 高 | 没有离线配对路径就上架 |
| 云端（可选） | 账号、同步、分析 | 高 | 隐私；云挂了设备不能用 |

## 步骤

1. 写一页纸，点名三层，以及哪一层可以独立发版。
2. 定义**配套 App MVP**：用 mock 或一台金样设备就能演示价值。
3. 任何公开 beta 前，固件变更要有可签名的更新叙事。
4. 跑下面供应链 / 合规清单——只勾你本人核实过的项。
5. **不要**在营销站写未核实的认证声明。

## 自行核实清单（非法律意见）

- [ ] 元件 / 模组供应商已明确；数据手册留存
- [ ] 按**你的**外壳与天线方案核对射频模组认证（适用时查 FCC ID 等）
- [ ] 目标市场的电源 / 电池安全路径已审
- [ ] 包装与标签声明与实测行为一致
- [ ] OTA 签名密钥离线保存；agent 永不接触生产密钥
- [ ] 收集遥测前，隐私政策已覆盖配套 App
- [ ] 工厂 / CM 的 NDA 与变更联系人在案
- [ ] 付费订单前已有 RMA / 支持路径

## 模板字段

- 产品类别 / 市场：
- 固件仓库 + 已签名 OTA？（是/否）：
- 配套 App URL / 商店草稿：
- 已声明 vs 已核实的认证：

## 完成定义

营销文案从不声称你未核实的认证。配套 App 在无生产云时仍有冒烟路径。固件更新权限由人类掌控。

## 反模式

- 让 agent 持有生产签名密钥
- 没有自己的授权就抄竞品「FCC 认证」徽章
- v1 就把每个按钮按下去都绑死云端往返

## 来源

见 frontmatter `publicSources`。本页仅作定向——销售受监管硬件时请聘请合格顾问/实验室。
