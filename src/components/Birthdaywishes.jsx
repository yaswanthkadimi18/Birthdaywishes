import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const HappyWishes = () => {
    const navigate = useNavigate();
    const [displayText, setDisplayText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showStars, setShowStars] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    // Assistant states
    const [assistantMood, setAssistantMood] = useState('happy');
    const [assistantMessage, setAssistantMessage] = useState('Reading this special message... ✨');
    const [showThoughtBubble, setShowThoughtBubble] = useState(true);

    const gradientRef = useRef(null);
    const animationRef = useRef(null);
    const textContainerRef = useRef(null);
    const contentContainerRef = useRef(null);
    const mountedRef = useRef(true);
    const typingIntervalRef = useRef(null);
    const rabbitsRef = useRef([]);
    const rabbitAnimationRef = useRef(null);
    const messageCycleRef = useRef(null);

    // User-specific messages - memoized
    const userMessages = useMemo(() => ({
        anu: `"Ammai 😇,

Nee presence naa life lo oka key role aney cheppali — nenu weak anipinchina moments lo kuda, nannu strong ga nilabettindi. Rajamatha shivagami devi laga..... (Naa matey sasanam 😄).

Nuvvu oka special person ani cheppadaniki heavy words avasaram ledu — naa life lo nenu konchem strong ga, konchem positive ga unna ante, daaniki reason nuvvey this one example is enough to say that you are so special among all others....

Actually niku unna qualities ki teacher amma vi avalsindhi we missed it (every day is not sunday)… aina parledhu ila undi kuda anni handle chesthunav chudu adhe magic uu 😉.

Anni baney unnai gani "A life full of journey" uhinchukunna netho but ika life long manam kalisi undalemu ga adhey chala badha ga undhi... Thats ok, andharaiki anni dorakvu ga paiga nelanti ammai antey (Like a diamond💎✨  in the sky🌌😉) just chudagalanu anthey dhakkinchukolenu(I know i wont deserve you)... 

(There is a small suggestion from my side i know u have been seeing some qualities to find your partner a qualities yento naku theliyadhu avi nalo levu annav i dont want to know what were that but i only say onthing if you truely want someone then the qualities wont matter kalisina tharavatha sort out chesukovachu pelli ayina tharavtha anni maripothai poni nuvvu anukuna qualities unna vadu vachina pelli ayyaka thanu same alaney untadu ani can u fix on that no right , 
Here everything is time that will change every thing .

so instead of find the person with some random qualities or something try to find the person who cares for you u  and stands for you till your end(A person who will stand beside you at every situation).) ==> idhi antha yepati nundo direct ga cheppali ani chusthunna but i dont have enough courage to say directly i think this is th time to say .. thats ok if u take it in a bad way but i need say this to you ...... 

koncham yekkuva aindhi kadha kani parledhu actually edhi special ga neeksoam nenu develop chesanu ee link, so neekosam chesinapudu minimum ee mathram undali ga 🤗.


And finally...,

Ee birthday roju, naa wish simple — nee life lo happiness ekkuva, worries takkuva(incase unna avi as soon as possible solve aipovali), smiles unlimited undaali. Nuvvu eppudu alaane strong ga, cute ga, little crazy ga undaali ✨

Happy Birthday, Ammai 💫

Happy birthday to my unfinished hope — the one only I kept writing. , I know.
May this year be your most beautiful chapter yet.

With all my admiration and love,
Forever cheering for you 💫"`,

        padma: `"Padhu 😇,

Padmavathi Padmavathi ne yerrani muthi chudaganey na manasu aipoindhi kothi🐒😄.

Ninnu first time college lo oka roju principal edho meeting pedithey something marketing gurinchi question adigithey nuvvu nee thokkalo MG car lu gurinchi cheppav appudu chusa same oka pandhi college dress yesukoni vasthey yela untadho alaney kanipinchav aa tharavatha mana friendship start aindhi ... enni days netho savasam chesanu antey adhi sahasam aney cheppali 😉....

Nuvvu oka caring soul nannu baga care chesthav ani cheppali anukunna kani nenu aney vadni unna ani asala niku gurthey undadhu ga but i can say onething your friendship makes me some what special correct edhi ani cheppalenu but there is a special thing about this .. more over i will remember all the journey of ours from starting to till now 
each one is a memory...

"Distance may be there" anukunte but memories anni close ga unnai. Like a precious pearl in the ocean 🌊, kanipinchedi kante ekkuva depth undi nee personality lo...

Actually naku nelo nachey quality being strong at every situation konni vishayalo lo ninnu chusi follow ayyevadni .. so be maintian that thing till the end🤗

And nachalenidhi yenti antey nenu ninnu chala special granted ga treat chestha but nenu niku just a normal person ga migilipoyanu chala sarlu ee vishaym lo badhapaddanu later alavatu chesukunna .. realise ayyanu manam anukunnatu opposite person kuda anukovali ga ani .. thats ok everything is an experience right .. But dont make this to the person who come into your life vadikantu kastha time and love isthu undu (its just a suggestion from my side.. thappu ga naukunna parledhu but i need to say this)

Sorry for everything which i made you disturbed and worried., But u will be always special to me 


And finally...,

Ee birthday roju, naa wish simple — nee life lo peace and happiness ekkuva, tension takkuva, laughter penta undaali. Nuvvu eppudu ilaane pandi laga, mental ga, beautiful ga undaali ✨

Happy Birthday, Padhu 💫

Happy birthday to the person who is so special in my life a beautifull journey makes the around us just by being in it.
May this year bring you all the peace and happiness you deserve.

With sincere affection and respect,
Always wishing you well 💫"`
    }), []);

    // Assistant messages
    const assistantMessages = useMemo(() => ({
        reading: [
            "Reading this beautiful message... 📖",
            "These words are so heartfelt! 💖",
            "Take your time to read this... 🕰️",
            "Every word is filled with emotion! 🥹"
        ],
        typing: [
            "Message is being typed out for you... ✍️",
            "Each word appears with love! 💌",
            "Patience, beautiful message coming... ⏳",
            "Special words for a special person! ✨"
        ],
        complete: [
            "What a beautiful message! 😊",
            "Time to accept these heartfelt wishes! 🌟",
            "Ready to continue? 🎉",
            "This is so special! 💫"
        ],
        skip: [
            "Message complete! Read it now! 📄",
            "All the beautiful words are here! 💝",
            "Take your time with the full message! 🕰️",
            "Ready when you are! ✅"
        ]
    }), []);

    // Get user-specific details - memoized
    const userDetails = useMemo(() => {
        if (!currentUser) return {
            name: 'Special One',
            nickname: 'Dear',
            gradient: 'from-indigo-600 via-purple-600 to-pink-600',
            bgGradient: 'from-slate-900 via-indigo-900/50 to-purple-900',
            title: 'Heartfelt Message',
            subtitle: 'Words from the heart, for the most special person',
            icon: '💌'
        };

        if (currentUser.id === 'padma') {
            return {
                name: 'Padma',
                nickname: 'Padhu',
                gradient: 'from-purple-600 via-pink-600 to-indigo-600',
                bgGradient: 'from-slate-900 via-purple-900/50 to-indigo-900',
                title: 'Special Message for Padma',
                subtitle: 'Gentle words for a gentle soul',
                icon: '💝'
            };
        }

        return {
            name: 'Anupama',
            nickname: 'Ammai',
            gradient: 'from-pink-600 via-purple-600 to-cyan-600',
            bgGradient: 'from-slate-900 via-pink-900/50 to-cyan-900',
            title: 'Heartfelt Message for Ammai',
            subtitle: 'Words from the heart, for the most special person',
            icon: '💌'
        };
    }, [currentUser]);

    // Get current message based on user - memoized
    const message = useMemo(() => {
        if (!currentUser) return userMessages.anu;
        return userMessages[currentUser.id] || userMessages.anu;
    }, [currentUser, userMessages]);

    // Simple Assistant Component
    const VirtualAssistant = () => {
        const getAssistantEmoji = () => {
            switch (assistantMood) {
                case 'happy': return '😊';
                case 'excited': return '🤩';
                case 'thinking': return '🤔';
                case 'sad': return '😢';
                case 'celebrating': return '🥳';
                case 'blissful': return '🥰';
                case 'shocked': return '😲';
                case 'peaceful': return '😌';
                default: return '😊';
            }
        };

        return (
            <div className="fixed top-4 right-4 z-50">
                <div className="relative">
                    {/* Thought Bubble - ALWAYS VISIBLE */}
                    {showThoughtBubble && (
                        <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-xl p-3 shadow-2xl border border-gray-200">
                            <p className="text-gray-800 text-sm font-medium text-center">
                                {assistantMessage}
                            </p>
                            {/* Bubble tail */}
                            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45 border-b border-r border-gray-200"></div>
                        </div>
                    )}

                    {/* Assistant Character */}
                    <div
                        className="relative w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 flex items-center justify-center shadow-2xl cursor-pointer animate-bounce"
                        onClick={() => setShowThoughtBubble(!showThoughtBubble)}
                    >
                        <span className="text-2xl">{getAssistantEmoji()}</span>

                        {/* Status Indicator */}
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                            <span className="text-xs">✨</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Cycle assistant messages
    const startAssistantMessages = (type) => {
        clearInterval(messageCycleRef.current);

        const messages = assistantMessages[type] || assistantMessages.reading;
        if (!messages) return;

        let index = 0;

        // Set first message
        setAssistantMessage(messages[0]);

        // Cycle through messages every 5 seconds
        messageCycleRef.current = setInterval(() => {
            index = (index + 1) % messages.length;
            setAssistantMessage(messages[index]);
        }, 5000);
    };

    useEffect(() => {
        // Get user from localStorage
        const user = localStorage.getItem('currentUser');
        const userName = localStorage.getItem('userName');
        const userFullName = localStorage.getItem('userFullName') || localStorage.getItem('userName');
        const userNickname = localStorage.getItem('userNickname');

        if (user && userName) {
            setCurrentUser({
                id: user,
                name: userName,
                fullName: userFullName || userName,
                nickname: userNickname || userName
            });

            // Check if already completed wishes
            const completed = localStorage.getItem(`completed_wishes_${user}`);
            if (completed === 'true') {
                navigate('/celebration');
            }
        } else {
            // If no user found, redirect to login
            navigate('/login');
        }

        // Start assistant messages for typing
        startAssistantMessages('typing');
    }, [navigate]);

    // Initialize rabbits
    const initRabbits = () => {
        rabbitsRef.current = [];
        const rabbitCount = isMobile ? 2 : 3;

        for (let i = 0; i < rabbitCount; i++) {
            rabbitsRef.current.push({
                id: i,
                x: -100, // Start completely off-screen
                y: Math.random() * 60 + 20, // More centered vertically
                speed: 0.1 + Math.random() * 0.1, // Very slow speed
                size: isMobile ? 70 : 90, // Bigger rabbits
                emoji: '🐰',
                delay: i * 3000, // Longer delay between rabbits
                opacity: 0.7 + Math.random() * 0.2, // More visible
                hopHeight: 0,
                hopDirection: 1,
                isHopping: true,
                hopSpeed: 0.3 + Math.random() * 0.2 // Gentle hop
            });
        }
    };

    // Animate rabbits function
    const animateRabbits = () => {
        const canvas = document.getElementById('rabbitsCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear with gentle fade for trailing effect
        ctx.fillStyle = `rgba(0, 0, 0, 0.02)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw each rabbit
        rabbitsRef.current.forEach(rabbit => {
            // Apply delay
            if (rabbit.delay > 0) {
                rabbit.delay -= 16; // ~60fps
                return;
            }

            // Move rabbit VERY SLOWLY
            rabbit.x += rabbit.speed;

            // Gentle hopping animation
            if (rabbit.isHopping) {
                rabbit.hopHeight += 0.08 * rabbit.hopDirection;
                if (rabbit.hopHeight > 12) rabbit.hopDirection = -1;
                if (rabbit.hopHeight < 0) rabbit.hopDirection = 1;
            }

            // Reset rabbit when it goes off screen
            if (rabbit.x > canvas.width + 150) {
                rabbit.x = -150;
                rabbit.y = Math.random() * 60 + 20;
                rabbit.speed = 0.1 + Math.random() * 0.1;
                rabbit.opacity = 0.7 + Math.random() * 0.2;
                rabbit.delay = Math.random() * 2000; // Random delay before reappearing
            }

            // Draw rabbit shadow
            ctx.save();
            ctx.globalAlpha = rabbit.opacity * 0.4;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.font = `bold ${rabbit.size}px Arial, sans-serif`;
            ctx.fillText('🐰', rabbit.x + 3, rabbit.y + rabbit.hopHeight + 3);
            ctx.restore();

            // Draw rabbit with glow effect
            ctx.save();
            ctx.shadowColor = currentUser?.id === 'padma' ? '#c084fc' : '#f472b6';
            ctx.shadowBlur = 20;
            ctx.globalAlpha = rabbit.opacity;
            ctx.font = `bold ${rabbit.size}px Arial, sans-serif`;
            ctx.fillText(rabbit.emoji, rabbit.x, rabbit.y - rabbit.hopHeight);
            ctx.restore();

            // Draw occasional hearts
            if (Math.random() > 0.97) {
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = currentUser?.id === 'padma' ? '#e879f9' : '#f472b6';
                ctx.font = '28px Arial, sans-serif';
                ctx.fillText('💖', rabbit.x + 40, rabbit.y - rabbit.hopHeight - 40);
                ctx.restore();
            }

            // Draw footprint trail occasionally
            if (Math.random() > 0.99) {
                ctx.save();
                ctx.globalAlpha = 0.3;
                ctx.font = '20px Arial, sans-serif';
                ctx.fillText('🌸', rabbit.x - 30, rabbit.y + 10);
                ctx.restore();
            }
        });

        rabbitAnimationRef.current = requestAnimationFrame(animateRabbits);
    };

    // Setup rabbit animation
    const setupRabbitAnimation = () => {
        const canvas = document.getElementById('rabbitsCanvas');
        if (!canvas) return;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        initRabbits();
        animateRabbits();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (rabbitAnimationRef.current) {
                cancelAnimationFrame(rabbitAnimationRef.current);
            }
        };
    };

    useEffect(() => {
        mountedRef.current = true;

        const handleResize = () => {
            if (mountedRef.current) {
                setIsMobile(window.innerWidth < 768);
            }
        };

        window.addEventListener('resize', handleResize);

        // Clear any existing typing interval
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }

        // Start typing animation
        typingIntervalRef.current = setInterval(() => {
            if (textIndex < message.length) {
                setDisplayText(prev => prev + message[textIndex]);
                setTextIndex(prev => prev + 1);
            } else {
                clearInterval(typingIntervalRef.current);
                setIsTypingComplete(true);
                // Update assistant when typing is complete
                setAssistantMood('celebrating');
                startAssistantMessages('complete');
                setTimeout(() => {
                    if (mountedRef.current) {
                        setShowButton(true);
                        setShowStars(true);
                    }
                }, 500);
            }
        }, isMobile ? 25 : 15);

        // Animate gradient based on user
        const animateGradient = () => {
            if (mountedRef.current && gradientRef.current) {
                let hue = currentUser?.id === 'padma' ? 270 : 0;
                const animate = () => {
                    if (!mountedRef.current || !gradientRef.current) return;

                    hue = (hue + 0.2) % 360;

                    if (currentUser?.id === 'padma') {
                        gradientRef.current.style.background =
                            `linear-gradient(${hue}deg, 
                             rgba(124, 58, 237, 0.1) 0%, 
                             rgba(236, 72, 153, 0.08) 25%, 
                             rgba(79, 70, 229, 0.06) 50%, 
                             rgba(99, 102, 241, 0.04) 75%, 
                             rgba(124, 58, 237, 0.1) 100%)`;
                    } else {
                        gradientRef.current.style.background =
                            `linear-gradient(${hue}deg, 
                             rgba(79, 70, 229, 0.1) 0%, 
                             rgba(124, 58, 237, 0.08) 25%, 
                             rgba(236, 72, 153, 0.06) 50%, 
                             rgba(245, 158, 11, 0.04) 75%, 
                             rgba(79, 70, 229, 0.1) 100%)`;
                    }
                    animationRef.current = requestAnimationFrame(animate);
                };
                animate();
            }
        };

        setTimeout(animateGradient, 100);

        return () => {
            mountedRef.current = false;
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
            if (messageCycleRef.current) {
                clearInterval(messageCycleRef.current);
            }
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [textIndex, isMobile]);

    useEffect(() => {
        const cleanup = setupRabbitAnimation();
        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    const handleAccept = () => {
        setIsExiting(true);
        // Assistant reacts to acceptance
        setAssistantMood('excited');
        setAssistantMessage("Moving to celebration! 🎉");

        // Mark wishes as completed in localStorage
        if (currentUser?.id) {
            localStorage.setItem(`completed_wishes_${currentUser.id}`, 'true');
        }

        setTimeout(() => {
            navigate('/celebration');
        }, 1000);
    };

    // SKIP TYPING BUTTON
    const handleSkipTyping = () => {
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }
        setDisplayText(message);
        setTextIndex(message.length);
        setIsTypingComplete(true);
        setShowButton(true);
        setShowStars(true);

        // Update assistant when skipping
        setAssistantMood('celebrating');
        startAssistantMessages('skip');
    };

    const getFloatingSymbols = useMemo(() => {
        if (!currentUser) return ['✨', '🌟', '💫', '🌙', '☁️', '🌸', '🎀', '💖', '💝'];

        if (currentUser.id === 'padma') {
            return ['✨', '🌟', '💫', '🌊', '🐚', '🌸', '💝', '💜', '🕊️', '☁️'];
        }

        return ['✨', '🌟', '💫', '🌙', '☁️', '🌸', '🎀', '💖', '💝', '💎'];
    }, [currentUser]);

    const renderFloatingSymbols = () => {
        if (!showStars) return null;

        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(isMobile ? 15 : 30)].map((_, i) => {
                    const symbol = getFloatingSymbols[Math.floor(Math.random() * getFloatingSymbols.length)];
                    const size = Math.random() * 25 + 15;

                    return (
                        <div
                            key={i}
                            className="absolute animate-float-symbol"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                fontSize: `${size}px`,
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: `${Math.random() * 20 + 20}s`,
                                opacity: 0.1 + Math.random() * 0.1
                            }}
                        >
                            {symbol}
                        </div>
                    );
                })}
            </div>
        );
    };

    const getGlowingOrbs = useMemo(() => {
        if (!currentUser) return {
            topLeft: 'bg-indigo-500/5',
            bottomRight: 'bg-purple-500/5',
            center: 'bg-pink-500/3'
        };

        if (currentUser.id === 'padma') {
            return {
                topLeft: 'bg-purple-500/5',
                bottomRight: 'bg-indigo-500/5',
                center: 'bg-pink-500/3'
            };
        }

        return {
            topLeft: 'bg-pink-500/5',
            bottomRight: 'bg-cyan-500/5',
            center: 'bg-purple-500/3'
        };
    }, [currentUser]);

    return (
        <div
            ref={contentContainerRef}
            className={`min-h-screen bg-gradient-to-br ${userDetails.bgGradient} px-3 md:px-4 py-4 md:py-8 flex items-start justify-center relative safe-area-padding overflow-hidden`}
            style={{
                minHeight: 'calc(var(--vh, 1vh) * 100)',
                WebkitOverflowScrolling: 'touch',
                overflowY: 'auto',
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)'
            }}
        >
            {/* Virtual Assistant */}
            <VirtualAssistant />

            {/* Animated Gradient Background */}
            <div
                ref={gradientRef}
                className="absolute inset-0 transition-all duration-1000"
                style={{
                    background: 'linear-gradient(0deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.08) 25%, rgba(236, 72, 153, 0.06) 50%, rgba(245, 158, 11, 0.04) 75%, rgba(79, 70, 229, 0.1) 100%)'
                }}
            />

            {/* Canvas for Running Rabbits */}
            <canvas
                id="rabbitsCanvas"
                className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
            />

            {/* Glowing Orbs - Mobile Optimized */}
            <div className={`absolute top-10 md:top-20 left-5 md:left-10 w-32 h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 ${getGlowingOrbs.topLeft} rounded-full blur-2xl md:blur-3xl`}></div>
            <div className={`absolute bottom-10 md:bottom-20 right-5 md:right-10 w-32 h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 ${getGlowingOrbs.bottomRight} rounded-full blur-2xl md:blur-3xl`}></div>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-80 md:h-80 ${getGlowingOrbs.center} rounded-full blur-2xl md:blur-3xl`}></div>

            {renderFloatingSymbols()}

            {/* User-specific decorative elements */}
            <div className="absolute top-10 left-5 opacity-15 text-3xl md:text-5xl animate-float">
                {currentUser?.id === 'padma' ? '🌸' : '✨'}
            </div>
            <div className="absolute bottom-10 right-5 opacity-15 text-3xl md:text-5xl animate-float-delayed">
                {currentUser?.id === 'padma' ? '🌊' : '💎'}
            </div>

            {/* Skip Typing Button - Only shows while typing */}
            {!isTypingComplete && (
                <div className="absolute top-20 md:top-24 left-1/2 transform -translate-x-1/2 z-20 animate-fade-in">
                    <button
                        onClick={handleSkipTyping}
                        className="px-4 py-2 bg-white/30 backdrop-blur-sm border border-white/40 rounded-full text-white text-xs md:text-sm font-medium hover:bg-white/40 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                    >
                        <span className="text-base">⏩</span>
                        <span>Skip to Read Full Message</span>
                    </button>
                </div>
            )}

            <div className={`relative z-10 w-full max-w-3xl mx-auto my-2 md:my-4 transition-all duration-700 ${isExiting ? 'opacity-0 scale-95 translate-y-10' : 'opacity-100 scale-100'} px-1 md:px-0`}>
                {/* Header - Mobile Optimized */}
                <div className="text-center mb-4 md:mb-6">
                    <div className="relative inline-block mb-2 md:mb-3">
                        <div className={`absolute -inset-3 md:-inset-4 bg-gradient-to-r ${userDetails.gradient}/30 rounded-full blur-lg md:blur-xl animate-pulse`}></div>
                        <div className="relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-xl">
                            <span className="text-2xl md:text-3xl lg:text-4xl">{userDetails.icon}</span>
                        </div>
                    </div>

                    <h1 className={`${isMobile ? 'text-xl md:text-2xl' : 'text-4xl lg:text-5xl'} font-bold text-white mb-1 md:mb-2 px-2`}>
                        {userDetails.title}
                    </h1>
                    <p className="text-white/70 text-xs md:text-sm lg:text-base px-3">
                        {userDetails.subtitle}
                    </p>
                </div>

                {/* Message Container - Mobile Optimized */}
                <div className="relative mb-4 md:mb-6">
                    {/* Outer glow effect */}
                    <div className={`absolute -inset-3 md:-inset-4 bg-gradient-to-r ${userDetails.gradient}/20 rounded-xl md:rounded-2xl blur-lg md:blur-xl opacity-50`}></div>

                    {/* Glass effect card */}
                    <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 border border-white/20 shadow-xl overflow-hidden">
                        {/* Decorative corner elements */}
                        <div className={`absolute top-2 left-2 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 ${currentUser?.id === 'padma' ? 'border-purple-400/50' : 'border-indigo-400/50'} rounded-tl-lg`}></div>
                        <div className={`absolute top-2 right-2 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 ${currentUser?.id === 'padma' ? 'border-pink-400/50' : 'border-purple-400/50'} rounded-tr-lg`}></div>
                        <div className={`absolute bottom-2 left-2 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 ${currentUser?.id === 'padma' ? 'border-indigo-400/50' : 'border-pink-400/50'} rounded-bl-lg`}></div>
                        <div className={`absolute bottom-2 right-2 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 ${currentUser?.id === 'padma' ? 'border-purple-400/50' : 'border-indigo-400/50'} rounded-br-lg`}></div>

                        {/* Rabbit decoration inside message card */}
                        <div className="absolute -top-3 -left-3 text-2xl opacity-25 animate-hop">
                            🐰
                        </div>
                        <div className="absolute -bottom-3 -right-3 text-2xl opacity-25 animate-hop-delayed">
                            🐇
                        </div>

                        {/* Message content with proper scrolling */}
                        <div ref={textContainerRef} className={`relative ${isMobile ? 'min-h-[300px] max-h-[350px]' : 'min-h-[350px] max-h-[450px]'} p-2 overflow-y-auto custom-scrollbar touch-manipulation`} >
                            <div className={`${isMobile ? 'text-xs md:text-sm' : 'text-base md:text-lg'} text-white/90 leading-relaxed md:leading-loose tracking-wide whitespace-pre-line font-light pb-4`}>
                                {displayText}
                                {!isTypingComplete && (
                                    <span className="ml-1 animate-pulse text-white/50">|</span>
                                )}
                            </div>

                            {/* Progress indicator - Mobile Optimized */}
                            <div className="sticky bottom-0 left-0 right-0 pt-4 bg-gradient-to-t from-slate-900/90 to-transparent">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="text-white/50 text-xs flex gap-1">
                                            {currentUser?.id === 'padma' ? '💜 🕊️ 😊' : '😍 🥰 😊'}
                                        </div>
                                    </div>
                                    {!isTypingComplete && (
                                        <div className="text-white/60 text-xs flex items-center gap-2">
                                            <span>Typing: {((textIndex / message.length) * 100).toFixed(0)}%</span>
                                            <span className="text-lg">🐇</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons - Mobile Optimized */}
                <div className="flex flex-col gap-3 md:gap-4 justify-center items-center px-2">
                    {showButton && (
                        <button
                            onClick={handleAccept}
                            disabled={isExiting}
                            className={`group relative w-full max-w-md px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl text-white font-semibold text-sm md:text-base transition-all duration-500 overflow-hidden border border-white/20 min-h-[44px] md:min-h-[52px] touch-manipulation ${isExiting ? 'opacity-50' : 'hover:scale-105 active:scale-95'}`}
                        >
                            {/* Gradient background */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${userDetails.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>

                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                            <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                                <span className="text-lg md:text-xl">🌟</span>
                                <span className="text-xs md:text-sm lg:text-base">Accept These Heartfelt Wishes</span>
                                <span className="text-lg md:text-xl">💫</span>
                            </span>
                        </button>
                    )}

                    <button
                        onClick={() => navigate(-1)}
                        className="group w-full max-w-md px-3 md:px-4 py-2 md:py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white/70 font-medium hover:bg-white/10 hover:text-white active:scale-95 transition-all duration-300 text-xs md:text-sm flex items-center justify-center gap-2 min-h-[36px]"
                    >
                        <span className="text-base">←</span>
                        <span>Back to Previous</span>
                    </button>
                </div>

                {/* Footer - Mobile Optimized */}
                <div className="mt-4 md:mt-6 text-center px-2">
                    <div className="inline-flex items-center gap-2 text-white/50 text-xs md:text-sm">
                        <span className="text-base">🐰</span>
                        <span className="font-light">Made with love for {userDetails.name}</span>
                        <span className="text-base">💖</span>
                    </div>
                </div>
            </div>

            {/* Mobile Responsive Styles */}
            <style jsx>{`
                :root {
                    --vh: 1vh;
                }
                
                .safe-area-padding {
                    padding-top: env(safe-area-inset-top);
                    padding-bottom: env(safe-area-inset-bottom);
                    padding-left: env(safe-area-inset-left);
                    padding-right: env(safe-area-inset-right);
                }
                
                .touch-manipulation {
                    touch-action: manipulation;
                }
                
                /* Rabbit animations */
                @keyframes hop {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-8px) rotate(3deg);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) scale(1);
                    }
                    50% {
                        transform: translateY(-10px) scale(1.05);
                    }
                }
                
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes float-symbol {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg) scale(1);
                        opacity: 0.1;
                    }
                    25% {
                        transform: translate(8px, -10px) rotate(90deg) scale(1.03);
                        opacity: 0.15;
                    }
                    50% {
                        transform: translate(0, -15px) rotate(180deg) scale(1);
                        opacity: 0.1;
                    }
                    75% {
                        transform: translate(-8px, -10px) rotate(270deg) scale(0.97);
                        opacity: 0.15;
                    }
                }
                
                .animate-hop {
                    animation: hop 2s ease-in-out infinite;
                }
                
                .animate-hop-delayed {
                    animation: hop 2s ease-in-out infinite 0.5s;
                }
                
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                
                .animate-float-delayed {
                    animation: float 4s ease-in-out infinite 1s;
                }
                
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                
                .animate-float-symbol {
                    animation: float-symbol ease-in-out infinite;
                }
                
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                
                /* Mobile optimizations */
                @media (max-width: 768px) {
                    .min-h-screen {
                        min-height: calc(var(--vh, 1vh) * 100);
                        overflow-y: auto;
                    }
                    
                    /* Fix for iOS Safari */
                    @supports (-webkit-touch-callout: none) {
                        .min-h-screen {
                            min-height: -webkit-fill-available;
                        }
                    }
                    
                    /* Better touch targets */
                    button {
                        min-height: 44px;
                    }
                    
                    /* Improve scrolling */
                    * {
                        -webkit-overflow-scrolling: touch;
                    }
                    
                    /* Smoother animations on mobile */
                    .animate-float-symbol {
                        animation-duration: 30s;
                    }
                    
                    /* Canvas visibility */
                    canvas {
                        opacity: 0.4;
                    }
                }
                
                /* Performance optimizations */
                canvas {
                    will-change: transform;
                }
            `}</style>
        </div>
    );
};

export default HappyWishes;