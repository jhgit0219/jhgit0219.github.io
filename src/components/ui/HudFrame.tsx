type Props = {
  corner: "tl" | "tr" | "bl" | "br";
  size?: number;
  className?: string;
};

export default function HudFrame({ corner, size = 22, className = "" }: Props) {
  // L-corner lives at the SVG corner (not inset) so the bracket aligns
  // exactly with the content-pane edge when positioned at e.g. top-12 left-6.
  // overflow="visible" prevents the half-stroke-width from being clipped.
  const paths: Record<Props["corner"], string> = {
    tl: `M 0 ${size} L 0 0 L ${size} 0`,
    tr: `M ${size - 20} 0 L ${size} 0 L ${size} ${size}`,
    bl: `M 0 ${size - 20} L 0 ${size} L ${size} ${size}`,
    br: `M ${size - 20} ${size} L ${size} ${size} L ${size} ${size - 20}`,
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      overflow="visible"
      className={className}
    >
      <path
        d={paths[corner]}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
