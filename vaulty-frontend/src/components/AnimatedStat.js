'use client';

import useCountUp from '../hooks/useCountUp';
import useGsapAnimation from '../hooks/useGsapAnimation';

export default function AnimatedStat({ number, label, suffix = '' }) {
  const containerRef = useGsapAnimation('fadeInUp', {
    scrollTrigger: { start: 'top 80%' },
  });
  const numberRef = useCountUp(number, 2.5);

  return (
    <div ref={containerRef} className="text-center">
      <div className="text-4xl sm:text-5xl font-bold text-transparent bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text">
        <span ref={numberRef}>0</span>
        <span>{suffix}</span>
      </div>
      <p className="text-gray-600 font-medium mt-2">{label}</p>
    </div>
  );
}
