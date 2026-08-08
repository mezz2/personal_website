"use client";

import { useEffect, useRef } from "react";

function s(str: string): React.CSSProperties {
  const o: Record<string, string> = {};
  for (const decl of str.split(";")) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const k = decl.slice(0, i).trim();
    const v = decl.slice(i + 1).trim();
    if (!k) continue;
    o[k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
  }
  return o as React.CSSProperties;
}

type Scene = {
  W: number; H: number; r: number;
  startX: number; rimX: number; rimY: number; floorY: number;
  launchX: number; launchY: number; shooterTop: number;
};
type Shot = {
  phase: "dribble" | "load" | "fly" | "result" | "return";
  t0: number; angle: number; pts: number;
  outcome: { name: string; label: string; points: number } | null;
  scored: boolean; landX: number;
};

export default function BasketballHero() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const g = (id: string) => root.querySelector<HTMLElement>("#" + id);

    let raf = 0;
    let scene: Scene | null = null;
    let sceneW = 0;
    const parts: { el: HTMLElement; x?: number; y?: number; vx?: number; vy?: number }[] = [];
    const shot: Shot = { phase: "dribble", t0: performance.now(), angle: 0, pts: 0, outcome: null, scored: false, landX: 0 };

    function layoutScene(): Scene | null {
      const band = g("hs-band");
      if (!band || !band.clientWidth) return null;
      const W = band.clientWidth, H = band.clientHeight;
      const r = 27;
      const startX = Math.max(124, W * 0.17);
      const rimX = Math.min(W - 90, W * 0.72);
      const rimY = H * 0.2, floorY = H * 0.9;
      const set = (id: string, l: number, t: number) => { const e = g(id); if (e) { e.style.left = l + "px"; e.style.top = t + "px"; } };
      set("hs-rim", rimX - 34, rimY - 9.5);
      set("hs-net", rimX - 32, rimY + 2);
      set("hs-board", rimX - 48, rimY - 70);
      set("hs-board2", rimX - 17, rimY - 54);
      const shooterTop = floorY - 150;
      set("hs-shooter", startX - 104, shooterTop);
      const launchX = startX - 22, launchY = shooterTop - 2;
      return { W, H, r, startX, rimX, rimY, floorY, launchX, launchY, shooterTop };
    }
    function poseShooter(t: { body?: string; lArm?: number; rArm?: number }) {
      const sh = g("hs-shooter"), al = g("hs-arm-l"), ar = g("hs-arm-r");
      if (!sh) return;
      sh.style.transform = t.body || "none";
      if (al) al.style.transform = "rotate(" + (t.lArm || 0) + "deg)";
      if (ar) ar.style.transform = "rotate(" + (t.rArm || 0) + "deg)";
    }
    function pickOutcome() {
      const r = Math.random();
      if (r < 0.5) return { name: "swish", label: "SWISH!  +3", points: 3 };
      if (r < 0.74) return { name: "bank", label: "BANK!  +2", points: 2 };
      return { name: "rimout", label: "RIM OUT", points: 0 };
    }
    function updatePts(p: number) { const e = g("hs-ptsval"); if (e) e.textContent = String(Math.min(999, p)).padStart(3, "0"); }
    function arcPos(s2: Scene, oc: string, u: number) {
      let tx = s2.rimX, ty = s2.rimY;
      if (oc === "bank") { tx = s2.rimX + 18; ty = s2.rimY - 16; }
      else if (oc === "rimout") { tx = s2.rimX - 24; ty = s2.rimY + 2; }
      const x = s2.launchX + (tx - s2.launchX) * u;
      const y = s2.launchY * (1 - u) + ty * u - (s2.H * 0.4) * Math.sin(Math.PI * u);
      return { x, y };
    }
    function drawTrail(s2: Scene, sh: Shot, curU: number) {
      const trail = g("hs-trail"); if (!trail || !sh.outcome) return;
      const steps = Math.max(1, Math.round(curU * 28));
      let d = "";
      for (let i = 0; i <= steps; i++) { const p = arcPos(s2, sh.outcome.name, curU * (i / steps)); d += (i ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1) + " "; }
      trail.setAttribute("d", d.trim());
    }
    function fireParticles(s2: Scene) {
      parts.forEach((p) => { p.x = s2.rimX + (Math.random() * 2 - 1) * 12; p.y = s2.rimY + s2.H * 0.05; p.vx = (Math.random() * 2 - 1) * 5.5; p.vy = 1.5 + Math.random() * 4.5; p.el.style.opacity = "1"; });
    }
    function updateParticles(u: number, make: boolean) {
      if (!make) { parts.forEach((p) => { if (p.el.style.opacity !== "0") p.el.style.opacity = "0"; }); return; }
      parts.forEach((p) => { if (p.x === undefined) return; p.x += p.vx!; p.vy! += 0.38; p.y! += p.vy!; p.el.style.transform = "translate(" + p.x.toFixed(1) + "px," + p.y!.toFixed(1) + "px)"; p.el.style.opacity = String(Math.max(0, 1 - u * 1.25)); });
    }
    function runShot(now: number) {
      if (!scene) { scene = layoutScene(); if (!scene) return; }
      const s2 = scene, sh = shot;
      const ball = g("hs-ball"), shadow = g("hs-shadow"), pop = g("hs-pop"), net = g("hs-net"), trail = g("hs-trail"), flash = g("hs-flash"), band = g("hs-band");
      if (!ball) return;
      const r = s2.r, e = now - sh.t0;
      const DRIB = 1900, LOAD = 320, FLY = 760, RES = 820, RET = 1500;
      let bx = s2.startX, by = s2.floorY, sx = 1, sy = 1, bandShake = "none";
      if (sh.phase === "dribble") {
        const per = 560, k = (e % per) / per, h = Math.abs(Math.sin(k * Math.PI));
        by = s2.floorY - h * (s2.floorY - s2.shooterTop) * 0.48; bx = s2.startX;
        if (h < 0.13) { const q = (0.13 - h) / 0.13; sx = 1 + 0.17 * q; sy = 1 - 0.17 * q; }
        sh.angle += 1.4;
        if (trail) trail.style.opacity = "0";
        poseShooter({ rArm: 18 + h * 24, lArm: -8 });
        if (e >= DRIB) { sh.phase = "load"; sh.t0 = now; sh.outcome = pickOutcome(); sh.scored = false; }
      } else if (sh.phase === "load") {
        const u = Math.min(1, e / LOAD), d = Math.sin(u * Math.PI);
        bx = s2.startX + (s2.launchX - s2.startX) * u;
        by = (s2.floorY + 7 * d) * (1 - u) + s2.launchY * u;
        sx = 1 + 0.1 * d; sy = 1 - 0.1 * d;
        const dip = Math.sin(Math.min(1, u * 1.4) * Math.PI);
        poseShooter({ body: "translateY(" + (9 * dip).toFixed(1) + "px) scaleY(" + (1 - 0.1 * dip).toFixed(3) + ")", rArm: 30 - u * 60, lArm: -20 + u * -30 });
        if (e >= LOAD) { sh.phase = "fly"; sh.t0 = now; }
      } else if (sh.phase === "fly") {
        const u = Math.min(1, e / FLY), oc = sh.outcome!.name;
        const p = arcPos(s2, oc, u); bx = p.x; by = p.y;
        sh.angle += 10;
        drawTrail(s2, sh, u);
        if (trail) trail.style.opacity = "0.92";
        const rel = Math.min(1, u * 3.2);
        poseShooter({ body: "translateY(" + (-7 * Math.sin(Math.min(1, u * 2) * Math.PI)).toFixed(1) + "px)", rArm: -30 - rel * 135, lArm: -50 - rel * 110 });
        if (e >= FLY) { sh.phase = "result"; sh.t0 = now; }
      } else if (sh.phase === "result") {
        const u = Math.min(1, e / RES), oc = sh.outcome!.name, make = oc !== "rimout";
        if (!sh.scored) { sh.pts += sh.outcome!.points; updatePts(sh.pts); if (make) fireParticles(s2); sh.scored = true; }
        if (trail) trail.style.opacity = String(Math.max(0, 0.9 * (1 - u * 1.3)));
        if (oc === "rimout") {
          bx = (s2.rimX - 22) - (s2.W * 0.32) * u;
          by = s2.rimY + (s2.floorY - s2.rimY + 60) * Math.pow(u, 1.7) - 40 * Math.sin(Math.PI * Math.min(1, u * 1.25));
          sh.angle += 8;
        } else {
          bx = s2.rimX; by = s2.rimY + (s2.H * 0.78) * u; sh.angle += 5;
          const rip = Math.sin(Math.min(1, u * 2) * Math.PI);
          if (net) net.style.transform = "scaleY(" + (1 + 0.34 * rip).toFixed(3) + ") translateY(" + (3 * rip).toFixed(1) + "px)";
          if (flash) { flash.style.background = "radial-gradient(55% 80% at " + (s2.rimX / s2.W * 100).toFixed(1) + "% " + (s2.rimY / s2.H * 100).toFixed(1) + "%,rgba(249,115,22,.6),rgba(249,115,22,0) 62%)"; flash.style.opacity = String(Math.max(0, (0.22 - u)) / 0.22 * 0.9); }
          if (u < 0.16) { const m = (0.16 - u) / 0.16 * 7; bandShake = "translate(" + ((Math.random() * 2 - 1) * m).toFixed(1) + "px," + ((Math.random() * 2 - 1) * m).toFixed(1) + "px)"; }
        }
        updateParticles(u, make);
        const setv = Math.max(0, 1 - u * 2.2);
        poseShooter({ rArm: -165 * setv, lArm: -160 * setv });
        if (pop) { pop.textContent = sh.outcome!.label; pop.style.color = oc === "rimout" ? "#9a9ab0" : "#fb8c2e"; pop.style.opacity = String(Math.min(1, u * 3)); const ps = 1 + 0.14 * Math.sin(Math.min(1, u * 3) * Math.PI); pop.style.transform = "translate(" + (s2.rimX - 150) + "px," + (s2.rimY - 8 - u * 16) + "px) scale(" + ps.toFixed(3) + ")"; }
        if (e >= RES) { sh.phase = "return"; sh.t0 = now; sh.landX = oc === "rimout" ? (s2.rimX - 22) - (s2.W * 0.32) : s2.rimX; if (net) net.style.transform = "none"; if (flash) flash.style.opacity = "0"; }
      } else {
        const u = Math.min(1, e / RET);
        const ease = 1 - Math.pow(1 - u, 2);
        bx = sh.landX + (s2.startX - sh.landX) * ease;
        const nB = 3, hh = Math.abs(Math.sin(u * nB * Math.PI)), amp = s2.H * 0.26 * (1 - u);
        by = s2.floorY - amp * hh;
        if (hh < 0.12) { const q = (0.12 - hh) / 0.12; sx = 1 + 0.16 * q; sy = 1 - 0.16 * q; }
        sh.angle += s2.startX < sh.landX ? -7 : 7;
        ball.style.opacity = "1";
        if (trail) trail.style.opacity = "0";
        if (pop) pop.style.opacity = String(Math.max(0, 1 - u * 1.8));
        updateParticles(1, false);
        const near = Math.max(0, (u - 0.5) / 0.5);
        poseShooter({ rArm: 18 + near * 18, lArm: -8 - near * 6 });
        if (e >= RET) { sh.phase = "dribble"; sh.t0 = now; }
      }
      if (band) band.style.transform = bandShake;
      ball.style.transform = "translate(" + (bx - r).toFixed(1) + "px," + (by - r).toFixed(1) + "px) rotate(" + (sh.angle % 360) + "deg) scale(" + sx.toFixed(3) + "," + sy.toFixed(3) + ")";
      if (shadow) {
        const above = Math.max(0, s2.floorY - by), tt = Math.min(1, above / (s2.H * 0.7));
        shadow.style.transform = "translate(" + (bx - s2.r).toFixed(1) + "px," + (s2.floorY + 10).toFixed(1) + "px) scaleX(" + (1 - 0.58 * tt).toFixed(3) + ")";
        shadow.style.opacity = String((0.42 * (1 - 0.7 * tt)).toFixed(3));
      }
    }

    const pc = g("hs-parts");
    if (pc) {
      for (let i = 0; i < 12; i++) {
        const d = document.createElement("div");
        d.style.cssText = "position:absolute;left:0;top:0;width:8px;height:8px;border-radius:50%;background:" + (i % 2 ? "#fb8c2e" : "#ffdca6") + ";opacity:0;will-change:transform,opacity;box-shadow:0 0 6px rgba(249,115,22,.6);";
        pc.appendChild(d);
        parts.push({ el: d });
      }
    }
    scene = layoutScene();
    sceneW = scene ? scene.W : 0;
    runShot(performance.now());

    const loop = () => {
      const now = performance.now();
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const t = g("hero-title");
      if (t) t.style.transform = "translateY(" + (y * 0.16).toFixed(1) + "px)";
      const band = g("hs-band");
      if (band) { const w = band.clientWidth; if (w && w !== sceneW) { sceneW = w; scene = layoutScene(); } }
      runShot(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    try {
      if (sessionStorage.getItem("hl_booted")) { const bt = g("boot"); if (bt) bt.style.display = "none"; }
      else sessionStorage.setItem("hl_booted", "1");
    } catch {}

    return () => { cancelAnimationFrame(raf); if (pc) pc.innerHTML = ""; };
  }, []);

  return (
    <section ref={rootRef} style={s("position:relative;min-height:100vh;background:radial-gradient(125% 90% at 50% -8%,#191922 0%,#0a0a10 60%,#06060a 100%);overflow:hidden;display:flex;flex-direction:column;font-family:var(--font-serif)")}>
      {/* arcade boot overlay */}
      <div id="boot" style={s("position:fixed;inset:0;z-index:90;background:#06060a;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:hl-boot 2.7s ease-in forwards")}>
        <div style={s("position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 2px,rgba(0,0,0,.5) 3px,rgba(0,0,0,0) 4px);pointer-events:none")} />
        <div style={s("font-family:var(--font-pixel);font-size:clamp(18px,4vw,34px);color:#fb8c2e;text-shadow:3px 3px 0 #7a2e0a;text-align:center;line-height:1.3")}>HOOPS<br />LAB</div>
        <div style={s("margin-top:34px;width:min(260px,60vw);height:14px;border:2px solid #fb8c2e;padding:2px")}>
          <div style={s("height:100%;background:#fb8c2e;animation:hl-barfill 2.7s steps(20,end) forwards")} />
        </div>
        <div style={s("margin-top:18px;font-family:var(--font-pixel);font-size:9px;color:#7a6a4a;letter-spacing:.1em")}>LOADING SEASON DATA...</div>
        <div style={s("margin-top:22px;font-family:var(--font-pixel);font-size:11px;color:#fb8c2e;animation:hl-bootflash 2.7s ease forwards")}>INSERT COIN</div>
      </div>

      {/* CRT + glow overlays */}
      <div style={s("position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 2px,rgba(0,0,0,.28) 3px,rgba(0,0,0,0) 4px);pointer-events:none;z-index:5")} />
      <div style={s("position:absolute;left:0;right:0;height:160px;background:linear-gradient(rgba(249,115,22,0),rgba(249,115,22,.09),rgba(249,115,22,0));animation:hl-scan 6s linear infinite;pointer-events:none;z-index:4")} />
      <div style={s("position:absolute;inset:0;background:radial-gradient(55% 45% at 50% 40%,rgba(249,115,22,.13) 0%,rgba(249,115,22,0) 70%)")} />

      {/* animated court backdrop */}
      <div style={s("position:absolute;inset:0;z-index:1;opacity:.5;background-image:linear-gradient(rgba(249,115,22,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.05) 1px,transparent 1px);background-size:72px 72px;animation:hl-drift 14s linear infinite;mask-image:radial-gradient(80% 70% at 50% 45%,#000,transparent 85%);-webkit-mask-image:radial-gradient(80% 70% at 50% 45%,#000,transparent 85%);pointer-events:none")} />
      <div style={s("position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);z-index:1;width:min(116vh,150vw);height:min(116vh,150vw);pointer-events:none;animation:hl-spinslow 60s linear infinite")}>
        <div style={s("position:absolute;inset:0;border:2px dashed rgba(249,115,22,.10);border-radius:50%")} />
        <div style={s("position:absolute;inset:13%;border:2px solid rgba(249,115,22,.07);border-radius:50%")} />
        <div style={s("position:absolute;inset:34%;border:1px dashed rgba(249,115,22,.09);border-radius:50%")} />
      </div>
      <div style={s("position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);z-index:1;width:min(70vh,92vw);height:min(70vh,92vw);pointer-events:none;animation:hl-spinrev 44s linear infinite")}>
        <div style={s("position:absolute;inset:0;border:2px solid rgba(249,115,22,.06);border-radius:50%")} />
      </div>
      <div style={s("position:absolute;left:8%;top:24%;z-index:1;width:6px;height:6px;border-radius:50%;background:#fb8c2e;box-shadow:0 0 8px rgba(249,115,22,.8);animation:hl-twinkle 5.5s ease-in-out infinite;pointer-events:none")} />
      <div style={s("position:absolute;left:22%;top:62%;z-index:1;width:4px;height:4px;border-radius:50%;background:#ffdca6;box-shadow:0 0 7px rgba(249,115,22,.7);animation:hl-twinkle 7s ease-in-out .8s infinite;pointer-events:none")} />
      <div style={s("position:absolute;left:74%;top:30%;z-index:1;width:5px;height:5px;border-radius:50%;background:#fb8c2e;box-shadow:0 0 8px rgba(249,115,22,.7);animation:hl-twinkle 6.2s ease-in-out 1.6s infinite;pointer-events:none")} />
      <div style={s("position:absolute;left:88%;top:66%;z-index:1;width:4px;height:4px;border-radius:50%;background:#ffdca6;box-shadow:0 0 7px rgba(249,115,22,.6);animation:hl-twinkle 8s ease-in-out .4s infinite;pointer-events:none")} />
      <div style={s("position:absolute;left:60%;top:14%;z-index:1;width:5px;height:5px;border-radius:50%;background:#fb8c2e;box-shadow:0 0 8px rgba(249,115,22,.7);animation:hl-twinkle 6.8s ease-in-out 2.2s infinite;pointer-events:none")} />
      <div style={s("position:absolute;left:0;right:0;bottom:0;height:60px;z-index:1;background:repeating-linear-gradient(90deg,rgba(249,115,22,.07) 0 5px,transparent 5px 13px),repeating-linear-gradient(90deg,rgba(255,255,255,.03) 0 13px,transparent 13px 26px);mask-image:linear-gradient(transparent,#000);-webkit-mask-image:linear-gradient(transparent,#000);animation:hl-crowd 4s ease-in-out infinite;pointer-events:none")} />

      {/* top HUD */}
      <div style={s("position:relative;z-index:6;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:clamp(20px,3.5vw,34px) clamp(20px,5vw,64px);font-family:var(--font-pixel);font-size:9px;letter-spacing:.1em;color:#5b5b6b")}>
        <span style={s("color:#fb8c2e")}>&#9679; HOOPS LAB</span>
        <span>1P&nbsp;&nbsp;HI 999999&nbsp;&nbsp;CREDIT 01</span>
      </div>

      {/* title block */}
      <div style={s("position:relative;z-index:6;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:10px clamp(20px,5vw,64px) 0")}>
        <h1 id="hero-title" style={s("font-family:var(--font-pixel);font-size:clamp(38px,8vw,78px);line-height:1.12;margin:0;color:#fb8c2e;text-shadow:3px 0 #7a2e0a,-3px 0 #7a2e0a,0 3px #7a2e0a,0 -3px #7a2e0a,3px 3px #7a2e0a,-3px 3px #7a2e0a,3px -3px #7a2e0a,-3px -3px #7a2e0a,7px 7px rgba(0,0,0,.5)")}>HOOPS<br />LAB</h1>
        <p style={s("font-family:var(--font-pixel);font-size:clamp(9px,1.5vw,12px);line-height:2.1;color:#f3b27a;margin:clamp(24px,4vw,36px) 0 0")}>BUILDING DATA SCIENCE SKILLS<br />THROUGH MY PASSION FOR THE NBA</p>
        <div style={s("font-family:var(--font-pixel);font-size:clamp(10px,1.6vw,13px);color:#fb8c2e;margin-top:clamp(30px,4.5vw,42px);animation:hl-blink 1.1s steps(1) infinite")}>&#9654; PRESS START</div>
        <div style={s("display:flex;gap:clamp(14px,2vw,22px);margin-top:clamp(30px,4.5vw,40px);flex-wrap:wrap;justify-content:center")}>
          <a className="hl-btn-primary" href="#projects" style={s("font-family:var(--font-pixel);font-size:clamp(9px,1.3vw,11px);color:#0a0a10;background:#fb8c2e;padding:15px 24px;box-shadow:5px 5px 0 #7a2e0a;text-decoration:none")}>VIEW PROJECTS</a>
          <a className="hl-btn-ghost" href="https://github.com/mezz2" target="_blank" rel="noopener noreferrer" style={s("font-family:var(--font-pixel);font-size:clamp(9px,1.3vw,11px);color:#fb8c2e;border:3px solid #fb8c2e;padding:12px 24px;box-shadow:5px 5px 0 rgba(249,115,22,.25);text-decoration:none")}>GITHUB / MEZZ2</a>
        </div>
      </div>

      {/* shot scene */}
      <div id="hs-band" style={s("position:absolute;inset:0;z-index:4;width:100%;height:100%;overflow:hidden;will-change:transform")}>
        <div id="hs-flash" style={s("position:absolute;inset:0;pointer-events:none;opacity:0;mix-blend-mode:screen")} />
        <svg id="hs-trailsvg" style={s("position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible")}>
          <path id="hs-trail" d="" fill="none" stroke="#fb8c2e" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 12" opacity="0" style={{ filter: "drop-shadow(0 0 7px rgba(249,115,22,.8))" }} />
        </svg>
        <div id="hs-board" style={s("position:absolute;left:0;top:0;width:96px;height:66px;background:rgba(255,255,255,.05);border:4px solid #fb8c2e;box-shadow:inset 0 0 0 2px rgba(122,46,10,.45),0 0 16px rgba(249,115,22,.22)")} />
        <div id="hs-board2" style={s("position:absolute;left:0;top:0;width:34px;height:26px;border:4px solid #fb8c2e")} />
        <div id="hs-net" style={s("position:absolute;left:0;top:0;width:64px;height:52px;background:repeating-linear-gradient(58deg,rgba(255,255,255,.5) 0 1.5px,transparent 1.5px 9px),repeating-linear-gradient(-58deg,rgba(255,255,255,.5) 0 1.5px,transparent 1.5px 9px);clip-path:polygon(0 0,100% 0,78% 100%,22% 100%);transform-origin:50% 0;will-change:transform")} />
        <div id="hs-rim" style={s("position:absolute;left:0;top:0;width:68px;height:19px;border:5px solid #fb8c2e;border-radius:50%;box-shadow:0 0 14px rgba(249,115,22,.5)")} />
        <div id="hs-parts" style={s("position:absolute;left:0;top:0;pointer-events:none")} />
        <div id="hs-shooter" style={s("position:absolute;left:0;top:0;width:88px;height:164px;transform-origin:50% 100%;will-change:transform")}>
          <div style={s("position:absolute;left:27px;top:0;width:34px;height:34px;background:#caa07a;border:3px solid #4a2c14;border-radius:5px")} />
          <div style={s("position:absolute;left:24px;top:3px;width:40px;height:9px;background:#fb8c2e")} />
          <div style={s("position:absolute;left:16px;top:36px;width:56px;height:60px;background:#fb8c2e;border:4px solid #7a2e0a")} />
          <div style={s("position:absolute;left:34px;top:46px;width:20px;height:26px;font-family:var(--font-pixel);font-size:15px;color:#7a2e0a;text-align:center;line-height:26px")}>2</div>
          <div id="hs-arm-l" style={s("position:absolute;left:4px;top:42px;width:13px;height:46px;background:#caa07a;border:2px solid #4a2c14;border-radius:4px;transform-origin:50% 8%;will-change:transform")} />
          <div id="hs-arm-r" style={s("position:absolute;left:71px;top:42px;width:13px;height:46px;background:#caa07a;border:2px solid #4a2c14;border-radius:4px;transform-origin:50% 8%;will-change:transform")} />
          <div style={s("position:absolute;left:22px;top:94px;width:17px;height:52px;background:#1b1b24;border:2px solid #050507")} />
          <div style={s("position:absolute;left:49px;top:94px;width:17px;height:52px;background:#1b1b24;border:2px solid #050507")} />
          <div style={s("position:absolute;left:15px;top:144px;width:29px;height:18px;background:#ededed;border:2px solid #4a2c14;border-radius:4px")} />
          <div style={s("position:absolute;left:45px;top:144px;width:29px;height:18px;background:#ededed;border:2px solid #4a2c14;border-radius:4px")} />
        </div>
        <div id="hs-shadow" style={s("position:absolute;left:0;top:0;width:62px;height:14px;border-radius:50%;background:#000;filter:blur(3px);opacity:.4;will-change:transform,opacity")} />
        <div id="hs-ball" style={s("position:absolute;left:0;top:0;width:54px;height:54px;will-change:transform")}>
          <div style={s("width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 34% 30%,#ffb066 0%,#f97316 46%,#c4480a 100%);position:relative;box-shadow:inset -4px -4px 0 rgba(0,0,0,.18),0 0 20px rgba(249,115,22,.38)")}>
            <div style={s("position:absolute;top:50%;left:0;right:0;height:4px;background:#7a2e0a;transform:translateY(-50%)")} />
            <div style={s("position:absolute;left:50%;top:0;bottom:0;width:4px;background:#7a2e0a;transform:translateX(-50%)")} />
            <div style={s("position:absolute;left:-22%;top:6%;width:144%;height:88%;border:4px solid #7a2e0a;border-radius:50%;opacity:.45")} />
          </div>
        </div>
        <div id="hs-pop" style={s("position:absolute;left:0;top:0;font-family:var(--font-pixel);font-size:clamp(15px,2.2vw,24px);color:#fb8c2e;text-shadow:3px 3px 0 #7a2e0a;opacity:0;white-space:nowrap;will-change:transform,opacity")} />
        <div style={s("position:absolute;right:clamp(16px,5vw,48px);bottom:clamp(16px,4vh,30px);font-family:var(--font-pixel);font-size:11px;color:#5b5b6b;letter-spacing:.1em")}>PTS <span id="hs-ptsval" style={s("color:#fb8c2e")}>000</span></div>
      </div>

      <div style={s("position:absolute;bottom:18px;left:0;right:0;text-align:center;z-index:6;font-family:var(--font-pixel);font-size:8px;color:#46465a;letter-spacing:.12em;animation:hl-cue 1.6s ease-in-out infinite")}>&#9660; SCROLL</div>
    </section>
  );
}
