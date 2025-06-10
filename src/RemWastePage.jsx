import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SkipSelector from './components/SkipSelector';
import { skipSizes } from './data/skipSizes';

const RemWastePage = () => {
  const [selectedSkips, setSelectedSkips] = useState(new Set());
  const [isExploded, setIsExploded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('success');

  useEffect(() => {
    setTimeout(() => setIsExploded(true), 100);
  }, []);

  const handleSkipSelect = (skipSizes) => {
    setSelectedSkips(skipSizes);
  };

  const getTotalPrice = () => {
    return Array.from(selectedSkips).reduce((total, size) => {
      const skip = skipSizes.find(s => s.size === size);
      return total + parseFloat(skip.price.replace('£', ''));
    }, 0);
  };

  const handleCheckout = () => {
    if (selectedSkips.size === 0) {
      setModalType('error');
      setShowModal(true);
      return;
    }
    setModalType('success');
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <style jsx>{`
        @keyframes explodeIn {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes floatButton {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .bg-glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <header className={`bg-glass shadow-lg transition-all duration-700 ${isExploded ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-full'}`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <center>
          <h1 className="text-3xl font-bold text-white">
            REM Waste Skip Selector
          </h1>
          <p className="mt-2 text-blue-200">
            Select one or multiple skips for your project
          </p>
          </center>
        </div>
      </header>
      

      <div className="fixed right-6 z-40" style={{ top: '1.5rem' }}>
        <button
          onClick={handleCheckout}
          className={`
            bg-gradient-to-r from-blue-600 to-blue-400 
            hover:from-blue-500 hover:to-blue-300
            text-white px-6 py-3 rounded-full shadow-lg
            transform transition-all duration-500
            hover:scale-105 hover:shadow-xl
            flex items-center gap-2
            animate-[floatButton_3s_ease-in-out_infinite]
            ${selectedSkips.size > 0 ? 'scale-110' : 'scale-100'}
          `}
        >
          <span className="font-semibold">
            {selectedSkips.size > 0 
              ? `Proceed with ${selectedSkips.size} Skip${selectedSkips.size > 1 ? 's' : ''}`
              : 'Choose Your Skips'}
          </span>
          <svg 
            className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14 5l7 7m0 0l-7 7m7-7H3" 
            />
          </svg>
        </button>
      </div>

      <main className={`max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 transition-all duration-1000 ${isExploded ? 'opacity-100 transform-none' : 'opacity-0 scale-50'}`}>
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-glass rounded-2xl shadow-xl">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Available Skip Sizes
              </h2>
              <SkipSelector onSkipSelect={handleSkipSelect} />
            </div>
          </div>
        </div>
      </main>

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

export default RemWastePage;
