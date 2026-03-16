'use client';

// A simple quality selector plugin for Video.js
export function registerQualitySelector(videojs: any) {
  if (!videojs) return;

  const MenuItem = videojs.getComponent('MenuItem');
  const MenuButton = videojs.getComponent('MenuButton');

  // Skip if already registered
  if (videojs.getComponent('QualitySelector')) return;

  class QualityMenuItem extends MenuItem {
    private src: string;

    constructor(player: any, options: any) {
      super(player, options);
      this.src = options.src;
    }
    
    handleClick() {
      const player = this.player();
      const currentTime = player.currentTime();
      const isPaused = player.paused();
      
      // Change source
      player.src({ src: this.src, type: 'video/mp4' });
      
      // Restore playback position
      player.one('loadeddata', () => {
        player.currentTime(currentTime);
        if (!isPaused) {
          player.play();
        }
      });
      
      // Update selected state
      this.addClass('vjs-selected');
      const siblings = this.el().parentElement?.querySelectorAll('.vjs-menu-item');
      siblings?.forEach((sibling: Element) => {
        if (sibling !== this.el()) {
          sibling.classList.remove('vjs-selected');
        }
      });
    }
  }

  class QualitySelector extends MenuButton {
    constructor(player: any, options: any) {
      super(player, options);
      this.controlText('Quality');
    }
    
    createItems() {
      const player = this.player();
      const sources = player.options_.sources || [];
      
      return sources.map((source: any) => {
        return new QualityMenuItem(player, {
          label: source.label || 'Auto',
          src: source.src,
          selected: source.selected
        });
      });
    }

    buildCSSClass() {
      return `vjs-quality-selector ${super.buildCSSClass()}`;
    }
  }

  // Register components
  videojs.registerComponent('QualityMenuItem', QualityMenuItem);
  videojs.registerComponent('QualitySelector', QualitySelector);
}
