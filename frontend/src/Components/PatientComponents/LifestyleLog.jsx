// src/components/LifestyleLog.jsx
import React from 'react';
import Card from './Card';
import { FaFire } from 'react-icons/fa';

const LifestyleLog = ({ log }) => (
  <Card title="Lifestyle Log" icon={FaFire}>
    <div className="space-y-3 sm:space-y-4">
      {log.length === 0 ? (
        <div className="text-center py-8">
          <FaFire className="mx-auto text-gray-300 w-12 h-12 mb-3" />
          <p className="text-gray-500 text-sm">No lifestyle activities logged</p>
        </div>
      ) : (
        log.map((item, index) => (
          <div 
            key={index} 
            className="flex items-start p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-200 group"
          >
            <div className={`mr-3 sm:mr-4 mt-0.5 sm:mt-1 p-2 sm:p-2.5 rounded-full bg-gray-100 ${item.color} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-700 text-sm sm:text-base mb-0.5 sm:mb-1 truncate">
                {item.event}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">{item.time}</p>
            </div>
          </div>
        ))
      )}
    </div>
  </Card>
);

export default LifestyleLog;