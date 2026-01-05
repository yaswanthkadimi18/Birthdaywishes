import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CelebrationPage = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [showConfetti, setShowConfetti] = useState(true);
    const [floatingEmojis, setFloatingEmojis] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isSmallMobile, setIsMobileSmall] = useState(window.innerWidth < 480);
    const [sparkleEffect, setSparkleEffect] = useState([]);
    const [messageIndex, setMessageIndex] = useState(0);

    const celebrationMessages = [
        "🎉 You've completed an amazing journey! May your birthday be as wonderful as you are! ✨",
        "🌟 Another year older, another year wiser! Wishing you endless joy and success! 🎂",
        "💫 Your journey through memories and dreams was beautiful! Now celebrate YOU! 🎊",
        "🎁 May all your wishes come true and this year bring you everything you dream of! ✨"
    ];

    const userEmojis = {
        anu: ['🎂', '🎀', '💖', '🌸', '🌟', '✨', '🎈', '🥳'],
        padma: ['🎉', '💐', '💝', '🌺', '⭐', '💫', '🎊', '🎇']
    };

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        const userName = localStorage.getItem('userName');
        const userNickname = localStorage.getItem('userNickname');

        if (user && userName) {
            setCurrentUser({
                id: user,
                name: userName,
                nickname: userNickname || userName
            });
        } else {
            navigate('/login');
        }

        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            const smallMobile = window.innerWidth < 480;
            setIsMobile(mobile);
            setIsMobileSmall(smallMobile);
        };

        window.addEventListener('resize', handleResize);

        // Create initial floating emojis
        const emojis = userEmojis[user] || userEmojis.anu;
        const initialEmojis = Array.from({ length: isMobile ? 8 : 12 }).map((_, i) => ({
            id: i,
            emoji: emojis[i % emojis.length],
            x: Math.random() * 100,
            y: Math.random() * 100,
            speed: 0.5 + Math.random() * 0.8,
            size: isMobile ? (15 + Math.random() * 10) : (20 + Math.random() * 15),
            rotation: Math.random() * 360,
            delay: Math.random() * 5
        }));
        setFloatingEmojis(initialEmojis);

        // Auto cycle through messages
        const messageTimer = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % celebrationMessages.length);
        }, 4000);

        // Add sparkle effects occasionally
        const sparkleTimer = setInterval(() => {
            if (Math.random() > 0.7) {
                setSparkleEffect(prev => [
                    ...prev.slice(-5),
                    {
                        id: Date.now(),
                        x: Math.random() * 100,
                        y: Math.random() * 100,
                        size: 10 + Math.random() * 20
                    }
                ]);
            }
        }, 800);

        const confettiTimer = setTimeout(() => setShowConfetti(false), 8000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(messageTimer);
            clearInterval(sparkleTimer);
            clearTimeout(confettiTimer);
        };
    }, [navigate, isMobile]);

    const handleRestart = () => {
        if (currentUser?.id) {
            localStorage.setItem(`completed_${currentUser.id}`, 'false');
            localStorage.setItem(`completed_balloons_${currentUser.id}`, 'false');
            localStorage.setItem(`completed_wishes_${currentUser.id}`, 'false');
            navigate('/questionnaire');
        }
    };

    const handleNewUser = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getUserColor = () => {
        return currentUser?.id === 'padma'
            ? 'linear-gradient(135deg, #9333ea, #ec4899, #6366f1)'
            : 'linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)';
    };

    const getUserTheme = () => {
        return currentUser?.id === 'padma'
            ? {
                bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                card: 'rgba(30, 27, 75, 0.8)',
                glow: '#a78bfa'
            }
            : {
                bg: 'linear-gradient(135deg, #500724 0%, #831843 100%)',
                card: 'rgba(80, 7, 36, 0.8)',
                glow: '#f472b6'
            };
    };

    const renderFloatingEmojis = () => {
        return floatingEmojis.map(emoji => (
            <div
                key={emoji.id}
                style={{
                    position: 'absolute',
                    left: `${emoji.x}%`,
                    top: `${emoji.y}%`,
                    fontSize: `${emoji.size}px`,
                    opacity: 0.7,
                    transform: `translate(-50%, -50%) rotate(${emoji.rotation}deg)`,
                    animation: `float ${6 + Math.random() * 4}s ease-in-out infinite ${emoji.delay}s, spin ${10 + Math.random() * 10}s linear infinite ${emoji.delay}s`,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                    zIndex: 1
                }}
            >
                {emoji.emoji}
            </div>
        ));
    };

    const renderSparkles = () => {
        return sparkleEffect.map(sparkle => (
            <div
                key={sparkle.id}
                style={{
                    position: 'absolute',
                    left: `${sparkle.x}%`,
                    top: `${sparkle.y}%`,
                    width: `${sparkle.size}px`,
                    height: `${sparkle.size}px`,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.9) 30%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'sparkle 1.5s ease-out forwards',
                    zIndex: 2
                }}
            />
        ));
    };

    const getFontSize = (desktop, tablet, mobile) => {
        if (isSmallMobile) return mobile;
        if (isMobile) return tablet;
        return desktop;
    };

    const theme = getUserTheme();

    return (
        <div style={{
            minHeight: '100vh',
            background: theme.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: getFontSize('30px', '20px', '15px'),
            fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background */}
            {renderFloatingEmojis()}
            {renderSparkles()}

            {/* Floating celebration text */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: getFontSize('24px', '20px', '18px'),
                color: 'rgba(255,255,255,0.15)',
                fontWeight: 'bold',
                animation: 'textFloat 15s ease-in-out infinite',
                zIndex: 1,
                whiteSpace: 'nowrap'
            }}>
                CELEBRATION TIME • BIRTHDAY BLISS • HAPPY DAY • JOY & LAUGHTER
            </div>

            {/* Confetti */}
            {showConfetti && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    zIndex: 2
                }}>
                    {[...Array(getFontSize(60, 40, 30))].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                width: getFontSize('12px', '10px', '8px'),
                                height: getFontSize('12px', '10px', '8px'),
                                background: ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#EF476F'][Math.floor(Math.random() * 6)],
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * -20}%`,
                                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                                animation: `confettiFall ${2 + Math.random() * 3}s linear forwards`,
                                animationDelay: `${Math.random() * 2}s`,
                                transform: `rotate(${Math.random() * 360}deg)`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Glow effects */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: getFontSize('500px', '400px', '300px'),
                height: getFontSize('500px', '400px', '300px'),
                background: `radial-gradient(circle, ${theme.glow}30 0%, transparent 70%)`,
                filter: 'blur(40px)',
                opacity: 0.6,
                zIndex: 1
            }} />

            {/* Main card */}
            <div style={{
                background: theme.card,
                backdropFilter: 'blur(20px)',
                borderRadius: getFontSize('30px', '25px', '20px'),
                padding: getFontSize('40px', '30px', '25px'),
                maxWidth: getFontSize('550px', '450px', '350px'),
                width: '100%',
                border: `2px solid rgba(255,255,255,0.15)`,
                boxShadow: `
                    0 25px 50px rgba(0,0,0,0.4),
                    0 0 60px ${theme.glow}40,
                    inset 0 1px 0 rgba(255,255,255,0.1)
                `,
                position: 'relative',
                zIndex: 10,
                textAlign: 'center',
                animation: 'cardAppear 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                overflow: 'hidden'
            }}>
                {/* Animated border */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: getUserColor(),
                    backgroundSize: '200% 100%',
                    animation: 'borderFlow 3s linear infinite'
                }} />

                {/* Celebration crown */}
                <div style={{
                    fontSize: getFontSize('70px', '50px', '40px'),
                    marginBottom: getFontSize('20px', '15px', '10px'),
                    animation: 'crownBounce 3s infinite',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
                }}>
                    👑
                </div>

                {/* Name with gradient */}
                <h1 style={{
                    color: 'white',
                    fontSize: getFontSize('36px', '28px', '24px'),
                    fontWeight: '800',
                    marginBottom: getFontSize('15px', '10px', '8px'),
                    background: getUserColor(),
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    letterSpacing: '0.5px',
                    animation: 'textGlow 2s ease-in-out infinite'
                }}>
                    🎊 {currentUser?.nickname || currentUser?.name || 'Friend'} 🎊
                </h1>

                <div style={{
                    fontSize: getFontSize('20px', '18px', '16px'),
                    color: 'rgba(255,255,255,0.7)',
                    marginBottom: getFontSize('25px', '20px', '15px'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                }}>
                    <span>✨</span>
                    Birthday Celebration Complete
                    <span>✨</span>
                </div>

                {/* Central cake animation */}
                <div style={{
                    fontSize: getFontSize('100px', '80px', '60px'),
                    margin: getFontSize('30px', '25px', '20px'),
                    animation: 'cakeFloat 4s ease-in-out infinite, cakeSparkle 2s infinite',
                    position: 'relative',
                    display: 'inline-block'
                }}>
                    🎂
                    <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        fontSize: getFontSize('30px', '25px', '20px'),
                        animation: 'twinkle 1.5s infinite'
                    }}>
                        ✨
                    </div>
                </div>

                {/* Rotating message display */}
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: getFontSize('15px', '12px', '10px'),
                    padding: getFontSize('20px', '18px', '16px'),
                    marginBottom: getFontSize('30px', '25px', '20px'),
                    border: '1px solid rgba(255,255,255,0.15)',
                    animation: 'messageFade 0.5s ease',
                    minHeight: getFontSize('100px', '90px', '80px'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: getFontSize('18px', '16px', '14px'),
                        lineHeight: '1.6',
                        margin: 0,
                        fontStyle: 'italic'
                    }}>
                        {celebrationMessages[messageIndex]}
                    </p>
                </div>

                {/* Decorative elements */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: getFontSize('20px', '15px', '10px'),
                    marginBottom: getFontSize('30px', '25px', '20px'),
                    flexWrap: 'wrap'
                }}>
                    {['🎉', '✨', '🎁', '🥳', '🎈', '💝'].map((emoji, index) => (
                        <div
                            key={index}
                            style={{
                                fontSize: getFontSize('30px', '25px', '20px'),
                                animation: `emojiFloat 3s ease-in-out infinite ${index * 0.2}s`,
                                opacity: 0.8
                            }}
                        >
                            {emoji}
                        </div>
                    ))}
                </div>

                {/* Action buttons */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: getFontSize('15px', '12px', '10px'),
                    marginTop: getFontSize('25px', '20px', '15px')
                }}>
                    <button
                        onClick={handleRestart}
                        style={{
                            padding: getFontSize('18px 32px', '16px 28px', '14px 24px'),
                            background: getUserColor(),
                            color: 'white',
                            border: 'none',
                            borderRadius: getFontSize('12px', '10px', '8px'),
                            fontSize: getFontSize('17px', '15px', '14px'),
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: `0 6px 20px ${theme.glow}50`,
                            letterSpacing: '0.5px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = `0 10px 25px ${theme.glow}70`;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = `0 6px 20px ${theme.glow}50`;
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            animation: 'shine 3s infinite'
                        }} />
                        <span style={{ fontSize: getFontSize('20px', '18px', '16px') }}>🔄</span>
                        Restart Journey
                    </button>

                    <button
                        onClick={handleNewUser}
                        style={{
                            padding: getFontSize('16px 28px', '14px 24px', '12px 20px'),
                            background: 'rgba(255,255,255,0.15)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            color: 'white',
                            borderRadius: getFontSize('12px', '10px', '8px'),
                            fontSize: getFontSize('16px', '14px', '13px'),
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.25)';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.15)';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        <span style={{ fontSize: getFontSize('18px', '16px', '14px') }}>👤</span>
                        New User Login
                    </button>

                    <button
                        onClick={handleLogout}
                        style={{
                            padding: getFontSize('16px 28px', '14px 24px', '12px 20px'),
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#fecaca',
                            borderRadius: getFontSize('12px', '10px', '8px'),
                            fontSize: getFontSize('16px', '14px', '13px'),
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        <span style={{ fontSize: getFontSize('18px', '16px', '14px') }}>🚪</span>
                        Logout
                    </button>
                </div>

                {/* Footer note */}
                <div style={{
                    marginTop: getFontSize('25px', '20px', '15px'),
                    paddingTop: getFontSize('15px', '12px', '10px'),
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <p style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: getFontSize('14px', '12px', '11px'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        flexWrap: 'wrap'
                    }}>
                        <span>🎯</span>
                        Made with ❤️ for your special day
                        <span>🎯</span>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes confettiFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }

                @keyframes float {
                    0%, 100% { 
                        transform: translate(-50%, -50%) rotate(0deg) translateY(0); 
                    }
                    50% { 
                        transform: translate(-50%, -50%) rotate(180deg) translateY(-20px); 
                    }
                }

                @keyframes spin {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }

                @keyframes sparkle {
                    0% { 
                        transform: scale(0) rotate(0deg); 
                        opacity: 0; 
                    }
                    50% { 
                        transform: scale(1) rotate(180deg); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: scale(0) rotate(360deg); 
                        opacity: 0; 
                    }
                }

                @keyframes textFloat {
                    0% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(-10px); }
                    100% { transform: translateX(-50%) translateY(0); }
                }

                @keyframes cardAppear {
                    0% { 
                        opacity: 0; 
                        transform: scale(0.8) rotate(-5deg); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: scale(1) rotate(0deg); 
                    }
                }

                @keyframes borderFlow {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 200% 0%; }
                }

                @keyframes crownBounce {
                    0%, 100% { 
                        transform: translateY(0) rotate(0deg); 
                    }
                    25% { 
                        transform: translateY(-15px) rotate(-5deg); 
                    }
                    50% { 
                        transform: translateY(0) rotate(0deg); 
                    }
                    75% { 
                        transform: translateY(-15px) rotate(5deg); 
                    }
                }

                @keyframes textGlow {
                    0%, 100% { 
                        filter: drop-shadow(0 0 10px transparent); 
                    }
                    50% { 
                        filter: drop-shadow(0 0 20px ${theme.glow}); 
                    }
                }

                @keyframes cakeFloat {
                    0%, 100% { 
                        transform: translateY(0) scale(1); 
                    }
                    50% { 
                        transform: translateY(-15px) scale(1.1); 
                    }
                }

                @keyframes cakeSparkle {
                    0%, 100% { 
                        filter: brightness(1) drop-shadow(0 0 0 transparent); 
                    }
                    50% { 
                        filter: brightness(1.2) drop-shadow(0 0 15px rgba(255,255,255,0.5)); 
                    }
                }

                @keyframes twinkle {
                    0%, 100% { 
                        opacity: 1; 
                        transform: scale(1); 
                    }
                    50% { 
                        opacity: 0.5; 
                        transform: scale(1.2); 
                    }
                }

                @keyframes emojiFloat {
                    0%, 100% { 
                        transform: translateY(0) rotate(0deg); 
                    }
                    50% { 
                        transform: translateY(-10px) rotate(10deg); 
                    }
                }

                @keyframes messageFade {
                    0% { 
                        opacity: 0; 
                        transform: translateY(10px); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }

                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }

                /* Mobile-specific optimizations */
                @media (max-width: 480px) {
                    button {
                        touch-action: manipulation;
                        min-height: 44px;
                    }
                    
                    h1 {
                        font-size: 22px !important;
                    }
                    
                    p {
                        font-size: 13px !important;
                    }
                }

                @media (hover: none) and (pointer: coarse) {
                    button {
                        font-size: 16px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default CelebrationPage;