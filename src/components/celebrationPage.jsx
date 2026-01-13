import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const CelebrationPage = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [showTitle, setShowTitle] = useState(false);
    const [letters, setLetters] = useState([]);
    const [letterAnimations, setLetterAnimations] = useState({});
    const [showSubtitle, setShowSubtitle] = useState(false);
    const [showHugAnimation, setShowHugAnimation] = useState(false);
    const [showHearts, setShowHearts] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);
    const [showConfetti, setShowConfetti] = useState(true);
    const [sparkleEffect, setSparkleEffect] = useState([]);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [titleGlow, setTitleGlow] = useState(false);

    const audioRef = useRef(null);
    const animationCompletedRef = useRef(false);
    const titleContainerRef = useRef(null);
    const lettersDisplayedRef = useRef(false);

    // Memoize getResponsiveSize with useCallback
    const getResponsiveSize = useCallback((mobile, tablet, desktop) => {
        if (isSmallMobile) return mobile;
        if (isMobile) return tablet;
        return desktop;
    }, [isMobile, isSmallMobile]);

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
            setIsSmallMobile(smallMobile);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        if (animationCompletedRef.current) return;

        // Start title animation sequence
        setTimeout(() => setShowTitle(true), 300);

        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play()
                    .then(() => setIsMusicPlaying(true))
                    .catch(e => console.log("Autoplay prevented:", e));
            }
        }, 800);

        // Define AMMAI letters with their properties
        const titleLetters = [
            { letter: 'A', id: 'letter-A', delay: 0, color: '#FF6B8B' },
            { letter: 'M', id: 'letter-M1', delay: 400, color: '#FF9EC0' },
            { letter: 'M', id: 'letter-M2', delay: 800, color: '#FFB3C1' },
            { letter: 'A', id: 'letter-A2', delay: 1200, color: '#FF8E9E' },
            { letter: 'I', id: 'letter-I', delay: 1600, color: '#FF6B6B' }
        ];

        // Clear any existing letters
        setLetters([]);

        // Start the AMMAI letter animation sequence
        titleLetters.forEach((item) => {
            setTimeout(() => {
                setLetters(prev => {
                    // Check if letter already exists to prevent duplicates
                    const exists = prev.find(l => l.id === item.id);
                    if (exists) return prev;
                    return [...prev, item];
                });

                // Mark this letter as animated
                setLetterAnimations(prev => ({
                    ...prev,
                    [item.id]: true
                }));

                // If this is the last letter, start other animations
                if (item.id === 'letter-I') {
                    setTimeout(() => {
                        setTitleGlow(true);
                        setTimeout(() => setShowSubtitle(true), 500);
                        setTimeout(() => setShowHugAnimation(true), 1000);
                        setTimeout(() => setShowMessage(true), 2000);
                        animationCompletedRef.current = true;
                    }, 800);
                }
            }, item.delay);
        });

        // Create floating hearts
        const heartInterval = setInterval(() => {
            setShowHearts(prev => {
                const newHeart = {
                    id: Date.now(),
                    x: Math.random() * 100,
                    y: 110,
                    size: (isSmallMobile ? 10 : isMobile ? 15 : 20) + Math.random() * (isSmallMobile ? 15 : isMobile ? 20 : 25),
                    speed: 1 + Math.random() * 2,
                    type: Math.random() > 0.5 ? '❤️' : '💖'
                };

                // Keep only last 15 hearts
                const updatedHearts = [...prev, newHeart];
                if (updatedHearts.length > 15) {
                    return updatedHearts.slice(-15);
                }
                return updatedHearts;
            });
        }, 700);

        // Add sparkle effects
        const sparkleTimer = setInterval(() => {
            if (Math.random() > 0.6) {
                setSparkleEffect(prev => {
                    const newSparkle = {
                        id: Date.now(),
                        x: Math.random() * 100,
                        y: Math.random() * 100,
                        size: 5 + Math.random() * 15
                    };

                    // Keep only last 10 sparkles
                    const updatedSparkles = [...prev, newSparkle];
                    if (updatedSparkles.length > 10) {
                        return updatedSparkles.slice(-10);
                    }
                    return updatedSparkles;
                });
            }
        }, 1000);

        const confettiTimer = setTimeout(() => setShowConfetti(false), 12000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(heartInterval);
            clearInterval(sparkleTimer);
            clearTimeout(confettiTimer);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [navigate]); // Removed getResponsiveSize from dependencies

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

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isMusicPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsMusicPlaying(!isMusicPlaying);
        }
    };

    const getUserColor = () => {
        return 'linear-gradient(135deg, #ff6b8b, #ff8e9e, #ffb3c1)';
    };

    const getLetterColor = (index) => {
        const colors = [
            'linear-gradient(135deg, #FF6B8B, #FF8E9E)',
            'linear-gradient(135deg, #FF9EC0, #FFB3C1)',
            'linear-gradient(135deg, #FFB3C1, #FFD6E7)',
            'linear-gradient(135deg, #FF8E9E, #FF9EC0)',
            'linear-gradient(135deg, #FF6B6B, #FF8E9E)'
        ];
        return colors[index % colors.length];
    };

    const renderHearts = () => {
        return showHearts.map(heart => (
            <div
                key={heart.id}
                className="floating-heart"
                style={{
                    position: 'absolute',
                    left: `${heart.x}%`,
                    top: `${heart.y}%`,
                    fontSize: `${heart.size}px`,
                    color: heart.type === '❤️' ? '#ff6b8b' : '#ff9ec0',
                    filter: 'drop-shadow(0 2px 4px rgba(255,107,139,0.4))',
                    animation: `heartFloat ${5 + Math.random() * 5}s ease-in forwards`,
                    zIndex: 1,
                    opacity: 0.9
                }}
            >
                {heart.type}
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

    const renderHugAnimation = () => {
        return (
            <div className="hug-container" style={{
                position: 'absolute',
                top: isMobile ? '45%' : '50%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(${isSmallMobile ? '0.5' : isMobile ? '0.7' : '1'})`,
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="hug-figure left" style={{
                    fontSize: getResponsiveSize('40px', '50px', '60px'),
                    animation: 'hugLeft 2s ease-in-out infinite',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}>
                    👧
                </div>
                <div className="hug-figure right" style={{
                    fontSize: getResponsiveSize('40px', '50px', '60px'),
                    animation: 'hugRight 2s ease-in-out infinite 0.5s',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                    marginLeft: isSmallMobile ? '-15px' : '-20px'
                }}>
                    👦
                </div>
                <div className="hug-hearts" style={{
                    position: 'absolute',
                    top: isSmallMobile ? '-10px' : '-20px',
                    animation: 'hugHearts 2s ease-in-out infinite'
                }}>
                    {['❤️', '💖', '💕'].map((heart, i) => (
                        <div key={i} style={{
                            fontSize: getResponsiveSize('12px', '15px', '20px'),
                            position: 'absolute',
                            animation: `heartPop 2s ease-in-out infinite ${i * 0.3}s`
                        }}>
                            {heart}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderAmamaiTitle = () => {
        // Define the correct order of letters
        const letterOrder = ['letter-A', 'letter-M1', 'letter-M2', 'letter-A2', 'letter-I'];

        // Sort letters based on the defined order
        const sortedLetters = [...letters].sort((a, b) => {
            return letterOrder.indexOf(a.id) - letterOrder.indexOf(b.id);
        });

        return (
            <div
                ref={titleContainerRef}
                style={{
                    marginBottom: getResponsiveSize('20px', '30px', '40px'),
                    position: 'relative',
                    minHeight: getResponsiveSize('100px', '120px', '180px'),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    padding: getResponsiveSize('10px', '15px', '20px')
                }}
            >
                {/* Glowing background effect for the entire title */}
                {titleGlow && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '120%',
                        height: '120%',
                        background: 'radial-gradient(circle, rgba(255,107,139,0.15) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                        animation: 'titleGlowPulse 2s ease-in-out infinite',
                        zIndex: -1
                    }} />
                )}

                {/* Letter container with better alignment */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: getResponsiveSize('8px', '12px', '20px'),
                    marginBottom: getResponsiveSize('15px', '20px', '30px'),
                    flexWrap: 'nowrap',
                    width: '100%',
                    position: 'relative',
                    zIndex: 5
                }}>
                    {sortedLetters.map((item, index) => (
                        <div
                            key={item.id}
                            className={`letter-container ${letterAnimations[item.id] ? 'animate' : ''}`}
                            style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: getResponsiveSize('50px', '70px', '90px'),
                                height: getResponsiveSize('60px', '80px', '100px')
                            }}
                        >
                            {/* Outer glow effect */}
                            {letterAnimations[item.id] && (
                                <div style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    background: item.color,
                                    borderRadius: '50%',
                                    filter: 'blur(15px)',
                                    opacity: 0.6,
                                    animation: 'letterGlow 1.5s ease-in-out infinite alternate',
                                    animationDelay: `${index * 0.2}s`,
                                    zIndex: 1
                                }} />
                            )}

                            {/* The letter */}
                            <div
                                className="letter"
                                style={{
                                    fontSize: getResponsiveSize('45px', '65px', '85px'),
                                    fontWeight: '900',
                                    background: getLetterColor(index),
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    animation: letterAnimations[item.id]
                                        ? `letterAppear 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, 
                                           letterFloat 3s ease-in-out infinite ${index * 0.2}s`
                                        : 'none',
                                    opacity: letterAnimations[item.id] ? 1 : 0,
                                    textShadow: '0 4px 20px rgba(0,0,0,0.4)',
                                    position: 'relative',
                                    zIndex: 2,
                                    lineHeight: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%'
                                }}
                            >
                                {item.letter}
                            </div>

                            {/* Little star decoration on some letters */}
                            {[0, 2, 4].includes(index) && letterAnimations[item.id] && (
                                <div style={{
                                    position: 'absolute',
                                    top: getResponsiveSize('-5px', '-8px', '-10px'),
                                    right: getResponsiveSize('-5px', '-8px', '-10px'),
                                    fontSize: getResponsiveSize('15px', '20px', '25px'),
                                    animation: 'starTwinkle 2s ease-in-out infinite',
                                    animationDelay: `${index * 0.3}s`,
                                    zIndex: 3
                                }}>
                                    ✨
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Subtitle with better animation */}
                {showSubtitle && (
                    <div style={{
                        animation: 'fadeInUp 0.8s ease forwards 0.5s',
                        opacity: 0,
                        marginTop: getResponsiveSize('5px', '10px', '15px'),
                        position: 'relative',
                        zIndex: 5
                    }}>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a0b2e 0%, #4a1e5e 50%, #8b2f6f 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: getResponsiveSize('15px', '20px', '40px'),
            fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
            position: 'relative',
            overflow: 'hidden',
            color: 'white'
        }}>
            {/* Hidden Audio Element */}
            <audio ref={audioRef} loop preload="auto" >
                <source src="https://assets.mixkit.co/music/preview/mixkit-romantic-sunset-687.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            {/* Music Control */}
            <button
                onClick={toggleMusic}
                style={{
                    position: 'fixed',
                    top: getResponsiveSize('15px', '20px', '20px'),
                    right: getResponsiveSize('15px', '20px', '20px'),
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    width: getResponsiveSize('40px', '45px', '50px'),
                    height: getResponsiveSize('40px', '45px', '50px'),
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 100,
                    backdropFilter: 'blur(10px)',
                    fontSize: getResponsiveSize('16px', '18px', '20px'),
                    transition: 'all 0.3s ease',
                    touchAction: 'manipulation'
                }}
                onMouseEnter={(e) => {
                    if (!isMobile) {
                        e.target.style.background = 'rgba(255,255,255,0.3)';
                        e.target.style.transform = 'scale(1.1)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isMobile) {
                        e.target.style.background = 'rgba(255,255,255,0.2)';
                        e.target.style.transform = 'scale(1)';
                    }
                }}
                onTouchStart={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.3)';
                    e.target.style.transform = 'scale(1.05)';
                }}
                onTouchEnd={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                    e.target.style.transform = 'scale(1)';
                }}
            >
                {isMusicPlaying ? '🔊' : '🔇'}
            </button>

            {/* Floating hearts background */}
            {renderHearts()}
            {renderSparkles()}

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
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="confetti"
                            style={{
                                position: 'absolute',
                                width: getResponsiveSize('6px', '8px', '10px'),
                                height: getResponsiveSize('6px', '8px', '10px'),
                                background: ['#FF6B6B', '#FF9EC0', '#FFD166', '#FFB3C1', '#FF8E9E', '#FF6B8B'][Math.floor(Math.random() * 6)],
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

            {/* Glow effect */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: getResponsiveSize('250px', '400px', '600px'),
                height: getResponsiveSize('250px', '400px', '600px'),
                background: 'radial-gradient(circle, rgba(255,107,139,0.3) 0%, transparent 70%)',
                filter: 'blur(60px)',
                opacity: 0.5,
                zIndex: 1
            }} />

            {/* Main content card */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: getResponsiveSize('20px', '25px', '30px'),
                padding: getResponsiveSize('20px', '25px', '40px'),
                maxWidth: getResponsiveSize('95%', '85%', '700px'),
                width: '100%',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: `
                    0 20px 40px rgba(0,0,0,0.3),
                    0 0 60px rgba(255,107,139,0.3),
                    inset 0 1px 0 rgba(255,255,255,0.1)
                `,
                position: 'relative',
                zIndex: 10,
                textAlign: 'center',
                overflow: 'hidden',
                minHeight: getResponsiveSize('500px', '550px', '600px'),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                margin: getResponsiveSize('10px', '15px', '0')
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

                {/* Title Card */}
                {showTitle && renderAmamaiTitle()}

                {/* Hug Animation */}
                {showHugAnimation && renderHugAnimation()}

                {/* Birthday Message */}
                {showMessage && (
                    <div style={{
                        animation: 'fadeInUp 1s ease forwards',
                        opacity: 0,
                        marginTop: getResponsiveSize('120px', '150px', '180px')
                    }}>
                        <div style={{
                            fontSize: getResponsiveSize('25px', '30px', '40px'),
                            marginBottom: getResponsiveSize('15px', '20px', '25px'),
                            animation: 'pulse 2s infinite'
                        }}>
                            🎂🎉✨
                        </div>

                        <h2 style={{
                            fontSize: getResponsiveSize('18px', '22px', '30px'),
                            marginBottom: getResponsiveSize('10px', '15px', '20px'),
                            background: getUserColor(),
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold',
                            letterSpacing: getResponsiveSize('0.5px', '0.8px', '1px'),
                            lineHeight: 1.3
                        }}>
                            Happy Birthday Ammai 💫
                        </h2>

                        <p style={{
                            fontSize: getResponsiveSize('14px', '16px', '18px'),
                            color: 'rgba(255,255,255,0.95)',
                            lineHeight: 1.5,
                            marginBottom: getResponsiveSize('20px', '25px', '30px'),
                            fontStyle: 'italic',
                            textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                        }}>
                            Mari cringe laga undhi kadha , edhi antha na burraki inthaku minchi idea yem thattaledhu special ga yem ivvala ani so andhukey idhi ,, future lo yepudaina kalisinapudu dhini girinchi matladukoni naccukovachu lee,,, as of now
                            Every moment with you is a celebration for me.So u have to be strong and successfull person.May this year bring you endless happiness, love, and beautiful memories.
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                {showMessage && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: getResponsiveSize('10px', '12px', '15px'),
                        marginTop: getResponsiveSize('25px', '30px', '40px'),
                        animation: 'fadeInUp 0.8s ease forwards'
                    }}>
                        <button
                            onClick={handleRestart}
                            style={{
                                padding: getResponsiveSize('12px 20px', '14px 24px', '16px 32px'),
                                background: getUserColor(),
                                color: 'white',
                                border: 'none',
                                borderRadius: getResponsiveSize('10px', '12px', '15px'),
                                fontSize: getResponsiveSize('14px', '15px', '18px'),
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: getResponsiveSize('8px', '10px', '12px'),
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 6px 15px rgba(255,107,139,0.3)',
                                letterSpacing: getResponsiveSize('0.5px', '0.8px', '1px'),
                                minHeight: getResponsiveSize('44px', '46px', '50px')
                            }}
                            onMouseEnter={(e) => {
                                if (!isMobile) {
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 10px 20px rgba(255,107,139,0.5)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isMobile) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 6px 15px rgba(255,107,139,0.3)';
                                }
                            }}
                            onTouchStart={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 18px rgba(255,107,139,0.4)';
                            }}
                            onTouchEnd={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 6px 15px rgba(255,107,139,0.3)';
                            }}
                        >
                            <span style={{ fontSize: getResponsiveSize('18px', '20px', '24px') }}>🔄</span>
                            Experience This Love Again
                        </button>

                        <div style={{
                            display: 'flex',
                            gap: getResponsiveSize('8px', '10px', '12px'),
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={handleNewUser}
                                style={{
                                    padding: getResponsiveSize('10px 16px', '12px 20px', '14px 24px'),
                                    background: 'rgba(255,255,255,0.15)',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    color: 'white',
                                    borderRadius: getResponsiveSize('10px', '12px', '12px'),
                                    fontSize: getResponsiveSize('12px', '14px', '16px'),
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    flex: 1,
                                    backdropFilter: 'blur(10px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: getResponsiveSize('6px', '8px', '8px'),
                                    minHeight: getResponsiveSize('40px', '42px', '44px')
                                }}
                                onMouseEnter={(e) => {
                                    if (!isMobile) {
                                        e.target.style.background = 'rgba(255,255,255,0.25)';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isMobile) {
                                        e.target.style.background = 'rgba(255,255,255,0.15)';
                                        e.target.style.transform = 'translateY(0)';
                                    }
                                }}
                                onTouchStart={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.25)';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onTouchEnd={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.15)';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                <span style={{ fontSize: getResponsiveSize('14px', '16px', '18px') }}>👤</span>
                                New User
                            </button>

                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: getResponsiveSize('10px 16px', '12px 20px', '14px 24px'),
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#fecaca',
                                    borderRadius: getResponsiveSize('10px', '12px', '12px'),
                                    fontSize: getResponsiveSize('12px', '14px', '16px'),
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    flex: 1,
                                    backdropFilter: 'blur(10px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: getResponsiveSize('6px', '8px', '8px'),
                                    minHeight: getResponsiveSize('40px', '42px', '44px')
                                }}
                                onMouseEnter={(e) => {
                                    if (!isMobile) {
                                        e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isMobile) {
                                        e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                                        e.target.style.transform = 'translateY(0)';
                                    }
                                }}
                                onTouchStart={(e) => {
                                    e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onTouchEnd={(e) => {
                                    e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                <span style={{ fontSize: getResponsiveSize('14px', '16px', '18px') }}>🚪</span>
                                Logout
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{
                    marginTop: getResponsiveSize('20px', '25px', '30px'),
                    paddingTop: getResponsiveSize('15px', '15px', '20px'),
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    animation: 'fadeIn 1s ease forwards',
                    opacity: showMessage ? 1 : 0
                }}>
                    <p style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: getResponsiveSize('11px', '12px', '14px'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: getResponsiveSize('6px', '8px', '10px'),
                        flexWrap: 'wrap',
                        lineHeight: 1.4
                    }}>
                        💝 Made with endless love for Ammai 💝
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

                @keyframes letterAppear {
                    0% {
                        opacity: 0;
                        transform: scale(0.1) translateY(50px) rotate(-30deg);
                        filter: blur(10px) brightness(0.5);
                    }
                    20% {
                        opacity: 0.3;
                        transform: scale(0.5) translateY(20px) rotate(-15deg);
                        filter: blur(5px) brightness(0.8);
                    }
                    50% {
                        opacity: 0.7;
                        transform: scale(1.2) translateY(-10px) rotate(0deg);
                        filter: blur(2px) brightness(1.2);
                    }
                    70% {
                        opacity: 1;
                        transform: scale(1.1) translateY(0) rotate(5deg);
                        filter: blur(0px) brightness(1.1);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0) rotate(0deg);
                        filter: blur(0px) brightness(1);
                    }
                }

                @keyframes letterFloat {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-10px) rotate(2deg);
                    }
                }

                @keyframes letterGlow {
                    0% {
                        opacity: 0.3;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 0.6;
                        transform: scale(1.2);
                    }
                }

                @keyframes fadeInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }

                @keyframes borderFlow {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 200% 0%; }
                }

                @keyframes heartFloat {
                    0% {
                        opacity: 0;
                        transform: translateY(0) scale(0) rotate(0deg);
                    }
                    10% {
                        opacity: 1;
                        transform: translateY(0) scale(1) rotate(0deg);
                    }
                    90% {
                        opacity: 0.8;
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-100vh) scale(0.5) rotate(360deg);
                    }
                }

                @keyframes hugLeft {
                    0%, 100% {
                        transform: translateX(0) rotate(0deg);
                    }
                    25% {
                        transform: translateX(15px) rotate(-5deg);
                    }
                    50% {
                        transform: translateX(25px) rotate(0deg);
                    }
                    75% {
                        transform: translateX(15px) rotate(5deg);
                    }
                }

                @keyframes hugRight {
                    0%, 100% {
                        transform: translateX(0) rotate(0deg);
                    }
                    25% {
                        transform: translateX(-15px) rotate(5deg);
                    }
                    50% {
                        transform: translateX(-25px) rotate(0deg);
                    }
                    75% {
                        transform: translateX(-15px) rotate(-5deg);
                    }
                }

                @keyframes hugHearts {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes heartPop {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.5);
                        opacity: 1;
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.8;
                    }
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

                @keyframes titleGlowPulse {
                    0%, 100% {
                        opacity: 0.1;
                    }
                    50% {
                        opacity: 0.25;
                    }
                }

                @keyframes subtitleGlow {
                    0%, 100% {
                        text-shadow: 0 2px 8px rgba(0,0,0,0.4);
                    }
                    50% {
                        text-shadow: 0 2px 15px rgba(255,107,139,0.6), 0 2px 8px rgba(0,0,0,0.4);
                    }
                }

                @keyframes starTwinkle {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(0.8) rotate(0deg);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.2) rotate(180deg);
                    }
                }

                .floating-heart {
                    will-change: transform, opacity;
                }

                .letter {
                    will-change: transform, opacity, filter;
                }

                /* Mobile-specific optimizations */
                @media (max-width: 768px) {
                    .letter {
                        font-size: 40px !important;
                        height: 55px !important;
                    }
                    
                    button {
                        min-height: 44px !important;
                        touch-action: manipulation;
                    }
                    
                    /* Prevent text selection on mobile */
                    * {
                        -webkit-tap-highlight-color: transparent;
                        -webkit-touch-callout: none;
                        user-select: none;
                    }
                    
                    /* Better scrolling */
                    html, body {
                        overflow-x: hidden;
                    }
                }

                @media (max-width: 480px) {
                    .letter {
                        font-size: 35px !important;
                        height: 45px !important;
                    }
                    
                    .hug-container {
                        top: 40% !important;
                    }
                }

                @media (max-width: 320px) {
                    .letter {
                        font-size: 30px !important;
                        height: 40px !important;
                    }
                    
                    button {
                        font-size: 13px !important;
                        padding: 10px 14px !important;
                    }
                }

                /* Tablet specific */
                @media (min-width: 769px) and (max-width: 1024px) {
                    .letter {
                        font-size: 70px !important;
                        height: 85px !important;
                    }
                    
                    .hug-container {
                        top: 48% !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default CelebrationPage;