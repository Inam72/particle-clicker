# Contributing

Thanks for wanting to help. This project uses the standard GitHub pull
request workflow — the `main` branch is protected, so no one, maintainers
included, pushes directly to it. Every change goes through a branch and a
pull request.

## Workflow

1. Fork the repo (or create a branch directly if you have write access).
2. Create a branch for your change:
   ```
   git checkout -b fix/short-description
   ```
3. Make your change. Keep pull requests focused on one thing — a bug fix,
   one feature, one cleanup — rather than bundling unrelated changes
   together.
4. Test it by actually running the game locally (see the "Running locally"
   section in [README.md](README.md)) — click through the feature or bug
   you touched, not just a glance at the diff.
5. Commit and push your branch, then open a pull request against `main`.
   Describe *what* changed and *why*; if it fixes a reported bug or issue,
   link it.
6. A maintainer reviews and merges. Please respond to review comments on
   the same branch rather than opening a new PR.

## Code style

- No build step or bundler — this is plain HTML/CSS/JS, loaded directly by
  the browser. Please keep it that way rather than introducing one for a
  small change.
- Match the existing style in the file you're editing rather than
  reformatting unrelated code.
- Comment only where the *why* isn't obvious from the code itself (a
  workaround, a non-obvious constraint) — not to restate what a line does.
- If you add a third-party library, vendor it under `js/external/` (see
  the existing files there) rather than pointing at a CDN, and note where
  it came from and how to update it.

## Reporting bugs

Open a GitHub issue with steps to reproduce, what you expected, and what
actually happened. Screenshots help a lot for layout/visual issues.
