"use client";

import { useEffect, useRef } from "react";

const FONT_SIZE = 14;
const FONT = `${FONT_SIZE}px 'Courier New', Courier, monospace`;
const EYE = "#2d1500";

const C = {
  bg:     "#0a0a0a",
  dot:    "#171717",
  skin:   "#D4A574",
  jersey: "#3B82F6",
  shorts: "#1E3A8A",
  legs:   "#F1F5F9",
  shoes:  "#111827",
  ball:   "#F97316",
  board:  "#D1D5DB",
  rim:    "#EF4444",
  net:    "#6B7280",
  pole:   "#374151",
  tramp:  "#94A3B8",
  tsupp:  "#475569",
  floor:  "#1c1400",
  floorL: "#2d2100",
};

type Px = [number, number, string];

// Body never changes — eyes are baked in at [2,3] and [3,3]
const BODY: Px[] = [
  [2,2,C.skin],[3,2,C.skin],
  [1,3,C.skin],[2,3,EYE],[3,3,EYE],[4,3,C.skin],
  [1,4,C.skin],[2,4,C.skin],[3,4,C.skin],[4,4,C.skin],
  [0,5,C.jersey],[1,5,C.jersey],[2,5,C.jersey],[3,5,C.jersey],[4,5,C.jersey],[5,5,C.jersey],
  [0,6,C.jersey],[1,6,C.jersey],[2,6,C.jersey],[3,6,C.jersey],[4,6,C.jersey],[5,6,C.jersey],
  [0,7,C.jersey],[1,7,C.jersey],[2,7,C.jersey],[3,7,C.jersey],[4,7,C.jersey],[5,7,C.jersey],
  [1,8,C.jersey],[2,8,C.jersey],[3,8,C.jersey],[4,8,C.jersey],
  [1,9,C.shorts],[2,9,C.shorts],[3,9,C.shorts],[4,9,C.shorts],
  [1,10,C.shorts],[2,10,C.shorts],[3,10,C.shorts],[4,10,C.shorts],
  [1,11,C.legs],[2,11,C.legs],[3,11,C.legs],[4,11,C.legs],
  [1,12,C.legs],[2,12,C.legs],[3,12,C.legs],[4,12,C.legs],
  [0,13,C.shoes],[1,13,C.shoes],[2,13,C.shoes],
  [3,13,C.shoes],[4,13,C.shoes],[5,13,C.shoes],
];

// Arm states — arm always originates from col 5, row 4-5 (shoulder/jersey)
// hdc/hdr = hand position; ball drawn at hdc+1, hdr
type ArmState = { pixels: Px[]; hdc: number; hdr: number };

// Fully raised: staircase from shoulder (row 4) up to hand (row 0)
const ARM_RAISED: ArmState = {
  pixels: [
    [7,0,C.skin],[6,0,C.skin],
    [7,1,C.skin],[6,1,C.skin],
    [6,2,C.skin],[5,2,C.skin],
    [5,3,C.skin],
    [5,4,C.jersey],           // shoulder — connects to jersey body at [5,5]
  ],
  hdc: 7, hdr: 0,
};

// Mid wind-up: hand at forehead height, arm still from shoulder
const ARM_WIND: ArmState = {
  pixels: [
    [7,3,C.skin],[6,3,C.skin],
    [6,4,C.skin],[5,4,C.skin],  // connects to [5,5] jersey body
  ],
  hdc: 7, hdr: 3,
};

// Catching/ready: arm extended right at waist, outside the body width
const ARM_DOWN: ArmState = {
  pixels: [
    [7,6,C.skin],[6,6,C.skin],
    [6,7,C.skin],               // connects to [5,7] jersey body
  ],
  hdc: 7, hdr: 6,
};

const HOOP_BODY: Px[] = [
  [10,0,C.board],[11,0,C.board],[10,1,C.board],[11,1,C.board],
  [10,2,C.board],[11,2,C.board],[10,3,C.board],[11,3,C.board],
  [10,4,C.board],[11,4,C.board],[10,5,C.board],[11,5,C.board],
  [10,6,C.board],[11,6,C.board],[10,7,C.board],[11,7,C.board],
  [2,4,C.rim],[3,4,C.rim],[4,4,C.rim],[5,4,C.rim],
  [6,4,C.rim],[7,4,C.rim],[8,4,C.rim],[9,4,C.rim],
  [2,5,C.rim],[9,5,C.rim],
  [10,8,C.pole],[11,8,C.pole],[10,9,C.pole],[11,9,C.pole],
  [10,10,C.pole],[11,10,C.pole],[10,11,C.pole],[11,11,C.pole],
  [10,12,C.pole],[11,12,C.pole],[10,13,C.pole],[11,13,C.pole],
];

const NET: Array<[number, number]> = [
  [3,5],[5,5],[7,5],
  [4,6],[6,6],[8,6],
  [4,7],[6,7],
  [5,8],[7,8],
  [5,9],[6,9],
];

// Trampoline split so surface compresses independently of supports
const TRAMP_SURFACE: Px[] = [
  [4,0,C.tramp],[3,1,C.tramp],[2,2,C.tramp],[1,3,C.tramp],[0,4,C.tramp],
];
const TRAMP_SUPPORT: Px[] = [
  [4,1,C.tsupp],[4,2,C.tsupp],[4,3,C.tsupp],[4,4,C.tsupp],[4,5,C.tsupp],
  [0,5,C.tsupp],
];

type Phase = "catch_pause"|"wind_up"|"shooting"|"at_hoop"|"falling"|"returning";
interface AnimState { phase: Phase; startTime: number; duration: number; isSwish: boolean; }

function qBez(t:number,ax:number,ay:number,bx:number,by:number,cx:number,cy:number):[number,number]{
  const m=1-t; return [m*m*ax+2*m*t*bx+t*t*cx, m*m*ay+2*m*t*by+t*t*cy];
}
const eIO = (t:number) => t<0.5?2*t*t:-1+(4-2*t)*t;
const eIn = (t:number) => t*t;
const eOut= (t:number) => 1-(1-t)*(1-t);

function getArm(phase:Phase, t:number):ArmState {
  switch(phase){
    case "catch_pause": return ARM_DOWN;
    case "wind_up":     return t<0.35?ARM_DOWN:t<0.65?ARM_WIND:ARM_RAISED;
    case "shooting":
    case "at_hoop":
    case "falling":     return ARM_RAISED;
    case "returning":   return t<0.3?ARM_RAISED:t<0.6?ARM_WIND:ARM_DOWN;
  }
}

export default function BasketballHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const cwRef     = useRef(0);
  const stateRef  = useRef<AnimState>({
    phase:"catch_pause", startTime:performance.now(), duration:700, isSwish:Math.random()>0.45,
  });

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;

    function resize(){
      if(!canvas) return;
      canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; cwRef.current=0;
    }

    function draw(){
      if(!canvas) return;
      const ctx=canvas.getContext("2d"); if(!ctx) return;
      const W=canvas.width, H=canvas.height;

      if(cwRef.current===0){
        ctx.font=FONT; cwRef.current=Math.round(ctx.measureText("█").width);
      }
      const cw=cwRef.current, ch=cw;
      const cols=Math.floor(W/cw), rows=Math.floor(H/ch);

      ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
      ctx.font=FONT; ctx.textBaseline="top";

      ctx.fillStyle=C.dot;
      for(let r=0;r<rows;r++)
        for(let c=0;c<cols;c++)
          if((c*3+r*7)%11===0) ctx.fillText("·",c*cw,r*ch);

      const fr=rows-3;
      const floorY=fr*ch;
      ctx.fillStyle=C.floor;
      for(let c=0;c<cols;c++) ctx.fillText("▄",c*cw,floorY);
      ctx.fillStyle=C.floorL;
      for(let c=0;c<cols;c++) ctx.fillText("─",c*cw,(fr+1)*ch);

      // Positions
      const pc=Math.max(4,Math.floor(cols*0.04)), pr=fr-14;
      const px=pc*cw, py=pr*ch;
      const hc=Math.min(cols-14,Math.floor(cols*0.76)), htr=Math.floor(rows*0.25);
      const hx=hc*cw, hy=htr*ch;
      const tc=hc-3, tr=fr-5;
      const tx=tc*cw, ty=tr*ch;

      // All arm states share ballAnchorX = px+8*cw (hdc=7 → ball at hdc+1=8)
      const ballAnchorX = px+8*cw;
      const releaseY    = py+ARM_RAISED.hdr*ch;  // py+0
      const catchY      = py+ARM_DOWN.hdr*ch;    // py+6*ch

      const rimCX=hx+5.5*cw, rimCY=hy+4*ch;
      const rimFX=hx+2*cw,   rimFY=hy+3.5*ch;
      const netExitX=hx+5.5*cw, netExitY=hy+9*ch;
      // Miss: after at_hoop the ball is at rimFX-3.5*cw, rimFY
      const postBounceX=hx-1.5*cw, postBounceY=rimFY;

      const trampX=tx+2*cw, trampY=ty+2*ch;

      // Floor bounce points for returning trajectory
      const fb1X=trampX-(trampX-ballAnchorX)*0.35;
      const fb2X=trampX-(trampX-ballAnchorX)*0.68;

      // State machine
      const now=performance.now();
      const raw=(now-stateRef.current.startTime)/stateRef.current.duration;
      if(raw>=1){
        const old=stateRef.current;
        stateRef.current=(()=>{
          switch(old.phase){
            case "catch_pause": return {phase:"wind_up"    as Phase,startTime:now,duration:460, isSwish:old.isSwish};
            case "wind_up":     return {phase:"shooting"   as Phase,startTime:now,duration:1900,isSwish:old.isSwish};
            case "shooting":    return {phase:"at_hoop"    as Phase,startTime:now,duration:250, isSwish:old.isSwish};
            case "at_hoop":     return {phase:"falling"    as Phase,startTime:now,duration:680, isSwish:old.isSwish};
            case "falling":     return {phase:"returning"  as Phase,startTime:now,duration:2500,isSwish:old.isSwish};
            case "returning":   return {phase:"catch_pause"as Phase,startTime:now,duration:600,
                                        isSwish:Math.random()>0.45};
          }
        })();
      }

      const s=stateRef.current;
      const t=Math.min((now-s.startTime)/s.duration,1);
      const arm=getArm(s.phase,t);

      // Ball position
      let ballX:number, ballY:number;
      switch(s.phase){
        case "catch_pause":{
          ballX=ballAnchorX; ballY=catchY; break;
        }
        case "wind_up":{
          ballX=ballAnchorX; ballY=py+arm.hdr*ch; break;
        }
        case "shooting":{
          [ballX,ballY]=qBez(eIO(t),
            ballAnchorX,releaseY,
            (ballAnchorX+rimCX)/2, H*0.05,
            s.isSwish?rimCX:rimFX, s.isSwish?rimCY:rimFY);
          break;
        }
        case "at_hoop":{
          if(s.isSwish){
            ballX=rimCX+Math.sin(t*Math.PI)*0.4*cw;
            ballY=rimCY+eIn(t)*5*ch;
          } else {
            ballX=rimFX-eOut(t)*3.5*cw;
            ballY=rimFY-Math.sin(t*Math.PI)*4.5*ch;
          }
          break;
        }
        case "falling":{
          const sx=s.isSwish?netExitX:postBounceX;
          const sy=s.isSwish?netExitY:postBounceY;
          ballX=sx+t*(trampX-sx);
          ballY=sy+eIn(t)*(trampY-sy);
          break;
        }
        case "returning":{
          // Trampoline bounce → 2 floor bounces → player hand
          // Control points chosen so actual bezier peak = midpoint(start,ctrl)
          const T1=0.33, T2=0.64;
          if(t<=T1){
            const seg=t/T1;
            // Big arc off trampoline
            [ballX,ballY]=qBez(seg,trampX,trampY,(trampX+fb1X)/2,H*0.15,fb1X,floorY);
          } else if(t<=T2){
            const seg=(t-T1)/(T2-T1);
            // Medium floor bounce
            [ballX,ballY]=qBez(seg,fb1X,floorY,(fb1X+fb2X)/2,H*0.34,fb2X,floorY);
          } else {
            const seg=(t-T2)/(1-T2);
            // Small final arc to player's hand height
            [ballX,ballY]=qBez(seg,fb2X,floorY,(fb2X+ballAnchorX)/2,H*0.63,ballAnchorX,catchY);
          }
          break;
        }
        default: ballX=ballAnchorX; ballY=releaseY;
      }

      // Net wave on swish
      let netWaveX=0;
      if(s.isSwish){
        if(s.phase==="at_hoop")
          netWaveX=Math.sin(t*Math.PI*3.5)*0.8*cw;
        else if(s.phase==="falling"&&t<0.4)
          netWaveX=Math.sin(t*Math.PI*5)*0.4*cw*(1-t/0.4);
      }

      // Trampoline surface compression: depresses on impact, springs back with overshoot
      let trampDepress=0;
      if(s.phase==="falling"&&t>0.78){
        trampDepress=eIn((t-0.78)/0.22)*2*ch;
      } else if(s.phase==="returning"){
        if(t<0.05){
          trampDepress=(1-t/0.05)*2*ch;           // spring back
        } else if(t<0.13){
          trampDepress=-Math.sin(((t-0.05)/0.08)*Math.PI)*0.7*ch; // upward overshoot
        }
      }

      // Draw hoop
      for(const [dc,dr,col] of HOOP_BODY){
        ctx.fillStyle=col; ctx.fillText("█",hx+dc*cw,hy+dr*ch);
      }
      ctx.fillStyle=C.net;
      for(const [dc,dr] of NET)
        ctx.fillText("█",hx+dc*cw+netWaveX,hy+dr*ch);

      // Draw trampoline — supports fixed, surface moves
      for(const [dc,dr,col] of TRAMP_SUPPORT){
        ctx.fillStyle=col; ctx.fillText("█",tx+dc*cw,ty+dr*ch);
      }
      for(const [dc,dr,col] of TRAMP_SURFACE){
        ctx.fillStyle=col; ctx.fillText("█",tx+dc*cw,ty+dr*ch+trampDepress);
      }

      // Draw ball
      ctx.fillStyle=C.ball;
      ctx.fillText("█",ballX,     ballY);
      ctx.fillText("█",ballX+cw,  ballY);
      ctx.fillText("█",ballX,     ballY+ch);
      ctx.fillText("█",ballX+cw,  ballY+ch);

      // Draw player body (eyes baked into BODY)
      for(const [dc,dr,col] of BODY){
        ctx.fillStyle=col; ctx.fillText("█",px+dc*cw,py+dr*ch);
      }

      // Draw arm (phase-dependent, always from shoulder)
      for(const [dc,dr,col] of arm.pixels){
        ctx.fillStyle=col; ctx.fillText("█",px+dc*cw,py+dr*ch);
      }

      rafRef.current=requestAnimationFrame(draw);
    }

    resize();
    const ro=new ResizeObserver(resize);
    ro.observe(canvas);
    rafRef.current=requestAnimationFrame(draw);
    return ()=>{ cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  },[]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-6">
        <div className="flex flex-col items-center gap-4 text-center p-8 bg-black/35 border border-white/[0.06] rounded-sm">
          <h1 className="font-mono font-bold text-white tracking-[0.3em] text-4xl sm:text-5xl">
            HOOPS LAB
          </h1>
          <p className="font-mono text-gray-400 text-sm max-w-sm leading-relaxed">
            Building data science skills through my passion for the NBA
          </p>
          <a
            href="https://github.com/mezz2"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto font-mono text-xs text-orange-400 border border-orange-400/50 px-5 py-2 hover:bg-orange-400 hover:text-black transition-all duration-200 mt-1 tracking-widest"
          >
            GITHUB / MEZZ2
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-7 left-0 right-0 flex flex-col items-center z-20 pointer-events-none gap-1 animate-bounce">
        <span className="font-mono text-[10px] text-gray-600 tracking-[0.3em]">SCROLL</span>
        <span className="font-mono text-gray-600 text-sm leading-none">↓</span>
      </div>
    </section>
  );
}
