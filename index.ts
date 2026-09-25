/**
 * pi-lazygit - open lazygit from inside pi.
 *
 * Inside Herdr, `/lazygit` (or ctrl+shift+g) opens lazygit in a temporary zoomed Herdr pane.
 * Elsewhere it suspends pi's TUI, hands lazygit the whole terminal, and
 * restores pi when lazygit exits.
 */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import type {
  ExtensionAPI,
  ExtensionContext,
} from "@earendil-works/pi-coding-agent";

const COMMAND = "lazygit";
const SHORTCUT = "ctrl+shift+g";
const HERDR_PLUGIN_ID = "pi-lazygit";
const HERDR_PLUGIN_DIR = fileURLToPath(new URL("./herdr", import.meta.url));

function lazygitAvailable(): boolean {
  return !spawnSync(COMMAND, ["--version"], { stdio: "ignore" }).error;
}

function herdr(args: string[]): string | null {
  const result = spawnSync("herdr", args, { encoding: "utf8" });
  if (result.error) return result.error.message;
  if (result.status !== 0) return result.stderr.trim() || `exit ${result.status}`;
  return null;
}

function openHerdrPane(ctx: ExtensionContext): string | null {
  return (
    herdr(["plugin", "link", HERDR_PLUGIN_DIR]) ??
    herdr([
      "plugin",
      "pane",
      "open",
      "--plugin",
      HERDR_PLUGIN_ID,
      "--entrypoint",
      COMMAND,
      "--cwd",
      ctx.cwd,
      "--env",
      `PATH=${process.env.PATH ?? ""}`,
    ])
  );
}

/** Suspend the TUI, run lazygit inheriting stdio, then restore the TUI. */
function runInline(ctx: ExtensionContext): Promise<void> {
  return ctx.ui.custom<void>((tui, _theme, _keybindings, done) => {
    tui.stop();
    process.stdout.write("\x1b[2J\x1b[H");

    spawnSync(COMMAND, {
      stdio: "inherit",
      env: process.env,
      cwd: ctx.cwd,
    });

    tui.start();
    tui.requestRender(true);
    done();
    return { render: () => [], invalidate: () => {} };
  });
}

async function open(ctx: ExtensionContext): Promise<void> {
  if (ctx.mode !== "tui") {
    ctx.ui.notify("lazygit needs an interactive terminal", "error");
    return;
  }
  if (!lazygitAvailable()) {
    ctx.ui.notify("Could not start lazygit - is it on your PATH?", "error");
    return;
  }
  if (process.env.HERDR_ENV === "1") {
    const error = openHerdrPane(ctx);
    if (!error) return;
    ctx.ui.notify(`Herdr pane failed, running inline: ${error}`, "warning");
  }
  await runInline(ctx);
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
