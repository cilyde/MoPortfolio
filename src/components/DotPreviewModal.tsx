import { useEffect } from "react";
import { X, Sparkles, ExternalLink } from "lucide-react";
import type { Project } from "../content";
import LiquidGlass from "./LiquidGlass";

interface DotPreviewModalProps {
  project: Project | null;
  onClose: () => void;
}

export function DotPreviewModal({ project, onClose }: DotPreviewModalProps) {
  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-ink/80 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <LiquidGlass
        tone="dark"
        radius={24}
        bezel={24}
        thickness={32}
        blur={0.5}
        className="relative max-w-4xl w-full transition-transform duration-300"
        contentClassName="p-6 sm:p-8"
        style={{
          boxShadow: `0 30px 80px -20px ${project.accent}33, 0 0 0 1px ${project.accent}22`,
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-bone/10 pb-4">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: project.accent, boxShadow: `0 0 10px ${project.accent}` }}
            />
            <span className="mono text-xs text-mist">{project.kind}</span>
            <span className="text-ash">•</span>
            <span className="mono text-xs text-bone">{project.year}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            data-cursor="link"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-bone/20 bg-bone/10 text-mist transition-all hover:bg-bone hover:text-ink"
            aria-label="Close visual preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
          {/* Screenshot presentation */}
          <div className="lg:col-span-7 overflow-hidden rounded-xl border border-bone/15 bg-ink">
            <div className="relative group">
              <img
                src={project.image}
                alt={`${project.title} interface preview`}
                className="w-full h-auto object-cover max-h-[500px] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>
          </div>

          {/* Details & outcomes */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="mono text-[11px] uppercase tracking-wider" style={{ color: project.accent }}>
                {project.metric.startsWith("★") ? project.metric : `★ ${project.metric}`}
              </div>
              <h3 id="preview-title" className="font-serif text-2xl sm:text-3xl font-normal mt-1 text-bone">
                {project.title}
              </h3>
              <p className="font-serif italic text-base text-bone/80 mt-1">{project.subtitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-mist">{project.summary}</p>
            </div>

            <div className="space-y-2 border-t border-bone/10 pt-4">
              <span className="mono text-[10px] text-ash uppercase tracking-wider">Key Highlights</span>
              <ul className="space-y-1.5 text-xs text-bone/90">
                {project.contributions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 rounded-full bg-bone-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mono text-[10px] text-mist flex flex-wrap gap-2 pt-2">
              <span className="text-ash">Stack:</span>
              <span className="text-bone">{project.stack}</span>
            </div>
          </div>
        </div>
      </LiquidGlass>
    </div>
  );
}
