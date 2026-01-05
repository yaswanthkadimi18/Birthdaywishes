import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BalloonBunchPage = () => {
    const navigate = useNavigate();
    const [poppedBalloons, setPoppedBalloons] = useState([]);
    const [showDate, setShowDate] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);
    const [currentUser, setCurrentUser] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [bounceEffect, setBounceEffect] = useState(false);
    const [nameParticles, setNameParticles] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        const userName = localStorage.getItem('userName');
        const userFullName = localStorage.getItem('userFullName') || localStorage.getItem('userName');
        const userBirthday = localStorage.getItem('userBirthday');

        if (user && userName) {
            setCurrentUser({
                id: user,
                name: userName,
                fullName: userFullName || userName,
                birthday: userBirthday
            });

            const completed = localStorage.getItem(`completed_balloons_${user}`);
            if (completed === 'true') {
                navigate('/wishes');
            }
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
        return () => window.removeEventListener('resize', handleResize);
    }, [navigate]);

    // User configurations
    const userConfigs = {
        anu: {
            name: 'ANUPAMA',
            fullName: 'Anupama',
            birthday: 'January 17th',
            balloonCount: 7
        },
        padma: {
            name: 'PADMA',
            fullName: 'Padma',
            birthday: 'January 6th',
            balloonCount: 7
        }
    };

    const userConfig = userConfigs[currentUser?.id] || userConfigs.anu;
    const { name, fullName, birthday, balloonCount } = userConfig;

    const balloonColors = [
        '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0',
        '#118AB2', '#EF476F', '#FF9A8B', '#8B5CF6',
        '#06D6D6', '#FF8E53', '#9D4EDD', '#FFB4A2'
    ];

    // Create balloon positions in a beautiful bunch
    const balloonPositions = Array.from({ length: balloonCount }, (_, i) => {
        // Arrange in a bouquet shape
        const angle = (i * 2 * Math.PI) / balloonCount;
        const spread = isSmallMobile ? 0.6 : (isMobile ? 0.7 : 0.8);
        const x = 50 + Math.cos(angle) * (isSmallMobile ? 12 : (isMobile ? 15 : 20)) * spread;
        const y = 50 + Math.sin(angle) * (isSmallMobile ? 15 : (isMobile ? 20 : 25)) * spread;

        return {
            id: i,
            x,
            y,
            color: balloonColors[i % balloonColors.length],
            size: isSmallMobile ? 30 + Math.random() * 15 : (isMobile ? 40 + Math.random() * 20 : 60 + Math.random() * 30),
            delay: i * 0.1,
            stringLength: isSmallMobile ? 30 + Math.random() * 20 : (isMobile ? 35 + Math.random() * 25 : 40 + Math.random() * 30),
            stringAngle: -10 + Math.random() * 20
        };
    });

    const createNameParticles = (balloonId) => {
        if (!currentUser?.fullName) return [];

        const nameToShow = currentUser.fullName.toUpperCase();
        const letters = nameToShow.split('');
        const balloon = balloonPositions.find(b => b.id === balloonId);
        if (!balloon) return [];

        // Calculate center position for name
        const totalWidth = letters.length * (isSmallMobile ? 16 : (isMobile ? 20 : 24)) +
            (letters.length - 1) * (isSmallMobile ? 8 : (isMobile ? 10 : 15));
        const startX = 50 - totalWidth / 100; // Convert to percentage

        return letters.map((letter, index) => ({
            id: `${balloonId}-${index}-${Date.now()}`,
            letter,
            startX: balloon.x,
            startY: balloon.y,
            targetX: startX + (index * (isSmallMobile ? 16 : (isMobile ? 20 : 24)) / 100 * 100),
            targetY: 15,
            size: isSmallMobile ? 16 : (isMobile ? 20 : 24),
            color: balloon.color,
            rotation: 0,
            scale: 1,
            opacity: 1,
            delay: index * 0.05
        }));
    };

    const handleBalloonClick = (balloonId) => {
        if (poppedBalloons.includes(balloonId) || showDate) return;

        setBounceEffect(true);
        setTimeout(() => setBounceEffect(false), 300);

        // Create name particles for this balloon
        const particles = createNameParticles(balloonId);
        setNameParticles(prev => [...prev, ...particles]);

        // Remove particles after animation
        setTimeout(() => {
            setNameParticles(prev => prev.filter(p => !p.id.startsWith(`${balloonId}-`)));
        }, 2000);

        setPoppedBalloons(prev => [...prev, balloonId]);

        // Play pop sound (simulated with animation)
        const balloonElement = document.querySelector(`[data-balloon-id="${balloonId}"]`);
        if (balloonElement) {
            balloonElement.style.animation = 'pop 0.3s ease-out forwards';
        }

        // Show confetti for each popped balloon
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 500);

        // If all balloons popped, show birthday
        if (poppedBalloons.length + 1 === balloonCount) {
            setTimeout(() => {
                setShowDate(true);
            }, 800);
        }
    };

    const handleProceed = () => {
        setIsExiting(true);
        if (currentUser?.id) {
            localStorage.setItem(`completed_balloons_${currentUser.id}`, 'true');
        }
        setTimeout(() => {
            navigate('/wishes');
        }, 1000);
    };

    const renderNameParticles = () => {
        return nameParticles.map((particle) => (
            <div
                key={particle.id}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 1000
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: `${particle.startY}%`,
                        left: `${particle.startX}%`,
                        fontSize: `${particle.size}px`,
                        fontWeight: 'bold',
                        color: particle.color,
                        opacity: particle.opacity,
                        transform: `translate(-50%, -50%)`,
                        animation: `nameFly 1.5s cubic-bezier(0.4, 0, 0.2, 1) ${particle.delay}s forwards`,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        willChange: 'transform, opacity'
                    }}
                >
                    {particle.letter}
                </div>
            </div>
        ));
    };

    // Display user name at the top when balloons are popped
    const renderUserNameDisplay = () => {
        if (poppedBalloons.length === 0) return null;

        // Calculate how many letters to show based on popped balloons
        const showFullName = poppedBalloons.length >= Math.ceil(balloonCount / 2);
        const nameToShow = showFullName ? currentUser.fullName :
            currentUser.fullName.substring(0, Math.min(poppedBalloons.length, currentUser.fullName.length));

        return (
            <div style={{
                position: 'fixed',
                top: isSmallMobile ? '15%' : (isMobile ? '12%' : '10%'),
                left: 0,
                right: 0,
                textAlign: 'center',
                zIndex: 999,
                pointerEvents: 'none',
                animation: 'fadeInDown 0.5s ease'
            }}>
                <div style={{
                    display: 'inline-block',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: isSmallMobile ? '10px 20px' : (isMobile ? '12px 25px' : '15px 30px'),
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '2px solid rgba(236, 72, 153, 0.2)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        {nameToShow.split('').map((letter, index) => (
                            <span
                                key={index}
                                style={{
                                    fontSize: getFontSize('32px', '28px', '24px'),
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    animation: `letterReveal 0.3s ease ${index * 0.1}s forwards`,
                                    opacity: 0,
                                    transform: 'translateY(20px)'
                                }}
                            >
                                {letter}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderBalloons = () => {
        return balloonPositions.map((balloon) => {
            const isPopped = poppedBalloons.includes(balloon.id);

            return (
                <div
                    key={balloon.id}
                    data-balloon-id={balloon.id}
                    style={{
                        position: 'absolute',
                        left: `${balloon.x}%`,
                        top: `${balloon.y}%`,
                        transform: `translate(-50%, -50%) scale(${isPopped ? 0 : 1})`,
                        transition: 'transform 0.3s ease',
                        zIndex: isPopped ? 1 : 10,
                        opacity: isPopped ? 0 : 1,
                        pointerEvents: isPopped ? 'none' : 'auto',
                        cursor: 'pointer'
                    }}
                    onClick={() => handleBalloonClick(balloon.id)}
                >
                    {/* Balloon */}
                    <div
                        style={{
                            width: `${balloon.size}px`,
                            height: `${balloon.size * 1.2}px`,
                            background: `radial-gradient(circle at 30% 30%, ${balloon.color}, ${balloon.color}90)`,
                            borderRadius: '50%',
                            position: 'relative',
                            animation: `balloonFloat 3s ease-in-out infinite ${balloon.delay}s`,
                            boxShadow: 'inset -8px -8px 15px rgba(0,0,0,0.1), 4px 4px 10px rgba(0,0,0,0.15)',
                            border: '2px solid rgba(255,255,255,0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (!isPopped && !isSmallMobile) {
                                e.target.style.transform = 'scale(1.15)';
                                e.target.style.boxShadow = 'inset -8px -8px 15px rgba(0,0,0,0.1), 6px 6px 15px rgba(0,0,0,0.2)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isPopped && !isSmallMobile) {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = 'inset -8px -8px 15px rgba(0,0,0,0.1), 4px 4px 10px rgba(0,0,0,0.15)';
                            }
                        }}
                    >
                        {/* Balloon shine */}
                        <div style={{
                            position: 'absolute',
                            top: '15%',
                            left: '20%',
                            width: `${balloon.size * 0.15}px`,
                            height: `${balloon.size * 0.15}px`,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.6)',
                            filter: 'blur(4px)'
                        }}></div>
                    </div>

                    {/* Balloon string */}
                    <div style={{
                        position: 'absolute',
                        top: '95%',
                        left: '50%',
                        transform: `translateX(-50%) rotate(${balloon.stringAngle}deg)`,
                        width: '2px',
                        height: `${balloon.stringLength}px`,
                        background: 'linear-gradient(to bottom, #666, #999, transparent)',
                        transformOrigin: 'top center'
                    }}></div>
                </div>
            );
        });
    };

    const renderConfetti = () => {
        if (!showConfetti) return null;

        const confettiCount = isSmallMobile ? 8 : (isMobile ? 10 : 20);
        return Array.from({ length: confettiCount }).map((_, i) => (
            <div
                key={i}
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    fontSize: isSmallMobile ? '16px' : (isMobile ? '20px' : '25px'),
                    opacity: 0.8,
                    animation: `confettiFall 1s ease-out forwards ${i * 0.05}s`,
                    zIndex: 999,
                    pointerEvents: 'none'
                }}
            >
                {['✨', '🎉', '🎊', '💫', '⭐'][Math.floor(Math.random() * 5)]}
            </div>
        ));
    };

    const getTitleColor = () => {
        if (currentUser?.id === 'padma') {
            return 'linear-gradient(135deg, #9333ea, #ec4899, #6366f1)';
        }
        return 'linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)';
    };

    const getFontSize = (desktop, tablet, mobile) => {
        if (isSmallMobile) return mobile;
        if (isMobile) return tablet;
        return desktop;
    };

    if (!currentUser) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f3e8ff, #fce7f3, #e0f2fe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}>
                <div style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid #9333ea',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{
                        color: '#6b7280',
                        fontSize: getFontSize('18px', '16px', '14px')
                    }}>Preparing your birthday celebration... 🎈</p>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #fce7f3, #fef3c7, #d1fae5)',
                padding: isSmallMobile ? '15px 8px' : (isMobile ? '20px 12px' : '32px 16px'),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* User Name Display */}
            {renderUserNameDisplay()}

            {/* Name Particles */}
            {renderNameParticles()}

            {/* Confetti */}
            {renderConfetti()}

            {/* Background decorative elements */}
            <div style={{
                position: 'absolute',
                top: '5%',
                left: '5%',
                fontSize: getFontSize('40px', '30px', '25px'),
                opacity: 0.1,
                animation: 'float 8s ease-in-out infinite'
            }}>🎈</div>

            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '5%',
                fontSize: getFontSize('35px', '25px', '20px'),
                opacity: 0.1,
                animation: 'float 10s ease-in-out infinite 1s'
            }}>✨</div>

            {/* Main content */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '800px',
                textAlign: 'center',
                transition: 'all 0.7s ease',
                opacity: isExiting ? 0 : 1,
                transform: isExiting ? 'scale(0.9) translateY(40px)' : 'scale(1) translateY(0)'
            }}>
                {/* Header - Mobile Optimized */}
                <div style={{
                    marginBottom: getFontSize('50px', '30px', '20px'),
                    animation: bounceEffect ? 'bounce 0.3s ease' : 'none'
                }}>
                    <h1 style={{
                        fontSize: getFontSize('56px', '32px', '26px'),
                        fontWeight: 'bold',
                        marginBottom: getFontSize('20px', '12px', '8px'),
                        background: getTitleColor(),
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: getFontSize('15px', '10px', '8px'),
                        flexWrap: 'wrap'
                    }}>
                        <span>🎈</span>
                        Pop the Balloons!
                        <span>🎈</span>
                    </h1>
                    <p style={{
                        color: '#4b5563',
                        fontSize: getFontSize('22px', '16px', '14px'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        flexWrap: 'wrap'
                    }}>
                        <span>✨</span>
                        Click each balloon to reveal {currentUser.fullName}'s name!
                        <span>✨</span>
                    </p>
                </div>

                {/* Balloons Container - Mobile Optimized */}
                <div style={{
                    position: 'relative',
                    height: getFontSize('500px', '400px', '300px'),
                    marginBottom: getFontSize('40px', '25px', '20px'),
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    border: '2px dashed rgba(236, 72, 153, 0.2)',
                    overflow: 'hidden'
                }}>
                    {renderBalloons()}

                    {/* Bunch center */}
                    <div style={{
                        position: 'absolute',
                        top: '85%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: getFontSize('60px', '50px', '40px'),
                        height: getFontSize('60px', '50px', '40px'),
                        background: 'rgba(255,255,255,0.8)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: getFontSize('30px', '24px', '20px'),
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                        🎀
                    </div>

                    {/* Progress Indicator - Mobile Optimized */}
                    <div style={{
                        position: 'absolute',
                        bottom: '15px',
                        left: '0',
                        right: '0',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '0 10px'
                    }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: getFontSize('15px', '12px', '8px'),
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '50px',
                            padding: getFontSize('14px 28px', '10px 20px', '8px 16px'),
                            boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                            border: '2px solid rgba(236, 72, 153, 0.2)',
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}>
                            <span style={{
                                color: '#374151',
                                fontWeight: '600',
                                fontSize: getFontSize('17px', '14px', '12px'),
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>🎈</span>
                                {poppedBalloons.length} of {balloonCount} popped
                                <span>✨</span>
                            </span>
                            <div style={{
                                display: 'flex',
                                gap: '6px',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }}>
                                {Array.from({ length: balloonCount }).map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: getFontSize('10px', '8px', '6px'),
                                            height: getFontSize('10px', '8px', '6px'),
                                            borderRadius: '50%',
                                            background: i < poppedBalloons.length
                                                ? (i === poppedBalloons.length - 1 ? '#ec4899' : '#10b981')
                                                : '#d1d5db',
                                            transition: 'all 0.3s',
                                            transform: i < poppedBalloons.length ? 'scale(1.3)' : 'scale(1)'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Birthday Date Reveal - Mobile Optimized */}
                {showDate && (
                    <div style={{
                        marginBottom: getFontSize('40px', '25px', '20px'),
                        animation: 'dateReveal 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                        padding: '0 10px'
                    }}>
                        <div style={{
                            position: 'relative',
                            display: 'inline-block',
                            width: '100%'
                        }}>
                            <div style={{
                                position: 'absolute',
                                inset: '-15px',
                                background: 'linear-gradient(135deg, rgba(236,72,153,0.3), rgba(139,92,246,0.3), rgba(6,182,212,0.3))',
                                borderRadius: '25px',
                                filter: 'blur(25px)'
                            }}></div>
                            <div style={{
                                position: 'relative',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(249,250,251,0.95))',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '20px',
                                padding: getFontSize('40px', '25px', '20px'),
                                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                border: '2px solid rgba(255,255,255,0.6)',
                                overflow: 'hidden',
                                width: '100%'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: getFontSize('25px', '15px', '12px'),
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        fontSize: getFontSize('70px', '50px', '40px'),
                                        animation: 'bounce 2s infinite'
                                    }}>
                                        🎂
                                    </div>
                                    <h2 style={{
                                        fontSize: getFontSize('36px', '24px', '20px'),
                                        fontWeight: 'bold',
                                        color: '#1f2937',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: getFontSize('15px', '10px', '8px'),
                                        flexWrap: 'wrap',
                                        justifyContent: 'center'
                                    }}>
                                        <span>✨</span>
                                        Happy Birthday {fullName}!
                                        <span>✨</span>
                                    </h2>
                                    <div style={{
                                        fontSize: getFontSize('64px', '42px', '32px'),
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        animation: 'pulseSlow 2s ease-in-out infinite',
                                        padding: getFontSize('10px 25px', '8px 20px', '6px 16px'),
                                        borderRadius: '15px',
                                        border: '3px solid rgba(236, 72, 153, 0.2)',
                                        textAlign: 'center',
                                        wordWrap: 'break-word'
                                    }}>
                                        {birthday}
                                    </div>
                                    <p style={{
                                        color: '#6b7280',
                                        fontSize: getFontSize('20px', '16px', '14px'),
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: getFontSize('10px', '8px', '6px'),
                                        flexWrap: 'wrap',
                                        justifyContent: 'center'
                                    }}>
                                        <span>🎉</span>
                                        You popped all the balloons!
                                        <span>🎉</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button - Mobile Optimized */}
                <div style={{ padding: '0 10px' }}>
                    {!showDate ? (
                        <div style={{
                            animation: 'instructionBounce 2s ease-in-out infinite'
                        }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: getFontSize('12px', '10px', '8px'),
                                background: 'linear-gradient(135deg, rgba(251, 207, 232, 0.6), rgba(165, 243, 252, 0.6))',
                                borderRadius: '50px',
                                padding: getFontSize('18px 36px', '14px 24px', '12px 20px'),
                                border: '2px solid rgba(236, 72, 153, 0.3)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }}>
                                <span style={{ fontSize: getFontSize('28px', '24px', '20px') }}>🎯</span>
                                <span style={{
                                    color: '#374151',
                                    fontWeight: '600',
                                    fontSize: getFontSize('18px', '15px', '13px')
                                }}>
                                    Pop {balloonCount - poppedBalloons.length} more balloons
                                </span>
                                <span style={{ fontSize: getFontSize('28px', '24px', '20px') }}>🎈</span>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleProceed}
                            style={{
                                position: 'relative',
                                padding: getFontSize('24px 56px', '18px 32px', '16px 24px'),
                                background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '15px',
                                fontSize: getFontSize('26px', '18px', '16px'),
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.5s ease',
                                overflow: 'hidden',
                                boxShadow: '0 10px 40px rgba(139, 92, 246, 0.5)',
                                minHeight: getFontSize('60px', '50px', '44px'),
                                width: '100%',
                                maxWidth: '400px',
                                margin: '0 auto',
                                border: '3px solid rgba(255,255,255,0.3)',
                                animation: 'buttonEnter 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                            }}
                            onMouseEnter={(e) => {
                                if (!isSmallMobile) {
                                    e.target.style.transform = 'scale(1.05)';
                                    e.target.style.boxShadow = '0 15px 50px rgba(139, 92, 246, 0.6)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSmallMobile) {
                                    e.target.style.transform = 'scale(1)';
                                    e.target.style.boxShadow = '0 10px 40px rgba(139, 92, 246, 0.5)';
                                }
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                transform: 'translateX(-200%)',
                                animation: 'shimmer 2s infinite'
                            }}></div>
                            <span style={{
                                position: 'relative',
                                zIndex: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: getFontSize('20px', '12px', '10px')
                            }}>
                                <span style={{ fontSize: getFontSize('28px', '24px', '20px') }}>🎁</span>
                                <span>Open Birthday Wishes</span>
                                <span style={{ fontSize: getFontSize('28px', '24px', '20px') }}>💌</span>
                            </span>
                        </button>
                    )}
                </div>

                {/* Footer - Mobile Optimized */}
                <div style={{
                    marginTop: getFontSize('35px', '25px', '20px'),
                    padding: '0 10px'
                }}>
                    <p style={{
                        color: '#6b7280',
                        fontSize: getFontSize('14px', '12px', '11px'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: 0.8,
                        flexWrap: 'wrap'
                    }}>
                        <span>✨</span>
                        Made with love for your special day
                        <span>✨</span>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes balloonFloat {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-15px) rotate(3deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(-10px) rotate(-3deg); }
                }
                
                @keyframes pop {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                    100% { transform: scale(0); opacity: 0; }
                }
                
                @keyframes dateReveal {
                    0% { opacity: 0; transform: translateY(30px) scale(0.9); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                
                @keyframes buttonEnter {
                    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                
                @keyframes instructionBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                
                @keyframes pulseSlow {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.9; transform: scale(1.05); }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-200%); }
                    100% { transform: translateX(200%); }
                }
                
                @keyframes confettiFall {
                    0% { 
                        transform: translate(-50%, -50%) rotate(0deg) scale(0.5); 
                        opacity: 0; 
                    }
                    10% { 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translate(calc(-50% + ${Math.random() * 200 - 100}px), calc(-50% + 200px)) 
                                   rotate(${Math.random() * 360}deg) 
                                   scale(${0.2 + Math.random() * 0.8}); 
                        opacity: 0; 
                    }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                
                /* Name blast animation */
                @keyframes nameFly {
                    0% {
                        top: var(--start-y, 50%);
                        left: var(--start-x, 50%);
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.1);
                    }
                    10% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1.2);
                    }
                    20% {
                        transform: translate(-50%, -50%) scale(1);
                    }
                    100% {
                        top: var(--target-y, 15%);
                        left: var(--target-x, 50%);
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
                
                @keyframes fadeInDown {
                    0% {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes letterReveal {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                /* Mobile-specific optimizations */
                @media (max-width: 480px) {
                    button {
                        touch-action: manipulation;
                    }
                    
                    /* Ensure buttons are large enough for touch */
                    button[style*="padding"] {
                        min-height: 44px;
                    }
                    
                    /* Adjust balloon container for small screens */
                    div[style*="height: '300px'"] {
                        height: 280px;
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

export default BalloonBunchPage;