import { useEffect, useRef } from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

export const EgyGoCartAnimation = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cartRef = useRef<HTMLDivElement>(null);
    const characterRef = useRef<HTMLDivElement>(null);
    const goRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const legsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
            const containerWidth = containerRef.current?.offsetWidth || 1000;

            // Initial state - Start from far left (off screen)
            gsap.set(cartRef.current, { x: -200, opacity: 1, rotation: 0 });
            gsap.set(characterRef.current, { x: -300, opacity: 1, scale: 0.8 }); // Character behind cart
            gsap.set(goRef.current, { x: 0, opacity: 0, scale: 0.5 }); // Go waits in center
            gsap.set(textRef.current, { opacity: 0, y: 20 });

            // Running legs animation loop
            gsap.to(".leg-left", {
                y: -5,
                rotation: 20,
                duration: 0.1,
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut"
            });
            gsap.to(".leg-right", {
                y: -5,
                rotation: -20,
                duration: 0.1,
                yoyo: true,
                repeat: -1,
                delay: 0.1,
                ease: "power1.inOut"
            });

            // Character bounce while running
            gsap.to(characterRef.current, {
                y: -5,
                duration: 0.15,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });

            // Blinking eyes
            gsap.to(".eye-blink", {
                scaleY: 0.1,
                duration: 0.1,
                repeat: -1,
                repeatDelay: 3,
                yoyo: true,
                ease: "power1.inOut"
            });

            // Main Animation Sequence
            tl
                // 1. Cart enters from left, running fast
                .to(cartRef.current, {
                    x: containerWidth / 2 - 80, // Move to center
                    duration: 2,
                    ease: "power2.out",
                })
                // 2. Character chases cart
                .to(characterRef.current, {
                    x: containerWidth / 2 - 140, // Catch up to cart
                    duration: 2.2, // Slightly slower/later
                    ease: "power2.out",
                }, "<") // Start at same time

                // 3. Cart stops with a skid effect
                .to(cartRef.current, {
                    rotation: -5,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                }, "-=0.5")

                // 4. "Go" appears with pop
                .to(goRef.current, {
                    opacity: 1,
                    scale: 1.2,
                    duration: 0.4,
                    ease: "elastic.out(1, 0.3)"
                })
                .to(goRef.current, {
                    scale: 1,
                    duration: 0.2
                })

                // 5. Character jumps with joy
                .to(characterRef.current, {
                    y: -20,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.out"
                }, "-=0.2")

                // 6. Tagline appears
                .to(textRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5
                })

                // 7. Everyone exits to right
                .to([cartRef.current, characterRef.current, goRef.current], {
                    x: containerWidth + 200,
                    opacity: 0,
                    duration: 1.5,
                    ease: "back.in(1.2)",
                    delay: 1.5
                });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-40 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 flex items-center relative overflow-hidden border-b border-red-100 dark:border-red-900/30">

            {/* Center Container for alignment */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Stationary "Go" - waits here */}
                <div ref={goRef} className="flex items-center ml-16">
                    <span className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-500 dark:to-orange-500 drop-shadow-sm">
                        Go
                    </span>
                    <ArrowRight className="w-10 h-10 text-orange-500 ml-2 animate-pulse" />
                </div>
            </div>

            {/* Running Character */}
            <div ref={characterRef} className="absolute left-0 z-20 flex flex-col items-center">
                {/* Cute Head/Body */}
                <div className="w-12 h-12 bg-orange-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-3 left-2 w-2 h-2 bg-black rounded-full eye-blink"></div>
                    <div className="absolute top-3 right-2 w-2 h-2 bg-black rounded-full eye-blink"></div>
                    <div className="absolute bottom-3 w-4 h-2 bg-red-500 rounded-full"></div>
                </div>
                {/* Short Cute Legs */}
                <div ref={legsRef} className="flex gap-2 -mt-1">
                    <div className="leg-left w-3 h-4 bg-black rounded-full"></div>
                    <div className="leg-right w-3 h-4 bg-black rounded-full"></div>
                </div>
            </div>

            {/* Moving Cart with "Egy" */}
            <div ref={cartRef} className="absolute left-0 z-10">
                <div className="relative">
                    <ShoppingCart className="w-20 h-20 text-red-600 dark:text-red-500" />
                    <span className="absolute -top-3 -right-3 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12">
                        Egy
                    </span>
                    {/* Speed lines */}
                    <div className="absolute top-1/2 -left-6 w-10 h-1 bg-red-300/50 rounded-full"></div>
                    <div className="absolute top-3/4 -left-8 w-8 h-1 bg-red-300/50 rounded-full"></div>
                </div>
            </div>

            {/* Tagline */}
            <div ref={textRef} className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap z-30">
                <span className="text-lg font-bold text-red-600/90 dark:text-red-400/90 tracking-wider bg-white/50 px-4 py-1 rounded-full backdrop-blur-sm">
                    يلا بينا نتسوق!
                </span>
            </div>
        </div>
    );
};
