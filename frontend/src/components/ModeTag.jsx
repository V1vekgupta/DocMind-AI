const MODE_STYLES = {
  CONCISE: {
    label: "GROUNDED",
    border: "border-tab-grounded",
    text: "text-tab-grounded",
  },
  DETAILED: {
    label: "DETAILED",
    border: "border-tab-detailed",
    text: "text-tab-detailed",
  },
  WEB: {
    label: "WEB SEARCH",
    border: "border-tab-web",
    text: "text-tab-web",
  },
};

export default function ModeTag({ mode }) {
  const style = MODE_STYLES[mode];
  if (!style) return null;

  return (
    <span className={`font-mono text-[10px] tracking-wider ${style.text}`}>{style.label}</span>
  );
}

export function modeBorderClass(mode) {
  return MODE_STYLES[mode]?.border || "border-ink-700";
}
