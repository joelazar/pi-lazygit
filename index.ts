/**
 * pi-lazygit - open lazygit from inside pi.
 *
 * `/lazygit` (or ctrl+shift+g) suspends pi's TUI, hands lazygit the whole
 * terminal, and restores pi when lazygit exits.
 */

import { spawnSync } from "node:child_process";
import type {
  ExtensionAPI,
  ExtensionContext,
} from "@earendil-works/pi-coding-agent";

const COMMAND = "lazygit";
const SHORTCUT = "ctrl+shift+g";

/** Suspend the TUI, run lazygit inheriting stdio, then restore the TUI. */
function runLazygit(ctx: ExtensionContext): Promise<number | null> {
  return ctx.ui.custom<number | null>((tui, _theme, _keybindings, done) => {
    tui.stop();
    process.stdout.write("\x1b[2J\x1b[H");

    const result = spawnSync(COMMAND, {
      stdio: "inherit",
      env: process.env,
      cwd: ctx.cwd,
    });

    tui.start();
    tui.requestRender(true);
    done(result.error ? null : result.status);
    return { render: () => [], invalidate: () => {} };
  });
}

async function open(ctx: ExtensionContext): Promise<void> {
  if (ctx.mode !== "tui") {
    ctx.ui.notify("lazygit needs an interactive terminal", "error");
    return;
  }
  const status = await runLazygit(ctx);
  if (status === null) {
    ctx.ui.notify("Could not start lazygit - is it on your PATH?", "error");
  }
}

export default function (pi: ExtensionAPI) {
  pi.registerCommand(COMMAND, {
    description: "Open lazygit",
    handler: async (_args, ctx) => {
      await open(ctx);
    },
  });

  pi.registerShortcut(SHORTCUT, {
    description: "Open lazygit",
    handler: async (ctx) => {
      await open(ctx);
    },
  });
}
