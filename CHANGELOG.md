# Changelog

## Unreleased

### Changed

- Inside Herdr, lazygit now opens in a temporary zoomed pane (`overlay`) instead of a popup. Popups are session-modal and swallow Herdr's prefix key, so you couldn't switch tabs or workspaces while lazygit was open.

## 1.1.0 - 2026-09-24

### Added

- Inside a [Herdr](https://herdr.dev) pane (`HERDR_ENV=1`), lazygit opens in a 90% Herdr popup while pi keeps running underneath. A bundled `pi-lazygit` Herdr plugin is linked automatically on each open, so you don't need to change your Herdr config.
- The inline mode is used as a fallback when the Herdr popup can't be opened.

### Changed

- The extension now checks that lazygit is on `PATH` before opening it.

## 1.0.2 - 2026-08-25

### Docs

- Removed the lazygit installation instructions from the README.

## 1.0.1 - 2026-08-13

### Fixed

- The demo image uses an absolute URL, so it renders outside GitHub.

## 1.0.0 - 2026-08-13

### Added

- `/lazygit` command and `ctrl+shift+g` shortcut that suspend pi's TUI, run lazygit in `cwd`, and restore pi on exit.
