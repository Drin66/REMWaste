import React from 'react';

const Modal = ({ isOpen, onClose, selectedSkips, type = 'success' }) => {
  if (!isOpen) return null;

  const isError = type === 'error';
  const totalSkips = selectedSkips?.size || 0;
  const skipSizes = Array.from(selectedSkips || []).sort((a, b) => a - b);
  const totalPrice = skipSizes.reduce((total, size) => {
    const priceMap = {
      4: 211, 5: 241, 6: 284, 8: 295, 10: 356,
      12: 380, 14: 434, 16: 510, 18: 650, 20: 802, 40: 877
    };
    return total + priceMap[size];
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <style jsx>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes backdropFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shakeAnimation {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
      `}</style>

      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 animate-[backdropFadeIn_0.3s_ease-out]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div 
          className={`relative inline-block w-full max-w-md p-6 my-8 text-left bg-white rounded-2xl shadow-xl ${
            isError ? 'animate-[shakeAnimation_0.5s_ease-in-out]' : 'animate-[modalFadeIn_0.5s_ease-out]'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className={`h-12 w-12 mx-auto mb-4 rounded-full flex items-center justify-center
              ${isError ? 'bg-red-100' : 'bg-blue-100'}`}
            >
              {isError ? (
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <h3 className={`text-2xl font-bold ${isError ? 'text-red-900' : 'text-gray-900'}`}>
              {isError ? 'No Skips Selected' : 'Skip Selection Summary'}
            </h3>
            {isError && (
              <p className="mt-2 text-red-600">
                Please select at least one skip to proceed with your order.
              </p>
            )}
          </div>

          {/* Content */}
          {!isError && (
            <div className="mt-4">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Selected Skips ({totalSkips}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {skipSizes.map(size => (
                    <span 
                      key={size}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {size} Yard
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Price:</span>
                  <span className="text-blue-600">£{totalPrice}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isError 
                  ? 'text-red-700 bg-red-100 hover:bg-red-200'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {isError ? 'Go Back' : 'Cancel'}
            </button>
            {!isError && (
              <button
                onClick={() => {
                  // Here you would typically handle the checkout process
                  onClose();
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 rounded-lg transition-all transform hover:scale-105"
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal; 