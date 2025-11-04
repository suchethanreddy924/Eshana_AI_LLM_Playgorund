import React, { useState } from 'react';
import { usePlayground } from '../context/PlaygroundContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, signup } = usePlayground();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      const message = (err && err.message) ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 p-6 flex items-center justify-center z-10">
        {/* Center: Links only */}
        <div className="hidden md:flex space-x-10 text-white/70">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Service</a>
          <a href="#" className="hover:text-white transition-colors">Blog</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
            Eshana.AI
          </span>
        </h1>
        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed text-white/80">
          LLM Playground — all AI tools in one place
        </p>

        {/* Login/Signup Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto mb-8 border border-white/20">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:opacity-50"
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:opacity-50"
              />
            </div>
            
            {isSignUp && (
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:opacity-50"
                />
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={() => setIsSignUp(false)}
              >
                {loading && !isSignUp ? 'Please wait...' : 'SIGN IN'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={() => setIsSignUp(true)}
              >
                {loading && isSignUp ? 'Please wait...' : 'SIGN UP'}
              </button>
            </div>
          </form>
        </div>

        <button className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-900 transition-all duration-300 tracking-wider">
          LEARN MORE
        </button>
      </div>

      {/* Bottom icon */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
          <div className="w-6 h-6 border-2 border-white rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;