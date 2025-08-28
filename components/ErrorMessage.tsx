'use client';

import React from 'react';
import { AlertCircle, RefreshCw, MapPin, Settings } from 'lucide-react';

interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
  isDark?: boolean;
}

export default function ErrorMessage({
  title,
  message,
  onRetry,
  isDark = false
}: ErrorMessageProps) {
  const themeClasses = {
    container: isDark 
      ? "bg-gray-800/60 border-gray-700/50" 
      : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    button: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    errorIcon: "text-red-500",
  };

  const troubleshootingSteps = [
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Check Browser Settings",
      description: "Ensure location services are enabled in your browser settings"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Enable Location Access",
      description: "Click the location icon in your browser's address bar and allow access"
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: "Refresh and Try Again",
      description: "Reload the page and grant location permission when prompted"
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`p-8 rounded-3xl border backdrop-blur-xl ${themeClasses.container}`}>
        {/* Error Icon and Title */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4`}>
            <AlertCircle className={`w-8 h-8 ${themeClasses.errorIcon}`} />
          </div>
          <h2 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
            {title}
          </h2>
          <p className={`${themeClasses.subtitle} leading-relaxed`}>
            {message}
          </p>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <div className="text-center mb-8">
            <button
              onClick={onRetry}
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.button}`}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Troubleshooting Steps */}
        <div>
          <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>
            Troubleshooting Steps:
          </h3>
          <div className="space-y-4">
            {troubleshootingSteps.map((step, index) => (
              <div key={index} className={`flex items-start space-x-4 p-4 rounded-xl ${themeClasses.container} border`}>
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  isDark ? 'bg-emerald-600/20 text-emerald-400' : 'bg-emerald-500/20 text-emerald-600'
                }`}>
                  {step.icon}
                </div>
                <div>
                  <h4 className={`font-medium ${themeClasses.text} mb-1`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm ${themeClasses.subtitle}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Help */}
        <div className={`mt-6 p-4 rounded-xl ${
          isDark ? 'bg-blue-900/30 border border-blue-700/50' : 'bg-blue-50/80 border border-blue-200/50'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-5 h-5 rounded-full ${
              isDark ? 'bg-blue-400' : 'bg-blue-500'
            } flex items-center justify-center mt-0.5`}>
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <h4 className={`font-medium ${themeClasses.text} mb-1`}>
                Why do we need your location?
              </h4>
              <p className={`text-sm ${themeClasses.subtitle}`}>
                The Qibla compass calculates the precise direction to Makkah from your current position. 
                Your location data is only used for this calculation and is not stored or shared.
              </p>
            </div>
          </div>
        </div>

        {/* Browser Compatibility Note */}
        <div className="mt-4 text-center">
          <p className={`text-xs ${themeClasses.subtitle}`}>
            This feature requires a modern browser with geolocation support. 
            For best results, use Chrome, Firefox, Safari, or Edge.
          </p>
        </div>
      </div>
    </div>
  );
}
