import { useEffect, useRef } from 'react';
import barba from '@barba/core';
import { gsap } from 'gsap';

// Page Transition Manager
export function useBarbaTransitions() {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Initialize Barba.js
    barba.init({
      transitions: [
        {
          name: 'fade',
          leave(data) {
            return gsap.to(data.current.container, {
              opacity: 0,
              duration: 0.5,
              ease: 'power2.inOut'
            });
          },
          enter(data) {
            return gsap.from(data.next.container, {
              opacity: 0,
              duration: 0.5,
              ease: 'power2.inOut'
            });
          }
        },
        {
          name: 'slide',
          leave(data) {
            return gsap.to(data.current.container, {
              x: -100,
              opacity: 0,
              duration: 0.6,
              ease: 'power2.inOut'
            });
          },
          enter(data) {
            return gsap.from(data.next.container, {
              x: 100,
              opacity: 0,
              duration: 0.6,
              ease: 'power2.inOut'
            });
          }
        },
        {
          name: 'clip',
          leave(data) {
            const tl = gsap.timeline();
            tl.to(data.current.container, {
              clipPath: 'circle(0% at 50% 50%)',
              duration: 0.8,
              ease: 'power2.inOut'
            });
            return tl;
          },
          enter(data) {
            const tl = gsap.timeline();
            tl.from(data.next.container, {
              clipPath: 'circle(0% at 50% 50%)',
              duration: 0.8,
              ease: 'power2.inOut'
            });
            return tl;
          }
        },
        {
          name: 'cover',
          leave() {
            const cover = document.createElement('div');
            cover.className = 'page-transition-cover';
            document.body.appendChild(cover);

            return gsap.timeline()
              .set(cover, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                zIndex: 9999,
                transformOrigin: 'bottom'
              })
              .from(cover, {
                scaleY: 0,
                duration: 0.5,
                ease: 'power2.inOut'
              });
          },
          enter() {
            const cover = document.querySelector('.page-transition-cover');
            
            return gsap.timeline()
              .to(cover, {
                scaleY: 0,
                transformOrigin: 'top',
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => cover?.remove()
              });
          }
        }
      ],
      views: [
        {
          namespace: 'home',
          beforeEnter() {
            console.log('Entering home page');
          },
          afterEnter() {
            // Initialize home page animations
            initHomeAnimations();
          }
        },
        {
          namespace: 'product',
          beforeEnter() {
            console.log('Entering product page');
          },
          afterEnter() {
            // Initialize product page animations
            initProductAnimations();
          }
        }
      ]
    });

    // Custom hooks
    barba.hooks.before(() => {
      document.querySelector('html')?.classList.add('is-transitioning');
    });

    barba.hooks.after(() => {
      document.querySelector('html')?.classList.remove('is-transitioning');
      window.scrollTo(0, 0);
    });

    return () => {
      barba.destroy();
    };
  }, []);
}

// Page-specific animations
function initHomeAnimations() {
  const tl = gsap.timeline();
  
  tl.from('.hero-title', {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })
  .from('.hero-subtitle', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.5')
  .from('.hero-cta', {
    scale: 0,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)'
  }, '-=0.3');
}

function initProductAnimations() {
  const tl = gsap.timeline();
  
  tl.from('.product-image', {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  })
  .from('.product-info > *', {
    x: 50,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out'
  }, '-=0.4');
}

// Transition Components
export function PageTransitionWrapper({ children, namespace = 'default' }: { children: React.ReactNode; namespace?: string }) {
  return (
    <div data-barba="wrapper">
      <div data-barba="container" data-barba-namespace={namespace}>
        {children}
      </div>
    </div>
  );
}

// Preloader Component
export function PagePreloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        preloaderRef.current?.remove();
      }
    });

    tl.to('.preloader-logo', {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.7)'
    })
    .to('.preloader-text', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out'
    })
    .to('.preloader-progress', {
      scaleX: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    })
    .to(preloaderRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  }, []);

  return (
    <div 
      ref={preloaderRef}
      className="fixed inset-0 bg-gradient-to-br from-purple-600 to-pink-600 z-[9999] flex items-center justify-center"
    >
      <div className="text-center">
        <div className="preloader-logo w-24 h-24 bg-white rounded-full mx-auto mb-4 scale-0 opacity-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-purple-600">EG</span>
        </div>
        <div className="preloader-text opacity-0 translate-y-4">
          <h2 className="text-white text-2xl font-bold mb-2">EgyGo</h2>
          <p className="text-white/80">جاري التحميل...</p>
        </div>
        <div className="mt-8 w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="preloader-progress h-full bg-white rounded-full origin-left scale-x-0"></div>
        </div>
      </div>
    </div>
  );
}

// Link Component with Barba
export function BarbaLink({ 
  href, 
  children, 
  className = '',
  transition = 'fade' 
}: { 
  href: string; 
  children: React.ReactNode; 
  className?: string;
  transition?: 'fade' | 'slide' | 'clip' | 'cover';
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    barba.go(href, transition);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

// Custom Cursor with Transitions
export function TransitionCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX - 20,
        y: e.clientY - 20,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      gsap.to(cursorDot, {
        x: e.clientX - 4,
        y: e.clientY - 4,
        duration: 0.1
      });
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, {
        scale: 1.5,
        borderColor: '#8b5cf6',
        duration: 0.3
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        borderColor: '#e5e7eb',
        duration: 0.3
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleMouseEnter);
        link.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef}
        className="fixed w-10 h-10 border-2 border-gray-300 rounded-full pointer-events-none z-[9998] mix-blend-difference"
        style={{ transform: 'translate(-20px, -20px)' }}
      />
      <div 
        ref={cursorDotRef}
        className="fixed w-2 h-2 bg-purple-600 rounded-full pointer-events-none z-[9999]"
        style={{ transform: 'translate(-4px, -4px)' }}
      />
    </>
  );
}
