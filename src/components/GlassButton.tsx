import { type MouseEvent, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import LiquidGlass from "./LiquidGlass";
import { scrollToTarget } from "../lib/runtime";

export function GlassButton({
  children,
  href,
  onClick,
  tone = "dark",
  size = "md",
  className = "",
  icon,
  external,
}: {
  children: ReactNode;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: ReactNode;
  external?: boolean;
}) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (href && href.startsWith("#")) {
      e.preventDefault();
      scrollToTarget(href, 2.2);
    }
    onClick?.(e);
  };

  const dims =
    size === "lg"
      ? "h-[60px] pl-7 pr-2.5 gap-5 text-[15px]"
      : size === "sm"
      ? "h-10 pl-4 pr-1.5 gap-3 text-[12.5px]"
      : "h-12 pl-5 pr-2 gap-4 text-[13.5px]";

  const iconDims =
    size === "lg" ? "h-10 w-10" : size === "sm" ? "h-7 w-7" : "h-8 w-8";

  const isLink = Boolean(href);
  const AsTag = isLink ? "a" : "button";

  return (
    <LiquidGlass
      as={AsTag}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={handleClick as never}
      tone={tone}
      className={`group inline-flex select-none transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97] ${className}`}
      contentClassName={`flex h-full items-center ${dims}`}
    >
      <span className="font-mono text-xs uppercase tracking-wider text-bone transition-colors group-hover:text-bone-2">
        {children}
      </span>
      <span
        className={`grid place-items-center rounded-full ${iconDims} ${
          tone === "dark"
            ? "bg-bone text-ink shadow-[inset_0_-2px_6px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.4)]"
            : "bg-ink text-bone shadow-[inset_0_-2px_6px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.2)]"
        } transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105`}
      >
        {icon ?? (
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        )}
      </span>
    </LiquidGlass>
  );
}
