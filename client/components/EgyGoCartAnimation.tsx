import { useEffect, useRef } from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

export const EgyGoCartAnimation = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cartRef = useRef<HTMLDivElement>(null);
    const goRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

            // Initial state
            gsap.set(cartRef.current, { x: -100, opacity: 0, rotation: 0 });
            gsap.set(goRef.current, { x: 20, opacity: 0, scale: 0.5 });
            gsap.set(textRef.current, { opacity: 0, y: 10 });

            // Animation sequence
            tl.to(cartRef.current, {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "back.out(1.7)",
            })
                .to(cartRef.current, {
                    rotation: -10,
                    y: -5,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 3,
                    ease: "power1.inOut"
                }, "-=0.5") // Wiggle while arriving
                .to(goRef.current, {
                    opacity: 1,
                    scale: 1.2,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                })
                .to(goRef.current, {
                    scale: 1,
                    duration: 0.2
                })
                .to(cartRef.current, {
                    x: 10, // Bump into Go
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                })
                .to(textRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5
                })
                .to([cartRef.current, goRef.current], {
                    x: 300, // Drive away together
                    opacity: 0,
                    duration: 1.5,
                    ease: "power2.in",
                    delay: 1
                });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-32 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 flex items-center justify-center overflow-hidden border-b border-red-100 dark:border-red-900/30">
            <div className="relative flex items-center gap-2">
                {/* Moving Cart with "Egy" */}
                <div ref={cartRef} className="relative z-10">
                    <div className="relative">
                        <ShoppingCart className="w-16 h-16 text-red-600 dark:text-red-500" />
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg transform rotate-12">
                            Egy
                        </span>
                        {/* Speed lines */}
                        <div className="absolute top-1/2 -left-4 w-8 h-0.5 bg-red-300/50 rounded-full"></div>
                        <div className="absolute top-3/4 -left-6 w-6 h-0.5 bg-red-300/50 rounded-full"></div>
                    </div>
                </div>

                {/* Stationary "Go" */}
                <div ref={goRef} className="relative z-10 flex items-center">
                    <span className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-500 dark:to-orange-500 drop-shadow-sm">
                        Go
                    </span>
                    <ArrowRight className="w-8 h-8 text-orange-500 ml-2 animate-pulse" />
                </div>

                {/* Tagline */}
                <div ref={textRef} className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-sm font-bold text-red-600/80 dark:text-red-400/80 tracking-wider">
                        يلا بينا نتسوق!
                    </span>
                </div>
            </div>
        </div>
    );
};
