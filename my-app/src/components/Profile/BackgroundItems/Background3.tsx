import React, { useEffect, useRef } from 'react';
import BackgroundItem from '../BackgroundItem/BackgroundItem';
import styles from './Background3.module.css';

const Background3: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // 캔버스 크기를 부모 요소에 맞추기
        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.offsetWidth;
                canvas.height = parent.offsetHeight;
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 별들의 정보를 저장할 배열
        const stars: { x: number; y: number; size: number; speed: number }[] = [];
        
        // 초기 별 생성
        for (let i = 0; i < 10; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1
            });
        }

        // 애니메이션 함수
        const animate = () => {
            ctx.fillStyle = 'rgba(10, 10, 40, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 별들 그리기
            stars.forEach(star => {
                ctx.beginPath();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();

                // 별들 움직임
                star.y += star.speed;
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <BackgroundItem 
            backgroundColor="#0a0a28"
            gradientColor="#1a1a4a"
            pattern="custom"
            opacity={1}
        >
            <div className={styles.background}>
                <canvas ref={canvasRef} className={styles.starCanvas} />
                <div className={styles.nebula} />
                <div className={styles.aurora} />
            </div>
        </BackgroundItem>
    );
};

export default Background3; 