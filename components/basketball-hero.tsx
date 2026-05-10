"use client";

import { useEffect, useRef } from "react";

const CELL = 18;

const C = {
  ceiling:   "#0F1420",
  beam:      "#161D30",
  light:     "#FFF8C8",
  wallTop:   "#141B2D",
  seatA:     "#1A2E5A",
  seatB:     "#142248",
  wallMid:   "#1E2A40",
  wood1:     "#D4883C",
  wood2:     "#BC7428",
  paint:     "#B05818",
  paintDk:   "#964A0E",
  courtLine: "#F0E0A0",
  skin:      "#F5C09A",
  eye:       "#2D1500",
  hairBlonde:"#E8B84B",
  hairBrown: "#5C3317",
  jerseyTrim:"#1E3A8A",
  jersey:    "#3B82F6",
  shorts:    "#1D4ED8",
  shoe:      "#1F2937",
  ball:      "#F97316",
  ballSeam:  "#7C2D12",
  board:     "#F0F4F8",
  rim:       "#EF4444",
  net:       "#CBD5E1",
  pole:      "#374151",
};

// Muted crowd jersey colours — desaturated, varied
const CROWD_JERSEYS = ["#2A3A5A","#4A3020","#2A3F3F","#3A2A4A","#3A3A28","#4A2F2F","#28403A","#3F3028"];
const CROWD_SKINS   = ["#C4956A","#A07855","#D4A882","#8B6545"];

type Px = [number, number, string];
type Phase =
  | "catch_pause"
  | "wind_up"
  | "shooting"
  | "at_hoop"
  | "falling"
  | "rb_catch"
  | "rb_dribble"
  | "rb_pass"
  | "ball_return";

interface AnimState {
  phase: Phase;
  startTime: number;
  duration: number;
  isSwish: boolean;
  dribbles: number;
}

// Chibi player — 6 cols × 10 rows, symmetric (works for both facing directions)
function makeBody(hair: string): Px[] {
  return [
    [1,0,hair],[2,0,hair],[3,0,hair],[4,0,hair],
    [0,1,hair],[1,1,C.eye],[2,1,C.skin],[3,1,C.skin],[4,1,C.eye],[5,1,hair],
    [0,2,C.skin],[1,2,C.skin],[2,2,C.skin],[3,2,C.skin],[4,2,C.skin],[5,2,C.skin],
    [2,3,C.skin],[3,3,C.skin],
    [1,4,C.jerseyTrim],[2,4,C.jerseyTrim],[3,4,C.jerseyTrim],[4,4,C.jerseyTrim],
    [0,5,C.jerseyTrim],[1,5,C.jersey],[2,5,C.jersey],[3,5,C.jersey],[4,5,C.jersey],[5,5,C.jerseyTrim],
    [0,6,C.jerseyTrim],[1,6,C.jersey],[2,6,C.jersey],[3,6,C.jersey],[4,6,C.jersey],[5,6,C.jerseyTrim],
    [0,7,C.shorts],[1,7,C.shorts],[2,7,C.shorts],[3,7,C.shorts],[4,7,C.shorts],[5,7,C.shorts],
    [1,8,C.shorts],[2,8,C.shorts],[3,8,C.shorts],[4,8,C.shorts],
    [0,9,C.shoe],[1,9,C.shoe],[2,9,C.shoe],
    [3,9,C.shoe],[4,9,C.shoe],[5,9,C.shoe],
  ];
}
const BODY_S = makeBody(C.hairBlonde);
const BODY_R = makeBody(C.hairBrown);

type ArmDef = { pixels: Px[]; hc: number; hr: number };

// Shooter arms (extends RIGHT from body)
const S_ARM_DOWN: ArmDef   = { pixels: [[6,5,C.skin],[7,5,C.skin],[7,6,C.skin],[8,6,C.skin]],   hc:8, hr:6 };
const S_ARM_WIND: ArmDef   = { pixels: [[6,3,C.skin],[7,3,C.skin],[7,4,C.skin]],                 hc:7, hr:3 };
const S_ARM_UP: ArmDef     = { pixels: [[6,1,C.skin],[7,1,C.skin],[7,2,C.skin],[6,2,C.skin],[6,3,C.skin]], hc:7, hr:1 };

// Rebounder arms (extends LEFT — negative col offsets from body origin)
const R_ARM_IDLE: ArmDef   = { pixels: [[-1,5,C.skin],[-2,5,C.skin],[-2,6,C.skin]],              hc:-2, hr:6 };
const R_ARM_UP: ArmDef     = { pixels: [[-1,2,C.skin],[-2,2,C.skin],[-2,1,C.skin],[-2,0,C.skin]],hc:-2, hr:0 };
const R_ARM_DRIB: ArmDef   = { pixels: [[-1,5,C.skin],[-2,5,C.skin],[-2,6,C.skin],[-2,7,C.skin]],hc:-2, hr:7 };
const R_ARM_PASS: ArmDef   = { pixels: [[-1,4,C.skin],[-2,4,C.skin],[-3,4,C.skin],[-4,4,C.skin]],hc:-4, hr:4 };

// Hoop: origin = top-left of backboard
const HOOP_BODY: Px[] = [
  [0,0,C.board],[1,0,C.board],[0,1,C.board],[1,1,C.board],
  [0,2,C.board],[1,2,C.board],[0,3,C.board],[1,3,C.board],
  [0,4,C.board],[1,4,C.board],[0,5,C.board],[1,5,C.board],
  [0,6,C.board],[1,6,C.board],[0,7,C.board],[1,7,C.board],
  [-8,4,C.rim],[-7,4,C.rim],[-6,4,C.rim],[-5,4,C.rim],
  [-4,4,C.rim],[-3,4,C.rim],[-2,4,C.rim],[-1,4,C.rim],
  [-8,5,C.rim],[-1,5,C.rim],
  [0,8,C.pole],[1,8,C.pole],[0,9,C.pole],[1,9,C.pole],
  [0,10,C.pole],[1,10,C.pole],[0,11,C.pole],[1,11,C.pole],
  [0,12,C.pole],[1,12,C.pole],
];

const NET: [number,number][] = [
  [-7,5],[-5,5],[-3,5],
  [-6,6],[-4,6],[-2,6],
  [-6,7],[-4,7],
  [-5,8],[-3,8],
  [-5,9],[-4,9],
];

function px(ctx: CanvasRenderingContext2D, pixels: Px[], ox: number, oy: number, cell: number) {
  for (const [dc,dr,col] of pixels) {
    ctx.fillStyle = col;
    ctx.fillRect(ox + dc*cell, oy + dr*cell, cell, cell);
  }
}

function ball(ctx: CanvasRenderingContext2D, x: number, y: number, cell: number, sx=1, sy=1) {
  ctx.save();
  ctx.translate(x + cell, y + cell);
  ctx.scale(sx, sy);
  ctx.fillStyle = C.ball;
  ctx.fillRect(-cell, -cell, cell*2, cell*2);
  ctx.fillStyle = C.ballSeam;
  ctx.fillRect(-cell, -1, cell*2, 2);
  ctx.fillRect(-1, -cell, 2, cell*2);
  ctx.restore();
}

function qBez(t:number,ax:number,ay:number,bx:number,by:number,cx:number,cy:number):[number,number]{
  const m=1-t; return [m*m*ax+2*m*t*bx+t*t*cx, m*m*ay+2*m*t*by+t*t*cy];
}
const eIO = (t:number) => t<0.5?2*t*t:-1+(4-2*t)*t;
const eIn = (t:number) => t*t;
const eOut= (t:number) => 1-(1-t)*(1-t);

export default function BasketballHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const stateRef  = useRef<AnimState>({
    phase:"catch_pause", startTime:performance.now(), duration:700,
    isSwish:Math.random()>0.45, dribbles:1+Math.floor(Math.random()*2),
  });

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;

    function resize(){ if(canvas){ canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; } }

    function draw(){
      if(!canvas) return;
      const ctx=canvas.getContext("2d"); if(!ctx) return;
      const W=canvas.width, H=canvas.height;
      const cell=CELL;
      const cols=Math.floor(W/cell), rows=Math.floor(H/cell);

      // Layout — court is bottom 28%, bleachers take the middle
      const ceilEnd  = Math.floor(rows*0.08);
      const blchEnd  = Math.floor(rows*0.55);
      const floorRow = Math.floor(rows*0.72);
      const floorY   = floorRow*cell;

      // --- CEILING ---
      ctx.fillStyle=C.ceiling;
      ctx.fillRect(0,0,W,ceilEnd*cell);
      ctx.fillStyle=C.beam;
      for(let c=3;c<cols;c+=9){ ctx.fillRect(c*cell,0,cell*2,ceilEnd*cell); }
      ctx.fillStyle=C.light;
      for(let lc=5;lc<cols;lc+=11){
        ctx.fillRect(lc*cell,(ceilEnd-2)*cell,cell*3,cell*2);
      }

      // --- BLEACHERS ---
      ctx.fillStyle=C.wallTop;
      ctx.fillRect(0,ceilEnd*cell,W,(blchEnd-ceilEnd)*cell);
      const tierCount=6;
      const tierH=Math.floor((blchEnd-ceilEnd)/tierCount);
      for(let tier=0;tier<tierCount;tier++){
        const ty=(ceilEnd+tier*tierH)*cell;
        ctx.fillStyle=tier%2===0?C.seatA:C.seatB;
        ctx.fillRect(0,ty+cell,W,(tierH-1)*cell);
        const stagger=(tier%2)*Math.floor(cell*2);
        for(let cx2=stagger;cx2<W-cell*3;cx2+=cell*4){
          const personIdx=((cx2/(cell*4))|0)+tier*3;
          ctx.fillStyle=CROWD_SKINS[personIdx%CROWD_SKINS.length];
          ctx.fillRect(cx2+cell,ty+cell,cell*2,cell);
          ctx.fillStyle=CROWD_JERSEYS[personIdx%CROWD_JERSEYS.length];
          ctx.fillRect(cx2,ty+cell*2,cell*3,cell*2);
        }
      }

      // --- MID WALL ---
      ctx.fillStyle=C.wallMid;
      ctx.fillRect(0,blchEnd*cell,W,(floorRow-blchEnd)*cell);

      // --- COURT ---
      const hoopCol=Math.floor(cols*0.90);

      for(let r=floorRow;r<rows+1;r++){
        const seam=(r-floorRow)%2===1;
        for(let c=0;c<cols;c++){
          ctx.fillStyle=seam?C.wood2:C.wood1;
          ctx.fillRect(c*cell,r*cell,cell,cell);
        }
      }

      // --- KEY POSITIONS ---
      const sc=Math.max(2,Math.floor(cols*0.05)), sr=floorRow-9;
      const sX=sc*cell, sY=sr*cell;
      const hoopX=hoopCol*cell, hoopY=Math.floor(rows*0.26)*cell;
      const rc=hoopCol-7, rr=floorRow-7;
      const rX=rc*cell, rY=rr*cell;
      const rimCX=hoopX-4*cell,  rimCY=hoopY+4.5*cell;
      const rimFX=hoopX-8*cell,  rimFY=hoopY+3.5*cell;
      const netEY=hoopY+9*cell;
      const rx3=rimCX-(sc+2)*cell;
      const paintL=Math.round((rimCX-rx3*0.8)/cell);
      const ballFloor=floorY-cell;
      const sHandX=sX+S_ARM_DOWN.hc*cell;
      const sCatchY=sY+S_ARM_DOWN.hr*cell;
      const sRelY=sY+S_ARM_UP.hr*cell;

      // --- COURT MARKINGS (pixel-block rendering) ---
      {
        const floorH   = H - floorY;
        const midY     = Math.round(floorY + floorH * 0.5);
        const ry3      = Math.min(Math.round(floorH * 0.40), H - 2 * cell - midY);
        const keyHalfY = Math.round(floorH * 0.16);
        const nearY    = midY - keyHalfY;
        const farY     = midY + keyHalfY;
        const ftX      = Math.round(paintL * cell);

        // Paint/key fill (clipped to floor)
        ctx.save();
        ctx.beginPath(); ctx.rect(0, floorY, W, floorH); ctx.clip();
        ctx.fillStyle = C.paint;
        ctx.fillRect(ftX, nearY, W - ftX, keyHalfY * 2);
        ctx.restore();

        ctx.fillStyle = C.courtLine;

        // Lane lines (2 px thin)
        ctx.fillRect(ftX, nearY, W - ftX, 2);
        ctx.fillRect(ftX, farY,  W - ftX, 2);
        // Free-throw line (2 px thin)
        ctx.fillRect(ftX, nearY, 2, farY - nearY);

        // FT circle — pixel-block arc
        const rxFT = Math.round((rimCX - ftX) * 0.32);
        const ryFT = Math.round(rxFT * ry3 / rx3);
        // Solid half (court-facing, x < ftX)
        for (let c = Math.floor((ftX - rxFT) / cell); c <= Math.ceil(ftX / cell); c++) {
          const cx = c * cell + cell * 0.5;
          if (cx > ftX) continue;
          const dx = (cx - ftX) / rxFT;
          const dyN = Math.sqrt(Math.max(0, 1 - dx * dx));
          const y1 = midY - dyN * ryFT, y2 = midY + dyN * ryFT;
          ctx.fillRect(c * cell, Math.floor(y1 / cell) * cell, cell, cell);
          if (Math.floor(y1 / cell) !== Math.floor(y2 / cell))
            ctx.fillRect(c * cell, Math.floor(y2 / cell) * cell, cell, cell);
        }
        // Dashed half (basket-facing) — every other cell
        for (let c = Math.ceil(ftX / cell); c <= Math.floor((ftX + rxFT) / cell); c++) {
          if (c % 2 === 0) continue;
          const cx = c * cell + cell * 0.5;
          const dx = (cx - ftX) / rxFT;
          const dyN = Math.sqrt(Math.max(0, 1 - dx * dx));
          const y1 = midY - dyN * ryFT, y2 = midY + dyN * ryFT;
          ctx.fillRect(c * cell, Math.floor(y1 / cell) * cell, cell, cell);
          if (Math.floor(y1 / cell) !== Math.floor(y2 / cell))
            ctx.fillRect(c * cell, Math.floor(y2 / cell) * cell, cell, cell);
        }

        // 3-point arc — pixel-block arc (left half of ellipse)
        for (let c = Math.floor((rimCX - rx3) / cell); c <= Math.ceil(rimCX / cell); c++) {
          const cx = c * cell + cell * 0.5;
          if (cx >= rimCX) continue;
          const dx = (cx - rimCX) / rx3;
          const dyN = Math.sqrt(Math.max(0, 1 - dx * dx));
          const y1 = midY - dyN * ry3, y2 = midY + dyN * ry3;
          ctx.fillRect(c * cell, Math.floor(y1 / cell) * cell, cell, cell);
          if (Math.floor(y1 / cell) !== Math.floor(y2 / cell))
            ctx.fillRect(c * cell, Math.floor(y2 / cell) * cell, cell, cell);
        }
        // Corner straight lines (one cell tall, runs to right edge)
        const cornerX  = Math.floor(rimCX / cell) * cell;
        const topRow   = Math.floor((midY - ry3) / cell) * cell;
        const botRow   = Math.floor((midY + ry3) / cell) * cell;
        ctx.fillRect(cornerX, topRow, W - cornerX, cell);
        ctx.fillRect(cornerX, botRow, W - cornerX, cell);
      }

      // --- STANCHION ---
      const stanchTopY=hoopY+8*cell;
      ctx.fillStyle=C.pole;
      ctx.fillRect(hoopX, stanchTopY, cell*2, floorY-stanchTopY);
      ctx.fillRect(hoopX-cell*3, floorY-cell, cell*8, cell);

      // --- STATE MACHINE ---
      const now=performance.now();
      const rawT=(now-stateRef.current.startTime)/stateRef.current.duration;
      if(rawT>=1){
        const o=stateRef.current;
        stateRef.current=(()=>{
          switch(o.phase){
            case "catch_pause": return {...o,phase:"wind_up"    as Phase,startTime:now,duration:450};
            case "wind_up":     return {...o,phase:"shooting"   as Phase,startTime:now,duration:1800};
            case "shooting":    return {...o,phase:"at_hoop"    as Phase,startTime:now,duration:300};
            case "at_hoop":     return {...o,phase:"falling"    as Phase,startTime:now,duration:680};
            case "falling":     return {...o,phase:"rb_catch"   as Phase,startTime:now,duration:280};
            case "rb_catch":    return {...o,phase:"rb_dribble" as Phase,startTime:now,duration:o.dribbles*480};
            case "rb_dribble":  return {...o,phase:"rb_pass"    as Phase,startTime:now,duration:380};
            case "rb_pass":     return {...o,phase:"ball_return"as Phase,startTime:now,duration:650};
            case "ball_return": return {
              phase:"catch_pause" as Phase,startTime:now,duration:500,
              isSwish:Math.random()>0.45,dribbles:1+Math.floor(Math.random()*2),
            };
          }
        })();
      }

      const s=stateRef.current;
      const t=Math.min((now-s.startTime)/s.duration,1);

      // Compute rebounder hand X at pass position (used for ball_return start)
      const rPassHandX=rX+R_ARM_PASS.hc*cell;
      const rPassHandY=rY+R_ARM_PASS.hr*cell;
      const rCatchHandX=rX+R_ARM_UP.hc*cell;
      const rCatchHandY=rY+R_ARM_UP.hr*cell;
      const rDribHandY=rY+R_ARM_DRIB.hr*cell;

      // --- BALL POSITION + SQUASH/STRETCH ---
      let bX=sHandX,bY=sCatchY,bSX=1,bSY=1;

      switch(s.phase){
        case "catch_pause": bX=sHandX; bY=sCatchY; break;
        case "wind_up":{
          bX=sHandX;
          const armHr=t<0.35?S_ARM_DOWN.hr:t<0.65?S_ARM_WIND.hr:S_ARM_UP.hr;
          bY=sY+armHr*cell; break;
        }
        case "shooting":{
          [bX,bY]=qBez(eIO(t),sHandX,sRelY,(sHandX+rimCX)/2,H*0.04,s.isSwish?rimCX:rimFX,s.isSwish?rimCY:rimFY);
          const arc=Math.sin(t*Math.PI);
          bSX=1-arc*0.18; bSY=1+arc*0.28; break;
        }
        case "at_hoop":
          if(s.isSwish){ bX=rimCX+Math.sin(t*Math.PI)*0.5*cell; bY=rimCY+eIn(t)*5*cell; }
          else          { bX=rimFX-eOut(t)*3*cell; bY=rimFY-Math.sin(t*Math.PI)*5*cell; }
          break;
        case "falling":{
          const fx=s.isSwish?rimCX:rimFX-cell*2;
          const fy=s.isSwish?netEY:rimFY;
          bX=fx+t*(rCatchHandX-fx);
          bY=fy+eIn(t)*(ballFloor-fy);
          if(t>0.82){ const imp=(t-0.82)/0.18; bSX=1+imp*0.4; bSY=1-imp*0.5; }
          break;
        }
        case "rb_catch":{
          bX=rCatchHandX;
          bY=ballFloor+eOut(t)*(rCatchHandY-ballFloor);
          if(t<0.3){ const u=1-t/0.3; bSX=1+u*0.3; bSY=1-u*0.4; }
          break;
        }
        case "rb_dribble":{
          const dT=t*s.dribbles, bounce=dT%1, down=bounce<0.5;
          const bT=down?bounce*2:(bounce-0.5)*2;
          bX=rCatchHandX;
          if(down){
            bY=rDribHandY+eIn(bT)*(ballFloor-rDribHandY);
          } else {
            bY=ballFloor-eOut(bT)*(ballFloor-rDribHandY);
            if(bT<0.18){ const u=1-bT/0.18; bSX=1+u*0.35; bSY=1-u*0.45; }
            else        { bSX=0.85; bSY=1.25; }
          }
          break;
        }
        case "rb_pass":{
          bX=rCatchHandX+eOut(t)*(rPassHandX-rCatchHandX);
          bY=rCatchHandY+eOut(t)*(rPassHandY-rCatchHandY);
          bSX=1+t*0.25; bSY=1-t*0.18; break;
        }
        case "ball_return":{
          [bX,bY]=qBez(eIO(t),rPassHandX,rPassHandY,(rPassHandX+sHandX)/2,H*0.22,sHandX,sCatchY);
          const arc=Math.sin(t*Math.PI);
          bSX=1-arc*0.15; bSY=1+arc*0.22; break;
        }
      }

      // --- SHOOTER ARM ---
      let sArm=S_ARM_DOWN;
      switch(s.phase){
        case "wind_up":     sArm=t<0.35?S_ARM_DOWN:t<0.65?S_ARM_WIND:S_ARM_UP; break;
        case "shooting": case "at_hoop": case "falling": case "rb_catch": case "rb_dribble":
          sArm=S_ARM_UP; break;
        case "rb_pass":     sArm=t<0.5?S_ARM_UP:S_ARM_WIND; break;
        case "ball_return": sArm=t<0.6?S_ARM_WIND:S_ARM_DOWN; break;
        default:            sArm=S_ARM_DOWN;
      }

      // --- REBOUNDER ARM ---
      let rArm=R_ARM_IDLE;
      switch(s.phase){
        case "at_hoop":     rArm=t>0.5?R_ARM_UP:R_ARM_IDLE; break;
        case "falling": case "rb_catch": rArm=R_ARM_UP; break;
        case "rb_dribble":  rArm=R_ARM_DRIB; break;
        case "rb_pass":     rArm=t>0.5?R_ARM_PASS:R_ARM_DRIB; break;
        default:            rArm=R_ARM_IDLE;
      }

      // --- NET WAVE ---
      let netWave=0;
      if(s.isSwish){
        if(s.phase==="at_hoop") netWave=Math.sin(t*Math.PI*3.5)*0.8*cell;
        else if(s.phase==="falling"&&t<0.4) netWave=Math.sin(t*Math.PI*5)*0.4*cell*(1-t/0.4);
      }

      // --- SHOOTER ANTICIPATION DIP ---
      let dipY=0;
      if(s.phase==="catch_pause"&&t>0.7) dipY=Math.sin(((t-0.7)/0.3)*Math.PI)*cell*0.6;

      // --- DRAW HOOP ---
      px(ctx,HOOP_BODY,hoopX,hoopY,cell);
      ctx.fillStyle=C.net;
      for(const [dc,dr] of NET) ctx.fillRect(hoopX+dc*cell+netWave,hoopY+dr*cell,cell,cell);

      // --- DRAW BALL ---
      ball(ctx,bX,bY,cell,bSX,bSY);

      // --- DRAW SHOOTER ---
      px(ctx,BODY_S,sX,sY+dipY,cell);
      px(ctx,sArm.pixels,sX,sY+dipY,cell);

      // --- DRAW REBOUNDER ---
      px(ctx,BODY_R,rX,rY,cell);
      px(ctx,rArm.pixels,rX,rY,cell);

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
        <div className="flex flex-col items-center gap-4 text-center p-8 bg-black/60 border border-white/[0.06] rounded-sm">
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
