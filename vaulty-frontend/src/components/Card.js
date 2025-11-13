'use client';

import useGsapAnimation from '../hooks/useGsapAnimation';

export default function Card({ 
  icon, 
  title, 
  description, 
  number, 
  variant = 'feature' // 'feature', 'step', 'data'
}) {
  const ref = useGsapAnimation('fadeInScale', {
    scrollTrigger: { start: 'top 85%' },
  });

  // Step card layout
  if (variant === 'step') {
    return (
      <div ref={ref} className="text-center">
        <div className="bg-linear-to-br from-blue-600 to-emerald-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
          {number}
        </div>
        <h4 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-300">
          {title}
        </h4>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  }

  // Data card layout (icon + content)
  if (variant === 'data') {
    return (
      <div
        ref={ref}
        className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <div className="mb-4 text-3xl hover:text-blue-600 transition-colors duration-300">
          {icon}
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-300">
          {title}
        </h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    );
  }

  // Feature card layout (default)
  return (
    <div
      ref={ref}
      className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="mb-4 text-4xl hover:text-blue-600 transition-colors duration-300">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-300">
        {title}
      </h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
