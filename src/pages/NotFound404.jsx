import React, { useState, useEffect, useRef } from 'react';
import { Truck, RotateCcw, Home, Trophy, Play, Layers, AlertTriangle, Package, ArrowLeft } from 'lucide-react';

export const NotFound404 = ({ onGoHome }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('IDLE'); // IDLE, PLAYING, GAMEOVER
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('viper_runner_highscore') || '0', 10);
  });

  // Game internal state ref
  const gameRef = useRef({
    truck: { x: 50, y: 147, width: 48, height: 28, vy: 0, isGrounded: true },
    obstacles: [],
    clouds: [
      { x: 150, y: 35, width: 45, speed: 0.8 },
      { x: 420, y: 25, width: 60, speed: 0.6 },
      { x: 680, y: 40, width: 50, speed: 0.7 }
    ],
    roadOffset: 0,
    speed: 5.5,
    score: 0,
    frame: 0,
    animationId: null,
    gravity: 0.65,
    jumpForce: -11.5,
    groundY: 175
  });

  // Initial render of scene on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      drawScene(ctx, canvas, false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameRef.current.animationId) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, [gameState]);

  const handleAction = () => {
    if (gameState === 'IDLE' || gameState === 'GAMEOVER') {
      startGame();
    } else if (gameState === 'PLAYING') {
      jump();
    }
  };

  const jump = () => {
    const g = gameRef.current;
    if (g.truck.isGrounded) {
      g.truck.vy = g.jumpForce;
      g.truck.isGrounded = false;
    }
  };

  const startGame = () => {
    const g = gameRef.current;
    g.truck = { x: 50, y: 147, width: 48, height: 28, vy: 0, isGrounded: true };
    g.obstacles = [];
    g.clouds = [
      { x: 150, y: 35, width: 45, speed: 0.8 },
      { x: 420, y: 25, width: 60, speed: 0.6 },
      { x: 680, y: 40, width: 50, speed: 0.7 }
    ];
    g.roadOffset = 0;
    g.speed = 5.5;
    g.score = 0;
    g.frame = 0;

    setScore(0);
    setGameState('PLAYING');

    if (g.animationId) cancelAnimationFrame(g.animationId);
    runGameLoop();
  };

  const runGameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const g = gameRef.current;

    const loop = () => {
      g.frame++;

      // 1. Update Physics
      g.truck.vy += g.gravity;
      g.truck.y += g.truck.vy;

      if (g.truck.y >= g.groundY - g.truck.height) {
        g.truck.y = g.groundY - g.truck.height;
        g.truck.vy = 0;
        g.truck.isGrounded = true;
      }

      // Update Score & Speed
      if (g.frame % 5 === 0) {
        g.score++;
        setScore(g.score);
        if (g.score % 100 === 0 && g.speed < 11) {
          g.speed += 0.4;
        }
      }

      // Update Road Offset
      g.roadOffset = (g.roadOffset + g.speed) % 40;

      // Update Clouds
      g.clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x < -70) {
          cloud.x = canvas.width + Math.random() * 80;
          cloud.y = 20 + Math.random() * 30;
        }
      });

      // Spawn Obstacles (Cargo Boxes / Server Towers)
      if (g.frame % Math.max(50, Math.floor(100 - g.speed * 4)) === 0) {
        const type = Math.random() > 0.4 ? 'box' : 'server';
        g.obstacles.push({
          x: canvas.width + 20,
          y: type === 'box' ? g.groundY - 26 : g.groundY - 38,
          width: type === 'box' ? 24 : 20,
          height: type === 'box' ? 26 : 38,
          type
        });
      }

      // Move & Filter Obstacles
      for (let i = g.obstacles.length - 1; i >= 0; i--) {
        const obs = g.obstacles[i];
        obs.x -= g.speed;

        // Collision Check (AABB with 4px padding tolerance)
        const pad = 4;
        if (
          g.truck.x + pad < obs.x + obs.width - pad &&
          g.truck.x + g.truck.width - pad > obs.x + pad &&
          g.truck.y + pad < obs.y + obs.height &&
          g.truck.y + g.truck.height > obs.y + pad
        ) {
          // Collision Detected!
          setGameState('GAMEOVER');
          if (g.score > highScore) {
            setHighScore(g.score);
            localStorage.setItem('viper_runner_highscore', String(g.score));
          }
          drawScene(ctx, canvas, true);
          return;
        }

        if (obs.x < -40) {
          g.obstacles.splice(i, 1);
        }
      }

      // 2. Render Scene
      drawScene(ctx, canvas, false);

      g.animationId = requestAnimationFrame(loop);
    };

    g.animationId = requestAnimationFrame(loop);
  };

  const drawScene = (ctx, canvas, isGameOver = false) => {
    const g = gameRef.current;
    const w = canvas.width;
    const h = canvas.height;

    // Clear Canvas with Desert Cream Horizon
    ctx.fillStyle = '#F8F6EC';
    ctx.fillRect(0, 0, w, h);

    // Draw Clouds
    ctx.fillStyle = '#D8D2BC';
    g.clouds.forEach(cloud => {
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, 14, 0, Math.PI * 2);
      ctx.arc(cloud.x + 12, cloud.y - 6, 16, 0, Math.PI * 2);
      ctx.arc(cloud.x + 26, cloud.y, 13, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Ground Line
    ctx.strokeStyle = '#D8D2BC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, g.groundY);
    ctx.lineTo(w, g.groundY);
    ctx.stroke();

    // Road dashed stripes
    ctx.fillStyle = '#757D6F';
    for (let x = -g.roadOffset; x < w; x += 30) {
      ctx.fillRect(x, g.groundY + 12, 16, 3);
    }

    // Draw SCM Delivery Truck (Player)
    const t = g.truck;
    ctx.save();
    // Truck Body (Burgundy #6D0808)
    ctx.fillStyle = '#6D0808';
    ctx.beginPath();
    ctx.roundRect(t.x, t.y, t.width - 12, t.height - 6, 4);
    ctx.fill();

    // Truck Cabin (#2D0000)
    ctx.fillStyle = '#2D0000';
    ctx.beginPath();
    ctx.roundRect(t.x + t.width - 14, t.y + 6, 14, t.height - 12, 3);
    ctx.fill();

    // Cabin Windshield
    ctx.fillStyle = '#EEEAD7';
    ctx.fillRect(t.x + t.width - 8, t.y + 8, 6, 8);

    // VIPER SCM Side Logo on Truck
    ctx.fillStyle = '#EEEAD7';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('VIPER', t.x + 4, t.y + 14);

    // Wheels
    ctx.fillStyle = '#2D0000';
    ctx.beginPath();
    ctx.arc(t.x + 8, t.y + t.height - 3, 5, 0, Math.PI * 2);
    ctx.arc(t.x + t.width - 8, t.y + t.height - 3, 5, 0, Math.PI * 2);
    ctx.fill();

    // Wheel hubs
    ctx.fillStyle = '#EEEAD7';
    ctx.beginPath();
    ctx.arc(t.x + 8, t.y + t.height - 3, 2, 0, Math.PI * 2);
    ctx.arc(t.x + t.width - 8, t.y + t.height - 3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw Obstacles (Cargo Crate or Server Tower)
    g.obstacles.forEach(obs => {
      ctx.save();
      if (obs.type === 'box') {
        // Wooden/Cardboard Cargo Crate
        ctx.fillStyle = '#D8D2BC';
        ctx.strokeStyle = '#757D6F';
        ctx.lineWidth = 1.5;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

        // Cross Tape
        ctx.strokeStyle = '#6D0808';
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y);
        ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
        ctx.moveTo(obs.x + obs.width, obs.y);
        ctx.lineTo(obs.x, obs.y + obs.height);
        ctx.stroke();
      } else {
        // High-Tech Server Rack Tower
        ctx.fillStyle = '#2D0000';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Server LEDs
        ctx.fillStyle = '#6D0808';
        ctx.fillRect(obs.x + 3, obs.y + 5, 4, 3);
        ctx.fillStyle = '#10B981';
        ctx.fillRect(obs.x + 10, obs.y + 5, 4, 3);

        ctx.fillStyle = '#757D6F';
        ctx.fillRect(obs.x + 3, obs.y + 14, 14, 2);
        ctx.fillRect(obs.x + 3, obs.y + 22, 14, 2);
        ctx.fillRect(obs.x + 3, obs.y + 30, 14, 2);
      }
      ctx.restore();
    });

    // Score Overlay
    ctx.fillStyle = '#2D0000';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`SCORE: ${String(g.score).padStart(5, '0')}`, w - 20, 25);
    ctx.fillStyle = '#757D6F';
    ctx.fillText(`HI: ${String(Math.max(highScore, g.score)).padStart(5, '0')}`, w - 20, 42);
  };

  return (
    <div className="min-h-screen bg-[#EEEAD7] text-[#2D0000] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2 border-b border-[#D8D2BC]">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6D0808] to-[#8A1212] flex items-center justify-center shadow-md shadow-[#6D0808]/20">
            <Layers className="w-5 h-5 text-[#EEEAD7]" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-[#2D0000]">
              VIPER <span className="text-[#6D0808]">SCM</span>
            </span>
          </div>
        </div>

        <button
          onClick={onGoHome}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-[#F8F6EC] text-[#2D0000] font-bold text-xs border border-[#D8D2BC] transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#6D0808]" />
          <span>Return to Dashboard</span>
        </button>
      </header>

      {/* Main 404 & Game Content */}
      <main className="max-w-4xl w-full mx-auto my-auto py-6 space-y-6">
        {/* 404 Hero Banner */}
        <div className="bg-white border border-[#D8D2BC] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#6D0808]/10 border border-[#6D0808]/20 rounded-full text-xs font-extrabold text-[#6D0808]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ERROR 404 &bull; SUPPLY ROUTE DISCONNECTED</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#2D0000]">
              Manifest Not Found
            </h1>
            <p className="text-xs text-[#50574B] max-w-lg leading-relaxed">
              The consignment tracking ID, destination route, or internal URL you requested does not exist on the Ejada VIPER network.
            </p>
          </div>

          <button
            onClick={onGoHome}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-[#6D0808] hover:bg-[#2D0000] text-[#EEEAD7] font-bold text-xs transition-all shadow-md shadow-[#6D0808]/20 cursor-pointer shrink-0"
          >
            <Home className="w-4 h-4" />
            <span>Return to SCM Dashboard</span>
          </button>
        </div>

        {/* VIPER SCM Runner Game Canvas Container */}
        <div className="bg-white border border-[#D8D2BC] rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D8D2BC] pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-[#6D0808] text-[#EEEAD7] flex items-center justify-center font-bold">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-[#2D0000]">VIPER Express Highway Runner</h2>
                <p className="text-[11px] text-[#757D6F]">Jump over cargo crates and server racks on the Riyadh dispatch route!</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs font-mono font-bold">
              <div className="flex items-center space-x-1.5 text-[#6D0808]">
                <Package className="w-4 h-4" />
                <span>Score: {score}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[#50574B]">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Best: {highScore}</span>
              </div>
            </div>
          </div>

          {/* Canvas Game Area */}
          <div
            onClick={handleAction}
            className="relative w-full overflow-hidden rounded-2xl border border-[#D8D2BC] bg-[#F8F6EC] cursor-pointer select-none group"
          >
            <canvas
              ref={canvasRef}
              width={760}
              height={200}
              className="w-full h-[200px] block"
            />

            {/* Idle Start Overlay */}
            {gameState === 'IDLE' && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-[#6D0808] text-[#EEEAD7] flex items-center justify-center shadow-lg mb-2 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 ml-0.5" />
                </div>
                <p className="text-sm font-black text-[#2D0000]">Click or Press SPACE to Start Delivery Run</p>
                <p className="text-xs text-[#50574B] mt-0.5 font-medium">Use SPACEBAR or UP ARROW to jump</p>
              </div>
            )}

            {/* Game Over Overlay */}
            {gameState === 'GAMEOVER' && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px] flex flex-col items-center justify-center text-center p-4 animate-in fade-in duration-150">
                <p className="text-xs font-bold uppercase tracking-widest text-[#EEEAD7] mb-1">Fulfillment Route Blocked</p>
                <h3 className="text-2xl font-black text-white">GAME OVER</h3>
                <p className="text-xs text-[#EEEAD7] mt-1 font-mono">
                  Final Score: <span className="font-bold text-amber-300">{score}</span> | High Score: <span className="font-bold text-emerald-300">{highScore}</span>
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startGame();
                  }}
                  className="mt-3 flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#6D0808] hover:bg-[#2D0000] text-[#EEEAD7] font-bold text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Play Again (Space)</span>
                </button>
              </div>
            )}
          </div>

          {/* Controls Guide */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#757D6F] pt-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-[#F8F6EC] border border-[#D8D2BC] rounded-md font-mono text-[11px] font-bold text-[#2D0000]">SPACE</span>
              <span>or</span>
              <span className="px-2 py-1 bg-[#F8F6EC] border border-[#D8D2BC] rounded-md font-mono text-[11px] font-bold text-[#2D0000]">▲ UP</span>
              <span>or Click canvas to Jump</span>
            </div>
            <p className="font-medium">SCM Logistics Highway Simulator &bull; 60 FPS Engine</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-[#757D6F] font-medium py-3 border-t border-[#D8D2BC]">
        Ejada Company &bull; Supply Chain Management Operations
      </footer>
    </div>
  );
};
