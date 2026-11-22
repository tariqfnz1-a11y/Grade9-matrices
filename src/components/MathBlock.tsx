import katex from 'katex';
import React from 'react';

interface MathBlockProps {
  latex: string;
  display?: boolean;
  className?: string;
}

export const MathBlock: React.FC<MathBlockProps> = ({
  latex,
  display = false,
  className = '',
}) => {
  let html = '';
  try {
    html = katex.renderToString(latex, {
      displayMode: display,
      throwOnError: false,
      strict: false,
    });
  } catch {
    html = latex;
  }

  if (display) {
    return (
      <div
        className={`overflow-x-auto py-1 text-slate-900 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block align-middle ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface RichMathTextProps {
  text: string;
  className?: string;
}

/**
 * Renders prose containing $$...$$ display math or $...$ inline math via offline KaTeX.
 */
const renderFormattedText = (segment: string, keyPrefix: number): React.ReactNode => {
  const parts = segment.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={`${keyPrefix}-${idx}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={`${keyPrefix}-${idx}`}
          className="font-mono-num px-1 py-0.5 bg-slate-100 rounded text-[0.9em] text-[#0F294A]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={`${keyPrefix}-${idx}`}>{part}</React.Fragment>;
  });
};

export const RichMathText: React.FC<RichMathTextProps> = ({ text, className = '' }) => {
  const tokens: { type: 'text' | 'inline' | 'display'; content: string }[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const displayIdx = remaining.indexOf('$$');
    const inlineIdx = remaining.indexOf('$');

    if (displayIdx === -1 && inlineIdx === -1) {
      tokens.push({ type: 'text', content: remaining });
      break;
    }

    if (displayIdx !== -1 && (inlineIdx === -1 || displayIdx <= inlineIdx)) {
      if (displayIdx > 0) {
        tokens.push({ type: 'text', content: remaining.slice(0, displayIdx) });
      }
      const closeIdx = remaining.indexOf('$$', displayIdx + 2);
      if (closeIdx === -1) {
        tokens.push({ type: 'text', content: remaining.slice(displayIdx) });
        break;
      }
      tokens.push({
        type: 'display',
        content: remaining.slice(displayIdx + 2, closeIdx),
      });
      remaining = remaining.slice(closeIdx + 2);
    } else if (inlineIdx !== -1) {
      if (inlineIdx > 0) {
        tokens.push({ type: 'text', content: remaining.slice(0, inlineIdx) });
      }
      const closeIdx = remaining.indexOf('$', inlineIdx + 1);
      if (closeIdx === -1) {
        tokens.push({ type: 'text', content: remaining.slice(inlineIdx) });
        break;
      }
      tokens.push({
        type: 'inline',
        content: remaining.slice(inlineIdx + 1, closeIdx),
      });
      remaining = remaining.slice(closeIdx + 1);
    }
  }

  return (
    <span className={className}>
      {tokens.map((tok, i) => {
        if (tok.type === 'text') {
          return <React.Fragment key={i}>{renderFormattedText(tok.content, i)}</React.Fragment>;
        }
        if (tok.type === 'display') {
          return <MathBlock key={i} latex={tok.content} display />;
        }
        return <MathBlock key={i} latex={tok.content} />;
      })}
    </span>
  );
};
