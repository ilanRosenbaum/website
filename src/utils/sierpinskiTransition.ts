import { getFastMode } from "../components/FastModeToggle";

const ZOOM_SCALE = 3;
const TRANSITION_DURATION_MS = 2200;

export const performTransitionAndRedirect = (hexagonId: number, url: string, navigate?: (url: string) => void) => {
  if (navigate && getFastMode()) {
    navigate(url);
    return;
  }

  const svg = document.querySelector("svg");
  const hexagon = document.querySelector(`#hexagon-${hexagonId}`);

  if (svg && hexagon) {
    if (svg.getAttribute("data-nav-transition") === "running") {
      return;
    }

    svg.setAttribute("data-nav-transition", "running");
    svg.classList.add("transitioning");

    const svgRect = svg.getBoundingClientRect();
    const hexRect = hexagon.getBoundingClientRect();

    const centerX = svgRect.width / 2;
    const centerY = svgRect.height / 2;

    const hexCenterX = hexRect.left + hexRect.width / 2 - svgRect.left;
    const hexCenterY = hexRect.top + hexRect.height / 2 - svgRect.top;

    const translateX = centerX - hexCenterX;
    const translateY = centerY - hexCenterY;

    const currentTransform = window.getComputedStyle(svg).transform;
    const matrix = new DOMMatrix(currentTransform);
    const currentScale = matrix.a;

    svg.style.transition = `transform ${TRANSITION_DURATION_MS}ms ease-in-out`;
    svg.style.transformOrigin = "center center";

    const adjustedTranslateX = translateX * ZOOM_SCALE;
    const adjustedTranslateY = translateY * ZOOM_SCALE;

    requestAnimationFrame(() => {
      svg.style.transform = `translate(${adjustedTranslateX}px, ${adjustedTranslateY}px) scale(${currentScale * ZOOM_SCALE})`;
    });

    window.setTimeout(() => {
      svg.setAttribute("data-nav-transition", "idle");
      if (navigate) {
        navigate(url);
      } else {
        window.location.href = url;
      }
    }, TRANSITION_DURATION_MS + 100);
  } else {
    if (navigate) {
      navigate(url);
    } else {
      window.location.href = url;
    }
  }
};
