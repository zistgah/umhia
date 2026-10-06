/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
/** Geometry is independent of symbol assignment. Unit is one key width. */
const ROWS = [
  "`1234567890-=",
  "qwertyuiop[]\\",
  "asdfghjkl;'",
  "zxcvbnm,./"
];
const STAGGER = [0, 0.25, 0.5, 0.75];

export function ansiGeometry() {
  const keys = [];
  ROWS.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const legend = row[x];
      keys.push({
        id: `k-${y}-${x}`,
        legendHint: legend,
        x: x + STAGGER[y],
        y,
        z: 0,
        width: 1,
        height: 1,
        rotation: 0,
        row: y,
        home: "asdfjkl;".includes(legend)
      });
    }
  });
  keys.push({ id: "k-space", legendHint: " ", x: 3.5, y: 4, z: 0, width: 6, height: 1, rotation: 0, row: 4, home: true });
  return { id: "ANSI-104-alpha", planar: true, keys };
}

export function keyByHint(geometry, hint) {
  return geometry.keys.find((k) => k.legendHint === hint);
}

export const FINGER_HOME = {
  LP: { x: 0.5, y: 2 },
  LR: { x: 1.5, y: 2 },
  LM: { x: 2.5, y: 2 },
  LI: { x: 3.5, y: 2 },
  RI: { x: 6.5, y: 2 },
  RM: { x: 7.5, y: 2 },
  RR: { x: 8.5, y: 2 },
  RP: { x: 9.5, y: 2 },
  LT: { x: 4.5, y: 4 },
  RT: { x: 6.5, y: 4 }
};

export function fingerForColumn(x) {
  if (x < 1.4) return "LP";
  if (x < 2.4) return "LR";
  if (x < 3.4) return "LM";
  if (x < 5.2) return "LI";
  if (x < 6.4) return "RI";
  if (x < 7.4) return "RM";
  if (x < 8.4) return "RR";
  return "RP";
}
