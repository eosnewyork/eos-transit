#!/bin/bash
SESSION=transit

set -- $(stty size)
tmux kill-session -t transit 
tmux -2 new-session -d -s $SESSION -x "$2" -y "$(($1 - 1))"

# Setup a window for tailing log files
tmux new-window -t $SESSION:1 -n 'Debug'
tmux split-window -v

tmux select-pane -t 0
tmux split-window -v

tmux select-pane -t 0
tmux send-keys "cd packages/eos-transit" C-m
tmux send-keys "yarn watch" C-m
tmux select-pane -t 1
tmux send-keys "cd packages/eos-transit-tokenpocket-provider" C-m
tmux send-keys "yarn watch" C-m

tmux select-pane -t 2
tmux split-window -v

tmux select-pane -t 2
tmux send-keys "cd packages" C-m
tmux select-pane -t 3
tmux send-keys "cd examples/transit-react-basic" C-m
tmux send-keys "yarn start" C-m


# Attach to session
tmux -2 attach-session -t $SESSION
