import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/common/Button';
import { VoiceButton, VoiceState } from '../components/voice';

interface OnboardingStep {
  id: string;
  title: string;
  content: string;
  animation?: string;
  hasVoiceDemo?: boolean;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to EQ AI',
    content: 'Your intelligent voice assistant is ready to help you with tasks, questions, and natural conversations.',
    animation: 'fade-in'
  },
  {
    id: 'voice-permission',
    title: 'Voice Permission',
    content: 'To provide the best experience, we need access to your microphone for voice interactions.',
    animation: 'slide-up'
  },
  {
    id: 'personality',
    title: 'Meet Your Assistant',
    content: 'I\'m here to help! I can assist with planning, answer questions, and engage in creative tasks.',
    animation: 'voice-pulse'
  },
  {
    id: 'ready',
    title: 'You\'re All Set!',
    content: 'Let\'s start with a simple "Hello" to test your voice interaction.',
    animation: 'fade-in',
    hasVoiceDemo: true
  }
];

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleVoiceDemo = () => {
    if (voiceState === 'idle') {
      setVoiceState('listening');
      setTimeout(() => {
        setVoiceState('processing');
        setTimeout(() => {
          setVoiceState('speaking');
          setTimeout(() => {
            setVoiceState('idle');
          }, 2000);
        }, 1500);
      }, 2000);
    }
  };

  const currentStepData = onboardingSteps[currentStep];

  if (isComplete) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 bg-gradient-to-br from-primary-50 to-primary-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Go!</h2>
          <p className="text-gray-600 mb-6">Your voice assistant is now set up and ready to help.</p>
          <Button onClick={() => window.location.href = '/chat-demo'}>
            Start Chatting
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Progress Bar */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep + 1} of {onboardingSteps.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-primary-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-sm"
          >
            {/* Icon or Visual Element */}
            {currentStepData.hasVoiceDemo ? (
              <div className="flex flex-col items-center mb-6">
                <VoiceButton
                  state={voiceState}
                  onClick={handleVoiceDemo}
                  size="lg"
                  className="mb-4"
                />
                <p className="text-sm text-gray-500 capitalize">
                  {voiceState === 'idle' ? 'Tap to try voice' : voiceState}
                </p>
              </div>
            ) : (
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-primary-500 rounded-full animate-pulse" />
            </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              {currentStepData.content}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex-1 mr-3"
          >
            Previous
          </Button>
          <Button
            onClick={nextStep}
            className="flex-1 ml-3"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow; 