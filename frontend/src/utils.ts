const FIREWORK_COLORS = [
  "#ff595e",
  "#ffca3a",
  "#8ac926",
  "#1982c4",
  "#6a4c93",
  "#ff924c",
];

/**
 * Bursts a small firework of particles from a random point near the top of
 * the viewport. Particles are plain divs animated via a CSS keyframe
 * (see .firework-particle in styles.css) and remove themselves when done.
 */
function burstFirework() {
  const originX = window.innerWidth * (0.3 + Math.random() * 0.4);
  const originY = window.innerHeight * (0.2 + Math.random() * 0.2);
  const particleCount = 24;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "firework-particle";

    const angle = (i / particleCount) * 2 * Math.PI;
    const distance = 60 + Math.random() * 60;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    particle.style.left = `${originX}px`;
    particle.style.top = `${originY}px`;
    particle.style.setProperty("--dx", `${dx}px`);
    particle.style.setProperty("--dy", `${dy}px`);
    particle.style.backgroundColor =
      FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];

    particle.addEventListener("animationend", () => particle.remove());
    document.body.appendChild(particle);
  }
}

/** Plays a brief fireworks animation over the page. */
export function playFireworks() {
  const burstCount = 3;
  for (let i = 0; i < burstCount; i++) {
    setTimeout(burstFirework, i * 250);
  }
}
