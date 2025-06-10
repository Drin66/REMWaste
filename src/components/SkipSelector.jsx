import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { skipSizes } from '../data/skipSizes';

const SkipSelector = ({ onSkipSelect }) => {
  const [selectedSkips, setSelectedSkips] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [explodedCards, setExplodedCards] = useState(new Set());
  const [loadedImages, setLoadedImages] = useState(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      const newExplodedCards = new Set();
      skipSizes.forEach((skip, index) => {
        setTimeout(() => {
          newExplodedCards.add(skip.size);
          setExplodedCards(new Set(newExplodedCards));
        }, index * 100);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = (size) => {
    setLoadedImages(prev => new Set(prev).add(size));
  };

  const toggleSkip = (size) => {
    const newSelectedSkips = new Set(selectedSkips);
    if (selectedSkips.has(size)) {
      newSelectedSkips.delete(size);
    } else {
      newSelectedSkips.add(size);
    }
    setSelectedSkips(newSelectedSkips);
    if (onSkipSelect) {
      onSkipSelect(newSelectedSkips);
    }
  };

  const handleSubmit = () => {
    if (selectedSkips.size === 0) {
      setModalType('error');
      setShowModal(true);
      return;
    }

    const selectedSkipDetails = Array.from(selectedSkips).map(size => {
      const skip = skipSizes.find(s => s.size === size);
      return {
        size: skip.size,
        price: skip.price
      };
    });

    setModalType('success');
    setShowModal(true);
    if (onSkipSelect) {
      onSkipSelect(selectedSkips);
    }
  };

  const getTotalPrice = () => {
    return Array.from(selectedSkips).reduce((total, size) => {
      const skip = skipSizes.find(s => s.size === size);
      return total + parseFloat(skip.price.replace('£', ''));
    }, 0);
  };

  return (
    <div className="relative min-h-screen p-8 bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
      <style jsx global>{`
        @keyframes explodeIn {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-15deg);
          }
          70% {
            transform: scale(1.1) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        @keyframes emergeFromDepth {
          0% {
            transform: translateZ(-1000px) rotateX(45deg);
            opacity: 0;
          }
          100% {
            transform: translateZ(0) rotateX(0);
            opacity: 1;
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.6),
                        0 0 40px rgba(34, 197, 94, 0.4),
                        0 0 60px rgba(34, 197, 94, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.7),
                        0 0 50px rgba(34, 197, 94, 0.5),
                        0 0 70px rgba(34, 197, 94, 0.3);
          }
        }

        @keyframes blueGlowPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.6),
                        0 0 40px rgba(59, 130, 246, 0.4),
                        0 0 60px rgba(59, 130, 246, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.7),
                        0 0 50px rgba(59, 130, 246, 0.5),
                        0 0 70px rgba(59, 130, 246, 0.3);
          }
        }

        .skip-box {
          transition: all 0.3s ease-in-out;
        }

        .skip-box:hover {
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.7),
                     0 0 45px rgba(59, 130, 246, 0.5),
                     0 0 65px rgba(59, 130, 246, 0.3);
          transform: translateY(-5px);
        }

        .image-hover-glow {
          transition: all 0.3s ease-in-out;
        }

        .image-hover-glow:hover {
          filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))
                 drop-shadow(0 0 30px rgba(59, 130, 246, 0.3));
          transform: scale(1.05);
        }

        .image-hover-glow-selected:hover {
          filter: drop-shadow(0 0 15px rgba(34, 197, 94, 0.5))
                 drop-shadow(0 0 30px rgba(34, 197, 94, 0.3));
          transform: scale(1.05);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.5) rgba(17, 24, 39, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {skipSizes.map((skip, index) => {
          const isSelected = selectedSkips.has(skip.size);
          return (
            <motion.div
              key={skip.size}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`
                relative overflow-hidden rounded-xl
                ${isSelected ? 'ring-4 ring-green-500 ring-opacity-60' : ''}
                transform transition-all duration-300 hover:scale-[1.02]
                bg-gradient-to-br from-gray-800/50 to-gray-900/50
                backdrop-blur-lg shadow-xl
                border border-white/10
              `}
              style={{
                boxShadow: isSelected
                  ? '0 0 25px rgba(34, 197, 94, 0.4)'
                  : '0 0 20px rgba(59, 130, 246, 0.2)'
              }}
              onClick={() => toggleSkip(skip.size)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
              
              <div className="relative p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white">
                    {skip.size} Yard Skip
                  </h3>
                  <span className="text-xl font-bold text-green-400">
                    {skip.price}
                  </span>
                </div>

                <div className="relative group perspective-1000">
                  <div className="transform-gpu transition-transform duration-500 group-hover:rotate-y-12">
                    <img
                      src={skip.size >= 20 ? '/images/yellow-skip.png' : '/images/green-skip.png'}
                      alt={`${skip.size} Yard Skip`}
                      className={`
                        w-full h-48 object-cover rounded-lg mb-4
                        transition-all duration-300
                        ${isSelected ? 'ring-2 ring-green-500' : 'ring-1 ring-blue-500/30'}
                        hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]
                      `}
                      onLoad={() => handleImageLoad(skip.size)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-300">{skip.description}</p>
                  <p className="text-sm text-blue-400">Hire Period: {skip.hirePeriod} days</p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`
                      w-3 h-3 rounded-full
                      ${skip.size >= 20 ? 'bg-yellow-400' : 'bg-green-400'}
                    `} />
                    <span className="text-sm text-gray-400">
                      {skip.size >= 20 ? 'Large Size' : 'Standard Size'}
                    </span>
                  </div>
                  
                  <motion.div
                    animate={{
                      scale: isSelected ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 0.3,
                      times: [0, 0.5, 1]
                    }}
                  >
                    <div className={`
                      w-6 h-6 rounded-full border-2
                      transition-colors duration-300
                      flex items-center justify-center
                      ${isSelected 
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-400 bg-transparent'}
                    `}>
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 
                   text-white font-bold py-4 px-8 rounded-full shadow-lg 
                   transform transition-all duration-300 hover:scale-105
                   flex items-center justify-center space-x-2"
        >
          <span>Continue with Selection</span>
          {selectedSkips.size > 0 && (
            <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {selectedSkips.size}
            </span>
          )}
        </button>
      </motion.div>

      {showModal && (
        <div className="fixed w-full h-full flex items-center justify-center"
             style={{
               position: 'fixed',
               top: `${window.scrollY}px`,
               left: '0',
               right: '0',
               height: '100vh',
               zIndex: 9999
             }}>
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-fadeIn" 
            onClick={() => setShowModal(false)} 
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl w-[90%] max-w-md mx-auto
                     shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-blue-500/30 backdrop-blur-xl
                     z-[10000] overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
            
            <div className="flex justify-between items-start mb-6">
              <div className={`text-2xl font-bold ${modalType === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {modalType === 'success' ? 'Selection Confirmed!' : 'Error'}
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {modalType === 'success' ? (
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                <p className="text-white/90 mb-4 text-lg">You have selected the following skips:</p>
                <ul className="mb-6 space-y-3">
                  {Array.from(selectedSkips).map(size => {
                    const skip = skipSizes.find(s => s.size === size);
                    return (
                      <motion.li
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        key={size}
                        className="text-white/80 flex justify-between items-center py-3 px-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <span className="font-medium">{size} Yard Skip</span>
                        <span className="font-bold text-blue-400">{skip.price}</span>
                      </motion.li>
                    );
                  })}
                </ul>
                <div className="sticky bottom-0 pt-4 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent">
                  <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <span className="text-white font-bold text-lg">Total</span>
                    <span className="text-green-400 font-bold text-xl">£{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white/90 mb-6 text-lg flex items-center space-x-3">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Please select at least one skip to continue.</span>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => setShowModal(false)}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 
                  transform hover:scale-[1.02] active:scale-[0.98]
                  ${modalType === 'success' 
                    ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-500/30'
                    : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/30'}`}
              >
                {modalType === 'success' ? 'Close' : 'Try Again'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SkipSelector; 