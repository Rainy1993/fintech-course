# Contributing to the FinTech course

Help improve a learning outcome, an explanation, a figure, or the ability to reproduce it. Small, focused changes are welcome. A2 is the worked example; it is not a fixed template for every future lesson.

## Start with a concrete problem

For a correction, identify the page and section, the current behavior, the proposed behavior, and why the change helps a learner. Include a source for a statistical claim and a screenshot for a visual defect. For a substantial new lesson or redesign, discuss the learning goal in an issue first.

Repository: https://github.com/Rainy1993/fintech-course

## Work on a branch

Fork the repository if you do not have write access, create a focused branch from the latest main, and edit the affected files. Preview the repository with `python3 -m http.server 8000`, then visit `http://localhost:8000/fintech-course/` only if your server's parent folder contains fintech-course; otherwise visit `http://localhost:8000/` when serving the repository itself.

Run `python3 ai-course-design/check_site.py .` from the repository root. It checks local HTML/CSS resource links, HTML fragment targets, duplicate HTML IDs, and ZIP integrity. It does not verify statistics, accessibility, JavaScript behavior, or remote URLs. Run the affected Python examples separately and inspect the changed interaction in a browser.

## Preserve the figure contract

When a statistical figure changes, describe the dataset/window, transformation, units, estimator, defaults, and seed where applicable. Update web calculations, downloadable Python, inline examples, and bundles together when the change affects them. Explain any intentional difference. Credit sources and distinguish observed results from claims about future prediction.

## Review the learner experience

Check formulas, axes, clipping, keyboard operation, and a narrow screen. Use the established colors and box roles. Keep introductory explanations within their prerequisite sequence. Do not introduce a new model only to avoid defining a current statistic.

## Submit a reviewable pull request

State the learner problem and the resulting behavior. List changed pages, sources, checks actually run, and any limitations. Include before/after screenshots for visible changes. State the AI tool's role when AI materially assisted, and identify what you verified yourself. Do not include private prompts, credentials, student records, or unrelated local files.

A maintainer reviews scope, teaching accuracy, and verification evidence before merging. Contributor status does not grant automatic publishing rights. A merge to main triggers the existing GitHub Pages deployment.

## Local authoring and remote contributions

The maintainer also keeps an original local course authoring folder and a separate publication checkout. Before preparing an upload, inspect remote main and incorporate accepted contributions into the authoring folder. Compare the prepared publication diff with the latest remote files; do not overwrite another contributor's accepted change or force-push to resolve a mismatch.

## Rights and attribution

Record the provenance and reuse conditions of contributed text, code, figures, and data. Do not assume the website's visibility grants redistribution rights to every dataset or third-party image. This guide does not assign a new license to existing course materials. The maintainer must choose any project-wide licensing terms separately.
