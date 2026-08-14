// ============================================================================
// GLOBAL ASSET PRELOADER & CACHE SYSTEM
// ============================================================================
// Ensures all critical PNG, WebM, Audio, and Lottie assets are loaded into memory / browser HTTP cache
// before entering the main narrative experience. Prevents layout shifts, flickering, and playback delays.
// ============================================================================

export interface PreloadProgress {
  total: number;
  loaded: number;
  percentage: number;
  currentAsset: string;
  isComplete: boolean;
}

// Master list of all visual, audio, and video assets in the application
export const CORE_IMAGE_ASSETS = [
  '/src/assets/images/logo1.png',
  '/src/assets/images/logo4.png',
  '/src/assets/images/首页底图.png',
  '/src/assets/images/首页-窗.png',
  '/src/assets/images/雏菊-开.png',
  '/src/assets/images/雏菊-闭.png',
  '/src/assets/images/树冠0.png',
  '/src/assets/images/树冠1.png',
  '/src/assets/images/树冠2.png',
  '/src/assets/images/树冠3.png',
  '/src/assets/images/树叶0.png',
  '/src/assets/images/girl1.png',
  '/src/assets/images/girl2.png',
  '/src/assets/images/girl3.png',
  '/src/assets/images/创作者-后.png',
  '/src/assets/images/从业者-后.png',
  '/src/assets/images/秤前星.png',
  '/src/assets/images/秤后星星1.png',
  '/src/assets/images/秤后星星2.png',
  '/src/assets/images/秤后星星3.png',
  '/src/assets/images/秤柱.png',
  '/src/assets/images/秤杆.png',
  '/src/assets/images/秤盘-前景.png',
  '/src/assets/images/秤盘-后景.png',
  '/src/assets/images/智齿.png',
  '/src/assets/images/车轮.png',
  '/src/assets/images/蜗牛壳.png',
  '/src/assets/images/羽毛.png',
  '/src/assets/images/躺猫.png',
  '/src/assets/images/背包.png',
  '/src/assets/images/工作牌.png',
  '/src/assets/images/珍珠.png',
  '/src/assets/images/玻璃弹珠-蓝.png',
  '/src/assets/images/玻璃弹珠-黄1.png',
  '/src/assets/images/玻璃弹珠-粉1.png',
  '/src/assets/images/车票1.png',
  '/src/assets/images/车票2.png',
  '/src/assets/images/车票3.png',
  '/src/assets/images/portf1.jpg',
  '/src/assets/UI/button1.png',
  '/src/assets/UI/button1-hover.png',
  '/src/assets/UI/对话框.png',
  '/src/assets/UI/对话框b.png',
  '/src/assets/UI/指引点.png',
  '/src/assets/UI/天平提示.png',
  '/src/assets/UI/menu.png',
  '/src/assets/UI/menu-hover.png',
  '/src/assets/UI/menubar-chosen.png',
  '/src/assets/UI/menubar-hover.png',
  '/src/assets/作品集/无定之流/无定之流封面1.jpg',
  '/src/assets/作品集/无定之流/无定之流2.jpg',
  '/src/assets/作品集/泛灵/泛灵海报.png',
  '/src/assets/作品集/物换星/物换星海报.png',
  '/src/assets/作品集/非理性边缘/非理性边缘海报.png'
];

export const CORE_VIDEO_ASSETS = [
  '/src/assets/video/2.webm',
  '/src/assets/video/1.webm',
  '/src/assets/video/5.webm',
  '/src/assets/video/学生女孩.webm',
  '/src/assets/video/创作者-前.webm',
  '/src/assets/video/从业者-前.webm',
  '/src/assets/video/ani2_牙痛.webm',
  '/src/assets/video/ani3-智齿循环动画.webm',
  '/src/assets/video/ani4-智齿女孩诞生.webm',
  '/src/assets/video/ani5-妖精悬浮循环.webm',
  '/src/assets/video/涟漪.webm',
  '/src/assets/video/女孩.webm',
  '/src/assets/video/妖精.webm',
  '/src/assets/video/蜗牛_pickup.webm',
  '/src/assets/video/蜗牛_afterpickup.webm',
  '/src/assets/video/蜗牛_爬行.webm',
  '/src/assets/video/蜗牛_缩进壳.webm',
  '/src/assets/UI/指引点.webm'
];

export const CORE_AUDIO_ASSETS = [
  '/src/assets/Music/museum of rust.mp3',
  '/src/assets/Music/Aquamarine Balance.mp3',
  '/src/assets/sound/A_broken_CRT_televis.mp3',
  '/src/assets/sound/UI_1.mp3',
  '/src/assets/sound/UI_2.mp3',
  '/src/assets/sound/bicycle.mp3',
  '/src/assets/sound/bicycle3.mp3',
  '/src/assets/sound/scalemovement.mp3',
  '/src/assets/sound/pearlfall.mp3',
  '/src/assets/sound/glassmarble.mp3',
  '/src/assets/sound/papersound.mp3',
  '/src/assets/sound/crack1.mp3',
  '/src/assets/sound/crack2.mp3',
  '/src/assets/sound/magical.mp3'
];

// Global Memory Cache for Loaded Assets
class AssetCache {
  private imageCache = new Map<string, HTMLImageElement>();
  private videoBlobCache = new Map<string, string>();
  private audioCache = new Map<string, HTMLAudioElement>();
  private loadedUrls = new Set<string>();

  public isLoaded(url: string): boolean {
    return this.loadedUrls.has(url);
  }

  public getImage(url: string): HTMLImageElement | undefined {
    return this.imageCache.get(url);
  }

  public getVideoUrl(url: string): string {
    return this.videoBlobCache.get(url) || url;
  }

  public async preloadImage(url: string): Promise<void> {
    if (this.loadedUrls.has(url)) return;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(url, img);
        this.loadedUrls.add(url);
        resolve();
      };
      img.onerror = () => {
        // Resolve gracefully even on fallback
        this.loadedUrls.add(url);
        resolve();
      };
      img.src = url;
    });
  }

  public async preloadVideo(url: string): Promise<void> {
    if (this.loadedUrls.has(url)) return;

    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        this.videoBlobCache.set(url, blobUrl);
      }
    } catch {
      // Fallback to standard URL if fetch fails
    } finally {
      this.loadedUrls.add(url);
    }
  }

  public async preloadAudio(url: string): Promise<void> {
    if (this.loadedUrls.has(url)) return;

    return new Promise((resolve) => {
      const audio = new Audio();
      const onDone = () => {
        this.audioCache.set(url, audio);
        this.loadedUrls.add(url);
        resolve();
      };
      audio.oncanplaythrough = onDone;
      audio.onerror = onDone;
      // Timeout fallback in case canplaythrough doesn't fire immediately
      setTimeout(onDone, 1200);
      audio.src = url;
      audio.load();
    });
  }

  public async startPreload(
    onProgress: (progress: PreloadProgress) => void
  ): Promise<void> {
    // Deduplicate lists
    const images = Array.from(new Set(CORE_IMAGE_ASSETS));
    const videos = Array.from(new Set(CORE_VIDEO_ASSETS));
    const audios = Array.from(new Set(CORE_AUDIO_ASSETS));

    const total = images.length + videos.length + audios.length;
    let loaded = 0;

    const notify = (url: string) => {
      loaded++;
      const percentage = Math.min(100, Math.round((loaded / total) * 100));
      onProgress({
        total,
        loaded,
        percentage,
        currentAsset: url,
        isComplete: loaded >= total
      });
    };

    // Load Images in parallel batches
    const imagePromises = images.map(async (url) => {
      await this.preloadImage(url);
      notify(url);
    });

    // Load Audios in parallel batches
    const audioPromises = audios.map(async (url) => {
      await this.preloadAudio(url);
      notify(url);
    });

    // Load Videos in parallel batches
    const videoPromises = videos.map(async (url) => {
      await this.preloadVideo(url);
      notify(url);
    });

    await Promise.all([...imagePromises, ...audioPromises, ...videoPromises]);
  }
}

export const assetPreloader = new AssetCache();
