import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const tourSteps = [
  {
    id: 1,
    title: 'WELCOME TO AGRISTACK OCR',
    description: 'Your one-stop solution for digitizing land records. Let us guide you through the key features of our platform.',
    target: null, // Full screen overlay
    position: 'center',
    icon: '🎉',
  },
  {
    id: 2,
    title: 'POWERFUL OCR EXTRACTION',
    description: 'Upload your legacy Urdu and Hindi documents. Our AI-powered OCR extracts text with 95%+ accuracy in seconds.',
    target: 'features-section',
    position: 'bottom',
    icon: '📄',
  },
  {
    id: 3,
    title: 'INTELLIGENT TRANSLATION',
    description: 'Automatically translate extracted text to English. Supports multiple Indian languages including Hindi, Urdu, and more.',
    target: 'features-section',
    position: 'bottom',
    icon: '🌐',
  },
  {
    id: 4,
    title: 'SECURE DATA STORAGE',
    description: 'All your documents are encrypted and stored securely. Access your records anytime, anywhere.',
    target: 'features-section',
    position: 'bottom',
    icon: '🔒',
  },
  {
    id: 5,
    title: 'YOUR DASHBOARD',
    description: 'Access your personalized dashboard to upload documents, view results, and manage your profile.',
    target: 'navbar-dashboard',
    position: 'bottom',
    icon: '📊',
  },
  {
    id: 6,
    title: 'READY TO START!',
    description: 'You\'re all set! Head to your dashboard to upload your first document and experience the power of AI-driven OCR.',
    target: null,
    position: 'center',
    icon: '🚀',
  },
];

const GuidedTour = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const step = tourSteps[currentStep];
    if (step.target) {
      const element = document.querySelector(`[data-tour="${step.target}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep, isOpen]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Mark tour as completed in localStorage
    localStorage.setItem('agristack_tour_completed', 'true');
    onComplete?.();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('agristack_tour_completed', 'true');
    onClose();
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999]"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleSkip}
        />

        {/* Spotlight/Highlight for target element */}
        {targetRect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bg-white/10 rounded-xl border-2 border-white/50 pointer-events-none"
            style={{
              left: targetRect.left - 8,
              top: targetRect.top - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
            }}
          />
        )}

        {/* Tour Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className={`absolute bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md ${
            step.position === 'center'
              ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              : targetRect
              ? 'left-1/2 -translate-x-1/2'
              : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          }`}
          style={
            step.position !== 'center' && targetRect
              ? { top: targetRect.bottom + 20 }
              : {}
          }
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-[#292929]'
                    : index < currentStep
                    ? 'w-4 bg-green-500'
                    : 'w-4 bg-neutral-200'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="text-4xl mb-4">{step.icon}</div>

          {/* Content */}
          <h3 className="text-xl font-bold text-[#292929] mb-2 tracking-wide">
            {step.title}
          </h3>
          <p className="text-neutral-600 mb-6 leading-relaxed">
            {step.description}
          </p>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              Skip Tour
            </button>

            <div className="flex gap-2">
              {!isFirstStep && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-5 py-2 rounded-xl bg-[#292929] text-white hover:bg-[#1a1a1a] transition-colors"
              >
                {isLastStep ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Get Started
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GuidedTour;
