// Drawing helpers shared by the board designs.

// Bezier handles for a smooth curve through the points (Catmull-Rom).
function segments(points) {
  return points.slice(0, -1).map((p1, i) => {
    const p0 = points[i - 1] ?? p1;
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    return [p1, { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }, { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }, p2];
  });
}

export function smoothPath(points) {
  return segments(points).reduce(
    (d, [, c1, c2, p2]) => `${d} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`,
    `M ${points[0].x} ${points[0].y}`,
  );
}

const bez = (a, b, c, d, t) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;

// Points spaced `gap` apart along the smooth curve, each with the curve's angle there.
export function pointsAlong(points, gap) {
  const dense = [];
  segments(points).forEach(([p0, c1, c2, p1]) => {
    for (let s = 0; s < 40; s++) {
      const t = s / 40;
      dense.push({ x: bez(p0.x, c1.x, c2.x, p1.x, t), y: bez(p0.y, c1.y, c2.y, p1.y, t) });
    }
  });
  dense.push(points.at(-1));

  const out = [];
  let travelled = 0;
  let next = 0;
  for (let i = 1; i < dense.length; i++) {
    const a = dense[i - 1];
    const b = dense[i];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    while (travelled + len >= next) {
      const t = (next - travelled) / len;
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI });
      next += gap;
    }
    travelled += len;
  }
  return out;
}

// Splits a stop name into short lines for small board spaces.
export function wrap(text, max) {
  const lines = [];
  text.split(' ').forEach((word) => {
    const last = lines.at(-1);
    if (last && (last + ' ' + word).length <= max) lines[lines.length - 1] = last + ' ' + word;
    else lines.push(word);
  });
  return lines;
}
