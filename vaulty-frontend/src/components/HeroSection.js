'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroSection() {
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);
  const dashboardRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0
    )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.2
      )
      .fromTo(
        buttonsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.4
      )
      .fromTo(
        dashboardRef.current,
        { opacity: 0, scale: 0.8, rotateY: -20 },
        { opacity: 1, scale: 1, rotateY: 0, duration: 1, ease: 'back.out(1.7)' },
        0.3
      );
  }, []);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 ref={titleRef} className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Transparent <span className="bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Financial</span> Collaboration
          </h2>
          <p ref={descRef} className="text-lg text-gray-600 leading-relaxed">
            Vaultly is your collaborative finance tracker for personal expense management and shared group goals. Track expenses with advanced search, sorting, filtering, and pagination. Ensure financial transparency and accountability with friends, family, and roommates.
          </p>
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup" className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition duration-300 text-center">
              Get Started Free
            </Link>
            <Link href="#features" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300 text-center">
              Learn More
            </Link>
          </div>
        </div>

        <div ref={dashboardRef} className="relative perspective">
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-4 hover:shadow-2xl transition">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">Monthly Balance</span>
              <TrendingUp className="text-emerald-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">$4,256.50</div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-linear-to-r from-blue-600 to-emerald-600"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-blue-50 rounded-lg p-4 hover:scale-105 transition duration-300">
                <p className="text-xs text-gray-600 font-medium">Personal</p>
                <p className="text-lg font-bold text-blue-600">$2,100</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 hover:scale-105 transition duration-300">
                <p className="text-xs text-gray-600 font-medium">Shared Groups</p>
                <p className="text-lg font-bold text-emerald-600">$2,156.50</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
