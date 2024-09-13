'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Image from 'next/image';

const RandomNamePicker = () => {
  const [title, setTitle] = useState('');
  const [entrants, setEntrants] = useState('');
  const [winner, setWinner] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStage, setSelectionStage] = useState(0);
  const [shuffledNames, setShuffledNames] = useState([]);

  const handleStart = () => {
    const names = entrants.split('\n').filter(name => name.trim() !== '');
    if (names.length > 0) {
      setIsSelecting(true);
      setWinner('');
      setSelectionStage(0);
      setShuffledNames(names);
      
      playSound('start');

      const stageDelay = 3000; // 3 seconds per stage
      const stages = 6; // 6 stages total

      for (let i = 1; i <= stages; i++) {
        setTimeout(() => {
          setSelectionStage(i);
          playSound('stage');
          if (i === 1 || i === 3 || i === 5) shuffleNamesAnimation(names);
        }, i * stageDelay);
      }

      // Reveal the winner after all stages
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * names.length);
        const selectedWinner = names[randomIndex];
        setWinner(selectedWinner);
        setIsSelecting(false);
        setSelectionStage(stages + 1);
        playSound('winner');
        triggerConfetti();
      }, (stages + 1) * stageDelay);
    }
  };

  const stageMessages = [
    "Initializing selection process...",
    "Shuffling names...",
    "Analyzing candidates...",
    "Reshuffling for fairness...",
    "Narrowing down options...",
    "Final shuffle...",
    "Drum roll, please!",
  ];

  const playSound = (type) => {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.play().catch(e => console.error("Error playing sound:", e));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2D61A7', '#F78F25']
    });
  };

  const shuffleNamesAnimation = (names) => {
    let shuffling = [...names];
    let shuffleCount = 0;
    const shuffleInterval = setInterval(() => {
      shuffling.sort(() => Math.random() - 0.5);
      setShuffledNames([...shuffling]);
      shuffleCount++;
      if (shuffleCount >= 15) clearInterval(shuffleInterval);
    }, 200);
  };

  useEffect(() => {
    if (!isSelecting) {
      const timer = setTimeout(() => setSelectionStage(0), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSelecting]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Logo */}
        <div className="bg-[#2D61A7] p-6 flex justify-center items-center">
          <div className="w-32 h-32 bg-white flex items-center justify-center rounded-full shadow-md overflow-hidden">
          <Image
  src="/logo.png"
  alt="Company Logo"
  width={120}
  height={120}
  style={{ objectFit: "contain" }}
/>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-center text-[#2D61A7] mb-2">7th Anniversary Sale</h2>
            <p className="text-center text-gray-600">Winner Selection</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#2D61A7] mb-1">Diamond Ring Winner Selection</label>
              <input
                id="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D61A7] transition duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
              />
            </div>
            <div>
              <label htmlFor="entrants" className="block text-sm font-medium text-[#2D61A7] mb-1">Participants</label>
              <textarea
                id="entrants"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D61A7] transition duration-200"
                value={entrants}
                onChange={(e) => setEntrants(e.target.value)}
                placeholder="Enter names, one per line"
                rows={6}
              />
            </div>
            <button
              onClick={handleStart}
              className="w-full bg-[#F78F25] text-white py-3 px-4 rounded-md hover:bg-[#e67d14] focus:outline-none focus:ring-2 focus:ring-[#F78F25] focus:ring-opacity-50 transition duration-200 text-lg font-semibold shadow-md"
              disabled={isSelecting}
            >
              {isSelecting ? 'Selecting...' : 'Start Selection'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isSelecting && selectionStage < stageMessages.length && (
              <motion.div
                key={selectionStage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-[#e6f0ff] rounded-md text-center border-2 border-[#2D61A7] shadow-inner"
              >
                <p className="font-semibold text-[#2D61A7]">{stageMessages[selectionStage]}</p>
                {(selectionStage === 1 || selectionStage === 3 || selectionStage === 5) && (
                  <div className="mt-2 h-20 overflow-hidden">
                    <motion.div
                      animate={{ y: [-20, 0] }}
                      transition={{ duration: 0.2, repeat: Infinity }}
                    >
                      {shuffledNames.map((name, index) => (
                        <div key={index} className="py-1 text-[#F78F25]">{name}</div>
                      ))}
                    </motion.div>
                  </div>
                )}
                <motion.div
                  className="w-full h-2 bg-[#b3d1ff] mt-2 rounded-full overflow-hidden"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 3, ease: "linear" }}
                >
                  <div className="h-full bg-[#2D61A7] rounded-full"></div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="p-6 bg-gradient-to-r from-[#2D61A7] to-[#F78F25] rounded-md relative overflow-hidden shadow-lg"
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {[...Array(50)].map((_, i) => (
                    <span
                      key={i}
                      className="absolute inline-block animate-sparkle"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        fontSize: `${Math.random() * 10 + 5}px`,
                        animationDelay: `${Math.random() * 2}s`,
                        color: Math.random() > 0.5 ? '#2D61A7' : '#F78F25',
                      }}
                    >
                      ✨
                    </span>
                  ))}
                </motion.div>
                <motion.p
                  className="text-center font-bold text-white text-2xl relative z-10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Winner: {winner}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RandomNamePicker;