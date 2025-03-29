import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
  
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const navigate = useNavigate();

  
  useEffect(() => {
  
    const isDarkMode = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
  
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log("data",data);
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/users');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (_) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen font-['Plus_Jakarta_Sans']">
      
      <div className="hidden md:block md:flex-1 bg-cover bg-center bg-no-repeat" 
           style={{backgroundImage: "url(https://images.unsplash.com/photo-1686706763783-1378f598d8c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80)"}}>
      </div>
      
     
      <div className="flex-1 flex flex-col justify-center items-center transition-colors duration-300 
                      bg-gradient-to-b from-[#0F123B] to-black 
                      dark:from-slate-800 dark:to-slate-900 
                      text-white p-6 overflow-auto">
        
        
        <div className="md:hidden flex justify-center mb-8">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-500 dark:border-blue-600 shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1686706763783-1378f598d8c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80" 
              alt="Login" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Nice to see you!</h2>
              <p className="text-white/50 dark:text-white/70">Enter your email and password to sign in</p>
            </div>
            
           
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-700/50 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              )}
            </button>
          </div>
          
  
          {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</div>}
          
      
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 mb-6">
              <label htmlFor="email" className="text-sm mt-4">Email</label>
              <input 
                type="email" 
                id="email"
                className="w-full px-5 py-3 rounded-full border border-white/50 dark:border-white/30 
                           bg-transparent focus:outline-none focus:border-blue-400 
                           dark:focus:border-blue-500 text-white transition-colors"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <label htmlFor="password" className="text-sm mt-4">Password</label>
              <input 
                type="password" 
                id="password"
                className="w-full px-5 py-3 rounded-full border border-white/50 dark:border-white/30 
                           bg-transparent focus:outline-none focus:border-blue-400 
                           dark:focus:border-blue-500 text-white transition-colors"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
           
            <button 
              type="submit" 
              className="w-full bg-[#30A2FF] dark:bg-blue-600 border border-[#30A2FF] dark:border-blue-600 
                         rounded-full py-3 text-white font-medium hover:bg-blue-600 
                         dark:hover:bg-blue-700 transition-colors"
            >
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;