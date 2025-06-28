import { motion, useInView, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import backgroundImage from '../assets/image.png';
import LoginForm from './LoginForm';
import Signup from './Signup';

export function GradualSpacing({ text }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="flex space-x-1 text-center flex-wrap">
      <AnimatePresence>
        {text.split('').map((char, i) => (
          <motion.span
            ref={ref}
            key={i}
            initial={{ opacity: 0, x: -18 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="text-4xl sm:text-5xl md:text-8xl font-extrabold tracking-tighter bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Home() {
  const [showLogin, setShowLogin] = React.useState(false);

  const toggle = () => setShowLogin((prev) => !prev);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center overflow-hidden">
      
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm brightness-75"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      <div className="relative w-[80%] z-10 text-center flex flex-col items-center text-white">
        <GradualSpacing text="Showcase 3D" />

        <div
          className="
            w-full h-[550px]
            bg-white/10
            backdrop-blur-md
            rounded-xl
            shadow-lg
            border border-white/30
            p-8
            mt-6
            flex flex-col
            items-center
            justify-start
          "
        >
          <div className="w-full flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">{showLogin ? 'Login' : 'Sign Up'}</span>
              <button
                onClick={toggle}
                className={`relative inline-flex h-6 w-12 rounded-full transition-colors duration-300 ${
                  showLogin ? 'bg-blue-500' : 'bg-green-500'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    showLogin ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </button>
            </div>
          </div>

          <p className="text-lg   text-white mb-4">
            Welcome to the 3D Showcase Platform!
          </p>

          <div className="w-full max-w-md">
            {showLogin ? <LoginForm /> : <Signup />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
