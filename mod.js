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
