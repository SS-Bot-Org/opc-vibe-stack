---
title: "Firmware vs companion app: OPC hardware split"
slug: hardware-soft-split
summary: "Decouple firmware, companion app, and cloud release trains; keep supply chain, radio, and OTA signing under human verification."
locale: en
category: guide
stage: cross
tools: []
priority: P1
status: published
evidence: documentation-backed
applicableToolsVersions: "Tool-independent guidance; confirm local regulations and vendor docs for your product class"
published: "2026-11-06"
updated: "2026-11-10"
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

## Conclusion

When a one-person company ships physical hardware, treat **firmware**, **companion app**, and optional **cloud services** as three distinct products on separate release trains. Let coding agents accelerate the companion app and cloud layers against a mocked device transport, keep firmware behind hardware-in-the-loop verification and offline human signing keys, and treat radio, safety, and factory compliance as **verify-yourself** engineering—never marketing guesswork.

## First deliverable: a transport contract and four fixtures

Before connecting hardware, write down the actual packet encoding, message length, units, allowed values, protocol version, timeout, and error response. The sketch below is not a wire format or a valid vendor identifier.

| Fixture | Expected companion-app behavior |
|---|---|
| Valid state frame | Show the documented state and units |
| Unknown protocol version | Display an unsupported-version message; do not guess |
| Malformed or out-of-range value | Reject it and keep the previous valid state |
| Device disconnected / timed out | Show reconnect guidance; do not report success |

**Pass:** a deterministic mock produces all four states and the UI handles each one. Then repeat the critical cases on a physical unit with Wi-Fi/cellular disabled and BLE or USB still enabled. Record device model, firmware version, app version, and result. A mock pass does not validate radio behavior, power safety, OTA recovery, or legal compliance; those need their own bench evidence and market-specific review.

> [!FLOW] Decoupled hardware-software release pipeline
>
> 1. **Freeze Transport Contract** — Specify BLE/USB packets and build a software mock device first.
> 2. **Agent-Built Companion MVP** — Iterate fast on pairing UX, offline controls, and automated UI tests against the mock.
> 3. **Hardware-in-Loop Firmware** — Validate bootloaders, watchdogs, and radio behavior on physical bench units.
> 4. **Human-Signed OTA & Compliance** — Sign firmware offline and verify regulatory grants before taking live orders.

## Three-layer architecture split

<figure class="article-figure article-figure--overview">
  <div class="theme-diagram" role="img" aria-label="Separate the release boundaries">
    <img class="theme-diagram__light" src="/illustrations/hardware-soft-split/overview.light.svg" alt="" data-decorative="true" width="420" height="614" loading="lazy" decoding="async" />
    <img class="theme-diagram__dark" src="/illustrations/hardware-soft-split/overview.dark.svg" alt="" data-decorative="true" width="420" height="614" loading="lazy" decoding="async" />
  </div>
  <figcaption><strong>Separate the release boundaries</strong> Cloud services are optional. The companion app talks to firmware through a defined BLE or USB contract, with a mock for development. Keep core controls usable offline and firmware releases behind hardware tests and human-held signing keys.</figcaption>
</figure>

| Layer | Core responsibilities | Release cadence | Coding-agent fit | Failure mode when blurred |
|---|---|---|---|---|
| **1. Firmware** | Bootloader, drivers, radio stack, battery safety, signed OTA verification | Slow, gated, bench-tested | **Medium** — good for parsers/tests; unsafe without hardware-in-loop | Bricked customer units, battery drain, or unauthenticated OTA |
| **2. Companion app** | BLE/USB discovery, local settings, diagnostics, firmware file transfer | Fast (weekly store or web builds) | **High** — once backed by a deterministic mock device | Useless app whenever Wi-Fi drops or a test rig is unplugged |
| **3. Cloud (optional)** | Optional backup, cross-device sync, opt-in crash telemetry | Continuous, independent | **High** — standard web/API slice ([Spec first](/en/articles/spec-first-agent-loop/)) | Server outage or sunset permanently bricks physical hardware |

## Prerequisites

- A clearly bounded hardware class and target shipping jurisdictions (for example, USB-C HID accessory vs intentional BLE radiator sold in the US/EU)
- Direct links to primary regulatory and security baseline docs for your market (such as FCC Equipment Authorization and CISA Secure by Design principles)
- Separate software directories or repositories with automated verify commands and explicit path rules ([Rules files + hooks](/en/articles/rules-hooks/))

## Execution steps

1. **Write a boundary one-pager before touching PCB or app scaffolding:** Explicitly name what lives in firmware, what lives in the companion app, and verify that core device controls still work with **zero cloud connectivity**.
2. **Define a versioned transport contract + software simulator:** Document every BLE characteristic or USB command frame so coding agents can exercise the documented app states without a physical board; measure coverage against your own test cases.
3. **Gate firmware updates behind human-held signing keys:** Implement cryptographic signature verification in the bootloader before any external beta, and store private signing keys completely offline ([Security quickcheck](/en/articles/security-quickcheck/)).
4. **Work through the verify-yourself compliance checklist below:** Check off an item only when you hold the primary datasheet, module grant conditions, or lab report in your own files.
5. **Audit landing copy against verified evidence:** Separate *“uses a pre-certified BLE module”* (which still carries host integration rules) from claiming full end-product certification you have not completed.

## Marketing claim vs compliance reality

| Tempting launch claim | Operational & regulatory reality | Safe, honest OPC practice |
|---|---|---|
| *“FCC / CE Certified”* (copied from your wireless module’s datasheet) | Module grants only cover tested antennas, enclosures, and host integration conditions; final assemblies often still require host testing/authorization | Cite exact regulatory status only after verifying host rules with primary docs or an accredited lab |
| *“Seamless automatic cloud firmware updates”* | Pushing unsigned or unthrottled OTA images from CI can brick every unit in the field at once | Stage canary rollouts, require cryptographic signature checks on-device, and sign releases offline |
| *“Create an account to pair your device”* | Couples a \$99 physical tool to your solo SaaS uptime forever | Make local USB/BLE pairing and core controls work offline first; treat cloud sync as strictly optional |

> [!WARNING] Orientation only — not legal or accredited lab advice
> OPC Vibe Stack does not sell hardware services or certify compliance. Radio emissions, lithium-battery transport, product safety, and import rules carry strict legal liability—consult primary regulator guidance, accredited test labs, and qualified counsel before selling regulated hardware.

## Copy-pasteable boundary & mock transport sheet (`specs/hardware-split.md`)

Give coding agents the software contract while fencing off signing keys and hardware claims:

```markdown
# Hardware / Software Split Spec: [Device Name]

- **Product class & target markets:** [e.g., BLE desk timer — US & Canada]
- **Offline-first rule:** Disable Wi-Fi and cellular data; keep BLE or USB enabled and verify the documented local controls.
- **OTA authority:** Bootloader verifies signatures using the algorithm and trust chain supported by this device; document the key owner and offline signing procedure.

## Transport contract v1 (shared by Firmware + Companion Mock)
- **Transport:** [BLE GATT / WebUSB / Serial]
- **Transport identifier:** [BLE: actual service + characteristic UUIDs; USB: assigned VID/PID; serial: port/framing settings. These are different identifiers, not interchangeable.]
- **State frame (device → app):** `{ protocolVersion: 1, batteryMv: number, mode: "idle" | "active", fwVersion: string }`
- **Command frame (app → device):** `{ cmd: "set_mode" | "ping", payload: ... }`

## Agent workspace boundaries
- **Allowed for autonomous edits:** `companion-app/`, `mock-device/`, `protocol/tests/`
- **Human-in-loop bench verification required:** `firmware/drivers/`, `firmware/bootloader/`
- **Strictly off-limits to agents:** Offline signing keys, regulatory filing claims, factory BOM substitutions
```

## Verify-yourself checklist (not legal advice)

- [ ] Primary component and wireless module vendors identified with official datasheets archived locally
- [ ] Radio module grant conditions checked against **your** actual enclosure, PCB trace/antenna, and co-location plan (for example via official FCC ID lookup where applicable)
- [ ] Power, thermal, and lithium-battery charging/shipping requirements reviewed for every target market
- [ ] Physical device markings, packaging labels, and manual notices match verified regulatory status
- [ ] Production OTA private signing keys generated and stored offline; coding agents never touch key material
- [ ] Companion-app privacy policy explicitly discloses any telemetry or crash reporting **before** collection begins
- [ ] Contract manufacturer / assembly house NDA, BOM lock, and engineering-change-notice (ECN) contact on file
- [ ] Dead-on-arrival (DOA) replacement, recovery mode, and customer RMA path documented before taking paid orders

## Definition of done

- [ ] Public marketing pages make zero certification, safety, or range claims that you have not personally verified
- [ ] Companion app runs end-to-end automated smoke checks against a deterministic software mock without production cloud dependencies
- [ ] Firmware builds are reproducible, version-stamped, and require offline human signature approval before release

## Anti-patterns

- **Storing production firmware signing keys in repo `.env` files or agent-accessible CI variables** — turns one leaked token or prompt-injection bug into fleet-wide malicious firmware authority.
- **Slapping “FCC / CE Certified” badges onto a landing page because an internal chip vendor had one** — risks customs holds, takedowns, and enforcement penalties.
- **Requiring a live cloud login just to toggle a local hardware setting in v1** — guarantees angry customers the first time your weekend server restarts.
- **Letting coding agents refactor low-level power or flash-erase routines without bench hardware tests** — clean-compiling C/Rust code can still brown out batteries or corrupt boot sectors.
