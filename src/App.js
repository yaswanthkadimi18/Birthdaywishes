import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BirthdayLogin from './components/LoginPage';
import AnimatedQuestionnaire from './components/Questionnaire';
import HappyWishes from './components/Birthdaywishes';
import CelebrationPage from './components/celebrationPage';
import { useEffect } from 'react';
import BalloonBunchPage from './components/BaloonPop';

// Helper function to check if user has completed questionnaire
const hasCompletedQuestionnaire = (userId) => {
  return localStorage.getItem(`completed_${userId}`) === 'true';
};

// Helper function to check if user has completed balloon popping
const hasCompletedBalloons = (userId) => {
  return localStorage.getItem(`completed_balloons_${userId}`) === 'true';
};

// Helper function to check if user has completed wishes
const hasCompletedWishes = (userId) => {
  return localStorage.getItem(`completed_wishes_${userId}`) === 'true';
};

// Protected Route with progress checking
const ProtectedRoute = ({ children, requireQuestionnaire = false, requireBalloons = false, requireWishes = false }) => {
  const currentUser = localStorage.getItem('currentUser');
  const userId = localStorage.getItem('userId');

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user needs to complete questionnaire first
  if (requireQuestionnaire && !hasCompletedQuestionnaire(userId)) {
    return <Navigate to="/questionnaire" replace />;
  }

  // Check if user needs to complete balloons first
  if (requireBalloons && !hasCompletedBalloons(userId)) {
    return <Navigate to="/balloons" replace />;
  }

  // Check if user needs to complete wishes first
  if (requireWishes && !hasCompletedWishes(userId)) {
    return <Navigate to="/wishes" replace />;
  }

  return children;
};

// Clean up any leftover animation frames when navigating
const CleanupWrapper = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    return () => {
      // Cancel any animation frames
      const cancelAllAnimations = () => {
        let id = requestAnimationFrame(() => { });
        while (id--) {
          cancelAnimationFrame(id);
        }
      };
      cancelAllAnimations();
    };
  }, [location.pathname]);

  return children;
};

function App() {
  return (
    <Router>
      <CleanupWrapper>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<BirthdayLogin />} />

          <Route
            path="/questionnaire"
            element={
              <ProtectedRoute>
                <AnimatedQuestionnaire />
              </ProtectedRoute>
            }
          />

          <Route
            path="/balloons"
            element={
              <ProtectedRoute requireQuestionnaire>
                <BalloonBunchPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishes"
            element={
              <ProtectedRoute requireQuestionnaire requireBalloons>
                <HappyWishes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/celebration"
            element={
              <ProtectedRoute requireQuestionnaire requireBalloons requireWishes>
                <CelebrationPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </CleanupWrapper>
    </Router>
  );
}

export default App;