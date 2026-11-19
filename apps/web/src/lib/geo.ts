/**
 * Tiny Web Mercator helpers for the static coverage map (no map library needed).
 * The map is drawn in a fixed "design" box (e.g. 800×600); tiles and pins are
 * positioned in percent of that box so it scales responsively.
 */
const TILE = 256;

export interface MapView {
  /** Centre of the view. */
  lat: number;
  lon: number;
  /** Tile zoom level (integer). */
  zoom: number;
  /** Design box size in px; tiles are drawn at TILE * scale px. */
  width: number;
  height: number;
  scale: number;
}

/** World pixel position (at `zoom`, before scaling). */
function worldPx(lat: number, lon: number, zoom: number): { x: number; y: number } {
  const n = TILE * 2 ** zoom;
  const s = Math.sin((lat * Math.PI) / 180);
  return {
    x: ((lon + 180) / 360) * n,
    y: (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n,
  };
}

/** Top-left of the design box in world pixels. */
function origin(v: MapView): { x: number; y: number } {
  const c = worldPx(v.lat, v.lon, v.zoom);
  return { x: c.x - v.width / 2 / v.scale, y: c.y - v.height / 2 / v.scale };
}

/** Position of a coordinate in percent of the design box. */
export function toPercent(v: MapView, lat: number, lon: number): { left: number; top: number } {
  const o = origin(v);
  const p = worldPx(lat, lon, v.zoom);
  return {
    left: (((p.x - o.x) * v.scale) / v.width) * 100,
    top: (((p.y - o.y) * v.scale) / v.height) * 100,
  };
}

export interface Tile {
  x: number;
  y: number;
  /** Position and size in percent of the design box. */
  left: number;
  top: number;
  w: number;
  h: number;
}

/** Every tile needed to cover the design box. */
export function tilesFor(v: MapView): Tile[] {
  const o = origin(v);
  const span = { x: v.width / v.scale, y: v.height / v.scale };
  const x0 = Math.floor(o.x / TILE);
  const y0 = Math.floor(o.y / TILE);
  const x1 = Math.floor((o.x + span.x) / TILE);
  const y1 = Math.floor((o.y + span.y) / TILE);
  const w = ((TILE * v.scale) / v.width) * 100;
  const h = ((TILE * v.scale) / v.height) * 100;
  const tiles: Tile[] = [];
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      tiles.push({
        x,
        y,
        left: (((x * TILE - o.x) * v.scale) / v.width) * 100,
        top: (((y * TILE - o.y) * v.scale) / v.height) * 100,
        w,
        h,
      });
    }
  }
  return tiles;
}
