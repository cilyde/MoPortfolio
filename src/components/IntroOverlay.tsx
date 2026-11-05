import { site } from "../content";

/** Caption + skip control used by the opening sequence. */
export function IntroOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[70]">
      <p data-intro="caption" className="intro-caption" aria-hidden="true">
        {site.caption[0]}
        <br />
        <span className="text-bone-2">{site.caption[1]}</span>
      </p>
      <button
        type="button"
        data-intro="skip"
        data-cursor="link"
        className="mono pointer-events-auto fixed bottom-6 right-[var(--gutter)] px-3 py-1 rounded border border-bone/10 bg-ink/60 backdrop-blur-sm text-[10px] text-mist transition-colors hover:text-bone hover:border-bone/40"
        style={{ visibility: "hidden", opacity: 0 }}
      >
        Skip intro →
      </button>
    </div>
  );
}
