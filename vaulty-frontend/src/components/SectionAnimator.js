'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SectionAnimator({ children, className = '', animationType = 'fadeIn', staggerChildren = false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const animations = {
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1, duration: 0.7, ease: 'power1.inOut' },
      },
      slideUp: {
        from: { opacity: 0, y: 40 },
        to: { opacity: 1, y: 0, duration: 0.9, ease: 'power2.inOut' },
      },
      slideInLeft: {
        from: { opacity: 0, x: -60 },
        to: { opacity: 1, x: 0, duration: 0.9, ease: 'power2.inOut' },
      },
    };

    const animation = animations[animationType] || animations.fadeIn;

    // Stagger children if enabled
    if (staggerChildren) {
      const children = ref.current.querySelectorAll('[data-animate]');
      gsap.fromTo(
        children,
        animation.from,
        {
          ...animation.to,
          stagger: 0.12,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 95%',
            end: 'top 60%',
            toggleActions: 'play none none none',
            once: true,
            markers: false,
          },
          immediateRender: false,
        }
      );
    } else {
      gsap.fromTo(ref.current, animation.from, {
        ...animation.to,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 95%',
          end: 'top 60%',
          toggleActions: 'play none none none',
          once: true,
          markers: false,
        },
        immediateRender: false,
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === ref.current) {
          trigger.kill();
        }
      });
    };
  }, [animationType, staggerChildren]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

