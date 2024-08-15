#!/usr/bin/env zsh
seq 1 386 | xargs -I '{}' printf "%03d\n"  '{}' | xargs -I '{}' python spriteurl.py '{}' ui/public/pokemon-images/'{}'s.png
