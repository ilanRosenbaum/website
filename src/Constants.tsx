export const COPYRIGHT_TEXT = `© Ilan Rosenbaum ${new Date().getFullYear()}`;
export const VERSION_TEXT = "Version 4.1.1";

export const COLORS = {
  BACK_BUTTON_PURPLE: "#603b61",
  BACK_BUTTON_TEXT: "#ffefdb",
  MARKDOWN_TEXT: "#ffebcd",
  DARK_MAROON: "#4c0013",
  SURFACE_DARK: "#1e1e1e",
  SURFACE_DARK_ALT: "#2d2d2d",
  ACCENT_LINK_PURPLE: "#c084fc",
} as const;

export const Footer = () => {
  return (
    <div className="flex justify-between px-2 py-0.5 text-[6px] sm:text-xs text-white opacity-40">
      <span>{VERSION_TEXT}</span>
      <span>{COPYRIGHT_TEXT}</span>
    </div>
  );
};
