import { useState, useEffect, useRef } from 'react';
import './index.css';

// Initial Wishes
const INITIAL_WISHES = [
  { id: 1, name: "An Nhien", message: "Sinh nhật vui vẻ nhất!" },
  { id: 2, name: "Minh Khue", message: "Yêu cậu nhiều!" },
  { id: 3, name: "Tuan Anh", message: "Những lời chúc tốt đẹp nhất!" }
];

/* --- Typing Effect Hook --- */
const useTypewriter = (text, speed = 50, start = false) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!start) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, start]);

  return displayedText;
};

/* --- Enhanced Confetti --- */
const Confetti = ({ active }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff4d8d', '#fbbf24', '#60a5fa', '#34d399', '#a78bfa', '#f472b6'];

    for (let i = 0; i < 300; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height, // Start above
        w: Math.random() * 10 + 5,
        h: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        xv: (Math.random() - 0.5) * 6,
        yv: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.5 ? 'circle' : 'rect'
      });
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach((p, i) => {
        p.rotation += p.rotationSpeed;
        p.x += p.xv;
        p.y += p.yv;

        // Reset if out of view
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Auto-stop confetti after 8 seconds but fade out gently? 
    // For now, controlled by parent 'active' state.

    return () => cancelAnimationFrame(animationId);
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [view, setView] = useState('landing');
  const [showWishModal, setShowWishModal] = useState(false);
  const [wishes, setWishes] = useState(INITIAL_WISHES);
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  // Music State
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');

    // Attempt autoplay music
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume to 50%
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsMusicPlaying(true);
        }).catch(error => {
          console.log("Autoplay prevented by browser:", error);
          setIsMusicPlaying(false);
        });
      }
    }
  }, []);

  const toggleMusic = () => {
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play();
      setIsMusicPlaying(true);
    }
  };

  /* --- Magic Effects --- */
  const handleOpenGift = () => {
    setIsGiftOpened(true);
    setShowConfetti(true);
    // Keep confetti running for a while
    setTimeout(() => setShowConfetti(false), 8000);
  };

  /* --- Gift Page --- */
  const GiftPage = () => {
    const message = "Duyên sinh nhật vui vẻ mọi điều tốt đẹp phía trước mạnh mẽ cùng nhau nha suuuuu suuuuuuu 🔥";
    const typedMessage = useTypewriter(message, 30, isGiftOpened);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative p-4 bg-background-light dark:bg-background-dark overflow-hidden text-slate-800 dark:text-white transition-colors duration-500">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary rounded-full mix-blend-screen filter blur-[100px] animate-float"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary rounded-full mix-blend-screen filter blur-[100px] animate-float-delayed"></div>
        </div>

        <Confetti active={showConfetti} />

        {!isGiftOpened ? (
          <div className="relative z-10 text-center cursor-pointer group perspective-1000" onClick={handleOpenGift}>
            <div className="relative transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              {/* Glowing Aura */}
              <div className="absolute inset-0 bg-yellow-400/30 blur-[60px] rounded-full animate-pulse-fast"></div>

              <div className="animate-bounce duration-[2000ms]">
                <span className="text-[120px] md:text-[180px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] filter contrast-125 block">
                  🎁
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <h2 className="text-3xl md:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 drop-shadow-sm animate-pulse">

              </h2>
              <p className="text-slate-300 font-handwriting text-xl md:text-2xl tracking-wider"></p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 w-full max-w-2xl px-4 animate-in zoom-in-50 duration-[1000ms]">
            <div className="glass-panel p-6 md:p-12 rounded-[2rem] border-2 border-white/20 shadow-[0_0_80px_rgba(255,77,141,0.4)] relative overflow-hidden bg-black/40">

              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"></div>

              {/* Top Decoration */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-500/30 rounded-full blur-[50px]"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/30 rounded-full blur-[50px]"></div>

              <div className="text-center relative">
                {/* Cake Animation */}
                <div className="mb-6 relative inline-block">
                  <div className="absolute inset-0 bg-yellow-500/20 blur-[40px] rounded-full animate-pulse"></div>
                  <span className="text-7xl md:text-9xl relative z-10 select-none animate-float">🎂</span>
                  <div className="absolute -top-4 right-0 text-3xl md:text-4xl animate-bounce delay-700">🎈</div>
                  <div className="absolute bottom-0 -left-4 text-3xl md:text-4xl animate-bounce delay-1000">✨</div>
                </div>

                <h3 className="text-4xl md:text-5xl font-display text-white mb-6 text-glow">
                  Chúc Mừng Sinh Nhật!
                </h3>

                {/* Typewriter Message */}
                <div className="min-h-[120px] bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm mb-8">
                  <p className="text-xl md:text-2xl text-slate-100 font-handwriting leading-relaxed">
                    {typedMessage}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsGiftOpened(false);
                    setView('landing');
                  }}
                  className="px-10 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 active:scale-95 transition-all text-lg group"
                >
                  <span className="mr-2 group-hover:animate-spin">🔥</span>

                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* --- Enhanced Wish Modal with Universe Effect --- */
  const WishModal = () => {
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isLaunched, setIsLaunched] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!msg) return;

      setIsSending(true);
      setShowSuccess(false); // Reset success state
      setTimeout(() => {
        setIsSending(false);
        setIsLaunched(true);

        // Show success message after rocket has launched (6s delay)
        setTimeout(() => setShowSuccess(true), 6000);

        setTimeout(() => {
          setWishes([...wishes, { id: Date.now(), name, message: msg }]);
          setShowWishModal(false);
          setIsLaunched(false); // Reset launch state
          setShowSuccess(false);
        }, 12000);
      }, 2000);
    };

    if (isLaunched) {
      return (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-background-dark overflow-hidden animate-in fade-in duration-700">
          {/* Dynamic Starfield with Warp Speed Effect */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-60 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900/40 to-black/90 opacity-90"></div>

          {/* Warp Speed Stars - generated dynamically for performance */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-70 animate-warp"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 40 + 10}px`,
                animationDuration: `${Math.random() * 1 + 0.5}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}

          {/* Shooting Stars */}
          <div className="absolute top-10 left-20 w-1 h-32 bg-gradient-to-t from-transparent to-white opacity-40 rotate-45 animate-twinkle"></div>
          <div className="absolute top-40 right-40 w-1 h-40 bg-gradient-to-t from-transparent to-white opacity-40 -rotate-45 animate-twinkle delay-500"></div>

          <div className="relative z-10 h-full w-full flex flex-col items-center justify-end pb-32">
            <div className="animate-launch relative">
              {/* The Rocket */}
              <div className="text-8xl md:text-9xl filter drop-shadow-[0_0_20px_rgba(255,100,100,0.5)] -rotate-45 relative z-10 p-4">
                🚀
              </div>

              {/* Rocket Exhaust - Fire */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 w-12 h-32 bg-gradient-to-t from-transparent via-yellow-500 to-red-600 blur-md rounded-b-full animate-pulse"></div>

              {/* Rocket Exhaust - Smoke Trail */}
              <div className="absolute top-28 left-1/2 -translate-x-1/2 w-20 h-screen bg-gradient-to-t from-transparent via-white/20 to-gray-400/10 blur-xl"></div>

              {/* Shockwaves */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-white/20 rounded-full animate-ping opacity-40 duration-1000"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/40 rounded-full animate-ping delay-200 opacity-60"></div>
            </div>
          </div>

          {showSuccess && (
            <div className="absolute bottom-20 text-center w-full z-10">
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 space-y-4">
                <h2 className="text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-t from-yellow-200 via-pink-200 to-white font-handwriting drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] leading-tight pb-2">
                  Vũ trụ đã lắng nghe
                </h2>
                <p className="text-white/80 font-body text-lg tracking-widest uppercase opacity-80 animate-pulse"></p>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto w-full h-full">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={() => setShowWishModal(false)}></div>

        <div className="relative w-full max-w-lg glass-panel bg-white/80 dark:bg-slate-900/80 rounded-[2rem] shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-300 rotate-1 border-t-8 border-primary">
          <button onClick={() => setShowWishModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors z-20">
            <span className="material-icons">close</span>
          </button>

          <div className="p-6 md:p-10 relative">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-3xl md:text-4xl font-display text-slate-800 dark:text-white mb-2">Gửi điều ước</h3>
              <p className="text-slate-500 dark:text-slate-400 font-handwriting text-lg md:text-xl">Hãy gửi ước mơ của Duyên vào dải ngân hà...</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="group">

              </div>

              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">

                </label>
                <textarea
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  className="w-full p-5 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all h-36 resize-none font-handwriting text-2xl leading-relaxed placeholder:text-slate-400"
                  placeholder="Điều ước của Duyên là ..."
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg uppercase tracking-wide"
              >
                {isSending ? (
                  <span className="animate-pulse">Đang chuẩn bị phóng...</span>
                ) : (
                  <>
                    <span>🚀</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-body text-slate-800 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden min-h-screen">

      {/* Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none sparkle-bg z-0">
        {/* Using CSS generated particles in index.css for better performance, preserving key HTML elements if needed */}
        <div className="absolute top-20 left-[10%] opacity-20 animate-float"><span className="material-icons text-5xl text-primary">favorite</span></div>
        <div className="absolute bottom-40 right-[15%] opacity-20 animate-float-delayed"><span className="material-icons text-6xl text-secondary">star</span></div>
      </div>

      <main className="relative z-10 min-h-screen">
        {/* Dark Mode Toggle */}
        <button
          className="fixed top-6 right-6 p-3 rounded-full glass-panel text-primary hover:scale-110 transition-transform z-50 shadow-lg"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <span className="material-icons text-2xl">light_mode</span>
          ) : (
            <span className="material-icons text-2xl">dark_mode</span>
          )}
        </button>

        {/* Music Toggle */}
        <button
          className="fixed top-6 right-20 p-3 rounded-full glass-panel text-primary hover:scale-110 transition-transform z-50 shadow-lg"
          onClick={toggleMusic}
        >
          {isMusicPlaying ? (
            <span className="material-icons text-2xl animate-spin-slow">music_note</span>
          ) : (
            <span className="material-icons text-2xl">music_off</span>
          )}
        </button>

        <audio ref={audioRef} loop>
          <source src="/videoplayback.mp3" type="audio/mp3" />
        </audio>
        {view === 'landing' ? (
          <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <section className="text-center space-y-8 md:space-y-10 max-w-5xl mx-auto pt-8 px-4 w-full">
              <div className="space-y-4 md:space-y-6">
                <span className="material-icons text-primary text-5xl md:text-7xl animate-bounce drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]">crown</span>

                <div className="relative">
                  <h2 className="text-3xl md:text-7xl font-display text-primary drop-shadow-lg mb-2"></h2>
                  <h1 className="text-7xl md:text-[10rem] leading-tight font-display text-white relative z-10 
                                 drop-shadow-[0_10px_20px_rgba(255,77,141,0.5)] 
                                 [text-shadow:_3px_3px_0_#ff4d8d,_-3px_-3px_0_#ff4d8d]
                                 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-white dark:to-pink-200
                                 animate-pulse-fast">
                    Duyên
                  </h1>
                </div>
              </div>

              <div className="space-y-8">
                <div className="relative inline-block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25"></div>
                  <p className="relative text-lg md:text-3xl font-medium text-slate-700 dark:text-slate-200 italic tracking-wide px-4">
                    Công chúa dễ thương nhất quả đất <span className="material-icons text-primary align-middle text-2xl md:text-3xl animate-pulse">favorite</span>
                  </p>
                </div>

                <div className="flex justify-center gap-8 text-primary/60">
                  <span className="material-icons text-2xl animate-spin-slow">star</span>
                  <span className="material-icons text-3xl animate-bounce">favorite</span>
                  <span className="material-icons text-2xl animate-spin-slow">star</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 pt-8 md:pt-12 pb-8 w-full max-w-md sm:max-w-none mx-auto">
                <button
                  onClick={() => setView('gift')}
                  className="w-full sm:w-auto px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-primary to-pink-600 text-white rounded-full font-bold shadow-[0_10px_40px_-10px_rgba(255,77,141,0.5)] hover:shadow-[0_20px_60px_-10px_rgba(255,77,141,0.7)] hover:-translate-y-2 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-4 group text-xl md:text-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12"></div>
                  <span className="material-icons group-hover:rotate-12 transition-transform text-3xl md:text-4xl">redeem</span>
                  <span className="relative">Mở quà</span>
                </button>

                <button
                  onClick={() => setShowWishModal(true)}
                  className="w-full sm:w-auto px-8 py-4 md:px-12 md:py-6 glass-panel text-primary rounded-full font-bold hover:bg-white/90 dark:hover:bg-primary/20 hover:-translate-y-2 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-4 group border border-white/60 shadow-xl text-xl md:text-2xl"
                >
                  <span className="material-icons group-hover:scale-110 transition-transform text-3xl md:text-4xl">auto_awesome</span>
                  Gửi điều ước
                </button>
              </div>
            </section>
          </div>
        ) : (
          <GiftPage />
        )}
      </main>

      {showWishModal && <WishModal />}
    </div>
  );
}

export default App;
