#!/usr/bin/env python3
import os
from pathlib import Path
from subprocess import Popen, TimeoutExpired

path = Path(os.path.dirname(os.path.realpath(__file__)))
jsCWD = path / "ui"

p_django = Popen(
    ["uv", "run", "./manage.py", "runserver", "0.0.0.0:3001"]
)
p_solidjs = Popen(["npm", "run", "dev"], cwd=jsCWD)
p_tailwindcss = Popen(["sh", "tailwind.sh"], cwd=jsCWD)


def check_and_show(p, name):
    try:
        if not p.poll():
            outs, errs = p.communicate(timeout=15)
            if outs and len(outs):
                [print("[%s] %s" % (name, segment)) for segment in outs.split("\n")]
            if errs and len(errs):
                [print("[%s] %s" % (name, segment)) for segment in errs.split("\n")]
        else:
            outs, errs = p.communicate(timeout=15)
            if outs and len(outs):
                [print("[%s] %s" % (name, segment)) for segment in outs.split("\n")]
            if errs and len(errs):
                [print("[%s] %s" % (name, segment)) for segment in errs.split("\n")]
            exit()
    except TimeoutExpired:
        pass


while True:
    check_and_show(p_django, "DJANGO")
    check_and_show(p_solidjs, "SOLIDJS")
    check_and_show(p_tailwindcss, "TAILWIND")
