import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-neutral-900 dark:via-black dark:to-blue-950 flex flex-col items-center justify-center z-50">
      {/* Book Animation */}
      <div className="relative w-64 h-80" style={{ perspective: '1200px' }}>
        {/* Book Cover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-amber-800 to-amber-900 rounded-r-2xl shadow-2xl"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
          }}
          animate={{
            rotateY: [0, -180, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Front Cover */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-700 to-amber-900 rounded-r-2xl flex flex-col items-center justify-center p-8 backface-hidden">
            <BookOpen className="w-16 h-16 text-amber-100 mb-4" />
            <div className="text-amber-100 text-xl font-serif text-center">
              Land Records
            </div>
            <div className="text-amber-200 text-sm mt-2">Digital Archive</div>
          </div>
          
          {/* Back Cover (visible when rotated) */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-amber-800 to-amber-950 rounded-r-2xl flex items-center justify-center"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="text-amber-100 space-y-2 px-8">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.3,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                  }}
                  className="h-1.5 bg-amber-200/30 rounded"
                  style={{ 
                    width: `${60 + Math.random() * 40}%`,
                    transformOrigin: 'left',
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Book Spine Shadow */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-amber-950 rounded-l-sm -z-10"></div>
      </div>

      {/* Loading Text */}
      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-serif text-amber-900 dark:text-amber-100 tracking-wide mb-2">
          Loading AgriStack
        </h2>
        <motion.div 
          className="flex items-center justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-4">
          Digitizing your records...
        </p>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
