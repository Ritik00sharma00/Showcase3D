import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import LoginForm from './Components/LoginForm';
import VisualizerScreen from './Components/VisualizerScreen';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './Services/AuthContext';
import Protectedroute from './Services/Protectedroute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* ✅ Protected Route Example */}
          <Route
            path="/dashboard"
            element={
              <Protectedroute>
                <VisualizerScreen />
              </Protectedroute>
            }
          />
        </Routes>
      </Router>

      <ToastContainer position="top-center" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
