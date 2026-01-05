import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AnimatedQuestionnaire = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState(['', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showEncouragement, setShowEncouragement] = useState(false);
    const [encouragementMessage, setEncouragementMessage] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const rabbitsRef = useRef([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);

    // Get user from localStorage
    const userId = localStorage.getItem('currentUser');
    const userName = localStorage.getItem('userName');
    const userNickname = localStorage.getItem('userNickname');

    // Fixed encouragement messages - simpler structure that works for all users
    const encouragements = [
        [
            "I understand how difficult that must have been for you. What's important is that every experience, even painful ones, teaches us valuable lessons. Take this as an opportunity to grow stronger and wiser. Remember, I'm here with you through this, and tough times don't last forever."
        ],
        [
            "Your happiness is a treasure! Keep those memories close to your heart like rabbits store their favorite carrots for winter...That's wonderful! Hold onto those happy memories—they're the jewels of life! Rabbits remember safe burrows and sunny meadows. 💎✨",
            "Pure joy! These moments are what make life truly beautiful. Keep smiling! Rabbits show joy with their happy hops. 😊",
        ],
        [
            "Your dreams have incredible power ✨ I wish that every dream you dare to dream comes true... Rabbits leap forward with faith!, Your hopes are the seeds of your future. Water them with action and watch them grow! Like rabbits preparing their burrow. 🌱",
            "Big dreams require big courage—and you've got it! The universe conspires to help dreamers. Rabbits trust their instincts. 🚀",
        ]
    ];

    const questions = [
        "What's the toughest and saddest thing that you've faced in your last birth year?",
        "What's your happiest memory from your last birth year that still makes you smile?",
        "What are your biggest dreams and goals for the upcoming birth year?"
    ];

    const stepColors = ['#3B82F6', '#10B981', '#8B5CF6'];
    const stepEmojis = ['🌧️', '🌈', '🚀'];
    const stepTitles = ['Reflect', 'Remember', 'Dream'];

    // Rabbit-themed messages for each step
    const rabbitMessages = [
        "🐰 Rabbits are resilient creatures. Like them, you'll bounce back stronger!",
        "🐇 Just like rabbits store happy memories in their burrows, treasure these moments in your heart!",
        "🐰 Rabbits leap forward with courage. May you do the same with your dreams!"
    ];

    // Additional decorative elements
    const decorativeElements = ['🥕', '🌸', '🌿', '⭐', '✨', '🎂', '🎈', '💫'];

    useEffect(() => {
        // Redirect if not logged in
        if (!userId || !userName) {
            navigate('/login');
            return;
        }

        // Check if user has already completed questionnaire
        const timer = setTimeout(() => {
            const completed = localStorage.getItem(`completed_${userId}`);
            if (completed === 'true') {
                navigate('/balloons');
            }
        }, 100);

        // Initialize canvas
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            initRabbits();
            animateRabbits();
        }

        // Handle resize
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            const smallMobile = window.innerWidth < 480;
            setIsMobile(mobile);
            setIsSmallMobile(smallMobile);

            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                initRabbits();
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timer);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [userId, userName, navigate]);

    const initRabbits = () => {
        rabbitsRef.current = [];
        const rabbitCount = isMobile ? (isSmallMobile ? 6 : 8) : 12;

        for (let i = 0; i < rabbitCount; i++) {
            const isSpecial = i % 3 === 0;
            rabbitsRef.current.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                speedX: (Math.random() - 0.5) * 0.6,
                speedY: (Math.random() - 0.5) * 0.4,
                size: isMobile ? (isSpecial ? (isSmallMobile ? 50 : 60) : (isSmallMobile ? 35 : 45)) : (isSpecial ? 80 : 65),
                emoji: isSpecial ? '🐇' : '🐰',
                hopHeight: 0,
                hopDirection: 1,
                hopSpeed: 0.04 + Math.random() * 0.06,
                opacity: 0.8 + Math.random() * 0.2,
                wiggle: Math.random() * Math.PI * 2,
                wiggleSpeed: 0.01 + Math.random() * 0.04,
                trail: [],
                maxTrail: isSpecial ? 15 : 8,
                color: stepColors[Math.floor(Math.random() * 3)],
                sparkle: isSpecial,
                sparkleTimer: 0,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.02
            });
        }
    };

    const animateRabbits = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear with gentle fade for trailing effect
        ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw floating carrots and flowers in background
        drawBackgroundElements(ctx);

        rabbitsRef.current.forEach(rabbit => {
            // Update position
            rabbit.x += rabbit.speedX;
            rabbit.y += rabbit.speedY;

            // Hop animation
            rabbit.hopHeight += rabbit.hopSpeed * rabbit.hopDirection;
            if (rabbit.hopHeight > 10) rabbit.hopDirection = -1;
            if (rabbit.hopHeight < 0) rabbit.hopDirection = 1;

            // Wiggle and rotation
            rabbit.wiggle += rabbit.wiggleSpeed;
            rabbit.rotation += rabbit.rotationSpeed;

            // Sparkle effect for special rabbits
            if (rabbit.sparkle) {
                rabbit.sparkleTimer += 0.1;
            }

            // Bounce off edges with slight randomness
            if (rabbit.x < 0 || rabbit.x > 100) {
                rabbit.speedX *= -1.1;
                rabbit.x = Math.max(0, Math.min(100, rabbit.x));
            }
            if (rabbit.y < 0 || rabbit.y > 100) {
                rabbit.speedY *= -1.1;
                rabbit.y = Math.max(0, Math.min(100, rabbit.y));
            }

            // Add to trail
            rabbit.trail.push({ x: rabbit.x, y: rabbit.y, opacity: rabbit.opacity });
            if (rabbit.trail.length > rabbit.maxTrail) {
                rabbit.trail.shift();
            }

            // Draw trail
            rabbit.trail.forEach((point, index) => {
                const alpha = (index / rabbit.maxTrail) * 0.3 * point.opacity;
                const size = rabbit.size * 0.6 * (index / rabbit.maxTrail);
                const x = (point.x / 100) * canvas.width;
                const y = (point.y / 100) * canvas.height;

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.font = `bold ${size}px Arial, sans-serif`;
                ctx.fillText('🐇', x, y);
                ctx.restore();
            });

            // Draw rabbit
            const x = (rabbit.x / 100) * canvas.width;
            const y = (rabbit.y / 100) * canvas.height;

            ctx.save();
            ctx.globalAlpha = rabbit.opacity;
            ctx.translate(x, y - rabbit.hopHeight);
            ctx.rotate(rabbit.rotation + Math.sin(rabbit.wiggle) * 0.15);

            // Draw rabbit with glow effect
            if (rabbit.sparkle && Math.sin(rabbit.sparkleTimer) > 0.8) {
                ctx.shadowColor = rabbit.color;
                ctx.shadowBlur = 15;
            }

            ctx.font = `bold ${rabbit.size}px Arial, sans-serif`;
            ctx.fillText(rabbit.emoji, 0, 0);
            ctx.restore();

            // Draw decorative elements occasionally
            if (Math.random() > 0.98) {
                const element = decorativeElements[Math.floor(Math.random() * decorativeElements.length)];
                ctx.save();
                ctx.globalAlpha = 0.7;
                ctx.font = isSmallMobile ? '18px' : '24px Arial, sans-serif';
                ctx.fillText(element, x + 40, y - rabbit.hopHeight - 30);
                ctx.restore();
            }

            // Draw dream clouds for step 3
            if (currentStep === 2 && Math.random() > 0.99) {
                ctx.save();
                ctx.globalAlpha = 0.6;
                ctx.font = isSmallMobile ? '20px' : '28px Arial, sans-serif';
                ctx.fillText('☁️', x - 50, y - rabbit.hopHeight - 40);
                ctx.restore();
            }
        });

        // Draw current step indicator in corner
        drawStepIndicator(ctx);

        animationRef.current = requestAnimationFrame(animateRabbits);
    };

    const drawBackgroundElements = (ctx) => {
        // Draw floating background elements
        const time = Date.now() / 1000;
        for (let i = 0; i < 5; i++) {
            const x = (Math.sin(time * 0.3 + i) * 50 + 50);
            const y = (Math.cos(time * 0.4 + i) * 50 + 50);
            const size = 20 + Math.sin(time + i) * 5;

            ctx.save();
            ctx.globalAlpha = 0.1;
            ctx.font = `${size}px Arial, sans-serif`;
            ctx.fillText('🥕', (x / 100) * canvasRef.current.width, (y / 100) * canvasRef.current.height);
            ctx.restore();
        }
    };

    const drawStepIndicator = (ctx) => {
        const canvas = canvasRef.current;
        const indicatorSize = isSmallMobile ? 30 : (isMobile ? 40 : 60);
        const x = canvas.width - indicatorSize - 10;
        const y = 10;

        ctx.save();

        // Draw background circle
        ctx.beginPath();
        ctx.arc(x + indicatorSize / 2, y + indicatorSize / 2, indicatorSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = stepColors[currentStep] + '30';
        ctx.fill();

        // Draw rabbit icon
        ctx.font = `bold ${indicatorSize}px Arial, sans-serif`;
        ctx.fillText('🐰', x, y + indicatorSize);

        // Draw step number
        ctx.fillStyle = 'white';
        ctx.font = `bold ${indicatorSize / 2}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${currentStep + 1}/3`, x + indicatorSize / 2, y + indicatorSize / 2);

        ctx.restore();
    };

    const handleAnswerChange = (value) => {
        const newAnswers = [...answers];
        newAnswers[currentStep] = value;
        setAnswers(newAnswers);
        setCharacterCount(value.length);
        setError('');
    };

    const handleSubmitAnswer = () => {
        if (!answers[currentStep].trim()) {
            setError('Please write your answer first');
            return;
        }

        if (answers[currentStep].length < 10) {
            setError('Please write at least 10 characters');
            return;
        }

        setIsLoading(true);
        setError('');

        // Show typing indicator animation
        setTimeout(() => {
            console.log(`💾 Saving answer for step ${currentStep + 1} for user: ${userName}`);

            // Get random encouragement message for current question - FIXED FOR ALL USERS
            const currentStepEncouragements = encouragements[currentStep];
            const randomEncouragement = currentStepEncouragements[Math.floor(Math.random() * currentStepEncouragements.length)];

            // Combine with rabbit message
            const combinedMessage = `${randomEncouragement}\n\n${rabbitMessages[currentStep]}`;

            // Show encouragement message
            setEncouragementMessage(combinedMessage);
            setShowEncouragement(true);

            // Create celebration effect
            createCelebrationRabbits();

            // Stop loading - wait for user to click "Next Question"
            setIsLoading(false);

        }, 1500);
    };

    // New function to handle moving to next question
    const handleNextQuestion = () => {
        if (currentStep < 2) {
            // Move to next question
            setCurrentStep(prev => prev + 1);
            setCharacterCount(0);
            setShowEncouragement(false);

            // Update rabbits for next step
            rabbitsRef.current.forEach(rabbit => {
                rabbit.size = isMobile ? (rabbit.id % 3 === 0 ? (isSmallMobile ? 50 : 60) : (isSmallMobile ? 35 : 45)) : (rabbit.id % 3 === 0 ? 80 : 65);
                rabbit.speedX = (Math.random() - 0.5) * 0.6;
                rabbit.speedY = (Math.random() - 0.5) * 0.4;
            });
        } else {
            // Mark as completed in localStorage
            const userId = localStorage.getItem('currentUser');
            localStorage.setItem(`completed_${userId}`, 'true');
            localStorage.setItem(`answers_${userId}`, JSON.stringify(answers));

            // Go to balloons
            console.log('🎉 All questions completed!');
            navigate('/balloons');
        }
    };

    const createCelebrationRabbits = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const celebrationRabbits = [];

        // Create celebration rabbits
        for (let i = 0; i < (isMobile ? 10 : 15); i++) {
            celebrationRabbits.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                size: 20 + Math.random() * 40,
                opacity: 0.9,
                life: 120,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                emoji: Math.random() > 0.5 ? '🐰' : '🐇',
                color: stepColors[Math.floor(Math.random() * 3)],
                trail: []
            });
        }

        // Animate celebration rabbits
        const animateCelebration = () => {
            celebrationRabbits.forEach(rabbit => {
                rabbit.x += rabbit.speedX;
                rabbit.y += rabbit.speedY;
                rabbit.rotation += rabbit.rotationSpeed;
                rabbit.life -= 1;
                rabbit.opacity = (rabbit.life / 120) * 0.9;

                // Add trail
                rabbit.trail.push({ x: rabbit.x, y: rabbit.y });
                if (rabbit.trail.length > 5) {
                    rabbit.trail.shift();
                }

                if (rabbit.life > 0) {
                    const x = (rabbit.x / 100) * canvas.width;
                    const y = (rabbit.y / 100) * canvas.height;

                    // Draw trail
                    rabbit.trail.forEach((point, index) => {
                        const trailX = (point.x / 100) * canvas.width;
                        const trailY = (point.y / 100) * canvas.height;
                        const trailAlpha = (index / 5) * 0.3 * rabbit.opacity;
                        const trailSize = rabbit.size * 0.7 * (index / 5);

                        ctx.save();
                        ctx.globalAlpha = trailAlpha;
                        ctx.font = `${trailSize}px Arial, sans-serif`;
                        ctx.fillText(rabbit.emoji, trailX, trailY);
                        ctx.restore();
                    });

                    // Draw rabbit
                    ctx.save();
                    ctx.globalAlpha = rabbit.opacity;
                    ctx.translate(x, y);
                    ctx.rotate(rabbit.rotation);
                    ctx.font = `bold ${rabbit.size}px Arial, sans-serif`;

                    // Add glow
                    ctx.shadowColor = rabbit.color;
                    ctx.shadowBlur = 15;

                    ctx.fillText(rabbit.emoji, 0, 0);
                    ctx.restore();

                    // Draw celebration emoji
                    if (Math.random() > 0.95) {
                        ctx.save();
                        ctx.globalAlpha = rabbit.opacity * 0.7;
                        ctx.font = isSmallMobile ? '16px' : '20px Arial, sans-serif';
                        ctx.fillText('🎉', x + 30, y - 30);
                        ctx.restore();
                    }
                }
            });

            // Remove dead rabbits
            for (let i = celebrationRabbits.length - 1; i >= 0; i--) {
                if (celebrationRabbits[i].life <= 0) {
                    celebrationRabbits.splice(i, 1);
                }
            }

            if (celebrationRabbits.length > 0) {
                requestAnimationFrame(animateCelebration);
            }
        };

        animateCelebration();
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleSkipQuestionnaire = () => {
        if (window.confirm('Skip to balloons?')) {
            localStorage.setItem(`completed_${userId}`, 'true');
            navigate('/balloons');
        }
    };

    // Mobile-responsive font sizes
    const getFontSize = (desktop, tablet, mobile) => {
        if (isSmallMobile) return mobile;
        if (isMobile) return tablet;
        return desktop;
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: isSmallMobile ? '10px' : (isMobile ? '15px' : '20px'),
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Animated Background Canvas with Rabbits */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none'
                }}
            />

            {/* Header - Mobile Optimized */}
            <div style={{
                display: 'flex',
                flexDirection: isSmallMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isSmallMobile ? 'stretch' : 'center',
                gap: isSmallMobile ? '15px' : '0',
                marginBottom: isSmallMobile ? '15px' : (isMobile ? '20px' : '25px'),
                position: 'relative',
                zIndex: 10,
                background: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: isSmallMobile ? '12px' : '15px 20px',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ textAlign: isSmallMobile ? 'center' : 'left' }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: getFontSize('28px', '22px', '20px'),
                        fontWeight: 'bold',
                        background: `linear-gradient(135deg, ${stepColors[currentStep]}, #ffffff)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isSmallMobile ? 'center' : 'flex-start',
                        gap: '10px',
                        flexWrap: 'wrap'
                    }}>
                        <span style={{ animation: 'hop 2s infinite' }}>🐰</span>
                        {isSmallMobile ? 'Rabbit Journey' : 'Rabbit Reflection Journey'}
                        <span style={{ animation: 'hop 2s infinite 0.5s' }}>📝</span>
                    </h1>
                    <p style={{
                        margin: '5px 0 0 0',
                        color: '#94a3b8',
                        fontSize: getFontSize('15px', '13px', '12px'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isSmallMobile ? 'center' : 'flex-start',
                        gap: '5px',
                        flexWrap: 'wrap'
                    }}>
                        <span>✨</span>
                        Welcome, {userNickname || userName}!
                        <span>✨</span>
                    </p>
                </div>

                {/* Action Buttons - Mobile Optimized */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: isSmallMobile ? 'center' : 'flex-end'
                }}>
                    {!isSmallMobile && (
                        <button
                            onClick={handleSkipQuestionnaire}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white',
                                padding: isSmallMobile ? '6px 10px' : '8px 15px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: getFontSize('14px', '12px', '11px'),
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                        >
                            <span style={{ animation: 'hop 1s infinite' }}>🐇</span>
                            Skip to Balloons
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'rgba(255,107,107,0.2)',
                            border: '1px solid rgba(255,107,107,0.3)',
                            color: '#ff6b6b',
                            padding: isSmallMobile ? '6px 10px' : '8px 15px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: getFontSize('14px', '12px', '11px'),
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,107,107,0.3)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,107,107,0.2)'}
                    >
                        <span>🚪</span>
                        Logout
                    </button>
                </div>
            </div>

            {/* Progress Steps - Mobile Optimized */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isSmallMobile ? '3px' : (isMobile ? '5px' : '10px'),
                marginBottom: isSmallMobile ? '20px' : (isMobile ? '25px' : '30px'),
                position: 'relative',
                zIndex: 10,
                padding: '0 5px'
            }}>
                {[0, 1, 2].map((step) => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <div style={{
                            width: getFontSize('60px', '50px', '40px'),
                            height: getFontSize('60px', '50px', '40px'),
                            borderRadius: '50%',
                            background: step <= currentStep
                                ? `linear-gradient(135deg, ${stepColors[step]}, ${stepColors[step]}90)`
                                : 'rgba(71, 85, 105, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: getFontSize('22px', '18px', '16px'),
                            boxShadow: step === currentStep
                                ? `0 0 30px ${stepColors[step]}, inset 0 2px 10px rgba(255,255,255,0.3)`
                                : '0 4px 15px rgba(0,0,0,0.3)',
                            transition: 'all 0.5s ease',
                            position: 'relative',
                            zIndex: 2,
                            animation: step === currentStep ? 'pulse 2s infinite' : 'none',
                            border: '2px solid rgba(255,255,255,0.3)',
                            color: 'white'
                        }}>
                            {step + 1}
                            {step === currentStep && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    width: getFontSize('24px', '20px', '18px'),
                                    height: getFontSize('24px', '20px', '18px'),
                                    borderRadius: '50%',
                                    background: stepColors[step],
                                    animation: 'ping 1.5s infinite',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: getFontSize('12px', '10px', '9px'),
                                    border: '2px solid white'
                                }}>
                                    🐰
                                </div>
                            )}
                        </div>
                        {step < 2 && (
                            <>
                                <div style={{
                                    width: getFontSize('60px', '40px', '30px'),
                                    height: '4px',
                                    background: step < currentStep
                                        ? `linear-gradient(90deg, ${stepColors[step]}, ${stepColors[step + 1]})`
                                        : 'rgba(71, 85, 105, 0.5)',
                                    margin: '0 5px',
                                    transition: 'all 0.5s ease',
                                    position: 'relative',
                                    borderRadius: '2px',
                                    overflow: 'hidden'
                                }}>
                                    {step < currentStep && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            height: '100%',
                                            width: '100%',
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                                            animation: 'shine 2s infinite'
                                        }} />
                                    )}
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: getFontSize('20px', '18px', '16px'),
                                    opacity: step < currentStep ? 1 : 0.3,
                                    animation: step < currentStep ? 'rabbitRun 1s infinite' : 'none',
                                    zIndex: 3
                                }}>
                                    🐇
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Question Card - Mobile Optimized - Only show when not showing encouragement */}
            {!showEncouragement && (
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
                    backdropFilter: 'blur(20px)',
                    borderRadius: getFontSize('25px', '20px', '18px'),
                    padding: isSmallMobile ? '20px 15px' : (isMobile ? '25px 20px' : '35px 30px'),
                    border: `2px solid ${stepColors[currentStep]}70`,
                    boxShadow: `0 20px 40px rgba(0,0,0,0.5), 
                               0 0 50px ${stepColors[currentStep]}40,
                               inset 0 1px 0 rgba(255,255,255,0.1)`,
                    position: 'relative',
                    zIndex: 10,
                    animation: 'slideUp 0.6s ease-out',
                    overflow: 'hidden'
                }}>
                    {/* Animated border */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: `linear-gradient(90deg, ${stepColors[currentStep]}, ${stepColors[(currentStep + 1) % 3]}, ${stepColors[currentStep]})`,
                        backgroundSize: '200% 100%',
                        animation: 'borderFlow 3s linear infinite'
                    }} />

                    {/* Step Indicator - Mobile Optimized */}
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: stepColors[currentStep],
                        color: 'white',
                        padding: isSmallMobile ? '4px 10px' : '6px 15px',
                        borderRadius: '20px',
                        fontSize: getFontSize('14px', '12px', '11px'),
                        fontWeight: 'bold',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: `0 4px 15px ${stepColors[currentStep]}50`
                    }}>
                        <span style={{ animation: 'spin 10s linear infinite', fontSize: getFontSize('14px', '12px', '11px') }}>🐇</span>
                        {stepTitles[currentStep]}
                    </div>

                    {/* Question - Mobile Optimized */}
                    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                        <div style={{
                            fontSize: getFontSize('70px', '50px', '40px'),
                            marginBottom: isSmallMobile ? '10px' : '15px',
                            animation: 'bounce 3s infinite',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: getFontSize('20px', '15px', '10px')
                        }}>
                            <span style={{ animation: 'float 4s infinite' }}>{stepEmojis[currentStep]}</span>
                            <span style={{
                                fontSize: getFontSize('40px', '30px', '25px'),
                                opacity: 0.7,
                                animation: 'hop 2s infinite 0.3s'
                            }}>🐰</span>
                            <span style={{ animation: 'float 4s infinite 0.5s' }}>{stepEmojis[(currentStep + 1) % 3]}</span>
                        </div>

                        <h2 style={{
                            fontSize: getFontSize('28px', '22px', '20px'),
                            fontWeight: 'bold',
                            marginBottom: isSmallMobile ? '10px' : '15px',
                            color: '#f1f5f9',
                            lineHeight: '1.4',
                            padding: '0 10px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}>
                            {questions[currentStep]}
                        </h2>

                        <p style={{
                            color: '#94a3b8',
                            fontSize: getFontSize('16px', '14px', '13px'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ animation: 'twinkle 1s infinite' }}>✨</span>
                            Share from your heart
                            <span style={{ animation: 'twinkle 1s infinite 0.5s' }}>✨</span>
                        </p>
                    </div>

                    {/* Textarea - Mobile Optimized */}
                    <div style={{ marginBottom: '25px', position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: '-12px',
                            left: '20px',
                            background: `linear-gradient(135deg, ${stepColors[currentStep]}, ${stepColors[currentStep]}90)`,
                            color: 'white',
                            padding: isSmallMobile ? '4px 12px' : '6px 20px',
                            borderRadius: '20px',
                            fontSize: getFontSize('14px', '12px', '11px'),
                            fontWeight: 'bold',
                            zIndex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: `0 4px 15px ${stepColors[currentStep]}50`
                        }}>
                            <span style={{ animation: 'typewriter 2s infinite', fontSize: getFontSize('16px', '14px', '12px') }}>✍️</span>
                            Your Rabbit Journal
                        </div>

                        <textarea
                            value={answers[currentStep]}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            placeholder={`Type your answer here... 🐰✨

Share your thoughts freely - this is your safe space.`}
                            rows={isSmallMobile ? 5 : 6}
                            style={{
                                width: '100%',
                                padding: isSmallMobile ? '15px' : '25px',
                                fontSize: getFontSize('18px', '16px', '16px'),
                                borderRadius: '15px',
                                background: 'rgba(15, 23, 42, 0.9)',
                                border: `2px solid ${error ? '#ef4444' : stepColors[currentStep] + '80'}`,
                                color: '#f1f5f9',
                                outline: 'none',
                                resize: 'vertical',
                                fontFamily: 'inherit',
                                transition: 'all 0.3s',
                                minHeight: isSmallMobile ? '120px' : '180px',
                                lineHeight: '1.6',
                                boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.2)'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = stepColors[currentStep];
                                e.target.style.boxShadow = `0 0 0 4px ${stepColors[currentStep]}40, inset 0 4px 20px rgba(0,0,0,0.3)`;
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = stepColors[currentStep] + '80';
                                e.target.style.boxShadow = 'inset 0 4px 20px rgba(0,0,0,0.2)';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        />

                        <div style={{
                            display: 'flex',
                            flexDirection: isSmallMobile ? 'column' : 'row',
                            justifyContent: 'space-between',
                            marginTop: '15px',
                            fontSize: getFontSize('15px', '13px', '12px'),
                            color: '#94a3b8',
                            alignItems: 'center',
                            gap: isSmallMobile ? '10px' : '0'
                        }}>
                            <span style={{
                                color: characterCount >= 10 ? '#10B981' : '#ef4444',
                                fontWeight: characterCount >= 10 ? 'bold' : 'normal',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '5px 15px',
                                background: characterCount >= 10 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '15px'
                            }}>
                                {characterCount >= 10 ? '✅' : '📝'}
                                {characterCount} characters
                                {characterCount >= 10 && <span style={{ animation: 'bounce 1s' }}>🐰</span>}
                            </span>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: isSmallMobile ? '5px 15px' : '0'
                            }}>
                                <span style={{ animation: 'pulse 2s infinite' }}>✨</span>
                                Minimum: <strong style={{ color: '#f1f5f9' }}>10</strong> characters
                            </span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#fecaca',
                            padding: '15px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            textAlign: 'center',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            animation: 'shake 0.5s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '15px',
                            fontSize: getFontSize('16px', '14px', '13px'),
                            backdropFilter: 'blur(10px)',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ fontSize: '24px', animation: 'bounce 1s infinite' }}>⚠️</span>
                            {error}
                            <span style={{ fontSize: '24px', animation: 'hop 1s infinite 0.5s' }}>🐰</span>
                        </div>
                    )}

                    {/* Submit Button - Mobile Optimized */}
                    <button
                        onClick={handleSubmitAnswer}
                        disabled={isLoading || answers[currentStep].length < 10}
                        style={{
                            width: '100%',
                            padding: isSmallMobile ? '14px' : (isMobile ? '18px' : '22px'),
                            background: isLoading
                                ? 'rgba(107, 114, 128, 0.5)'
                                : `linear-gradient(135deg, ${stepColors[currentStep]}, ${stepColors[(currentStep + 1) % 3]})`,
                            color: 'white',
                            border: 'none',
                            borderRadius: '15px',
                            fontSize: getFontSize('20px', '17px', '16px'),
                            fontWeight: 'bold',
                            cursor: (isLoading || answers[currentStep].length < 10) ? 'not-allowed' : 'pointer',
                            opacity: (isLoading || answers[currentStep].length < 10) ? 0.7 : 1,
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            boxShadow: `0 10px 30px ${stepColors[currentStep]}50`,
                            position: 'relative',
                            overflow: 'hidden',
                            letterSpacing: '0.5px'
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading && answers[currentStep].length >= 10) {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = `0 15px 35px ${stepColors[currentStep]}70`;
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = `0 10px 30px ${stepColors[currentStep]}50`;
                        }}
                    >
                        {/* Shine effect */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            animation: isLoading ? 'none' : 'shine 3s infinite'
                        }} />

                        {isLoading ? (
                            <>
                                <span style={{
                                    width: '24px',
                                    height: '24px',
                                    border: '3px solid white',
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></span>
                                <span>Rabbits are reading...</span>
                                <span style={{ animation: 'hop 1s infinite' }}>🐰</span>
                            </>
                        ) : currentStep < 2 ? (
                            <>
                                <span style={{ fontSize: getFontSize('26px', '22px', '20px'), animation: 'bounce 2s infinite' }}>🐇</span>
                                <span>Share with Me</span>
                                <span style={{ fontSize: getFontSize('26px', '22px', '20px'), animation: 'float 2s infinite' }}>→</span>
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: getFontSize('26px', '22px', '20px'), animation: 'pulse 2s infinite' }}>🎉</span>
                                <span>Complete Journey</span>
                                <span style={{ fontSize: getFontSize('26px', '22px', '20px'), animation: 'twinkle 1s infinite' }}>✨</span>
                            </>
                        )}
                    </button>

                    {/* Action Buttons - Mobile Optimized */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '15px',
                        marginTop: '20px',
                        flexWrap: 'wrap'
                    }}>
                        {isSmallMobile && (
                            <button
                                onClick={handleSkipQuestionnaire}
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white',
                                    padding: '8px 12px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    transition: 'all 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    flex: 1,
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                            >
                                <span style={{ animation: 'hop 1s infinite' }}>🐇</span>
                                Skip to Balloons
                            </button>
                        )}
                        <button
                            onClick={() => {
                                localStorage.removeItem(`completed_${userId}`);
                                window.location.reload();
                            }}
                            style={{
                                background: 'rgba(255,215,0,0.2)',
                                border: '1px solid rgba(255,215,0,0.3)',
                                color: '#FFD700',
                                padding: isSmallMobile ? '8px 12px' : '10px 20px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: getFontSize('14px', '12px', '12px'),
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                flex: isSmallMobile ? 1 : 'auto'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255,215,0,0.3)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(255,215,0,0.2)'}
                        >
                            <span>🔄</span>
                            Restart
                        </button>
                    </div>
                </div>
            )}

            {/* Encouragement Popup - FIXED: Won't disappear automatically */}
            {showEncouragement && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.95)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: isSmallMobile ? '10px' : '20px',
                    animation: 'fadeIn 0.4s'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
                        borderRadius: getFontSize('25px', '20px', '18px'),
                        padding: isSmallMobile ? '20px 15px' : (isMobile ? '30px 25px' : '40px 35px'),
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: isSmallMobile ? '90vh' : 'auto',
                        overflowY: 'auto',
                        border: `2px solid ${stepColors[currentStep]}`,
                        boxShadow: `0 30px 60px rgba(0,0,0,0.8), 
                                   0 0 80px ${stepColors[currentStep]}50,
                                   inset 0 1px 0 rgba(255,255,255,0.1)`,
                        textAlign: 'center',
                        animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        position: 'relative'
                    }}>
                        {/* Celebration Icon */}
                        <div style={{
                            width: getFontSize('100px', '80px', '60px'),
                            height: getFontSize('100px', '80px', '60px'),
                            background: `linear-gradient(135deg, ${stepColors[currentStep]}, ${stepColors[(currentStep + 1) % 3]})`,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            fontSize: getFontSize('50px', '40px', '30px'),
                            animation: 'pulse 2s infinite',
                            border: '4px solid rgba(255,255,255,0.3)',
                            boxShadow: `0 10px 30px ${stepColors[currentStep]}50`
                        }}>
                            {currentStep === 2 ? '🎊' : '✨'}
                        </div>

                        {/* Title */}
                        <h3 style={{
                            fontSize: getFontSize('32px', '26px', '22px'),
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            color: '#f1f5f9',
                            background: `linear-gradient(135deg, ${stepColors[currentStep]}, #ffffff)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}>
                            {currentStep === 2 ? 'Rabbit Celebration! 🎊' : 'Rabbit Message ✨'}
                        </h3>

                        {/* Encouragement Message */}
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: isSmallMobile ? '15px' : '20px',
                            borderRadius: '15px',
                            marginBottom: '25px',
                            fontSize: getFontSize('19px', '17px', '16px'),
                            lineHeight: '1.6',
                            color: '#e2e8f0',
                            textAlign: 'center',
                            border: '1px solid rgba(255,255,255,0.15)',
                            minHeight: isSmallMobile ? '120px' : '150px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'fadeInUp 0.6s',
                            backdropFilter: 'blur(10px)',
                            whiteSpace: 'pre-line'
                        }}>
                            {encouragementMessage}
                        </div>

                        {/* Next Button - User must click to continue */}
                        <button
                            onClick={handleNextQuestion}
                            style={{
                                padding: isSmallMobile ? '14px 25px' : (isMobile ? '16px 40px' : '18px 50px'),
                                background: `linear-gradient(135deg, ${stepColors[currentStep]}, ${stepColors[(currentStep + 1) % 3]})`,
                                color: 'white',
                                border: 'none',
                                borderRadius: '15px',
                                fontSize: getFontSize('20px', '17px', '16px'),
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: `0 10px 30px ${stepColors[currentStep]}50`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                margin: '0 auto',
                                width: isSmallMobile ? '100%' : 'auto',
                                minWidth: isSmallMobile ? 'auto' : '200px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = `0 15px 35px ${stepColors[currentStep]}70`;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = `0 10px 30px ${stepColors[currentStep]}50`;
                            }}
                        >
                            {currentStep === 2 ? (
                                <>
                                    <span style={{ fontSize: getFontSize('26px', '22px', '20px'), animation: 'float 2s infinite' }}>🎈</span>
                                    <span>Hop to Balloons!</span>
                                    <span style={{ fontSize: getFontSize('26px', '22px', '20px'), animation: 'hop 1s infinite' }}>🐰</span>
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: getFontSize('26px', '22px', '20px'), animation: 'bounce 2s infinite' }}>🐇</span>
                                    <span>Next Question</span>
                                    <span style={{ fontSize: getFontSize('26px', '22px', '20px'), animation: 'float 2s infinite' }}>→</span>
                                </>
                            )}
                        </button>

                        {/* Optional: Add a "Read more" button if message is long */}
                        {encouragementMessage.length > 200 && (
                            <p style={{
                                color: '#94a3b8',
                                fontSize: getFontSize('14px', '13px', '12px'),
                                marginTop: '15px',
                                fontStyle: 'italic',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}>
                                <span>📜</span>
                                Scroll to read the full message
                                <span>📜</span>
                            </p>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.9; }
                }
                
                @keyframes ping {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(3); opacity: 0; }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(50px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.8) rotate(-5deg); }
                    to { opacity: 1; transform: scale(1) rotate(0deg); }
                }
                
                @keyframes hop {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-10px) rotate(-5deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(-10px) rotate(5deg); }
                }
                
                @keyframes rabbitRun {
                    0% { transform: translateX(-20px) translateY(0); }
                    25% { transform: translateX(0) translateY(-5px); }
                    50% { transform: translateX(20px) translateY(0); }
                    75% { transform: translateX(0) translateY(-5px); }
                    100% { transform: translateX(-20px) translateY(0); }
                }
                
                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                
                @keyframes borderFlow {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 200% 0%; }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                @keyframes typewriter {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
                
                @keyframes confetti {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                
                textarea::placeholder {
                    color: #64748b;
                    font-style: italic;
                    font-size: 14px;
                }
                
                /* Mobile-specific optimizations */
                @media (max-width: 480px) {
                    button {
                        touch-action: manipulation;
                    }
                    
                    textarea {
                        font-size: 16px !important;
                    }
                    
                    .question-card {
                        margin: 0 5px !important;
                    }
                }
                
                /* Improve button tap targets on mobile */
                @media (hover: none) and (pointer: coarse) {
                    button, 
                    textarea,
                    input {
                        min-height: 44px;
                    }
                    
                    button {
                        font-size: 16px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AnimatedQuestionnaire;