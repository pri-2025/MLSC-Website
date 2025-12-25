import { useEffect, useRef } from "react";

export default function NetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;
    let particles = [];
    // Increase particle density for mesh-like structure
    const particleCount = 140;
    const maxDistance = 220;
    const mouse = { x: null, y: null };
    let rafId;

    // RGB tuples (no alpha) — we'll build rgba(...) strings where needed
    const colors = [
      "0,140,255",
      "80,200,220",
      "0,220,140",
      "255,210,80",
      "255,100,100",
    ];

    function setSize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    class Particle {
      constructor() {
        this.reset();
        this.radius = rand(0.9, 2.6);
        this.colorIndex = Math.floor(Math.random() * colors.length);
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = rand(-0.25, 0.25);
        this.vy = rand(-0.25, 0.25);
      }

      draw() {
        ctx.save();
        const color = `rgba(${colors[this.colorIndex]},0.9)`;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.shadowBlur = 18;
        ctx.shadowColor = color;
        ctx.globalCompositeOperation = "lighter";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        // subtle outer halo
        ctx.beginPath();
        ctx.fillStyle = `rgba(${colors[this.colorIndex]},0.06)`;
        ctx.arc(this.x, this.y, this.radius * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      update() {
        // gentle drift
        this.x += this.vx;
        this.y += this.vy;

        // subtle perlin-like wiggle
        this.vx += rand(-0.01, 0.01);
        this.vy += rand(-0.01, 0.01);
        this.vx = Math.max(Math.min(this.vx, 0.6), -0.6);
        this.vy = Math.max(Math.min(this.vy, 0.6), -0.6);

        // Cursor attraction (magnetic effect)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const force = (1 - dist / 220) * 0.06; // smooth attraction
            this.vx += dx * force * 0.0015;
            this.vy += dy * force * 0.0015;
          }
        }

        // wrap softly at edges
        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;

        this.draw();
      }
    }

    function init() {
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    }

    function mixColor(i, j) {
      // return rgb tuples to build rgba(...) with desired alpha later
      return { c1: colors[i], c2: colors[j] };
    }

    function drawConnections() {
      // Connect each particle to its k nearest neighbors for mesh/triangulation look
      const k = 4; // number of neighbors
      ctx.save();
      ctx.lineWidth = 0.8;
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // build array of distances
        const neighbors = [];
        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue;
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = dx * dx + dy * dy; // squared
          neighbors.push({ idx: j, dist });
        }
        neighbors.sort((a, b) => a.dist - b.dist);
        for (let n = 0; n < Math.min(k, neighbors.length); n++) {
          const other = particles[neighbors[n].idx];
          const realDist = Math.sqrt(neighbors[n].dist);
          if (realDist > maxDistance) continue;
          const alpha = (1 - realDist / maxDistance) * 0.6;
          const { c1, c2 } = mixColor(p.colorIndex, other.colorIndex);

          // draw a slightly curved line biased by mouse proximity
          const nearMouse =
            mouse.x !== null && (Math.hypot(p.x - mouse.x, p.y - mouse.y) < 160 || Math.hypot(other.x - mouse.x, other.y - mouse.y) < 160);

          const grad = ctx.createLinearGradient(p.x, p.y, other.x, other.y);
          grad.addColorStop(0, `rgba(${c1},${alpha})`);
          grad.addColorStop(1, `rgba(${c2},${alpha})`);
          ctx.strokeStyle = grad;
          ctx.beginPath();
          if (nearMouse) {
            const mx = mouse.x || (p.x + other.x) / 2;
            const my = mouse.y || (p.y + other.y) / 2;
            const cpX = mx + rand(-30, 30) * (realDist / maxDistance);
            const cpY = my + rand(-30, 30) * (realDist / maxDistance);
            ctx.moveTo(p.x, p.y);
            ctx.quadraticCurveTo(cpX, cpY, other.x, other.y);
          } else {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
          }
          ctx.shadowBlur = 10;
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      // subtle background vignette
      ctx.fillStyle = "rgba(5,10,20,0.22)";
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => p.update());
      drawConnections();
      rafId = requestAnimationFrame(animate);
    }

    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function onMouseLeave() {
      mouse.x = null;
      mouse.y = null;
    }

    setSize();
    init();
    const resizeHandler = () => {
      setSize();
      init();
    };
    window.addEventListener("resize", resizeHandler);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    animate();

    return () => {
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        background: "#050814",
      }}
    />
  );
}
