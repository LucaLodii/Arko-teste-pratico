import Antigravity from '../../atoms/Antigravity';

export default function AntigravityWrapper() {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
            }}
        >
            <Antigravity
                count={300}
                magnetRadius={6}
                ringRadius={7}
                waveSpeed={0.4}
                waveAmplitude={1}
                particleSize={0.8}
                lerpSpeed={0.05}
                color="#687764"
                autoAnimate
                particleVariance={1}
                rotationSpeed={0}
                depthFactor={1}
                pulseSpeed={3}
                particleShape="capsule"
                fieldStrength={10}
            />
        </div>
    );
}
