export const COPYRIGHT_TEXT = `Copyright © 2024-${new Date().getFullYear()} Ilan Rosenbaum. All rights reserved.`;
export const VERSION_TEXT = "Version 2.0.0";
export const Footer = () => {
  return (
    <div>
      <div className="absolute bottom-2 left-2 text-xs text-white opacity-50">{VERSION_TEXT}</div>
      <div className="absolute bottom-2 right-2 text-xs text-white opacity-50">{COPYRIGHT_TEXT}</div>
    </div>
  );
};
