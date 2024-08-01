#!/usr/bin/env zsh
seq 1 386 | xargs -I '{}' curl $(python spriteurl.py '{}') -o static/images/'{}'.png
