const CHANGED_BUTTON_POSITIONS = {
  arid: { x: 454, y: 213 },
  'autumn-area': { x: 259, y: 158 },
  'autumn-fall': { x: 329, y: 163 },
  'bergen-trails': { x: 189, y: 168 },
  'cold-dng': { x: 204, y: 68 },
  forest: { x: 415, y: 153 },
  'jungle-city': { x: 313, y: 128 },
  jungle: { x: 279, y: 113 },
};

for (let id in CHANGED_BUTTON_POSITIONS) {
  if (Object.prototype.hasOwnProperty.call(CHANGED_BUTTON_POSITIONS, id)) {
    let pos = CHANGED_BUTTON_POSITIONS[id];
    sc.map.areas[id].position = pos;
  }
}

const BUTTON_SPRITE = {
  srcX: 0,
  srcY: 0,
  width: 10,
  height: 10,
  posX: 3,
  posY: 3,
};

const CROSSHAIR_SPRITE = {
  srcX: 14,
  srcY: 39,
  width: 25,
  height: 25,
  posX: -5,
  posY: -4,
};

const BUTTON_HIGHLIGHT_SPRITE = {
  srcX: 39,
  srcY: 39,
  width: CROSSHAIR_SPRITE.width,
  height: CROSSHAIR_SPRITE.height,
  posX: CROSSHAIR_SPRITE.posX,
  posY: CROSSHAIR_SPRITE.posY,
};

sc.AreaButton.inject({
  patchedGfx: new ig.Image('media/gui/patched-area-buttons.png'),

  updateDrawables(renderer) {
    if (this.focus) {
      renderer
        .addGfx(
          this.patchedGfx,
          BUTTON_HIGHLIGHT_SPRITE.posX,
          BUTTON_HIGHLIGHT_SPRITE.posY,
          BUTTON_HIGHLIGHT_SPRITE.srcX,
          BUTTON_HIGHLIGHT_SPRITE.srcY,
          BUTTON_HIGHLIGHT_SPRITE.width,
          BUTTON_HIGHLIGHT_SPRITE.height,
        )
        .setCompositionMode('lighter');
      renderer.addGfx(
        this.patchedGfx,
        CROSSHAIR_SPRITE.posX,
        CROSSHAIR_SPRITE.posY,
        CROSSHAIR_SPRITE.srcX,
        CROSSHAIR_SPRITE.srcY,
        CROSSHAIR_SPRITE.width,
        CROSSHAIR_SPRITE.height,
      );
    }

    renderer.addGfx(
      this.patchedGfx,
      BUTTON_SPRITE.posX,
      BUTTON_SPRITE.posY,
      BUTTON_SPRITE.srcX +
        sc.AREA_TYPE[this.area.areaType] * BUTTON_SPRITE.width,
      BUTTON_SPRITE.srcY + (this.activeArea ? 1 : 0) * BUTTON_SPRITE.height,
      BUTTON_SPRITE.width,
      BUTTON_SPRITE.height,
    );

    if (this.activeArea) {
      // hardcoded coordinates from game.compiled.js
      renderer.addGfx(this.gfx, 1, 2, 304, 440, 3, 3);
      renderer.addGfx(this.gfx, -11, -8, 280, 424, 16, 11);
    }
  },
});
