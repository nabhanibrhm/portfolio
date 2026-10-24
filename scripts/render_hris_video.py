"""Render a conceptual HRIS AI Chatbot portfolio film, without app dependencies.

Requires Python 3, Pillow, numpy, fonttools[woff] and imageio-ffmpeg, or pass
an ffmpeg executable with --ffmpeg. Use --preview-only for a contact sheet.
All conversation and technology-flow visuals are illustrative, not product UI.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import subprocess
import tempfile

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
W, H, FPS, DURATION = 1280, 720, 24, 27
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
    p = ease((t-delay)/.8)
    txt(d, (xy[0], xy[1]+round(20*(1-p))), text, size,
        mix(BLACK, color, p), mono, bold)


def shell(t, chapter):
    im = Image.new("RGB", (W, H), BLACK)
    d = ImageDraw.Draw(im)
    txt(d, (56, 35), "LN / SELECTED WORK", 13, MUTE, mono=True)
    d.ellipse((1010, 39, 1016, 45), fill=AMBER)
    txt(d, (1031, 35), "CONCEPTUAL OVERVIEW", 12, MUTE, mono=True)
    rule(d, (56, 76, 1224, 76))
    rule(d, (56, 654, 1224, 654))
    rule(d, (56, 654, 56+1168*clamp(t/DURATION), 654), AMBER, 2)
    txt(d, (56, 674), "LUTHFI NABHAN IBRAHIM", 12, MUTE, mono=True)
    txt(d, (510, 674), chapter, 12, MUTE, mono=True)
    txt(d, (1128, 674), "AI / 03", 12, AMBER, mono=True)
    return im, d


def chat_icon(d, box, color=WHITE, width=2):
    x, y, x1, y1 = box
    d.rounded_rectangle(box, 15, outline=color, width=width)
    rule(d, (x+23, y1, x+23, y1+20, x+48, y1), color, width)
    for j in range(3):
        cx=x+32+j*27
        d.ellipse((cx-3, y+32, cx+3, y+38), fill=color)


def opening(t):
    im, d = shell(t, "01 / THE PROJECT")
    enter(d, (58, 126), "CONVERSATIONAL HR SUPPORT", 13, t, .12, AMBER, mono=True)
    enter(d, (50, 191), "HRIS AI", 102, t, .25, bold=True)
    enter(d, (50, 299), "Chatbot", 102, t, .45, bold=True)
    enter(d, (58, 453), "HRIS data access.", 28, t, .7)
    enter(d, (58, 493), "Employee support queries.", 28, t, .9, MUTE)
    enter(d, (58, 596), "PT. SINARMAS MULTIARTHA TBK", 13, t, 1.1, MUTE, mono=True)
    p=ease((t-.6)/1)
    rule(d, (745, 130, 745, 595))
    # Abstract conversation marks introduce the motif, not a fabricated app.
    for j, (x,y,w) in enumerate([(826,180,280),(885,323,280),(826,466,280)]):
        a=ease((t-.7-j*.2)/.9)
        col=mix(BLACK, AMBER if j==1 else LINE, a)
        d.rounded_rectangle((x,y+round(18*(1-a)),x+w,y+90),10,outline=col,width=2)
        for k in range(2):
            rule(d,(x+24,y+33+k*23,x+w-36-k*68,y+33+k*23),col,3)
    txt(d, (826, 593), "A CONVERSATIONAL INTERFACE", 12, mix(BLACK,MUTE,p),mono=True)
    return im


def conversation(t):
    local=t-4.5
    im,d=shell(t,"02 / THE CONVERSATION")
    enter(d,(56,121),"Start with",48,local,.05,bold=True)
    enter(d,(56,181),"a question.",48,local,.15,bold=True)
    enter(d,(58,288),"An AI-powered interface",23,local,.3)
    enter(d,(58,322),"for HRIS data access",23,local,.4,MUTE)
    enter(d,(58,356),"and employee support.",23,local,.5,MUTE)
    enter(d,(58,561),"ILLUSTRATIVE CONVERSATION",12,local,.4,AMBER,mono=True)
    enter(d,(58,589),"Example copy · conceptual UI",16,local,.5,MUTE)
    # Spacious, deliberately generic exchange. No personnel data or policy facts.
    p=ease((local-.25)/.8)
    d.rounded_rectangle((541,119,1224,615),10,fill=mix(BLACK,TILE,p),outline=mix(BLACK,LINE,p))
    txt(d,(566,144),"HRIS AI CHATBOT",14,mix(BLACK,WHITE,p),mono=True)
    txt(d,(1069,145),"CONCEPT UI",11,mix(BLACK,MUTE,p),mono=True)
    rule(d,(542,182,1223,182),mix(BLACK,LINE,p))
    q="Where can I find HR information?"
    a=ease((local-.9)/.6)
    d.rounded_rectangle((601,211,1194,293),8,fill=mix(BLACK,AMBER,a))
    visible=q[:int(len(q)*clamp((local-1.05)/1.45))]
    txt(d,(624,241),visible,25,mix(BLACK,BLACK,a))
    txt(d,(1122,308),"EXAMPLE",11,mix(BLACK,MUTE,a),mono=True)
    response=ease((local-3)/.65)
    if local>3:
        txt(d,(571,348),"AI",12,mix(BLACK,AMBER,response),mono=True)
        d.rounded_rectangle((601,337,1194,469),8,outline=mix(BLACK,LINE,response))
        txt(d,(624,365),"You can start with your",25,mix(BLACK,WHITE,response))
        txt(d,(624,402),"organization’s HR resources.",25,mix(BLACK,WHITE,response))
    elif local>2.5:
        for j in range(3):
            d.ellipse((620+j*18,365,625+j*18,370),fill=AMBER)
    rule(d,(569,541,1195,541),mix(BLACK,LINE,p))
    txt(d,(570,566),"Ask an HR question",18,mix(BLACK,MUTE,p))
    d.rounded_rectangle((1158,555,1195,592),5,fill=mix(BLACK,AMBER,p))
    rule(d,(1176,581,1176,566,1170,572,1176,566,1182,572),BLACK,2)
    return im


NODES=[("01","Question","Employee support"),
       ("02","LLM","Conversation"),
       ("03","Python / Java","Application stack"),
       ("04","APIs","Connections"),
       ("05","HRIS","Data access")]


def flow(t):
    local=t-12.5
    im,d=shell(t,"03 / THE CONNECTIONS")
    enter(d,(56,119),"Conversation meets HRIS.",48,local,.05,bold=True)
    enter(d,(58,188),"Illustrative technology flow · not an implementation diagram",17,local,.2,MUTE)
    active=min(4,max(0,int((local-1)/1.2)))
    for j,(num,title,subtitle) in enumerate(NODES):
        x=56+j*238
        p=ease((local-.4-j*.1)/.7)
        y=293+round(15*(1-p))
        c=mix(BLACK,AMBER if j==active else LINE,p)
        d.rounded_rectangle((x,y,x+216,y+217),6,fill=mix(BLACK,TILE,p),outline=c,width=2 if j==active else 1)
        txt(d,(x+18,y+19),num,12,mix(BLACK,AMBER if j==active else MUTE,p),mono=True)
        if j<2:
            chat_icon(d,(x+20,y+58,x+126,y+111),mix(BLACK,AMBER if j==active else WHITE,p))
        elif j==2:
            txt(d,(x+18,y+57),"{ }",48,mix(BLACK,WHITE,p),mono=True)
        elif j==3:
            txt(d,(x+18,y+62),"↔",45,mix(BLACK,WHITE,p))
        else:
            d.ellipse((x+20,y+60,x+87,y+78),outline=mix(BLACK,WHITE,p),width=2)
            rule(d,(x+20,y+69,x+20,y+112),mix(BLACK,WHITE,p),2)
            rule(d,(x+87,y+69,x+87,y+112),mix(BLACK,WHITE,p),2)
            d.arc((x+20,y+102,x+87,y+122),0,180,fill=mix(BLACK,WHITE,p),width=2)
        txt(d,(x+18,y+149),title,24,mix(BLACK,WHITE,p),bold=True)
        txt(d,(x+18,y+188),subtitle,14,mix(BLACK,MUTE,p))
        if j<4:
            cy=402
            rule(d,(x+219,cy,x+235,cy),mix(BLACK,LINE,p))
            q=(local*.65-j*.15)%1
            cx=x+219+q*16
            d.ellipse((cx-2,cy-2,cx+2,cy+2),fill=mix(BLACK,AMBER,p))
    enter(d,(58,564),"LLM, Python, Java and APIs",25,local,.7)
    enter(d,(58,602),"A conceptual view of the technologies named in this project.",17,local,.85,MUTE)
    return im


def closing(t):
    local=t-20.5
    im,d=shell(t,"04 / THE STACK")
    enter(d,(58,126),"HRIS AI CHATBOT",14,local,.05,AMBER,mono=True)
    enter(d,(51,197),"HR support,",76,local,.15,bold=True)
    enter(d,(51,282),"in conversation.",76,local,.3,bold=True)
    enter(d,(58,390),"AI-powered HRIS data access and employee support.",25,local,.5,MUTE)
    x=58
    for j,(label,width) in enumerate([("Python",144),("LLM",115),("Java",119),("SQL",110),("APIs",122)]):
        p=ease((local-.7-j*.1)/.7)
        y=462+round(12*(1-p))
        d.rounded_rectangle((x,y,x+width,y+58),4,outline=mix(BLACK,LINE,p))
        txt(d,(x+20,y+19),label,22,mix(BLACK,WHITE,p))
        x+=width+13
    enter(d,(58,575),"Luthfi Nabhan Ibrahim",25,local,1.2,bold=True)
    enter(d,(58,615),"PT. SINARMAS MULTIARTHA TBK",12,local,1.35,MUTE,mono=True)
    p=ease((local-.7)/.8)
    chat_icon(d,(1048,478,1198,573),mix(BLACK,AMBER,p))
    return im


SCENES=[(0,opening),(4.5,conversation),(12.5,flow),(20.5,closing)]


def render(t):
    index=max(i for i,(start,_) in enumerate(SCENES) if t>=start)
    im=SCENES[index][1](t)
    start=SCENES[index][0]
    if index and t-start<.32:
        im=Image.blend(SCENES[index-1][1](start-.001),im,ease((t-start)/.32))
    if t<.4:
        im=Image.blend(Image.new("RGB",(W,H),BLACK),im,ease(t/.4))
    return im


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ffmpeg")
    parser.add_argument("--preview-only",action="store_true")
    parser.add_argument("--preview-dir",type=Path,default=Path(tempfile.gettempdir())/"portfolio-hris-preview")
    args=parser.parse_args()
    output=ROOT/"public"/"videos"
    output.mkdir(parents=True,exist_ok=True)
    args.preview_dir.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="portfolio-hris-fonts-") as tmp:
        global FONT_PATHS
        FONT_PATHS={}
        for mono,name in [(False,"Satoshi-Variable"),(True,"GeistMono-Variable")]:
            ft=TTFont(ROOT/"public"/"fonts"/(name+".woff2"))
            ft.flavor=None
            path=Path(tmp)/(name+".ttf")
            ft.save(path)
            FONT_PATHS[mono]=path
        times=[2.8,6.8,10,14.5,18.5,24]
        sheet=Image.new("RGB",(1280,1080),BLACK)
        for i,t in enumerate(times):
            frame=render(t)
            frame.save(args.preview_dir/f"frame-{t:g}.jpg",quality=95)
            sheet.paste(frame.resize((640,360),Image.Resampling.LANCZOS),((i%2)*640,(i//2)*360))
        sheet.save(args.preview_dir/"contact-sheet.jpg",quality=95)
        print(f"Contact sheet: {args.preview_dir/'contact-sheet.jpg'}",flush=True)
        if args.preview_only:
            return
        render(10).save(output/"hris-ai-chatbot-promo-poster.jpg",quality=95,subsampling=0)
        if args.ffmpeg:
            ffmpeg=args.ffmpeg
        else:
            import imageio_ffmpeg
            ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
        target=output/"hris-ai-chatbot-promo.mp4"
        cmd=[ffmpeg,"-y","-f","rawvideo","-vcodec","rawvideo","-pix_fmt","rgb24",
             "-s",f"{W}x{H}","-r",str(FPS),"-i","-","-an","-c:v","libx264",
             "-preset","medium","-crf","18","-pix_fmt","yuv420p","-movflags","+faststart",
             "-metadata","title=HRIS AI Chatbot | Conceptual overview",
             "-metadata","comment=Illustrative conversation and technology flow, not production UI or an implementation diagram.",
             str(target)]
        proc=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=subprocess.DEVNULL)
        try:
            for i in range(FPS*DURATION):
                proc.stdin.write(np.asarray(render(i/FPS)).tobytes())
                if i%(FPS*2)==0:
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
