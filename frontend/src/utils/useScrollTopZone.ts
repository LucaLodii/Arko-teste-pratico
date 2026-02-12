import { useState, useEffect } from 'react';

/**
 * Hook que monitora se o scroll está nos primeiros 100vh da página
 * @returns {boolean} true se está nos primeiros 100vh, false caso contrário
 */
export function useScrollTopZone(): boolean {
    const [isInTopZone, setIsInTopZone] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            // Pega a posição atual de scroll
            const scrollY = window.scrollY;

            // Calcula 100vh em pixels
            const viewportHeight = window.innerHeight;

            // Verifica se está dentro dos primeiros 100vh
            // Usa < ao invés de <= para desativar exatamente ao atingir 100vh
            setIsInTopZone(scrollY < viewportHeight);
        };

        // Verifica inicialmente
        handleScroll();

        // Adiciona o listener de scroll
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Remove o listener quando o componente desmontar
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return isInTopZone;
}
