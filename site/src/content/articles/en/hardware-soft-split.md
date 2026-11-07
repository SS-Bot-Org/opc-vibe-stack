---
title: "Firmware vs companion app: OPC hardware split"
slug: hardware-soft-split
summary: "Separate firmware, companion app, and cloud; keep a verify-yourself list for supply chain and compliance—not a storefront."
locale: en
category: guide
stage: cross
tools: []
priority: P1
status: published
evidence: documentation-backed
applicableToolsVersions: "Tool-independent guidance; confirm local regulations and vendor docs for your product class"
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

## Conclusion

If your OPC ships a physical device, treat **firmware**, **companion app**, and optional **cloud** as three products with separate release trains. Use agents for the software sides; treat certifications, factories, and radio rules as **verify-yourself** work—not something this site sells or certifies.

## Prerequisites

- A clear product class (BLE gadget, USB accessory, simple IoT, etc.)
- Willingness to read primary regulator / standards pages for your market
- Software repo(s) with a verify command for the companion app (and firmware build if applicable)

## Split

| Layer | Owns | Agent fit | High risk if blurred |
|---|---|---|---|
| Firmware | Boot, drivers, radio, OTA | Medium—need hardware-in-loop | Bricking devices; unsigned OTA |
| Companion app | Pairing, UX, local settings | High | Shipping without offline pairing path |
| Cloud (optional) | Accounts, sync, analytics | High | Privacy, outages blocking the device |

## Steps

1. Write a one-pager that names the three layers and which can ship independently.
2. Define a **companion-app MVP** that demos value with a mock or single golden device.
3. Keep firmware changes behind a signed update story before any public beta.
4. Run the supply-chain / compliance checklist below—tick only what you personally verified.
5. Do **not** put unverified certification claims on the marketing site.

## Verify-yourself checklist (not legal advice)

- [ ] Component / module vendors identified; datasheets retained
- [ ] Radio module certifications checked for **your** enclosure and antenna plan (e.g. FCC ID lookup where applicable)
- [ ] Power / battery safety path reviewed for your market
- [ ] Packaging and labeling claims match tested behavior
- [ ] OTA signing keys stored offline; agents never see production keys
- [ ] Privacy policy covers companion telemetry before collection
- [ ] Factory / CM NDA and change-control contact on file
- [ ] RMA / support path exists before paid orders

## Template fields

- Product class / markets:
- Firmware repo + signed OTA? (y/n):
- Companion app URL / store draft:
- Certifications claimed vs verified:

## Definition of done

Marketing copy never claims a certification you have not verified. Companion app has a smoke path without production cloud. Firmware update authority is human-controlled.

## Anti-patterns

- Letting an agent hold production signing keys
- Copying a competitor’s “FCC certified” badge without your own grant
- Coupling every button press to a cloud round-trip in v1

## Sources

See frontmatter `publicSources`. This page is orientation only—hire qualified counsel/labs when you sell regulated hardware.
