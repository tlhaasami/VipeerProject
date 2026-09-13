import React, { useState, useEffect, useRef } from 'react';
import { Layers, ArrowLeft, Home } from 'lucide-react';

export const NotFound404 = ({ onGoHome }) => {
  // Eye tracking refs and states
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const [leftPupilPos, setLeftPupilPos] = useState({ x: 0, y: 0 });
  const [rightPupilPos, setRightPupilPos] = useState({ x: 0, y: 0 });
  const [eyebrowTilt, setEyebrowTilt] = useState({ left: 0, right: 0, yOffset: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Periodic natural eye blinking
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

  // Eye cursor & touch tracking
  useEffect(() => {
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (clientX === undefined || clientY === undefined) return;

      const calcPupilOffset = (eyeEl) => {
        if (!eyeEl) return { x: 0, y: 0 };
        const rect = eyeEl.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const dx = clientX - eyeCenterX;
        const dy = clientY - eyeCenterY;
        const angle = Math.atan2(dy, dx);
        const maxDist = rect.width * 0.26; // Maximum pupil movement radius
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

      // Eyebrow dynamics based on cursor coordinates
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

        {/* Action Button */}
        <div className="flex items-center justify-center pt-2">
          <button
            onClick={onGoHome}
            className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-[#6D0808] hover:bg-[#2D0000] text-[#EEEAD7] font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#6D0808]/25 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to SCM Dashboard</span>
          </button>
        </div>
      </main>

      {/* Enterprise Footer */}
      <footer className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between py-4 border-t border-[#D8D2BC] text-xs text-[#757D6F] font-medium relative z-10 gap-2">
        <div>Ejada Company &bull; Supply Chain Management Operations</div>
        <div className="font-mono text-[11px]">VIPER SCM Error Diagnostics &bull; 404 Route</div>
      </footer>
    </div>
  );
};
