'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useCountUp(targetNumber = 0, duration = 2.5) {
  const ref = useRef(null);
  const numberRef = useRef({ value: 0 });

  useEffect(() => {
    if (!ref.current) return;

    ScrollTrigger.create({
      trigger: ref.current,
      onEnter: () => {
        gsap.to(numberRef.current, {
          value: targetNumber,
          duration: duration,
          ease: 'power2.out',
          onUpdate: () => {
            if (ref.current) {
              ref.current.textContent = Math.floor(numberRef.current.value);
            }
          },
        });
      },
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === ref.current) {
          trigger.kill();
        }
      });
    };
  }, [targetNumber, duration]);

  return ref;
}
