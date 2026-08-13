Output assets/demo.gif

Require pi
Require lazygit

Set Shell bash
Set Theme "Catppuccin Mocha"
Set FontSize 18
Set LineHeight 1.2
Set Width 1280
Set Height 800
Set Padding 20
Set Margin 20
Set MarginFill "#1e1e2e"
Set BorderRadius 10
Set WindowBar Colorful
Set CursorBlink false
Set TypingSpeed 45ms
Set PlaybackSpeed 1
Set Framerate 24
Set WaitTimeout 30s

Hide
Type "bash assets/setup.sh && cd /tmp/pi-lazygit-demo" Enter
Sleep 3s
Type "export LG_CONFIG_FILE=/tmp/pi-lazygit-demo-config/config.yml && clear" Enter
Sleep 1s
Show

Type "pi -a"
Sleep 700ms
Enter
Sleep 4s

Type "/lazygit"
Sleep 800ms
Enter
Sleep 4s

Sleep 1500ms
Space
Sleep 2500ms

Sleep 1500ms
Down
Sleep 2500ms

Type "q"
Sleep 4s
