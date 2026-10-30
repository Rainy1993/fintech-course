# Course release workflow

This is the documented release procedure for this static course. GitHub Pages deployment already runs after a commit reaches main; this document does not install a new automation or grant publishing permission.

## 1. Synchronize

Read the latest remote main before editing or preparing publication. Contributors use a branch or fork and propose a pull request. The maintainer incorporates accepted remote edits into the original authoring folder before preparing the separate publication checkout. If either copy has unreviewed local work, preserve it and reconcile changes; do not reset or force-push.

Output: an identified starting revision and a focused change.

## 2. Build

Make the requested lesson or module change. Update dependent formulas, figure parameters, web calculations, Python examples, inline code, bundles, and references where the change affects them. Keep only website resources and contribution tools in the public repository.

Output: a reviewable diff and a local browser preview.

## 3. Verify

Run `python3 ai-course-design/check_site.py .` in the repository root. It checks local HTML/CSS links, HTML fragment targets, duplicate HTML IDs, and ZIP integrity. Run affected Python examples with the documented dependencies. Inspect changed interactions, formulas, and axes at desktop and mobile widths. Treat statistics, pedagogy, and accessibility as separate review tasks; the link checker cannot certify them.

Output: evidence of checks actually performed, with unresolved issues identified.

## 4. Review

Summarize the learner problem and resulting behavior in a pull request, including screenshots for visible changes and sources for substantive claims. A maintainer judges content scope, statistical meaning, and evidence. Return defects to the affected build step and repeat relevant checks.

Output: a maintainer-reviewed change. Downloading a skill does not authorize publication.

## 5. Publish and inspect

For the maintainer's local setup, run `python3 publish_site.py` in the original course_site folder to prepare the separate publication copy. The helper only copies linked files locally. Review that copy against current remote main, then upload or push the authorized changes. A normal contributor instead submits the reviewed branch through the repository's pull request process.

The repository currently serves main from its root with .nojekyll. After merging, wait for the GitHub Pages deployment to succeed. Open the public page, exercise the changed controls, and verify affected downloads. Do not call a successful upload a successful deployment.

Output: the live page URL and observed deployment result.

## 6. Recover if needed

Record the last working revision. If the release introduces a defect, revert the relevant commit through a normal reviewed commit or restore its affected files, and verify the new deployment. Do not rewrite shared history to hide the failed release.

## Release evidence template

- Starting revision:
- Learner problem / resulting behavior:
- Pages and resources changed:
- Statistical or source checks:
- Browser states and widths checked:
- Python examples run:
- Local link / fragment / ZIP check result:
- Reviewer and unresolved limitations:
- Deployed revision / Pages result / live URL:
