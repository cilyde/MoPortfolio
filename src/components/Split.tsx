import type { CSSProperties } from "react";

interface SplitProps {
  text: string;
  className?: string;
  /** stagger index offset, so multi-line headings cascade continuously */
  offset?: number;
}

/** Characters inside per-word masks. Screen readers get the plain string. */
export function SplitChars({ text, className, offset = 0 }: SplitProps) {
  let i = offset;
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            <span className="inline-block overflow-hidden align-top">
              {Array.from(word).map((c, ci) => (
                <span key={ci} className="ch inline-block will-change-transform" style={{ "--i": i++ } as CSSProperties}>
                  {c}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Words that rise out of their own line masks. */
export function SplitWords({ text, className }: SplitProps) {
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} className="inline-block whitespace-nowrap">
            <span className="inline-block overflow-hidden align-top">
              <span className="wd inline-block will-change-transform">{w}</span>
            </span>
            {i < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
          </span>
        ))}
      </span>
    </span>
  );
}
