import { useEffect, useState } from 'react';

interface Digit {
    id: number;
    x: number;
    y: number;
    speed: number;
    bright: boolean;
    value: number;
}

const MatrixRain = () => {
    const [digits, setDigits] = useState<Digit[]>([]);

    useEffect(() => {
        const createDigit = (x: number): Digit => ({
            id: Math.random(),
            x: Math.round(x), // Round x position to ensure straight lines
            y: Math.random() * -100, // Start above screen
            speed: 3 + Math.random() * 5, // Increased base speed and variation
            bright: Math.random() > 0.8,
            value: Math.floor(Math.random() * 10),
        });

        // Create initial digits
        const initDigits = () => {
            const newDigits = [];
            const numColumns = Math.floor(window.innerWidth / 20); // Space digits every 20px

            // Create multiple digits per column for fuller effect
            for (let i = 0; i < numColumns; i++) {
                for (let j = 0; j < 8; j++) { // Increased digits per column for denser rain
                    newDigits.push(createDigit(i * 20));
                }
            }
            return newDigits;
        };

        let digits = initDigits();
        setDigits(digits);

        let animationFrameId: number;
        let lastTime = 0;

        const animate = (currentTime: number) => {
            if (!lastTime) lastTime = currentTime;
            const deltaTime = currentTime - lastTime;

            if (deltaTime >= 16) { // Cap at roughly 60fps
                digits = digits.map(digit => {
                    const newY = digit.y + (digit.speed * deltaTime / 16);

                    if (newY > window.innerHeight) {
                        return {
                            ...createDigit(digit.x),
                            id: digit.id
                        };
                    }

                    return {
                        ...digit,
                        y: newY,
                        value: Math.random() > 0.95 ? Math.floor(Math.random() * 10) : digit.value // More frequent number changes
                    };
                });

                setDigits([...digits]);
                lastTime = currentTime;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        // Start the animation
        animationFrameId = requestAnimationFrame(animate);

        // Handle window resize
        const handleResize = () => {
            digits = initDigits();
            setDigits(digits);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {digits.map((digit) => (
                <div
                    key={digit.id}
                    className={`absolute matrix-digit ${digit.bright ? 'bright' : ''}`}
                    style={{
                        left: `${digit.x}px`,
                        top: `${digit.y}px`,
                        // Removed transition property for smoother movement
                    }}
                >
                    {digit.value}
                </div>
            ))}
        </div>
    );
};

export default MatrixRain;