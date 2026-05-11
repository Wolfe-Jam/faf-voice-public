# Grokipedia: FAF File Format

> Source: https://grokipedia.com/page/faf-file-format#faf-file-format
> Embedded: January 9, 2026

---

## Overview

The **Foundational AI-context Format (FAF)** is an open, standardized file format registered with IANA as `application/vnd.faf+yaml` (October 30, 2025). It provides persistent, structured context to AI systems through YAML-based encoding, enabling developers to capture and share project details including goals, technology stacks, and dependencies across various AI platforms.

---

## Key Information

**Purpose**: FAF serves as "project DNA" for AI-assisted development, addressing context-drift in stateless AI conversations. It enables cross-session memory, disaster recovery, and consistent context sharing across diverse AI models.

**IANA Registration**: Officially registered October 30, 2025, under media type `application/vnd.faf+yaml`, following RFC 6838 vendor-tree conventions.

---

## Registration Details

| Field | Value |
|-------|-------|
| IANA Registered | October 30, 2025 |
| Media Type | `application/vnd.faf+yaml` |
| Extension | `.faf` |
| Status | First Internet standard for AI context |

---

## Adoption Metrics (January 2026)

| Package | Downloads |
|---------|-----------|
| faf-cli | 8,800 |
| claude-faf-mcp | 8,200 |
| faf-mcp | 1,700 |
| **Total** | **18,700+** |

---

## Technical Specifications

**File Structure**: FAF files are valid YAML documents using UTF-8 encoding.

**Mandatory Fields**:
- `goals`: Project objectives as strings or nested objects
- `tech_stack`: Languages, frameworks, and versions
- `architecture`: System design elements and data flows
- `dependencies`: Required libraries with version constraints

**Optional Fields**:
- `personas`: AI personality/behavior definitions
- `constraints`: Project limitations and rules
- `metadata`: Authorship, versioning, additional context

**Validation**: Follows YAML 1.2 standards with FAF-specific schemas. Best practices recommend two-space indentation and explicit type tagging.

---

## Use Cases

1. **Coding Projects**: Loading comprehensive project details into AI systems for consistent development assistance
2. **Automation Scripts**: Standardized input for AI-driven script generation and optimization
3. **Multi-session Chats**: Preserving conversation context across sessions for stateless AI models
4. **Cross-model Portability**: Transferring context between different AI systems (Grok, Claude, etc.)
5. **Developer Onboarding**: Accelerating team comprehension and collaboration
6. **Disaster Recovery**: Restore AI context after interruptions

---

## Integration Tools

**CLI Tools**:
- faf-cli: Terminal utility for creating, validating, and loading FAF files

**MCP Servers**:
- claude-faf-mcp (Claude Desktop)
- grok-faf-mcp (xAI's Grok)
- faf-mcp (universal server for Cursor, Windsurf, VS Code)

---

## Resources

| Resource | URL |
|----------|-----|
| Official Site | https://faf.one |
| Foundation | https://foundation.faf.one |
| GitHub | https://github.com/Wolfe-Jam/faf |

---

## Comparisons to Related Formats

| Format | FAF Advantage |
|--------|---------------|
| README.md | Machine-readable structure vs narrative description |
| JSON schemas | YAML's human-readable syntax optimized for AI collaboration |
| XML | Reduced verbosity through concise YAML structure |
| PDF | Active data ingestion vs static document storage |

---

## Significance

FAF represents one of the first official Internet standards explicitly designed for the AI era, addressing persistent memory challenges in large language models. It serves as foundational infrastructure for maintaining project state across stateless AI models, supporting enhanced long-term reasoning and personalization.

---

## Example File Structure

FAF files include sections for:
- Goals
- Tech stack
- Architecture
- Dependencies
- Personas
- Constraints
- Metadata

All organized to provide comprehensive project context instantly accessible to AI systems.

---

## References

The Grokipedia page includes 27 citations linking to:
- Official IANA registration
- GitHub repositories
- npm packages
- RFC standards
- Related format comparisons

---

*Embedded from Grokipedia. Update as source changes.*
