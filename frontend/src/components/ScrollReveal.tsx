import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  baseColor?: string;
  revealColor?: string;
}

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
  baseColor = 'rgba(41, 41, 41, 0.25)',
  revealColor = '#292929'
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const scrollerElement = scrollContainerRef?.current || window;

    // Rotation animation for container
    gsap.fromTo(
      containerRef.current,
      { rotateX: baseRotation },
      {
        rotateX: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          scroller: scrollerElement === window ? undefined : scrollerElement,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true
        }
      }
    );

    // Split text into words and animate
    const text = textRef.current.innerText;
    const words = text.split(' ');
    textRef.current.innerHTML = words
      .map(word => `<span class="word" style="color: ${baseColor}">${word}</span>`)
      .join(' ');

    const wordElements = textRef.current.querySelectorAll('.word');

    wordElements.forEach((word) => {
      gsap.fromTo(
        word,
        {
          opacity: baseOpacity,
          filter: enableBlur ? `blur(${blurStrength}px)` : 'blur(0px)',
          color: baseColor
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          color: revealColor,
          ease: 'none',
          scrollTrigger: {
            trigger: word,
            scroller: scrollerElement === window ? undefined : scrollerElement,
            start: 'top 85%',
            end: 'top 50%',
            scrub: true,
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseOpacity, baseRotation, blurStrength, rotationEnd, wordAnimationEnd, baseColor, revealColor]);

  // Get the text content from children
  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getTextContent).join('');
    if (node && typeof node === 'object' && 'props' in node) {
      const element = node as { props?: { children?: React.ReactNode } };
      return getTextContent(element.props?.children);
    }
    return '';
  };

  const textContent = getTextContent(children);

  return (
    <div 
      ref={containerRef} 
      className={`scroll-reveal-container ${containerClassName}`}
      style={{ perspective: '1000px' }}
    >
      <p ref={textRef} className={`scroll-reveal-text ${textClassName}`}>
        {textContent}
      </p>
    </div>
  );
};

export default ScrollReveal;
