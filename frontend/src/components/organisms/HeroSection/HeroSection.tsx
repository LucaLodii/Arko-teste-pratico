import { Icon } from '../../atoms';
import AntigravityWrapper from '../AntigravityWrapper';

/**
 * Hero section - fullscreen landing with centered logo, title, and tagline
 */
export function HeroSection() {
    return (
        <section className="flex min-h-screen items-start justify-center px-4 pt-32 md:pt-40 relative z-10 overflow-hidden">
            <AntigravityWrapper />
            <div className="text-center relative z-20">
                {/* Logo + Title (same style as header but larger) */}
                <div className="mb-8 flex items-center justify-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-sage-100">
                        <Icon name="logo" size="xl" className="text-sage-600" />
                    </div>
                    <h1 className="font-['Questrial',sans-serif] text-4xl font-bold text-olive-900 md:text-5xl">
                        CarCalc
                    </h1>
                </div>

                {/* Large tagline */}
                <h2 className="mx-auto max-w-4xl font-['Questrial',sans-serif] text-5xl font-bold leading-tight text-gray-900 md:text-6xl lg:text-7xl">
                    Descubra a melhor forma de adquirir seu veículo
                </h2>

                {/* Subtitle */}
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
                    Compare custos reais entre compra, financiamento e aluguel de forma inteligente
                </p>
            </div>
        </section>
    );
}
