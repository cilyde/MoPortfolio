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

  // Harmonious, concentric proportions:
  // Button height on outer LiquidGlass container -> icon badge diameter -> equal top/bottom/right margin -> proportional left padding
  const config =
    size === "lg"
      ? {
          height: "h-14",
          content: "pl-7 pr-3 gap-4 text-xs",
          iconDims: "h-8 w-8",
          iconSvgDims: "h-4 w-4",
        }
      : size === "sm"
      ? {
          height: "h-10",
          content: "pl-5 pr-2 gap-3 text-[11px]",
          iconDims: "h-6 w-6",
          iconSvgDims: "h-3 w-3",
        }
      : {
          height: "h-12",
          content: "pl-6 pr-2.5 gap-3.5 text-xs",
          iconDims: "h-7 w-7",
          iconSvgDims: "h-3.5 w-3.5",
        };

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
      className={`group inline-flex items-center select-none ${config.height} transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97] ${className}`}
      contentClassName={`flex h-full items-center ${config.content}`}
    >
      <span
        className={`font-mono uppercase tracking-wider transition-colors whitespace-nowrap leading-none ${
          tone === "dark"
            ? "text-bone group-hover:text-bone-2"
            : "text-ink group-hover:text-ink-2"
        }`}
      >
        {children}
      </span>
      <span
        className={`grid place-items-center rounded-full shrink-0 aspect-square ${config.iconDims} ${
          tone === "dark"
            ? "bg-bone text-ink shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_1px_3px_rgba(0,0,0,0.3)]"
            : "bg-ink text-bone shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_1px_3px_rgba(0,0,0,0.2)]"
        } transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105`}
      >
        {icon ?? (
          <ArrowUpRight
            className={`${config.iconSvgDims} transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
          />
        )}
      </span>
    </LiquidGlass>
  );
}
