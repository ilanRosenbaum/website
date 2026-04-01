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
    <>
      <div className="ml-2 fixed bottom-2 left-2 text-[10px] sm:text-xs text-white opacity-50">{VERSION_TEXT}</div>
      <div className="mr-2 fixed bottom-2 right-2 text-[10px] sm:text-xs text-white opacity-50">{COPYRIGHT_TEXT} </div>
    </>
  );
};
