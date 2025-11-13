'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useGsapAnimation(animationType = 'fadeInUp', options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const animations = {
      fadeInUp: {
        from: { opacity: 0, y: 60 },
        to: { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      },
      fadeInScale: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)' },
      },
      slideInLeft: {
        from: { opacity: 0, x: -100 },
        to: { opacity: 1, x: 0, duration: 1, ease: 'power3.out' },
      },
      slideInRight: {
        from: { opacity: 0, x: 100 },
        to: { opacity: 1, x: 0, duration: 1, ease: 'power3.out' },
      },
      rotateIn: {
        from: { opacity: 0, rotation: -10, scale: 0.9 },
        to: { opacity: 1, rotation: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)' },
      },
      staggerFade: {
        from: { opacity: 0, y: 30 },
        to: { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
      },
    };

    const animation = animations[animationType] || animations.fadeInUp;
    const config = { ...animation.to, ...options };

    if (options.immediateRender !== false && !options.scrollTrigger) {
      gsap.fromTo(ref.current, animation.from, config);
    } else {
      gsap.fromTo(ref.current, animation.from, {
        ...config,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
          ...options.scrollTrigger,
        },
      });
    }

    return () => {
      gsap.killTweensOf(ref.current);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === ref.current) {
          trigger.kill();
        }
      });
    };
  }, [animationType, options]);

  return ref;
}
