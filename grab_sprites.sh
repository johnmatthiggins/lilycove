#!/usr/bin/env zsh
seq 1 386 | xargs -I '{}' printf "%03d\n" '{}'  | \
		xargs -I {} echo https://archives.bulbagarden.net/wiki/File:Spr_3r_{}.png
		# xargs -I '{}' curl https://archives.bulbagarden.net/media/upload/f/f1/Spr_3r_'{}'.png -o static/images/pokemon_'{}'.png
