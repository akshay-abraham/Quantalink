## 📋 Table of Contents

- [Windows Prerequisites](#-windows-prerequisites)
- [Installing Arch Linux on WSL2](#-installing-arch-linux-on-wsl2)
- [Initial System Setup](#-initial-system-setup)
- [Shell Configuration](#-shell-configuration)
- [Development Tools](#-development-tools)
- [VS Code Setup](#-vs-code-setup)

---

## 🪟 Windows Prerequisites

### System Debloating & Optimization

- [ ] Debloat Windows aggressively
- [ ] Run O&O ShutUp10++ for privacy optimization
- [ ] Enable advanced Windows features:
  - Windows Sandbox
  - Virtual Machine Platform
  - Windows Subsystem for Linux

```powershell
# 1. Enable Windows Subsystem for Linux (WSL)
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 2. Enable Virtual Machine Platform (Required for WSL 2)
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 3. Enable Windows Sandbox (Isolated temporary environment)
dism.exe /online /enable-feature /featurename:Containers-DisposableClientVM /all /norestart

# Final Step: Prompt for restart
Write-Host "All features enabled. Please restart your computer to apply changes." -ForegroundColor Cyan
```

- [ ] Restart pc
- [ ] setup private dns cloudflare for wifi and ethernet.
- [ ] go through win settings and optimise.

### Essential Applications

**Browser & Extensions (Chrome/Brave)**

- [ ] uBlock Origin Lite (complete setup)
- [ ] Privacy Badger
- [ ] Bitwarden
- [ ] SponsorBlock
- [ ] Proton VPN
- [ ] Change settings to be strict on privacy, setup DNS Cloudflare,

**Fonts**
jetbrains mono nerd font
inter, helvetica, space grotesk, eb garamound, stix two, futura, libre baskerville., geist (by vereceel), geist mono, fira code, IBM plex sans,Fraunces, Atkinson Hyperlegible, public sans,
**Productivity Tools**

- [ ] PowerShell 7
- [ ] Windows Terminal (configure with JetBrainsMono Nerd Font, and go through settings and optimise themes, startup, profile order, etc.)
- [ ] VS Code
- [ ] Flow Launcher
- [ ] Everything Search
- [ ] Google Drive
- [ ] Obsidian
  - Extensions: Book Search, Calendar, Dataview, Excalidraw, Kanban, Paper Importer, PDF++, Surfing
  - Enable Vim keybindings
- [ ] Affinity Designer/Photo

**Development Tools**

- [ ] Arduino IDE + ESP32 libraries
- [ ] Silicon Labs USB Driver
- [ ] ADB (Android Debug Bridge)
- [ ] scrcpy (screen mirroring)

**Utilities**

- [ ] SumatraPDF
- [ ] qView
- [ ] VLC Media Player
- [ ] Remote Mouse App
- [ ] PC Manager (Windows App)

**Office Suite**

- [ ] Microsoft Office 365 home editon (via MAS: https://massgrave.dev)

**Logins & Accounts**

- [ ] GitHub
- [ ] Google
- [ ] ChatGPT
- [ ] Microsoft
- [ ] All AI tools (bookmark frequently used services)

---

## 🐧 Installing Arch Linux on WSL2

### Using PowerShell

```powershell
# Install WSL2 (if not already installed)
wsl --install

# Install Arch Linux directly
wsl --install archlinux

```

### Initial Arch Configuration

After launching Arch WSL for the first time:

```bash
# Initialize pacman keyring
pacman-key --init
pacman-key --populate archlinux

# Update system
pacman -Syu

# Create a new user
useradd -m -G wheel -s /bin/bash akshay
passwd akshay

# Enable sudo for wheel group (give sudo permission)
pacman -S sudo
echo "%wheel ALL=(ALL:ALL) ALL" | sudo tee -a /etc/sudoers

# Exit

```

Restart WSL:

```powershell
# Set your new user as the default login
wsl --manage archlinux --set-default-user yourname
wsl --update
wsl --terminate Arch
wsl -d Arch
```

---

## 🔧 Initial System Setup

### Update System & Install Base Packages

```bash
# Full system update
sudo pacman -Syu

# Install essential development tools
sudo pacman -S --needed base-devel git curl wget unzip tar gzip \
    zip less nano vim openssh
```

### Install AUR Helper (yay)

```bash
# Install yay
cd /tmp
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
cd ~
```

### Configure Git

```bash
# Set global username and email
git config --global user.name "Akshay Abraham"
git config --global user.email "akshaykroobenabraham@gmail.com"

# Use VS Code as default editor
git config --global core.editor "code --wait"

# Set default branch name to main
git config --global init.defaultBranch main

# Enable colored output
git config --global color.ui auto
```

---

## 🐚 Shell Configuration

### Install Zsh & Oh My Zsh

```bash
# Install Zsh
sudo pacman -S zsh

# Set Zsh as default shell
chsh -s $(which zsh)

# Install Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### Install Powerlevel10k Theme

```bash
# Clone Powerlevel10k
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k


# Or install via AUR
yay -S zsh-theme-powerlevel10k-git

# Add to .zshrc
echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >> ~/.zshrc
```

### Install Zsh Plugins

```bash
# zsh-completions
git clone https://github.com/zsh-users/zsh-completions.git \
    ~/.oh-my-zsh/custom/plugins/zsh-completions

# zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-autosuggestions.git \
    ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions

# fast-syntax-highlighting
git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git \
    ~/.oh-my-zsh/custom/plugins/fast-syntax-highlighting

# zsh-autocomplete
git clone --depth 1 https://github.com/marlonrichert/zsh-autocomplete.git \
    ~/.oh-my-zsh/custom/plugins/zsh-autocomplete

# alias-tips
git clone https://github.com/djui/alias-tips.git \
    ~/.oh-my-zsh/custom/plugins/alias-tips
```

### Apply Custom .zshrc Configuration

```bash
# Clone your dotfiles repository
git clone https://github.com/akshay-abraham/CS50.git ~/CS50

# Backup existing .zshrc (if any)
[ -f ~/.zshrc ] && mv ~/.zshrc ~/.zshrc.backup

# Copy custom configuration
cp ~/CS50/.zshrc ~/.zshrc

# Reload shell
source ~/.zshrc
```

> **Note:** On first restart, Powerlevel10k will launch its configuration wizard. Follow the prompts to customize your prompt. OR run `p10k configure`

---

## 🛠️ Development Tools

### Python Development Stack

```bash
# Install Python and related tools
sudo pacman -S python python-pip python-virtualenv python-setuptools

# Install pipx for isolated CLI tools
sudo pacman -S python-pipx

# Common Python packages (install in virtual environments)
# Create a virtual environment in your project:
cd ~/CS50
python -m venv venv
source venv/bin/activate

# Update pip and install common libraries
pip install --upgrade pip
pip install numpy pandas scikit-learn matplotlib seaborn
pip install jupyter jupyterlab notebook
pip install black flake8 isort mypy pylint
```

### Node.js & JavaScript Development

```bash
# Install Node.js and npm
sudo pacman -S nodejs npm

# Install global packages
npm install -g yarn pnpm
npm install -g vite typescript
npm install -g http-server live-server
npm install -g eslint prettier
```

### C/C++ Development

```bash
# Install compilers and build tools
sudo pacman -S gcc clang llvm lldb gdb cmake make
sudo pacman -S valgrind bear

# Install additional libraries
sudo pacman -S boost catch2
```

### CLI Utilities & Tools

```bash
# Modern CLI tools
sudo pacman -S btop bat fastfetch exa tree
sudo pacman -S jq httpie

# GitHub CLI
sudo pacman -S github-cli

# Media tools
sudo pacman -S ffmpeg
```

### Neovim + LazyVim

```bash
# Install Neovim
sudo pacman -S neovim

# Install LazyVim dependencies
sudo pacman -S git make unzip gcc ripgrep fd
yay -S lazygit

# Backup existing config (if any)
mv ~/.config/nvim ~/.config/nvim.backup
mv ~/.local/share/nvim ~/.local/share/nvim.backup

# Install LazyVim
git clone https://github.com/LazyVim/starter ~/.config/nvim
rm -rf ~/.config/nvim/.git

# Launch Neovim (plugins will auto-install)
nvim
```

---

## 💻 VS Code Setup

### Install VS Code on Windows

Download from: https://code.visualstudio.com/

### Essential Extensions (Windows)

Install these extensions on Windows VS Code:

```
bradlc.vscode-tailwindcss
christian-kohler.npm-intellisense
christian-kohler.path-intellisense
dbaeumer.vscode-eslint
dsznajder.es7-react-js-snippets
esbenp.prettier-vscode
formulahendry.auto-close-tag
formulahendry.auto-complete-tag
formulahendry.auto-rename-tag
github.codespaces
github.copilot
github.copilot-chat
ms-azuretools.vscode-containers
ms-python.debugpy
ms-python.python
ms-python.vscode-pylance
ms-python.vscode-python-envs
ms-vscode-remote.remote-containers
ms-vscode-remote.remote-ssh
ms-vscode-remote.remote-ssh-edit
ms-vscode-remote.remote-wsl
ms-vscode-remote.vscode-remote-extensionpack
ms-vscode.cpptools
ms-vscode.cpptools-extension-pack
ms-vscode.cpptools-themes
ms-vscode.live-server
ms-vscode.remote-explorer
ms-vscode.remote-server
pkief.material-icon-theme
qwtel.sqlite-viewer
vscodevim.vim
```

### WSL Remote Extensions

After connecting to WSL (Ctrl+Shift+P → "WSL: Connect to WSL"), install:

```
bradlc.vscode-tailwindcss
christian-kohler.npm-intellisense
christian-kohler.path-intellisense
dbaeumer.vscode-eslint
esbenp.prettier-vscode
formulahendry.auto-close-tag
formulahendry.auto-complete-tag
formulahendry.auto-rename-tag
github.copilot
github.copilot-chat
ms-azuretools.vscode-containers
ms-python.debugpy
ms-python.python
ms-python.vscode-pylance
ms-python.vscode-python-envs
ms-vscode.cpptools
ms-vscode.cpptools-extension-pack
ms-vscode.live-server
qwtel.sqlite-viewer
```

### Configure VS Code Settings

```json
{
  "terminal.integrated.fontFamily": "JetBrainsMono Nerd Font",
  "editor.fontFamily": "JetBrainsMono Nerd Font",
  "terminal.integrated.defaultProfile.linux": "zsh"
}
```

---

## 📦 Package Reference

Current installed packages (for reference):

```
base base-devel bear btop clang fastfetch ffmpeg gdb git github-cli
less lldb llvm nano neovim nodejs npm pacman-contrib python
python-pip python-pipx python-setuptools python-virtualenv sudo
unzip valgrind vim wget yay zip zsh zsh-theme-powerlevel10k-git
```
