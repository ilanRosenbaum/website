export const COPYRIGHT_TEXT = `© Ilan Rosenbaum ${new Date().getFullYear()}`;
export const VERSION_TEXT = "Version 2.2.3";
export const Footer = () => {
  return (
    <div>
      <div className="absolute bottom-2 left-2 text-[10px] sm:text-xs text-white opacity-50">{VERSION_TEXT}</div>
      <div className="absolute bottom-2 right-2 text-[10px] sm:text-xs text-white opacity-50">{COPYRIGHT_TEXT} </div>
    </div>
  );
};
