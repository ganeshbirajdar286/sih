// src/components/Alerts.jsx
import React from 'react';
import Card from './Card';
import { FaBell, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const Alerts = ({ alerts }) => {
    const alertStyles = {
        warning: {
            bg: 'bg-yellow-50',
            text: 'text-yellow-800',
            border: 'border-yellow-200',
            icon: <FaExclamationTriangle className="text-yellow-500" />
        },
        info: {
            bg: 'bg-blue-50',
            text: 'text-blue-800',
            border: 'border-blue-200',
            icon: <FaInfoCircle className="text-blue-500" />
        }
    };

    return (
        <Card title="Alerts & Notifications" icon={FaBell}>
            <div className="space-y-3">
                {alerts.length === 0 ? (
                    <div className="text-center py-8">
                        <FaBell className="mx-auto text-gray-300 w-12 h-12 mb-3" />
                        <p className="text-gray-500 text-sm">No alerts at this time</p>
                    </div>
                ) : (
                    alerts.map(alert => {
                        const style = alertStyles[alert.type] || alertStyles.info;
                        return (
                            <div 
                                key={alert.id} 
                                className={`p-3 sm:p-4 rounded-lg flex items-start border ${style.bg} ${style.border} hover:shadow-md transition-all duration-300 animate-slideIn`}
                            >
                                <div className="mr-3 flex-shrink-0 mt-0.5 sm:mt-1">
                                    {style.icon}
                                </div>
                                <p className={`text-xs sm:text-sm font-medium ${style.text} leading-relaxed`}>
                                    {alert.message}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>
        </Card>
    );
};

export default Alerts;