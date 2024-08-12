#!/usr/bin/env python3
import os
from pathlib import Path
from subprocess import Popen, TimeoutExpired

path = Path(os.path.dirname(os.path.realpath(__file__)))
jsCWD = path / "ui"

p_django = Popen(['poetry', 'run', 'python', './manage.py', 'runserver'])
p_solidjs = Popen(['npm', 'run', 'dev'], cwd=jsCWD)
p_tailwindcss = Popen(['sh', 'tailwind.sh'], cwd=jsCWD)

def check_and_show(p):
    try:
        if not p.poll():
            outs, errs = p.communicate(timeout=15)
            if len(outs):
                print(outs)
            if len(errs):
                print(errs)
        else:
            outs, errs = p.communicate(timeout=15)
            if len(outs):
                print(outs)
            if len(errs):
                print(errs)
            exit()
    except TimeoutExpired:
        pass

while True:
    check_and_show(p_django)
    check_and_show(p_solidjs)
    check_and_show(p_tailwindcss)
