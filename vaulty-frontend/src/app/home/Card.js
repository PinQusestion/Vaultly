'use client';

import useGsapAnimation from '../../hooks/useGsapAnimation';

export default function Card({ 
  icon, 
  title, 
  description, 
  number, 
  variant = 'feature' // 'feature', 'step', 'data'
}) {
  const ref = useGsapAnimation('fadeInScale', {
    scrollTrigger: { start: 'top 95%' },
  });

  // Step card layout
  if (variant === 'step') {
    return (
      <div ref={ref} data-animate className="text-center group cursor-pointer">
        <div className="bg-linear-to-br from-blue-600 to-emerald-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
          {number}
        </div>
        <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h4>
        <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{description}</p>
      </div>
    );
  }

  // Data card layout (icon + content)
  if (variant === 'data') {
    return (
      <div
        ref={ref}
        data-animate
        className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden"
      >
        {/* Animated background shine */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-15 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
        
        <div className="relative z-10">
          <div className="mb-4 text-3xl group-hover:text-blue-600 group-hover:scale-105 transition-all duration-300">
            {icon}
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h4>
          <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">{description}</p>
        </div>
      </div>
    );
  }

  // Feature card layout (default)
  return (
    <div
      ref={ref}
      data-animate
      className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      {/* Animated background shine */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-15 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
      
      <div className="relative z-10">
        <div className="mb-4 text-4xl group-hover:text-blue-600 group-hover:scale-105 transition-all duration-300">
          {icon}
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h4>
        <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">{description}</p>
      </div>
    </div>
  );
}
