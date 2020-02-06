const CHANGED_AREA_BUTTON_POSITIONS = {
  arid: { x: 454, y: 213 },
  'autumn-area': { x: 259, y: 158 },
  'autumn-fall': { x: 329, y: 163 },
  'bergen-trails': { x: 189, y: 168 },
  'cold-dng': { x: 204, y: 68 },
  forest: { x: 415, y: 153 },
  'jungle-city': { x: 313, y: 128 },
  jungle: { x: 279, y: 113 },
};

for (let id in CHANGED_AREA_BUTTON_POSITIONS) {
  if (Object.prototype.hasOwnProperty.call(CHANGED_AREA_BUTTON_POSITIONS, id)) {
    let pos = CHANGED_AREA_BUTTON_POSITIONS[id];
    sc.map.areas[id].position = pos;
  }
}

sc.AreaButton.inject({
  patchedGfx: new ig.Image('media/gui/patched-area-buttons.png'),
  updateDrawables(renderer) {
    if (this.focus) {
      renderer
        .addGfx(this.patchedGfx, -3, -2, 24, 0, 21, 21)
        .setCompositionMode('lighter');
    }
    renderer.addGfx(
      this.patchedGfx,
      4,
      4,
      0 + this.icon,
      0 + (this.activeArea ? 8 : 0),
      8,
      8,
    );
    if (this.activeArea) {
      renderer.addGfx(this.gfx, 1, 2, 304, 440, 3, 3);
      renderer.addGfx(this.gfx, -11, -8, 280, 424, 16, 11);
    }
  },
});
