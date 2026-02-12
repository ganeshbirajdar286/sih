// src/components/Card.jsx
import React from 'react';

const Card = ({ title, icon: Icon, children, className = "" }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 ${className}`}>
            {/* Card Header */}
            <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100">
                <div className="flex items-center">
                    {Icon && (
                        <div className="p-2 sm:p-2.5 bg-green-100 text-green-600 rounded-lg mr-3 flex-shrink-0">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                    )}
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
                        {title}
                    </h3>
                </div>
            </div>
            
            {/* Card Body */}
            <div className="p-4 sm:p-5 md:p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;