import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

interface Alphabet {
  id: number;
  char: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  language: 'urdu' | 'hindi' | 'english';
  isInitial?: boolean;
  finalY?: number;
}

interface CursorAlphabetsProps {
  className?: string;
  maxAlphabets?: number;
  spawnRadius?: number;
}

const CursorAlphabets = ({
  className = '',
  maxAlphabets = 15,
  spawnRadius = 150,
}: CursorAlphabetsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [alphabets, setAlphabets] = useState<Alphabet[]>([]);
  const [initialAlphabets, setInitialAlphabets] = useState<Alphabet[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const nextId = useRef(0);
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });
  const hasInitialized = useRef(false);

  // Cursor position with spring physics
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 150, damping: 15 });
  const springY = useSpring(cursorY, { stiffness: 150, damping: 15 });

  // Alphabets from different languages
  const urduAlphabets = ['ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش'];
  const hindiAlphabets = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ', 'क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ'];
  const englishAlphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];

  const getRandomAlphabet = (): { char: string; language: 'urdu' | 'hindi' | 'english' } => {
    const languageChoice = Math.random();
    if (languageChoice < 0.33) {
      return {
        char: urduAlphabets[Math.floor(Math.random() * urduAlphabets.length)],
        language: 'urdu'
      };
    } else if (languageChoice < 0.66) {
      return {
        char: hindiAlphabets[Math.floor(Math.random() * hindiAlphabets.length)],
        language: 'hindi'
      };
    } else {
      return {
        char: englishAlphabets[Math.floor(Math.random() * englishAlphabets.length)],
        language: 'english'
      };
    }
  };

  // Initial animation - continuously spawn letters from bottom
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Create 30 letters scattered across the screen
    const createFloatingLetter = () => {
      const { char, language } = getRandomAlphabet();
      return {
        id: nextId.current++,
        char,
        x: Math.random() * rect.width, // Random X position
        y: rect.height + Math.random() * 200, // Start below viewport
        size: Math.random() * 32 + 18,
        rotation: Math.random() * 40 - 20,
        opacity: Math.random() * 0.4 + 0.25,
        language,
        isInitial: true,
        finalY: -200 - Math.random() * 100, // End above viewport
      };
    };

    // Initialize with 30 letters at staggered starting positions
    const initialLetters: Alphabet[] = [];
    for (let i = 0; i < 30; i++) {
      const letter = createFloatingLetter();
      // Stagger initial Y positions for seamless loop
      letter.y = rect.height + (i * 100);
      initialLetters.push(letter);
    }

    setInitialAlphabets(initialLetters);

    // Continuously add new letters as old ones disappear
    const spawnInterval = setInterval(() => {
      setInitialAlphabets((prev) => {
        // Remove letters that have moved far above viewport
        const filtered = prev.filter(letter => letter.y > -300);
        
        // Add new letters if needed
        if (filtered.length < 30) {
          const newLetters = Array.from({ length: 30 - filtered.length }, createFloatingLetter);
          return [...filtered, ...newLetters];
        }
        
        return filtered;
      });
    }, 2000); // Check every 2 seconds

    return () => clearInterval(spawnInterval);
  }, []);

  const spawnAlphabet = (mouseX: number, mouseY: number, velocity: number) => {
    if (alphabets.length >= maxAlphabets) return;

    const { char, language } = getRandomAlphabet();
    const angle = Math.random() * Math.PI * 2;
    const baseDistance = 30 + velocity * 0.5;
    const distance = Math.min(baseDistance + Math.random() * spawnRadius * 0.5, spawnRadius);

    const newAlphabet: Alphabet = {
      id: nextId.current++,
      char,
      x: mouseX + Math.cos(angle) * distance,
      y: mouseY + Math.sin(angle) * distance,
      size: Math.random() * 18 + 14,
      rotation: Math.random() * 40 - 20,
      opacity: Math.min(0.3 + velocity * 0.002, 0.7),
      language
    };

    setAlphabets(prev => [...prev, newAlphabet]);

    // Remove after animation - longer duration for smoother feel
    setTimeout(() => {
      setAlphabets(prev => prev.filter(a => a.id !== newAlphabet.id));
    }, 4000);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastSpawnTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      cursorX.set(x);
      cursorY.set(y);

      const now = Date.now();
      const timeDelta = now - lastMousePos.current.time;
      
      // Calculate velocity
      const dx = x - lastMousePos.current.x;
      const dy = y - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = timeDelta > 0 ? distance / timeDelta * 16 : 0; // Normalize to ~60fps

      // Dynamic spawn interval based on velocity
      // Slow movement = more frequent spawns, fast movement = less frequent
      const spawnInterval = Math.max(80, 200 - velocity * 2);

      if (now - lastSpawnTime > spawnInterval && velocity > 0.5) {
        spawnAlphabet(x, y, velocity);
        lastSpawnTime = now;
      }

      lastMousePos.current = { x, y, time: now };
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [alphabets.length, maxAlphabets]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-auto ${className}`}
    >
      {/* Subtle cursor follower */}
      {isHovering && (
        <motion.div
          className="absolute w-6 h-6 rounded-full border border-[#292929]/10 pointer-events-none"
          style={{
            x: springX,
            y: springY,
            translateX: '-50%',
            translateY: '-50%',
          }}
        />
      )}

      {/* Initial alphabets - rise from bottom and float continuously */}
      <AnimatePresence>
        {initialAlphabets.map((alphabet, index) => (
          <motion.div
            key={`initial-${alphabet.id}`}
            initial={{
              x: alphabet.x,
              y: alphabet.y,
              scale: 0.8,
              rotate: alphabet.rotation,
              opacity: 0,
            }}
            animate={{
              y: alphabet.finalY,
              opacity: [0, alphabet.opacity, alphabet.opacity, 0], // Fade in, stay, fade out
              rotate: [alphabet.rotation, alphabet.rotation + 15, alphabet.rotation - 15, alphabet.rotation],
              scale: hoveredId === alphabet.id ? 1.5 : 1,
            }}
            transition={{
              duration: 10 + (index % 5) * 2, // 10-18 seconds per cycle
              delay: index * 0.3, // Stagger initial spawn
              ease: "linear",
              opacity: {
                times: [0, 0.1, 0.8, 1], // Fade in quickly, fade out slowly
                duration: 10 + (index % 5) * 2,
              },
              rotate: {
                duration: 8 + (index % 4),
                repeat: Infinity,
                ease: "easeInOut",
              },
              scale: { duration: 0.2 },
            }}
            onAnimationComplete={() => {
              // Reset to bottom when reaching top
              setInitialAlphabets((prev) =>
                prev.map((letter) =>
                  letter.id === alphabet.id
                    ? {
                        ...letter,
                        y: containerRef.current 
                          ? containerRef.current.getBoundingClientRect().height + Math.random() * 200
                          : letter.y,
                      }
                    : letter
                )
              );
            }}
            onMouseEnter={() => setHoveredId(alphabet.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="absolute pointer-events-auto select-none cursor-pointer"
            style={{
              fontSize: alphabet.size,
              color: '#292929',
              fontFamily: alphabet.language === 'english' 
                ? '"Bebas Neue", "Impact", sans-serif' 
                : 'system-ui, sans-serif',
              textShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            {alphabet.char}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating alphabets from cursor */}
      <AnimatePresence>
        {alphabets.map((alphabet) => (
          <motion.div
            key={alphabet.id}
            initial={{
              x: alphabet.x,
              y: alphabet.y,
              scale: 0,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              scale: hoveredId === alphabet.id ? 1.4 : 1,
              rotate: alphabet.rotation,
              opacity: alphabet.opacity,
              y: alphabet.y - 80,
            }}
            exit={{
              scale: 0,
              opacity: 0,
              y: alphabet.y - 150,
            }}
            transition={{
              duration: 3.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              scale: { duration: 0.2 },
            }}
            onMouseEnter={() => setHoveredId(alphabet.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="absolute pointer-events-auto select-none cursor-pointer"
            style={{
              fontSize: alphabet.size,
              color: '#292929',
              fontFamily: alphabet.language === 'english' 
                ? '"Bebas Neue", "Impact", sans-serif' 
                : 'system-ui, sans-serif',
              textShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            {alphabet.char}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CursorAlphabets;
