# SKILL — create-skill

Purpose
- Provide a repeatable workflow for converting a multi-step conversation or informal notes into a repository-scoped `SKILL.md` file that agents can invoke.

When to use
- When a user and agent converge on a repeatable process (bug triage, adding a screen, PR checklist) and you want to capture it as a reusable skill.

Inputs
- Conversation transcript or message IDs.
- Target skill name (e.g., `add-screen`).
- Scope: `workspace` (default) or `personal`.

Outputs
- A saved skill file at `skills/<skill-name>.SKILL.md` and a short summary message with example prompts.

Workflow (step-by-step)
1. Read the conversation and any referenced files (links the user provided).
2. Extract the concrete step-by-step process: primary steps, decision points, and completion checks.
3. Identify missing or ambiguous items that require user clarification.
4. Draft a minimal `SKILL.md` using the template below.
5. Save the file to `skills/<skill-name>.SKILL.md` in the repository.
6. Present the draft to the user with example prompts and ask for confirmation or edits.

Decision points
- If the workflow is ambiguous: ask a single focused question that resolves the ambiguity.
- If the skill is workspace-scoped: reference existing docs (link, don't duplicate).
- If personal: suggest storing in `/memories/` or a local `user-skills/` folder.

Quality checks (acceptance)
- Minimal: contains only non-discoverable guidance.
- Actionable: lists clear inputs, outputs, and steps an agent can follow.
- Linked: references existing docs by link instead of embedding large sections.
- Example: includes at least one user prompt to invoke the skill and expected result.

SKILL.md template
---
Title: <skill-name>
Description: One-line purpose.
When to use: Short trigger conditions.
Inputs: list of inputs the agent needs.
Outputs: what the skill produces (file(s), PR text, summary).
Steps: numbered instructions (concise, deterministic).
Example prompts: 2-3 example user prompts that call the skill.
Notes/links: short links to existing docs.
---

Example (add-screen)
---
Title: add-screen
Description: Scaffold a new Expo Router screen and wire it into navigation.
When to use: User asks to add a new route/screen.
Inputs: `screenName`, `tab` (optional).
Outputs: `app/<screenName>.tsx` and any navigation updates.
Steps:
  1. Create `app/<screenName>.tsx` using the project's UI conventions.
  2. Add route link if required (update tab layout).
  3. Run `npm run lint` and present file links to the user.
Example prompts:
  - "Create a screen named `Profile` under `app/` with a header and sample text."
  - "Scaffold `Settings` as a tab screen and wire it into `(tabs)/_layout.tsx`."
Notes/links: See [AGENTS.md](../AGENTS.md) and [app/_layout.tsx](../app/_layout.tsx).
---

Next steps after drafting
- Present the draft to the user and ask at most one clarifying question.
- On approval, save and optionally update `AGENTS.md` to reference the new skill.

Suggested related customizations
- `.github/copilot-instructions.md` referencing `AGENTS.md` for CI and lint policies.
- `skills/add-screen.SKILL.md`, `skills/fix-lint.SKILL.md`, and `skills/refactor-component.SKILL.md` as concrete examples.

If you'd like, I can:
- Save this exact file to `skills/create-skill.SKILL.md` (done).
- Create any of the suggested example skills next.
