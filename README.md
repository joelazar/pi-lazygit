# pi-lazygit

Open [lazygit](https://github.com/jesseduffield/lazygit) from inside [pi](https://pi.dev) without leaving your session.

![demo](./assets/demo.gif)

Running `/lazygit` suspends pi's TUI, clears the screen, and gives lazygit the whole terminal. When you quit lazygit, pi comes back exactly where you left it. Handy when pi has staged a pile of changes and you want to stage, split, or discard hunks yourself before telling it to continue.

## Install

```bash
pi install npm:pi-lazygit
```

lazygit itself has to be on your `PATH`:

```bash
brew install lazygit
```

## Usage

| Trigger        | What it does           |
| -------------- | ---------------------- |
| `/lazygit`     | Opens lazygit in `cwd` |
| `ctrl+shift+g` | Same, without typing   |

lazygit runs in pi's current working directory, so it picks up whichever repo the session is pointed at.

The command only works in interactive TUI mode. In `print`, `json`, or `rpc` mode it reports an error instead of hanging on a terminal that isn't there.

## Rebinding the shortcut

`ctrl+shift+g` is registered by the extension, and you can remap it in `~/.pi/agent/keybindings.json` like any other pi shortcut.

## License

MIT
