ig.module('game.feature.world-map-overhaul')
  .requires(
    'game.feature.menu.map-model',
    'game.feature.menu.gui.map.map-worldmap',
    'impact.base.image',
  )
  .defines(() => {
    const ASSETS_DIR = 'media/gui/better-world-map';

    const CHANGED_BUTTON_POSITIONS = new Map([
      ['autumn-area', { x: 259, y: 158 }],
      ['autumn-fall', { x: 329, y: 163 }],
      ['bergen-trails', { x: 189, y: 168 }],
      ['cargo-ship', { x: 370, y: 260 }],
      ['cold-dng', { x: 204, y: 68 }],
      ['final-dng', { x: 40, y: 139 }],
      ['jungle-city', { x: 313, y: 128 }],
      ['rhombus-sqr', { x: 275, y: 248 }],
      ['rookie-harbor', { x: 273, y: 198 }],
      ['arid', { x: 454, y: 213 }],
      ['beach', { x: 175, y: 277 }],
      ['forest', { x: 415, y: 153 }],
      ['jungle', { x: 279, y: 113 }],
    ]);

    const COLORED_AREAS = new Set([
      'arid',
      'autumn-area',
      'autumn-fall',
      'beach',
      'bergen-trails',
      'final-dng',
      'forest',
      'heat-area',
      'jungle',
      'rookie-harbor',
    ]);

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

    sc.MapModel.inject({
      initAreas() {
        this.parent();
        for (let [id, pos] of CHANGED_BUTTON_POSITIONS) {
          this.areas[id].position = pos;
        }
      },
    });

    sc.AreaButton.inject({
      patchedGfx: new ig.Image(`${ASSETS_DIR}/patched-area-buttons.png`),

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
          BUTTON_SPRITE.srcX + sc.AREA_TYPE[this.area.areaType] * BUTTON_SPRITE.width,
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

    sc.MapWorldMap.inject({
      _seaGfx: new ig.Image(`${ASSETS_DIR}/sea.png`),
      _areasGfx: [],
      _areaVisitStatuses: null,

      _addAreas() {
        let visitedAreas = [];
        for (let [id, area] of Object.entries(sc.map.areas)) {
          let visited = Boolean(
            (!area.condition || new ig.VarCondition(area.condition).evaluate()) &&
              sc.map.getVisitedArea(id),
          );
          if (visited) {
            visitedAreas.push([id, area]);
          }
          if (COLORED_AREAS.has(id)) {
            this.addChildGui(new sc.MapBetterWorldMapArea(id, visited));
          }
        }
        for (let [id, area] of visitedAreas) {
          this.addChildGui(this._addAreaButton(id, area));
        }
      },

      updateDrawables(renderer) {
        let size = this.hook.size;
        renderer.addColor('black', 0, 0, size.x, size.y);
        renderer.addGfx(this._seaGfx, 0, 0, 0, 0, size.x, size.y);
      },
    });

    sc.MapBetterWorldMapArea = ig.GuiElementBase.extend({
      id: '',
      defaultGfx: null,
      revealGfx: null,
      coloredGfx: null,
      defaultGui: null,
      revealGui: null,
      coloredGui: null,

      init(id, visited) {
        this.parent();
        this.id = id;

        let visitedVarName = `menu.circuit.start.${id}`;
        let visitedVarValue = ig.vars.get(visitedVarName);
        if (visitedVarValue == null) visitedVarValue = visited;
        ig.vars.set(visitedVarName, visited);

        let showRevealAnimation = visited && !visitedVarValue;

        let size = Vec2.createC(ig.system.width, ig.system.height);
        this.setSize(size.x, size.y);
        this.setPivot(size.x / 2, size.y / 2);

        let timeFunction = KEY_SPLINES.LINEAR;

        // The children must be added in this exact order:

        if (!visited || showRevealAnimation) {
          this.defaultGfx = new ig.Image(`${ASSETS_DIR}/overlays/default/${id}.png`);
          this.defaultGui = new ig.ImageGui(this.defaultGfx, 0, 0, size.x, size.y);
          this.defaultGui.hook.transitions = {
            DEFAULT: { state: {}, time: 0.2, timeFunction },
            HIDDEN: { state: { alpha: 0 }, time: 0.2, timeFunction },
          };
          this.addChildGui(this.defaultGui);
        }

        if (visited) {
          this.coloredGfx = new ig.Image(`${ASSETS_DIR}/overlays/colored/${id}.png`);
          this.coloredGui = new ig.ImageGui(this.coloredGfx, 0, 0, size.x, size.y);
          this.coloredGui.hook.transitions = {
            DEFAULT: { state: {}, time: 0.3, timeFunction },
            HIDDEN: { state: { alpha: 0 }, time: 0.5, timeFunction },
          };
          this.addChildGui(this.coloredGui);
        }

        if (visited && showRevealAnimation) {
          this.revealGfx = new ig.Image(`${ASSETS_DIR}/overlays/reveal/${id}.png`);
          this.revealGui = new ig.ImageGui(this.revealGfx, 0, 0, size.x, size.y);
          this.revealGui.renderMode = 'lighter';
          this.revealGui.hook.transitions = {
            DEFAULT: { state: {}, time: 0.2, timeFunction },
            HIDDEN: { state: { alpha: 0 }, time: 0.2, timeFunction },
          };
          this.addChildGui(this.revealGui);
        }

        if (visited && showRevealAnimation) {
          // doStateTransition(name, skipTransition, removeAfter, callback, initDelay)
          this.defaultGui.doStateTransition('DEFAULT', true);
          this.coloredGui.doStateTransition('HIDDEN', true);
          this.revealGui.doStateTransition('HIDDEN', true);

          this.revealGui.doStateTransition(
            'DEFAULT',
            false,
            false,
            () => {
              this.defaultGui.doStateTransition('HIDDEN', false);
              this.coloredGui.doStateTransition('DEFAULT', true);
              this.revealGui.doStateTransition('HIDDEN', false, false, null, 0.2);
            },
            0.4,
          );
        }
      },
    });
  });
