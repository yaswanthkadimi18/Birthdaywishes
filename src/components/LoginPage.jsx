import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const BirthdayLogin = () => {
    const navigate = useNavigate();
    const [dateInput, setDateInput] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const rabbitsRef = useRef([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Define valid users with their birthdays and details
    const validUsers = [
        {
            id: 'padma',
            username: 'paddu',
            fullName: 'Padmavathi',
            birthday: '06/01',
            formattedBirthday: 'January 6th',
            nickname: 'Padhu'
        },
        {
            id: 'anu',
            username: 'Ammai',
            fullName: 'Anupama',
            birthday: '17/01',
            formattedBirthday: 'January 17th',
            nickname: 'Ammai'
        }
    ];

    useEffect(() => {
        // Check if user is already logged in
        const loggedInUser = localStorage.getItem('currentUser');
        const userName = localStorage.getItem('userName');

        if (loggedInUser && userName) {
            navigate('/questionnaire');
        }

        // Initialize rabbits
        initRabbits();
        animateRabbits();

        // Handle resize
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (canvasRef.current) {
                resizeCanvas();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [navigate]);

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const container = canvas.parentElement;
        if (!container) return;

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    };

    const initRabbits = () => {
        rabbitsRef.current = [];
        const rabbitCount = isMobile ? 3 : 5;

        for (let i = 0; i < rabbitCount; i++) {
            rabbitsRef.current.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.4,
                size: isMobile ? 25 : 35,
                emoji: '🐰',
                hopHeight: 0,
                hopDirection: 1,
                hopSpeed: 0.05 + Math.random() * 0.05,
                opacity: 0.7 + Math.random() * 0.3,
                wiggle: Math.random() * Math.PI * 2,
                wiggleSpeed: 0.02 + Math.random() * 0.03
            });
        }
    };

    const animateRabbits = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear with slight fade for trailing effect
        ctx.fillStyle = 'rgba(102, 126, 234, 0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        rabbitsRef.current.forEach(rabbit => {
            // Update position
            rabbit.x += rabbit.speedX;
            rabbit.y += rabbit.speedY;

            // Hop animation
            rabbit.hopHeight += rabbit.hopSpeed * rabbit.hopDirection;
            if (rabbit.hopHeight > 8) rabbit.hopDirection = -1;
            if (rabbit.hopHeight < 0) rabbit.hopDirection = 1;

            // Wiggle
            rabbit.wiggle += rabbit.wiggleSpeed;

            // Bounce off edges
            if (rabbit.x < 0 || rabbit.x > canvas.width) rabbit.speedX *= -1;
            if (rabbit.y < 0 || rabbit.y > canvas.height) rabbit.speedY *= -1;

            // Draw shadow
            ctx.save();
            ctx.globalAlpha = rabbit.opacity * 0.3;
            ctx.font = `bold ${rabbit.size}px Arial, sans-serif`;
            ctx.fillText('🐰', rabbit.x + 3, rabbit.y + rabbit.hopHeight + 3);
            ctx.restore();

            // Draw rabbit
            ctx.save();
            ctx.globalAlpha = rabbit.opacity;
            ctx.translate(rabbit.x, rabbit.y - rabbit.hopHeight);
            ctx.rotate(Math.sin(rabbit.wiggle) * 0.1);
            ctx.font = `bold ${rabbit.size}px Arial, sans-serif`;
            ctx.fillText('🐰', 0, 0);

            // Occasionally draw heart trail
            if (Math.random() > 0.98) {
                ctx.save();
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = '#ff6b6b';
                ctx.font = '16px Arial, sans-serif';
                ctx.fillText('💖', -15, -25);
                ctx.restore();
            }

            ctx.restore();
        });

        animationRef.current = requestAnimationFrame(animateRabbits);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation
        if (!dateInput.match(/^\d{2}\/\d{2}$/)) {
            setError('Please enter date in DD/MM format (e.g., 06/01)');
            setIsLoading(false);
            return;
        }

        const [day, month] = dateInput.split('/');
        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);

        if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) {
            setError('Please enter a valid date (DD/MM)');
            setIsLoading(false);
            return;
        }

        // Find user by birthday
        const user = validUsers.find(u => u.birthday === dateInput);

        if (!user) {
            setError('Invalid birth date. Please try 06/01 or 17/01');
            setIsLoading(false);
            return;
        }

        // Create floating particles effect on success
        createSuccessParticles();

        // Simulate API call delay
        setTimeout(() => {
            console.log('✅ Login successful for:', user.fullName);

            // Store user data in localStorage
            localStorage.setItem('currentUser', user.id);
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userName', user.fullName);
            localStorage.setItem('userFullName', user.fullName);
            localStorage.setItem('userNickname', user.nickname);
            localStorage.setItem('userBirthday', user.formattedBirthday);
            localStorage.setItem('username', user.username);

            // RESET ALL COMPLETION STATES FOR FRESH START
            localStorage.setItem(`completed_${user.id}`, 'false');
            localStorage.setItem(`completed_balloons_${user.id}`, 'false');
            localStorage.setItem(`completed_wishes_${user.id}`, 'false');

            setIsLoading(false);
            navigate('/questionnaire');
        }, 1200);
    };

    const createSuccessParticles = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;

                // Draw celebration particle
                ctx.save();
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = ['#ff6b6b', '#4ecdc4', '#ffd166', '#06d6a0'][Math.floor(Math.random() * 4)];
                ctx.beginPath();
                ctx.arc(x, y, Math.random() * 4 + 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }, i * 30);
        }
    };

    const handleClearStorage = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Animated Background Canvas */}
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

            {/* Floating decorative elements */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                fontSize: isMobile ? '24px' : '32px',
                opacity: 0.3,
                animation: 'float 6s ease-in-out infinite'
            }}>✨</div>

            <div style={{
                position: 'absolute',
                bottom: '15%',
                right: '10%',
                fontSize: isMobile ? '28px' : '40px',
                opacity: 0.2,
                animation: 'float 8s ease-in-out infinite 1s'
            }}>🎈</div>

            <div style={{
                position: 'absolute',
                top: '20%',
                right: '8%',
                fontSize: isMobile ? '20px' : '28px',
                opacity: 0.4,
                animation: 'float 7s ease-in-out infinite 0.5s'
            }}>🐰</div>

            <div style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: isMobile ? '25px 20px' : '30px',
                maxWidth: '400px',
                width: '100%',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                position: 'relative',
                zIndex: 10,
                animation: 'slideIn 0.6s ease-out'
            }}>
                <button
                    onClick={handleClearStorage}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'rgba(255,255,255,0.7)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                >
                    Reset
                </button>

                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <div style={{
                        width: isMobile ? '60px' : '70px',
                        height: isMobile ? '60px' : '70px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px',
                        fontSize: isMobile ? '28px' : '32px',
                        animation: 'pulse 2s infinite'
                    }}>
                        🎂
                    </div>
                    <h1 style={{
                        color: 'white',
                        margin: '0 0 8px 0',
                        fontSize: isMobile ? '22px' : '26px',
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        Birthday Portal
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.8)',
                        margin: '0 0 15px 0',
                        fontSize: isMobile ? '12px' : '13px'
                    }}>
                        Enter your birth date (DD/MM)
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                        <input
                            type="text"
                            value={dateInput}
                            onChange={(e) => {
                                let value = e.target.value.replace(/[^\d]/g, '');
                                if (value.length > 4) value = value.substring(0, 4);
                                if (value.length > 2) {
                                    value = value.substring(0, 2) + '/' + value.substring(2);
                                }
                                setDateInput(value);
                                setError('');
                            }}
                            placeholder="DD/MM"
                            maxLength="5"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: isMobile ? '12px' : '15px',
                                fontSize: isMobile ? '16px' : '18px',
                                textAlign: 'center',
                                borderRadius: '10px',
                                border: `2px solid ${error ? '#ff6b6b' : 'rgba(255,255,255,0.3)'}`,
                                background: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                outline: 'none',
                                fontFamily: 'monospace',
                                letterSpacing: '2px',
                                transition: 'all 0.3s',
                                boxShadow: error ? '0 0 0 2px rgba(255,107,107,0.2)' : 'none'
                            }}
                            onFocus={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
                            onBlur={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                        />
                        <div style={{
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: isMobile ? '16px' : '18px'
                        }}>
                            📅
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(255,107,107,0.2)',
                            color: '#ff6b6b',
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            textAlign: 'center',
                            fontSize: '13px',
                            border: '1px solid rgba(255,107,107,0.3)',
                            animation: 'shake 0.5s'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !dateInput}
                        style={{
                            width: '100%',
                            padding: isMobile ? '12px' : '15px',
                            background: isLoading ? '#8a63d2' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: isMobile ? '14px' : '16px',
                            fontWeight: 'bold',
                            cursor: (isLoading || !dateInput) ? 'not-allowed' : 'pointer',
                            opacity: (isLoading || !dateInput) ? 0.7 : 1,
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)',
                            transform: 'translateY(0)'
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading && dateInput) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(245, 87, 108, 0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(245, 87, 108, 0.3)';
                        }}
                        onMouseDown={(e) => {
                            if (!isLoading && dateInput) {
                                e.target.style.transform = 'translateY(1px)';
                            }
                        }}
                    >
                        {isLoading ? (
                            <>
                                <span style={{
                                    width: '18px',
                                    height: '18px',
                                    border: '2px solid white',
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></span>
                                Verifying...
                            </>
                        ) : (
                            <>
                                <span>🔓</span>
                                Enter Portal
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button
                        onClick={() => setShowGuide(!showGuide)}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'rgba(255,255,255,0.7)',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            margin: '5px 0',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                        {showGuide ? 'Hide Guide' : 'Need Help?'}
                    </button>

                    {showGuide && (
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '10px',
                            padding: '12px',
                            marginTop: '10px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            animation: 'fadeIn 0.3s'
                        }}>
                            <p style={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: '11px',
                                margin: '3px 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <span style={{ fontSize: '12px' }}>🐰</span>
                                <strong>For Padma:</strong> Enter <code>06/01</code>
                            </p>
                            <p style={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: '11px',
                                margin: '3px 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <span style={{ fontSize: '12px' }}>✨</span>
                                <strong>For Anupama:</strong> Enter <code>17/01</code>
                            </p>
                        </div>
                    )}

                    <p style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '10px',
                        margin: '12px 0 3px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                    }}>
                        <span>🐇</span>
                        A special birthday experience awaits
                        <span>✨</span>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(3deg); }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.9; }
                }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                ::placeholder {
                    color: rgba(255,255,255,0.3);
                }
                
                @media (max-width: 768px) {
                    div[style*="maxWidth: '400px'"] {
                        margin: 0 10px;
                    }
                    
                    canvas {
                        display: none; /* Hide canvas on mobile for better performance */
                    }
                }
                
                @media (max-width: 480px) {
                    div[style*="padding: '20px'"] {
                        padding: 15px;
                    }
                    
                    h1[style*="fontSize: '22px'"] {
                        font-size: 20px;
                    }
                    
                    button[style*="padding: '6px 12px'"] {
                        padding: 5px 10px;
                        font-size: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default BirthdayLogin;