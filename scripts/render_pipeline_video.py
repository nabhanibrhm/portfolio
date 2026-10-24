"""Render the portfolio's conceptual Big Data Pipeline film.

Requires Python 3, Pillow, numpy, fonttools[woff] and either imageio-ffmpeg or
an ffmpeg executable passed with --ffmpeg. No website/build dependencies.
Usage: python scripts/render_pipeline_video.py [--ffmpeg /path/to/ffmpeg]
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path
import subprocess
import tempfile

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
W, H, FPS, DURATION = 1280, 720, 24, 26
BLACK, WHITE, AMBER = (0, 0, 0), (255, 255, 255), (252, 163, 17)
MUTE, LINE, TILE = (158, 158, 158), (51, 51, 51), (13, 13, 13)
FONTS = {}


def clamp(v):
    return max(0.0, min(1.0, v))


def ease(v):
    return 1 - (1 - clamp(v)) ** 3


def mix(a, b, p):
    return tuple(round(x + (y - x) * p) for x, y in zip(a, b))


def font(size, mono=False, bold=False):
    key = size, mono, bold
    if key not in FONTS:
        f = ImageFont.truetype(str(FONT_PATHS[mono]), size)
        if not mono:
            f.set_variation_by_axes([700 if bold else 500])
        FONTS[key] = f
    return FONTS[key]


def txt(d, xy, text, size=20, color=WHITE, mono=False, bold=False):
    d.text(xy, text, font=font(size, mono, bold), fill=color, anchor="lt")


def rule(d, xy, color=LINE, width=1):
    d.line(xy, fill=color, width=width)


def enter(d, xy, text, size, t, delay=0, color=WHITE, bold=False, mono=False):
    p = ease((t - delay) / .85)
    txt(d, (xy[0], xy[1] + round(24 * (1 - p))), text, size,
        mix(BLACK, color, p), mono, bold)


def shell(t, chapter):
    im = Image.new("RGB", (W, H), BLACK)
    d = ImageDraw.Draw(im)
    txt(d, (56, 35), "LN / SELECTED WORK", 13, MUTE, mono=True)
    d.ellipse((1010, 39, 1016, 45), fill=AMBER)
    txt(d, (1031, 35), "CONCEPTUAL OVERVIEW", 12, MUTE, mono=True)
    rule(d, (56, 76, 1224, 76))
    rule(d, (56, 654, 1224, 654))
    txt(d, (56, 674), "LUTHFI NABHAN IBRAHIM", 12, MUTE, mono=True)
    txt(d, (510, 674), chapter, 12, MUTE, mono=True)
    txt(d, (1128, 674), "DATA / 01", 12, AMBER, mono=True)
    rule(d, (56, 654, 56 + 1168 * clamp(t / DURATION), 654), AMBER, 2)
    return im, d


def arrow(d, x, y, color=AMBER):
    rule(d, (x - 8, y - 5, x, y, x - 8, y + 5), color, 2)


def particles(d, start, end, t, count=5, color=AMBER):
    rule(d, (*start, *end), LINE, 1)
    for n in range(count):
        p = (t * .23 + n / count) % 1
        x = start[0] + p * (end[0] - start[0])
        y = start[1] + p * (end[1] - start[1])
        d.rectangle((x - 3, y - 3, x + 3, y + 3), fill=color)


def database(d, cx, cy, color=WHITE, scale=1):
    rx, ry, hh = 30 * scale, 8 * scale, 39 * scale
    d.arc((cx-rx, cy-ry+hh, cx+rx, cy+ry+hh), 0, 180, color, 2)
    rule(d, (cx-rx, cy, cx-rx, cy+hh), color, 2)
    rule(d, (cx+rx, cy, cx+rx, cy+hh), color, 2)
    d.ellipse((cx-rx, cy-ry, cx+rx, cy+ry), outline=color, width=2)
    d.arc((cx-rx, cy-ry+hh/2, cx+rx, cy+ry+hh/2), 0, 180, color, 2)


def opening(t):
    im, d = shell(t, "01 / THE PROJECT")
    enter(d, (58, 123), "FINANCIAL DATA ENGINEERING", 13, t, .15, AMBER, mono=True)
    enter(d, (50, 178), "Big Data", 103, t, .3, bold=True)
    enter(d, (50, 285), "Pipeline", 103, t, .5, bold=True)
    enter(d, (58, 437), "From financial transactions", 28, t, .8)
    enter(d, (58, 476), "to structured analysis.", 28, t, .95, MUTE)
    enter(d, (58, 590), "PT. SINARMAS MULTIARTHA TBK", 13, t, 1.2, MUTE, mono=True)
    # A restrained, continuously flowing field of transaction records.
    for r in range(7):
        y = 164 + r * 58
        p = ease((t - .6 - r*.08) / .9)
        for c in range(5):
            x = 813 + c*79
            col = mix(BLACK, AMBER if (r+c) % 5 == int(t*.8)%5 else LINE, p)
            d.rounded_rectangle((x, y, x+57, y+32), 3, outline=col, width=1)
            rule(d, (x+12, y+11, x+43, y+11), col)
            rule(d, (x+12, y+20, x+29, y+20), col)
    rule(d, (759, 132, 759, 595))
    txt(d, (813, 590), "TRANSACTIONS → STRUCTURE", 12, MUTE, mono=True)
    return im


NODES = [(56, "01", "Financial data", "Transaction records"),
         (360, "02", "Python + Spark", "Processing & analysis"),
         (664, "03", "Iceberg", "Structured tables"),
         (968, "04", "Analysis", "Explore the data")]


def architecture(t):
    local = t - 4.5
    im, d = shell(t, "02 / THE ARCHITECTURE")
    enter(d, (56, 116), "A connected data workflow.", 44, local, .05, bold=True)
    enter(d, (58, 182), "Illustrative flow · simplified for this overview", 16, local, .2, MUTE)
    active = min(3, max(0, int((local-1.1)/2.25)))
    p = ease((local - .3)/.8)
    col = mix(BLACK, AMBER, p)
    d.rounded_rectangle((454, 236, 826, 287), 4, outline=mix(BLACK, LINE, p))
    txt(d, (482, 252), "AIRFLOW", 15, col, mono=True)
    txt(d, (595, 252), "Orchestration", 16, mix(BLACK, WHITE, p))
    rule(d, (640, 287, 640, 310), mix(BLACK, LINE, p))
    rule(d, (184, 330, 184, 310, 1096, 310, 1096, 330), mix(BLACK, LINE, p))
    for j, (x, num, title, sub) in enumerate(NODES):
        a = ease((local - .6 - j*.15)/.8)
        top = 347 + round(18*(1-a))
        selected = j == active
        c = mix(BLACK, AMBER if selected else LINE, a)
        d.rounded_rectangle((x, top, x+256, top+184), 5,
                            fill=mix(BLACK, TILE, a), outline=c, width=2 if selected else 1)
        txt(d, (x+20, top+20), num, 12, mix(BLACK, AMBER if selected else MUTE, a), mono=True)
        txt(d, (x+20, top+112), title, 25, mix(BLACK, WHITE, a), bold=True)
        txt(d, (x+20, top+151), sub, 14, mix(BLACK, MUTE, a))
        icon = mix(BLACK, AMBER if selected else WHITE, a)
        if j == 0:
            for k in range(3):
                rule(d, (x+21, top+53+k*12, x+79, top+53+k*12), icon, 2)
                d.rectangle((x+91, top+50+k*12, x+97, top+56+k*12), fill=icon)
        elif j == 1:
            for k in range(3):
                d.rectangle((x+21+k*24, top+52, x+36+k*24, top+85), outline=icon, width=2)
        elif j == 2:
            database(d, x+52, top+51, icon, .75)
        else:
            for k, h in enumerate([13, 25, 35, 45]):
                d.rectangle((x+22+k*17, top+91-h, x+32+k*17, top+91), fill=icon)
        if j < 3:
            particles(d, (x+259, 438), (x+297, 438), local-j*.35, 2,
                      mix(BLACK, AMBER, a))
            arrow(d, x+297, 438, mix(BLACK, AMBER, a))
    descriptions = ["Start with financial transaction data.",
                    "Process and analyze with Python and Spark.",
                    "Organize the workflow around structured tables.",
                    "Connect the data to analysis."]
    txt(d, (58, 588), descriptions[active], 22, WHITE)
    txt(d, (1010, 596), "ILLUSTRATIVE", 12, MUTE, mono=True)
    return im


def detail(t):
    local = t - 15.5
    im, d = shell(t, "03 / FROM RECORDS TO TABLES")
    enter(d, (56, 117), "Make complex data", 54, local, .05, bold=True)
    enter(d, (56, 182), "ready for analysis.", 54, local, .2, bold=True)
    enter(d, (58, 281), "PYTHON  /  SPARK  /  ICEBERG", 14, local, .4, AMBER, mono=True)
    # Abstract row streams converge into an ordered table. Values are deliberately
    # omitted: this film makes no claims about real schemas, volumes or results.
    p = ease((local-.25)/1)
    for r in range(7):
        y = 370+r*28
        for c in range(3):
            x = round(58+c*104 + math.sin(local*1.1+r*.9)*8)
            d.rounded_rectangle((x,y,x+83,y+15), 2, outline=mix(BLACK, LINE, p))
    for r in range(5):
        particles(d, (388, 386+r*35), (745, 456), local+r*.3, 3,
                  mix(BLACK, AMBER, p))
    d.rounded_rectangle((532, 416, 611, 496), 5, fill=BLACK, outline=AMBER, width=2)
    txt(d, (550, 439), "→", 36, AMBER)
    x0, y0 = 789, 344
    d.rounded_rectangle((x0,y0,x0+433,y0+254), 5, outline=mix(BLACK, LINE, p))
    d.rectangle((x0+1,y0+1,x0+432,y0+40), fill=mix(BLACK, AMBER, p))
    txt(d, (x0+19,y0+13), "STRUCTURED TABLES", 13, BLACK, mono=True)
    for r in range(6):
        yy = y0+59+r*31
        rule(d, (x0+18, yy+20, x0+414, yy+20), mix(BLACK, LINE, p))
        for c in range(4):
            xx=x0+20+c*103
            fill = mix(BLACK, AMBER if (r+c+int(local*1.3))%7 == 0 else MUTE, p)
            rule(d, (xx,yy+6,xx+52,yy+6), fill, 3)
    txt(d, (58, 605), "ABSTRACT DATA VISUALIZATION", 12, MUTE, mono=True)
    return im


def closing(t):
    local=t-21
    im,d=shell(t,"04 / THE STACK")
    enter(d,(58,122),"BIG DATA PIPELINE",14,local,.05,AMBER,mono=True)
    enter(d,(51,188),"Built around data.",78,local,.15,bold=True)
    enter(d,(56,300),"Processing financial transactions",29,local,.3)
    enter(d,(56,342),"with a modern data engineering stack.",29,local,.45,MUTE)
    labels=[("Python",139),("Spark",132),("Airflow",148),("Iceberg",150),("PostgreSQL",213)]
    x=58
    for j,(label,width) in enumerate(labels):
        p=ease((local-.6-j*.1)/.8)
        yy=448+round(14*(1-p))
        d.rounded_rectangle((x,yy,x+width,yy+57),4,outline=mix(BLACK,LINE,p))
        txt(d,(x+20,yy+18),label,21,mix(BLACK,WHITE,p))
        x+=width+13
    enter(d,(58,577),"Luthfi Nabhan Ibrahim",25,local,1.05,bold=True)
    enter(d,(58,614),"PT. SINARMAS MULTIARTHA TBK",12,local,1.2,MUTE,mono=True)
    # Closing motion settles, leaving a readable final frame for looping playback.
    rule(d,(1066,575,1194,575),AMBER,2)
    arrow(d,1194,575)
    return im


SCENES = [(0,opening),(4.5,architecture),(15.5,detail),(21,closing)]


def render(t):
    index=max(i for i,(start,_) in enumerate(SCENES) if t>=start)
    im=SCENES[index][1](t)
    # Short editorial dissolves preserve continuous motion without flashes.
    start=SCENES[index][0]
    if index and t-start<.32:
        prior=SCENES[index-1][1](start-.001)
        im=Image.blend(prior,im,ease((t-start)/.32))
    if t<.4:
        im=Image.blend(Image.new("RGB",(W,H),BLACK),im,ease(t/.4))
    return im


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ffmpeg")
    parser.add_argument("--preview-only",action="store_true")
    parser.add_argument("--preview-dir",type=Path,default=Path(tempfile.gettempdir())/"portfolio-pipeline-preview")
    args=parser.parse_args()
    output=ROOT/"public"/"videos"
    output.mkdir(parents=True,exist_ok=True)
    args.preview_dir.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="portfolio-film-fonts-") as tmp:
        global FONT_PATHS
        FONT_PATHS={}
        for mono,name in [(False,"Satoshi-Variable"),(True,"GeistMono-Variable")]:
            ft=TTFont(ROOT/"public"/"fonts"/(name+".woff2"))
            ft.flavor=None
            path=Path(tmp)/(name+".ttf")
            ft.save(path)
            FONT_PATHS[mono]=path
        times=[2.8,6.8,10.5,14.3,18.5,24]
        sheet=Image.new("RGB",(1280,1080),BLACK)
        for i,t in enumerate(times):
            frame=render(t)
            frame.save(args.preview_dir/f"frame-{t:g}.jpg",quality=95)
            sheet.paste(frame.resize((640,360),Image.Resampling.LANCZOS),((i%2)*640,(i//2)*360))
        sheet.save(args.preview_dir/"contact-sheet.jpg",quality=95)
        render(10.5).save(output/"big-data-pipeline-promo-poster.jpg",quality=95,subsampling=0)
        print(f"Contact sheet: {args.preview_dir/'contact-sheet.jpg'}",flush=True)
        if args.preview_only:
            return
        if args.ffmpeg:
            ffmpeg=args.ffmpeg
        else:
            import imageio_ffmpeg
            ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
        target=output/"big-data-pipeline-promo.mp4"
        cmd=[ffmpeg,"-y","-f","rawvideo","-vcodec","rawvideo","-pix_fmt","rgb24",
             "-s",f"{W}x{H}","-r",str(FPS),"-i","-","-an","-c:v","libx264",
             "-preset","medium","-crf","18","-pix_fmt","yuv420p","-movflags","+faststart",
             "-metadata","title=Big Data Pipeline | Conceptual overview",
             "-metadata","comment=Illustrative architecture; no production topology or performance claims.",
             str(target)]
        proc=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=subprocess.DEVNULL)
        try:
            for i in range(FPS*DURATION):
                proc.stdin.write(np.asarray(render(i/FPS)).tobytes())
                if i% (FPS*2)==0:
                    print(f"Rendered {i/FPS:.0f}/{DURATION}s",flush=True)
            proc.stdin.close()
            if proc.wait():
                raise RuntimeError("Video encoder failed")
        except BaseException:
            proc.kill()
            proc.wait()
            raise
        print(f"Created {target}",flush=True)


if __name__=="__main__":
    main()
