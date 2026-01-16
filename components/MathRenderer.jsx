// components/MathRenderer.jsx
import { useEffect, useRef } from 'react';

// Simple KaTeX implementation without external dependencies
export default function MathRenderer({ children, inline = false }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current && children) {
      try {
        // Simple math rendering for common expressions
        const mathText = children.toString();
        
        // Basic LaTeX-like rendering
        let rendered = mathText
          .replace(/\^(\w+)/g, '<sup>$1</sup>')
          .replace(/_(\w+)/g, '<sub>$1</sub>')
          .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="fraction"><span class="numerator">$1</span><span class="denominator">$2</span></span>')
          .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
          .replace(/\\sum/g, '∑')
          .replace(/\\int/g, '∫')
          .replace(/\\alpha/g, 'α')
          .replace(/\\beta/g, 'β')
          .replace(/\\gamma/g, 'γ')
          .replace(/\\delta/g, 'δ')
          .replace(/\\pi/g, 'π')
          .replace(/\\theta/g, 'θ')
          .replace(/\\lambda/g, 'λ')
          .replace(/\\mu/g, 'μ')
          .replace(/\\sigma/g, 'σ')
          .replace(/\\infty/g, '∞')
          .replace(/\\leq/g, '≤')
          .replace(/\\geq/g, '≥')
          .replace(/\\neq/g, '≠')
          .replace(/\\approx/g, '≈')
          .replace(/\\pm/g, '±');

        ref.current.innerHTML = rendered;
      } catch (error) {
        ref.current.textContent = children;
      }
    }
  }, [children]);

  return (
    <span
      ref={ref}
      className={inline ? "math-inline" : "math-block"}
      style={{
        fontFamily: 'KaTeX_Math, Times New Roman, serif',
        fontSize: inline ? 'inherit' : '1.1em',
        display: inline ? 'inline' : 'block',
        textAlign: inline ? 'inherit' : 'center',
        margin: inline ? '0' : '16px 0',
        padding: inline ? '2px' : '12px',
        background: inline ? 'transparent' : 'rgba(15,23,36,0.02)',
        borderRadius: inline ? '0' : '6px'
      }}
    >
      {children}
    </span>
  );
}