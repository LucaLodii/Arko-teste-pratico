import { useState, useEffect, useRef } from 'react';
import { Icon } from '../../atoms';

/**
 * Minimalist white header with logo, title, and navigation links.
 * Hides on scroll down, reappears on scroll up or when near top.
 * Each nav button scrolls to its corresponding floor/section.
 */
export function Header() {
  const [isVisible, setIsVisible] = useState(true);


  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToPageEnd = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };
  const lastScrollY = useRef(0);
  const threshold = 80;

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current < threshold) {
        setIsVisible(true);
      } else if (current > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-[#FFFFFF] transition-transform duration-300 ease-out ${!isVisible ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="mx-auto max-w-[1200px] pl-4 pr-0 font-['Inter',sans-serif] md:pl-8 md:pr-2">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-500 text-white">
              <Icon name="logo" size="2xl" />
            </div>
            <h1 className="ml-3 font-['Questrial',sans-serif] text-xl font-bold text-olive-900 md:text-2xl">
              CarCalc
            </h1>
          </div>

          {/* Center/Right: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              type="button"
              onClick={() => scrollToSection('calculadora')}
              className="text-[17px] font-medium text-[#45474D] hover:text-olive-900 transition-colors py-1.5 pl-4 pr-2"
            >
              Calculadora
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('results')}
              className="text-[17px] font-medium text-[#45474D] hover:text-olive-900 transition-colors py-1.5 pl-4 pr-2"
            >
              Resultados
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('como-calculamos')}
              className="text-[17px] font-medium text-[#45474D] hover:text-olive-900 transition-colors py-1.5 pl-4 pr-2"
            >
              Como Calculamos
            </button>
            <button
              type="button"
              onClick={scrollToPageEnd}
              className="text-[17px] font-medium text-[#45474D] hover:text-olive-900 transition-colors py-1.5 pl-4 pr-2"
            >
              Sobre
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
