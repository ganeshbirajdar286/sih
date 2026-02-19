
// src/components/Layout.jsx

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';


import Header from './Header';     
import Sidebar from './Sidebar';  
import Footer from './Footer';    
function Layout({ children }) {
 
  const [isSidebarOpen, setSidebarOpen] = useState(false);


  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
  
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className=" min-h-screen flex">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            key="sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="
              fixed top-0 left-0 h-full z-40 md:relative md:translate-x-0
             
            "
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>
      
     
      {isMobile && isSidebarOpen && (
        <div 
          onClick={toggleSidebar} 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        ></div>
      )}

      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
