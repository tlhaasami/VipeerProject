import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Truck,
  RotateCcw,
  Home,
  Trophy,
  Play,
  Layers,
  Package,
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  Gamepad2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Cross-browser safe rounded rectangle drawing for canvas
const drawSafeRoundedRect = (ctx, x, y, width, height, radius, fillStyle, strokeStyle, lineWidth = 1) => {
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
};

export const NotFound404 = ({ onGoHome }) => {
  // Eye tracking refs and state
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const [leftPupilPos, setLeftPupilPos] = useState({ x: 0, y: 0 });
  const [rightPupilPos, setRightPupilPos] = useState({ x: 0, y: 0 });
  const [eyebrowTilt, setEyebrowTilt] = useState({ left: 0, right: 0, yOffset: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [showGame, setShowGame] = useState(false);

  // Highway Runner Game states
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('IDLE'); // IDLE, PLAYING, GAMEOVER
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('viper_runner_highscore') || '0', 10);
  });

  const gameStateRef = useRef('IDLE');
  const audioCtxRef = useRef(null);

  // Sync game state to ref
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Periodic organic eye blinking
  useEffect(() => {
    let blinkTimeout;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        const nextBlink = Math.random() * 3500 + 2500;
        blinkTimeout = setTimeout(triggerBlink, nextBlink);
      }, 160);
    };

    blinkTimeout = setTimeout(triggerBlink, 3000);
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Eye cursor tracking (mouse and touch)
  useEffect(() => {
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (!clientX || !clientY) return;

      const calcPupilOffset = (eyeEl) => {
        if (!eyeEl) return { x: 0, y: 0 };
        const rect = eyeEl.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const dx = clientX - eyeCenterX;
        const dy = clientY - eyeCenterY;
        const angle = Math.atan2(dy, dx);
        const maxDist = rect.width * 0.26; // Maximum pupil travel radius
        const dist = Math.min(maxDist, Math.hypot(dx, dy) * 0.12);

        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist
        };
      };

      const leftPos = calcPupilOffset(leftEyeRef.current);
      const rightPos = calcPupilOffset(rightEyeRef.current);

      setLeftPupilPos(leftPos);
      setRightPupilPos(rightPos);

      // Eyebrow dynamics based on vertical cursor position
      const screenH = window.innerHeight || 800;
      const screenW = window.innerWidth || 1200;
      const normY = (clientY - screenH / 2) / (screenH / 2);
      const normX = (clientX - screenW / 2) / (screenW / 2);

      setEyebrowTilt({
        left: -normX * 8 + normY * 4,
        right: normX * 8 + normY * 4,
        yOffset: Math.min(6, Math.max(-10, -normY * 8))
      });
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  // Web Audio Synthesizer for retro SCM sound effects
  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioCtxRef.current = new AudioContext();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'jump') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'score') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'crash') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }, [soundEnabled]);

  // Internal Game State Ref for 60 FPS loop
  const gameRef = useRef({
    truck: {
      x: 50,
      y: 135,
      width: 52,
      height: 30,
      vy: 0,
      isGrounded: true,
      wheelAngle: 0
    },
    obstacles: [],
    clouds: [
      { x: 120, y: 30, width: 45, speed: 0.6 },
      { x: 380, y: 22, width: 65, speed: 0.4 },
      { x: 620, y: 38, width: 50, speed: 0.55 }
    ],
    particles: [],
    roadOffset: 0,
    speed: 5.8,
    score: 0,
    frame: 0,
    animationId: null,
    gravity: 0.68,
    jumpForce: -12.0,
    groundY: 165
  });

  // Safe draw scene caller
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const g = gameRef.current;
    const w = canvas.width;
    const h = canvas.height;

    // 1. Sky & Horizon Gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, g.groundY);
    skyGradient.addColorStop(0, '#F5F0DC');
    skyGradient.addColorStop(1, '#EEEAD7');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, w, h);

    // 2. Distant Desert Mountain Silhouette
    ctx.fillStyle = '#E2DCBE';
    ctx.beginPath();
    ctx.moveTo(0, g.groundY);
    ctx.lineTo(80, g.groundY - 30);
    ctx.lineTo(160, g.groundY - 15);
    ctx.lineTo(260, g.groundY - 45);
    ctx.lineTo(360, g.groundY - 20);
    ctx.lineTo(480, g.groundY - 50);
    ctx.lineTo(600, g.groundY - 25);
    ctx.lineTo(700, g.groundY - 40);
    ctx.lineTo(w, g.groundY - 18);
    ctx.lineTo(w, g.groundY);
    ctx.closePath();
    ctx.fill();

    // 3. Parallax Clouds
    ctx.fillStyle = '#D8D2BC';
    g.clouds.forEach((cloud) => {
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, 14, 0, Math.PI * 2);
      ctx.arc(cloud.x + 12, cloud.y - 6, 17, 0, Math.PI * 2);
      ctx.arc(cloud.x + 26, cloud.y, 13, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Ground & Asphalt Road
    ctx.fillStyle = '#CFC8AB';
    ctx.fillRect(0, g.groundY, w, h - g.groundY);

    ctx.strokeStyle = '#B3AB8C';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, g.groundY);
    ctx.lineTo(w, g.groundY);
    ctx.stroke();

    // Road dashed stripes
    ctx.fillStyle = '#757D6F';
    for (let x = -g.roadOffset; x < w; x += 36) {
      drawSafeRoundedRect(ctx, x, g.groundY + 14, 18, 3, 1, '#757D6F');
    }

    // 5. Particles (Dust & Sparks)
    for (let i = g.particles.length - 1; i >= 0; i--) {
      const p = g.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.035;
      p.size = Math.max(0.5, p.size - 0.1);

      if (p.alpha <= 0 || p.y > h) {
        g.particles.splice(i, 1);
      } else {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 6. Obstacles
    g.obstacles.forEach((obs) => {
      ctx.save();
      if (obs.type === 'box') {
        drawSafeRoundedRect(ctx, obs.x, obs.y, obs.width, obs.height, 3, '#D8D2BC', '#757D6F', 1.5);
        ctx.strokeStyle = '#6D0808';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(obs.x + 2, obs.y + 2);
        ctx.lineTo(obs.x + obs.width - 2, obs.y + obs.height - 2);
        ctx.moveTo(obs.x + obs.width - 2, obs.y + 2);
        ctx.lineTo(obs.x + 2, obs.y + obs.height - 2);
        ctx.stroke();
      } else if (obs.type === 'cone') {
        ctx.fillStyle = '#EA580C';
        ctx.beginPath();
        ctx.moveTo(obs.x + obs.width / 2, obs.y);
        ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
        ctx.lineTo(obs.x, obs.y + obs.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(obs.x + 4, obs.y + 12, obs.width - 8, 4);
        ctx.fillRect(obs.x + 6, obs.y + 6, obs.width - 12, 3);
      } else {
        drawSafeRoundedRect(ctx, obs.x, obs.y, obs.width, obs.height, 3, '#2D0000', '#6D0808', 1);

        ctx.fillStyle = '#10B981';
        ctx.fillRect(obs.x + 3, obs.y + 4, 3, 3);
        ctx.fillStyle = g.frame % 30 < 15 ? '#EF4444' : '#6D0808';
        ctx.fillRect(obs.x + 8, obs.y + 4, 3, 3);

        ctx.fillStyle = '#757D6F';
        ctx.fillRect(obs.x + 3, obs.y + 12, obs.width - 6, 2);
        ctx.fillRect(obs.x + 3, obs.y + 19, obs.width - 6, 2);
        ctx.fillRect(obs.x + 3, obs.y + 26, obs.width - 6, 2);
      }
      ctx.restore();
    });

    // 7. SCM Delivery Truck (Player)
    const t = g.truck;
    ctx.save();

    // Truck Cargo Container
    drawSafeRoundedRect(ctx, t.x, t.y, t.width - 14, t.height - 6, 3, '#6D0808');

    // VIPER SCM Stamp
    ctx.fillStyle = '#EEEAD7';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('VIPER', t.x + 5, t.y + 14);

    // Truck Driver Cabin
    drawSafeRoundedRect(ctx, t.x + t.width - 16, t.y + 6, 16, t.height - 12, 2, '#2D0000');

    // Windshield
    ctx.fillStyle = '#EEEAD7';
    ctx.fillRect(t.x + t.width - 9, t.y + 8, 7, 7);

    // Headlight Beam
    ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.beginPath();
    ctx.moveTo(t.x + t.width, t.y + t.height - 14);
    ctx.lineTo(t.x + t.width + 35, t.y + t.height - 18);
    ctx.lineTo(t.x + t.width + 40, t.y + t.height - 4);
    ctx.lineTo(t.x + t.width, t.y + t.height - 8);
    ctx.closePath();
    ctx.fill();

    // Wheels (Spinning with Hubs)
    const drawWheel = (wx, wy) => {
      ctx.save();
      ctx.translate(wx, wy);
      ctx.rotate(t.wheelAngle);
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath();
      ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#EEEAD7';
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#757D6F';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(4, 0);
      ctx.stroke();
      ctx.restore();
    };

    drawWheel(t.x + 10, t.y + t.height - 3);
    drawWheel(t.x + t.width - 10, t.y + t.height - 3);
    ctx.restore();

    // 8. Live HUD Overlay
    ctx.fillStyle = '#2D0000';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`SCORE: ${String(g.score).padStart(5, '0')}`, w - 16, 22);

    ctx.fillStyle = '#757D6F';
    ctx.fillText(`BEST:  ${String(Math.max(highScore, g.score)).padStart(5, '0')}`, w - 16, 38);
  }, [highScore]);

  // Initial mount render
  useEffect(() => {
    if (showGame) {
      renderFrame();
    }
  }, [showGame, renderFrame]);

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (g.truck.isGrounded) {
      g.truck.vy = g.jumpForce;
      g.truck.isGrounded = false;
      playSound('jump');

      // Spawn jump dust particles
      for (let i = 0; i < 6; i++) {
        g.particles.push({
          x: g.truck.x + 8 + Math.random() * 20,
          y: g.groundY - 2,
          vx: -(Math.random() * 2 + 1),
          vy: -(Math.random() * 2 + 0.5),
          size: Math.random() * 3 + 2,
          alpha: 0.8,
          color: '#B3AB8C'
        });
      }
    }
  }, [playSound]);

  const runGameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const g = gameRef.current;

    const loop = () => {
      if (gameStateRef.current !== 'PLAYING') return;

      g.frame++;

      // 1. Update Physics
      g.truck.vy += g.gravity;
      g.truck.y += g.truck.vy;

      if (g.truck.y >= g.groundY - g.truck.height) {
        g.truck.y = g.groundY - g.truck.height;
        g.truck.vy = 0;
        g.truck.isGrounded = true;
      }

      // Wheel rotation
      g.truck.wheelAngle += g.speed * 0.12;

      // Ground exhaust puffs
      if (g.truck.isGrounded && g.frame % 8 === 0) {
        g.particles.push({
          x: g.truck.x,
          y: g.groundY - 4,
          vx: -(g.speed * 0.4 + Math.random()),
          vy: -(Math.random() * 0.6),
          size: Math.random() * 2.5 + 1.5,
          alpha: 0.6,
          color: '#CFC8AB'
        });
      }

      // 2. Update Score & Difficulty Ramp
      if (g.frame % 5 === 0) {
        g.score++;
        setScore(g.score);

        if (g.score > 0 && g.score % 100 === 0) {
          playSound('score');
        }

        if (g.score % 80 === 0 && g.speed < 12) {
          g.speed += 0.35;
        }
      }

      // Update Road & Cloud Parallax
      g.roadOffset = (g.roadOffset + g.speed) % 36;
      g.clouds.forEach((cloud) => {
        cloud.x -= cloud.speed;
        if (cloud.x < -70) {
          cloud.x = canvas.width + Math.random() * 80;
          cloud.y = 20 + Math.random() * 30;
        }
      });

      // 3. Spawn Obstacles
      const spawnInterval = Math.max(45, Math.floor(90 - g.speed * 3.5));
      if (g.frame % spawnInterval === 0 && Math.random() > 0.15) {
        const rand = Math.random();
        let type = 'box';
        let width = 26;
        let height = 26;

        if (rand < 0.4) {
          type = 'box';
          width = 26;
          height = 26;
        } else if (rand < 0.75) {
          type = 'server';
          width = 22;
          height = 38;
        } else {
          type = 'cone';
          width = 18;
          height = 22;
        }

        g.obstacles.push({
          x: canvas.width + 20,
          y: g.groundY - height,
          width,
          height,
          type
        });
      }

      // 4. Move & Filter Obstacles with AABB Collision
      for (let i = g.obstacles.length - 1; i >= 0; i--) {
        const obs = g.obstacles[i];
        obs.x -= g.speed;

        const pad = 5;
        if (
          g.truck.x + pad < obs.x + obs.width - pad &&
          g.truck.x + g.truck.width - pad > obs.x + pad &&
          g.truck.y + pad < obs.y + obs.height &&
          g.truck.y + g.truck.height > obs.y + pad
        ) {
          playSound('crash');
          gameStateRef.current = 'GAMEOVER';
          setGameState('GAMEOVER');

          for (let p = 0; p < 20; p++) {
            g.particles.push({
              x: g.truck.x + g.truck.width / 2,
              y: g.truck.y + g.truck.height / 2,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.8) * 8,
              size: Math.random() * 4 + 2,
              alpha: 1.0,
              color: Math.random() > 0.5 ? '#6D0808' : '#EA580C'
            });
          }

          if (g.score > highScore) {
            setHighScore(g.score);
            localStorage.setItem('viper_runner_highscore', String(g.score));
          }
          renderFrame();
          return;
        }

        if (obs.x < -50) {
          g.obstacles.splice(i, 1);
        }
      }

      renderFrame();
      g.animationId = requestAnimationFrame(loop);
    };

    g.animationId = requestAnimationFrame(loop);
  }, [highScore, playSound, renderFrame]);

  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.truck = {
      x: 50,
      y: 135,
      width: 52,
      height: 30,
      vy: 0,
      isGrounded: true,
      wheelAngle: 0
    };
    g.obstacles = [];
    g.clouds = [
      { x: 120, y: 30, width: 45, speed: 0.6 },
      { x: 380, y: 22, width: 65, speed: 0.4 },
      { x: 620, y: 38, width: 50, speed: 0.55 }
    ];
    g.particles = [];
    g.roadOffset = 0;
    g.speed = 5.8;
    g.score = 0;
    g.frame = 0;

    setScore(0);
    gameStateRef.current = 'PLAYING';
    setGameState('PLAYING');

    if (g.animationId) cancelAnimationFrame(g.animationId);
    runGameLoop();
  }, [runGameLoop]);

  const handleAction = useCallback(() => {
    if (gameStateRef.current === 'IDLE' || gameStateRef.current === 'GAMEOVER') {
      startGame();
    } else if (gameStateRef.current === 'PLAYING') {
      jump();
    }
  }, [startGame, jump]);

  // Stable Keyboard event listener
  const handleActionRef = useRef(handleAction);
  useEffect(() => {
    handleActionRef.current = handleAction;
  }, [handleAction]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showGame && (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW')) {
        e.preventDefault();
        handleActionRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameRef.current.animationId) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, [showGame]);

  return (
    <div className="min-h-screen bg-[#EEEAD7] text-[#2D0000] flex flex-col justify-between p-4 sm:p-8 lg:p-12 font-sans selection:bg-[#6D0808] selection:text-[#EEEAD7] relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#6D0808]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-3 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6D0808] to-[#8A1212] flex items-center justify-center shadow-lg shadow-[#6D0808]/20">
            <Layers className="w-5 h-5 text-[#EEEAD7]" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-[#2D0000] block leading-none">
              VIPER <span className="text-[#6D0808]">SCM</span>
            </span>
            <span className="text-[10px] text-[#757D6F] font-semibold tracking-wider uppercase">
              Ejada Supply Chain
            </span>
          </div>
        </div>

        <button
          onClick={onGoHome}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#F8F6EC] text-[#2D0000] font-bold text-xs border border-[#D8D2BC] transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#6D0808]" />
          <span>Return to Dashboard</span>
        </button>
      </header>

      {/* Main Center Area with Headline and Interactive Eyes */}
      <main className="max-w-5xl w-full mx-auto my-auto py-8 sm:py-12 flex flex-col items-center justify-center relative z-10 space-y-10 sm:space-y-14">
        {/* Top Headline Message */}
        <div className="w-full text-left sm:text-left space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#2D0000] max-w-2xl leading-[1.12]">
            Uh oh, the page you&rsquo;re looking for can&rsquo;t be found.
          </h1>
          <p className="text-xs sm:text-sm text-[#757D6F] font-medium max-w-xl leading-relaxed">
            The requested consignment tracking ID, destination route, or portal URL does not exist on the Ejada VIPER network.
          </p>
        </div>

        {/* Big Expressive Interactive Eyes Centerpiece */}
        <div className="py-6 sm:py-10 flex flex-col items-center justify-center select-none">
          <div className="flex items-center justify-center space-x-6 sm:space-x-12">
            {/* Left Eye */}
            <div className="flex flex-col items-center space-y-2.5 sm:space-y-3.5">
              {/* Left Eyebrow */}
              <svg
                width="84"
                height="28"
                viewBox="0 0 84 28"
                className="w-16 sm:w-24 h-auto transition-transform duration-100 ease-out"
                style={{
                  transform: `translateY(${eyebrowTilt.yOffset}px) rotate(${eyebrowTilt.left}deg)`
                }}
              >
                <path
                  d="M 6 22 Q 42 2 78 22"
                  fill="none"
                  stroke="#2D0000"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>

              {/* Left Eyeball */}
              <div
                ref={leftEyeRef}
                className={`
                  w-28 h-28 sm:w-40 sm:h-40 md:w-44 md:h-44
                  rounded-full bg-white
                  border-[10px] sm:border-[14px] md:border-[16px] border-[#2D0000]
                  shadow-xl shadow-[#2D0000]/10
                  relative flex items-center justify-center overflow-hidden
                  transition-all duration-150
                  ${isBlinking ? 'scale-y-[0.08]' : 'scale-y-100'}
                `}
              >
                {/* Left Pupil */}
                <div
                  className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#2D0000] absolute transition-transform duration-75 ease-out shadow-inner"
                  style={{
                    transform: `translate(${leftPupilPos.x}px, ${leftPupilPos.y}px)`
                  }}
                >
                  {/* Catchlight reflection dot */}
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white absolute top-2 left-2" />
                </div>
              </div>
            </div>

            {/* Right Eye */}
            <div className="flex flex-col items-center space-y-2.5 sm:space-y-3.5">
              {/* Right Eyebrow */}
              <svg
                width="84"
                height="28"
                viewBox="0 0 84 28"
                className="w-16 sm:w-24 h-auto transition-transform duration-100 ease-out"
                style={{
                  transform: `translateY(${eyebrowTilt.yOffset}px) rotate(${eyebrowTilt.right}deg)`
                }}
              >
                <path
                  d="M 6 22 Q 42 2 78 22"
                  fill="none"
                  stroke="#2D0000"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>

              {/* Right Eyeball */}
              <div
                ref={rightEyeRef}
                className={`
                  w-28 h-28 sm:w-40 sm:h-40 md:w-44 md:h-44
                  rounded-full bg-white
                  border-[10px] sm:border-[14px] md:border-[16px] border-[#2D0000]
                  shadow-xl shadow-[#2D0000]/10
                  relative flex items-center justify-center overflow-hidden
                  transition-all duration-150
                  ${isBlinking ? 'scale-y-[0.08]' : 'scale-y-100'}
                `}
              >
                {/* Right Pupil */}
                <div
                  className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#2D0000] absolute transition-transform duration-75 ease-out shadow-inner"
                  style={{
                    transform: `translate(${rightPupilPos.x}px, ${rightPupilPos.y}px)`
                  }}
                >
                  {/* Catchlight reflection dot */}
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white absolute top-2 left-2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons & Mini Game Drawer Toggle */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            onClick={onGoHome}
            className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-[#6D0808] hover:bg-[#2D0000] text-[#EEEAD7] font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#6D0808]/25 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to SCM Dashboard</span>
          </button>

          <button
            onClick={() => setShowGame(!showGame)}
            className="flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-[#F8F6EC] text-[#2D0000] font-bold text-xs sm:text-sm border border-[#D8D2BC] transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4 text-[#6D0808]" />
            <span>{showGame ? 'Hide Highway Runner' : 'Play Highway Runner Simulator'}</span>
            {showGame ? <ChevronUp className="w-4 h-4 text-[#757D6F]" /> : <ChevronDown className="w-4 h-4 text-[#757D6F]" />}
          </button>
        </div>

        {/* Optional Expandable 60 FPS Highway Runner Canvas Box */}
        {showGame && (
          <div className="w-full max-w-4xl bg-white border border-[#D8D2BC] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D8D2BC] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#6D0808] text-[#EEEAD7] flex items-center justify-center font-bold shadow-sm">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-[#2D0000]">VIPER Express Highway Runner</h2>
                  <p className="text-[11px] text-[#757D6F]">Jump over cargo crates, server towers, and cones on the Riyadh route!</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono font-bold">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-xl bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#50574B] border border-[#D8D2BC] cursor-pointer transition-all"
                  title={soundEnabled ? 'Mute Game Sound' : 'Enable Game Sound'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-[#6D0808]" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
                </button>
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#6D0808]/10 border border-[#6D0808]/20 rounded-xl text-[#6D0808]">
                  <Package className="w-4 h-4" />
                  <span>SCORE: {score}</span>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#50574B]">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>BEST: {highScore}</span>
                </div>
              </div>
            </div>

            {/* Interactive Game Canvas Box */}
            <div
              onClick={handleAction}
              onTouchStart={(e) => {
                e.preventDefault();
                handleAction();
              }}
              className="relative w-full overflow-hidden rounded-2xl border border-[#D8D2BC] bg-[#F8F6EC] cursor-pointer select-none group focus:outline-none shadow-inner"
              tabIndex={0}
            >
              <canvas
                ref={canvasRef}
                width={760}
                height={190}
                className="w-full h-[190px] block"
              />

              {/* IDLE State Overlay */}
              {gameState === 'IDLE' && (
                <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#6D0808] text-[#EEEAD7] flex items-center justify-center shadow-xl mb-2.5 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 ml-0.5" />
                  </div>
                  <p className="text-sm font-black text-white drop-shadow-md">Click Canvas or Press SPACE to Start Run</p>
                  <p className="text-xs text-[#EEEAD7] mt-1 font-medium drop-shadow">Use SPACEBAR, UP ARROW, or Tap anywhere to jump</p>
                </div>
              )}

              {/* GAME OVER State Overlay */}
              {gameState === 'GAMEOVER' && (
                <div className="absolute inset-0 bg-black/45 backdrop-blur-[3px] flex flex-col items-center justify-center text-center p-4 animate-in fade-in duration-200">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#EEEAD7] mb-1">SCM Dispatch Route Blocked</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">DELIVERY RUN OVER</h3>
                  <p className="text-xs text-[#EEEAD7] mt-1 font-mono">
                    Final Score: <span className="font-bold text-amber-300">{score}</span> | Record: <span className="font-bold text-emerald-300">{highScore}</span>
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startGame();
                    }}
                    className="mt-3.5 flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#6D0808] hover:bg-[#2D0000] text-[#EEEAD7] font-bold text-xs shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restart Run (Space)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Controls Bar & Jump button */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#757D6F] pt-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-[#F8F6EC] border border-[#D8D2BC] rounded-md font-mono text-[11px] font-bold text-[#2D0000]">SPACE</span>
                <span>or</span>
                <span className="px-2 py-1 bg-[#F8F6EC] border border-[#D8D2BC] rounded-md font-mono text-[11px] font-bold text-[#2D0000]">▲ UP</span>
                <span>or Click Canvas to Jump</span>
              </div>

              <button
                onClick={handleAction}
                className="px-4 py-2 rounded-xl bg-[#6D0808] hover:bg-[#2D0000] text-[#EEEAD7] font-bold text-xs flex items-center justify-center space-x-2 shadow-sm active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{gameState === 'PLAYING' ? 'JUMP TRUCK' : 'START GAME'}</span>
              </button>

              <p className="font-medium hidden sm:block">SCM Logistics Highway Simulator &bull; 60 FPS Engine</p>
            </div>
          </div>
        )}
      </main>

      {/* Enterprise Footer */}
      <footer className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between py-4 border-t border-[#D8D2BC] text-xs text-[#757D6F] font-medium relative z-10 gap-2">
        <div>Ejada Company &bull; Supply Chain Management Operations</div>
        <div className="font-mono text-[11px]">VIPER SCM Error Diagnostics &bull; 404 Route</div>
      </footer>
    </div>
  );
};
