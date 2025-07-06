import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import flows (will be created later)
// import OnboardingFlow from './flows/OnboardingFlow';
// import ChatDemoFlow from './flows/ChatDemoFlow';

const App: FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            {/* <Route path="/onboarding" element={<OnboardingFlow />} /> */}
            {/* <Route path="/chat-demo" element={<ChatDemoFlow />} /> */}
          </Routes>
        </motion.div>
      </div>
    </Router>
  );
}

// Temporary welcome screen
const WelcomeScreen: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        EQ AI Voice Assistant
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Interactive prototype with smooth animations and demo flows
      </p>
      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors"
        >
          Start Onboarding Demo
        </motion.button>
        <br />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-green-700 transition-colors"
        >
          Start Chat Demo
        </motion.button>
      </div>
    </motion.div>
  );
}

export default App; 