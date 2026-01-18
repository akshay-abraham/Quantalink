# ============================================================
# 0. Powerlevel10k Instant Prompt (MUST be at the top)
# ============================================================
# Reduces perceived startup time by pre-rendering prompt.
# Must be sourced before heavy init.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi


# ============================================================
# 1. PATH Setup (core binary locations)
# ============================================================
# Personal/local tooling first so they shadow system binaries.
export PATH="$HOME/bin:$HOME/.local/bin:/usr/local/bin:$PATH"
export PATH="$HOME/tools:$PATH"

# ============================================================
# 2. Oh My Zsh Setup
# ============================================================
# OMZ plugin framework; theme is overridden by Powerlevel10k
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"  # harmless default

# Plugins: keep lightweight and useful
plugins=(
  sudo                     # ESC-ESC prefixes last command with sudo
  zsh-completions          # community completions
  zsh-autosuggestions      # ghost-text suggestions
  fast-syntax-highlighting # syntax highlighting
  zsh-autocomplete         # intelligent completions
  alias-tips               # reminders for existing aliases
)

# Load Oh My Zsh framework
source $ZSH/oh-my-zsh.sh


# ============================================================
# 3. Powerlevel10k Prompt
# ============================================================
# Must load after OMZ plugins
[[ -r ~/powerlevel10k/powerlevel10k.zsh-theme ]] && source ~/powerlevel10k/powerlevel10k.zsh-theme
[[ -f ~/.p10k.zsh ]] && source ~/.p10k.zsh


# ============================================================
# 4. Performance Tweaks (completion & caching)
# ============================================================
# Menu selection for completion
zstyle ':completion:*' rehash true
zstyle ':completion:*' menu select
zstyle ':completion:*' list-colors ''
zmodload zsh/complist

# Completion caching to speed up shell startups
ZSH_CACHE_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/zsh"
mkdir -p "$ZSH_CACHE_DIR"
zstyle ':completion::complete:*' use-cache yes
zstyle ':completion::complete:*' cache-path "$ZSH_CACHE_DIR"


# ============================================================
# 5. History Settings
# ============================================================
HISTFILE=~/.zsh_history
HISTSIZE=100000
SAVEHIST=100000
setopt HIST_IGNORE_ALL_DUPS   # ignore duplicate entries
setopt HIST_IGNORE_SPACE      # ignore commands starting with space
setopt SHARE_HISTORY          # share history across terminals


# ============================================================
# 6. NVM (Node Version Manager)
# ============================================================
export NVM_DIR="$HOME/.nvm"
[[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh"
[[ -s "$NVM_DIR/bash_completion" ]] && source "$NVM_DIR/bash_completion"


# ============================================================
# 7. Aliases
# ============================================================
# Syntax: alias name='command'
alias zshconfig='code ~/.zshrc'                # edit zsh config
alias reloadzsh='source ~/.zshrc'              # reload zsh config
alias ll='eza --icons=always -lah --color=auto' # long listing with hidden files
alias grep='grep --color=auto'                 # colored grep output
alias pyvenv='source .venv/bin/activate'       # activate python venv
alias cs50venv='source ~/CS50/.venv/bin/activate' # activate python venv in CS50/

# ================= Git Aliases =================
alias gs='git status'                    # show current repo status
alias ga='git add'                       # stage files
alias gaa='git add .'                    # stage all files
alias gc='git commit -v'                 # commit with verbose diff
alias gca='git commit -am'               # commit staged changes with message
alias gcm='git commit -m'                # commit with message
alias gp='git push'                      # push current branch
alias gpo='git push origin'              # push to origin
alias gpm='git push origin main'         # push to main branch
alias gl='git log --oneline --graph --all --decorate'  # compact visual log
alias gls='git log --stat'               # log with stats
alias gco='git checkout'                 # switch branches
alias gb='git branch'                    # list branches
alias gba='git branch -a'                # list all branches including remote
alias gbd='git branch -d'                # delete local branch
alias gr='git restore'                   # restore file(s) from last commit
alias grs='git reset'                    # reset staging area
alias gcl='git clone'                    # clone repo
alias gm='git merge'                     # merge branch
alias gff='git fetch --all && git pull'  # fetch and pull latest changes
