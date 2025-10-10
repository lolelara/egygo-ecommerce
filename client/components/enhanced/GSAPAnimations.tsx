import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

interface GSAPAnimationProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 
              'zoomIn' | 'rotate' | 'bounce' | 'flip' | 'stagger' | 'parallax' |
              'typewriter' | 'morphText' | 'drawSVG' | 'custom';
  duration?: number;
  delay?: number;
  ease?: string;
  trigger?: boolean;
  triggerStart?: string;
  triggerEnd?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  staggerAmount?: number;
  customAnimation?: (element: HTMLElement) => gsap.core.Timeline;
}

export function GSAPAnimation({
  children,
  animation = 'fadeIn',
  duration = 1,
  delay = 0,
  ease = 'power2.out',
  trigger = false,
  triggerStart = 'top 80%',
  triggerEnd = 'bottom 20%',
  scrub = false,
  pin = false,
  markers = false,
  staggerAmount = 0.1,
  customAnimation
}: GSAPAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline>();

  useGSAP(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const tl = gsap.timeline({
      defaults: { duration, ease },
      scrollTrigger: trigger ? {
        trigger: element,
        start: triggerStart,
        end: triggerEnd,
        scrub,
        pin,
        markers,
        toggleActions: 'play pause resume reverse'
      } : undefined
    });

    // Apply animation based on type
    switch (animation) {
      case 'fadeIn':
        tl.fromTo(element, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, delay }
        );
        break;

      case 'slideUp':
        tl.fromTo(element,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, delay }
        );
        break;

      case 'slideDown':
        tl.fromTo(element,
          { y: -100, opacity: 0 },
          { y: 0, opacity: 1, delay }
        );
        break;

      case 'slideLeft':
        tl.fromTo(element,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, delay }
        );
        break;

      case 'slideRight':
        tl.fromTo(element,
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1, delay }
        );
        break;

      case 'zoomIn':
        tl.fromTo(element,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, delay }
        );
        break;

      case 'rotate':
        tl.fromTo(element,
          { rotation: 360, opacity: 0 },
          { rotation: 0, opacity: 1, delay }
        );
        break;

      case 'bounce':
        tl.fromTo(element,
          { y: -100, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            delay,
            ease: 'bounce.out'
          }
        );
        break;

      case 'flip':
        tl.fromTo(element,
          { rotationY: 180, opacity: 0 },
          { rotationY: 0, opacity: 1, delay }
        );
        break;

      case 'stagger':
        const children = element.children;
        tl.fromTo(children,
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            delay,
            stagger: staggerAmount
          }
        );
        break;

      case 'parallax':
        tl.fromTo(element,
          { y: 100 },
          { 
            y: -100,
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          }
        );
        break;

      case 'typewriter':
        const text = element.textContent || '';
        element.textContent = '';
        tl.to(element, {
          text: text,
          duration: text.length * 0.05,
          ease: 'none',
          delay
        });
        break;

      case 'morphText':
        tl.fromTo(element,
          { 
            filter: 'blur(10px)',
            opacity: 0,
            letterSpacing: '20px'
          },
          { 
            filter: 'blur(0px)',
            opacity: 1,
            letterSpacing: '0px',
            delay
          }
        );
        break;

      case 'custom':
        if (customAnimation) {
          customAnimation(element);
        }
        break;
    }

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, { dependencies: [animation, duration, delay, trigger] });

  return (
    <div ref={elementRef} className="gsap-animation">
      {children}
    </div>
  );
}

// Hero Section with GSAP
export function GSAPHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Animate title with split text
    if (titleRef.current) {
      const chars = titleRef.current.textContent?.split('') || [];
      titleRef.current.innerHTML = chars.map(char => 
        `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');

      tl.from(titleRef.current.children, {
        y: 100,
        opacity: 0,
        rotationX: -90,
        stagger: 0.02,
        ease: 'back.out(1.7)',
        duration: 0.8
      });
    }

    // Animate subtitle
    if (subtitleRef.current) {
      tl.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4');
    }

    // Animate CTA buttons
    if (ctaRef.current) {
      tl.from(ctaRef.current.children, {
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'back.out(1.7)'
      }, '-=0.3');
    }

    // Animate image with floating effect
    if (imageRef.current) {
      tl.from(imageRef.current, {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.8');

      // Add floating animation
      gsap.to(imageRef.current, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 
              ref={titleRef}
              className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              مرحباً بك في EgyGo
            </h1>
            <p 
              ref={subtitleRef}
              className="text-xl text-muted-foreground mb-8"
            >
              اكتشف أفضل المنتجات بأسعار لا تُقاوم مع تجربة تسوق استثنائية
            </p>
            <div ref={ctaRef} className="flex gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
                ابدأ التسوق
              </button>
              <button className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-all">
                تعرف أكثر
              </button>
            </div>
          </div>
          <div ref={imageRef} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30"></div>
            <img 
              src="https://via.placeholder.com/600x600" 
              alt="Hero"
              className="relative z-10 rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Scroll Progress Indicator
export function GSAPScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!progressRef.current) return;

    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
      <div 
        ref={progressRef}
        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

// Magnetic Button
export function GSAPMagneticButton({ children, className = '' }: { children: ReactNode; className?: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <button ref={buttonRef} className={`relative ${className}`}>
      {children}
    </button>
  );
}
