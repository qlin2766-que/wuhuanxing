import React from 'react';

// ============================================================================
// CENTRALIZED ASSET MANAGEMENT SYSTEM
// ============================================================================
// All visual elements, media URLs, SVG path coordinates, and immersive interactive 
// media placeholders (Lottie, GLB 3D, WebM Videos) are registered here.
// To modify, upgrade, or replace any graphic asset or 3D/video layer in the future,
// you ONLY need to update this single configuration file.
// ============================================================================

export interface ImageAsset {
  src: string;
  alt: string;
  description?: string;
  enabled?: boolean; // Toggle override
}

export interface VideoAsset {
  enabled: boolean; // Set to true to switch from SVG/static fallback to high-quality responsive WebM video loop
  src: string;      // Absolute path or CDN URL to the WebM file
  poster?: string;  // Image fallback shown during loading
  className?: string;
}

export interface LottieAsset {
  enabled: boolean; // Set to true to replace static vectors with dynamic Lottie JSON animation
  jsonUrl: string;  // Path or CDN URL to the Lottie player data JSON file
  loop: boolean;
  autoplay: boolean;
}

export interface GlbAsset {
  enabled: boolean; // Set to true to mount standard WebGL canvas / @react-three/fiber 3D viewer
  modelUrl: string; // URL to the .glb / .gltf binary model asset file
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export interface AssetRegistry {
  metadata: {
    systemName: string;
    version: string;
    lastUpdated: string;
  };
  
  // 1. IMAGE ASSETS (No hardcoded paths in components)
  images: {
    qlinProfile: ImageAsset;
    logoFallback: ImageAsset;
    certStamp: ImageAsset;
    // NEW: Home screen title logo image override
    homeTitleLogo: ImageAsset;
    // NEW: Home screen top emblem logo image override
    homeTopEmblem: ImageAsset;
    // NEW: Foreground trees image override
    treesForeground: ImageAsset;
    treesLayer0: ImageAsset;
    treesLayer1: ImageAsset;
    treesLayer2: ImageAsset;
    treesLayer3: ImageAsset;
    // NEW: Falling leaf image override
    fallingLeafPlaceholder: ImageAsset;
    // NEW: Dossier paper texture background png override
    questionnaireCardBg: ImageAsset;
    // NEW: Three distinct resume portrait PNGs
    girlStudent: ImageAsset;
    girlCreator: ImageAsset;
    girlArtPractitioner: ImageAsset;
    // NEW: Portfolio dynamic card image overrides
    portfolioProjects: Record<string, {
      cardImageSrc?: string;      // Image override path for the primary list card
      detailImageSrc?: string;    // Image override path inside details reader modal
      videoEmbedEnabled?: boolean; // Set true to load embedding iframe/player below
      videoEmbedUrl?: string;     // Embed url e.g. "https://www.youtube.com/embed/..." or direct webm URL
      staticPortfolioImages?: string[]; // Array of static portfolio document / slides images (e.g. 物换星 0..10)
    }>;
  };

  // 2. POETIC SVG ILLUSTATIONS & VECTOR SHAPES/PATHS
  svgs: {
    // Intro scene blobs
    introBlobAbout: string;
    introBackgroundLines: {
      leftCurve: string;
      topHorizontal: string;
    };
    // Questionnaire / Character silhouettes (Avatar fallbacks)
    questionnaireStamp: {
      textLine1: string;
      textLine2: string;
    };
    identities: {
      art_practitioner: {
        hornLeft: string;
        hornRight: string;
        body: string;
        tie: string;
      };
      creator: {
        hairLeft: string;
        hairRight: string;
        hairTop: string;
        body: string;
      };
      student: {
        questionMarkerLeft: string;
        questionMarkerRight: string;
        body: string;
      };
    };
    // Character bodies inside Chapter 04 (Scale Girl weight test)
    scaleGirlBodies: {
      art_practitioner: string;
      student: string;
      creator: string;
    };
    // NEW: Balance Scale visual elements (Base, cross lever, left/right pan hooks)
    scaleElements: {
      base: string;     // Base triangular prism coordinates
      pivotPin: string; // Anchor circular pins config or path
      leverCross: string; // Lever bar path drawing option
      leftPanString1: { x1: number; y1: number; x2: number; y2: number };
      leftPanString2: { x1: number; y1: number; x2: number; y2: number };
      leftPanBase: string; // Left pan flat path
      rightPanString1: { x1: number; y1: number; x2: number; y2: number };
      rightPanString2: { x1: number; y1: number; x2: number; y2: number };
      rightPanBase: string; // Right pan flat path
    };
    // NEW: Customizable falling shapes on calibration page
    scaleShapes: {
      circle: string; // Dynamic path or formula coordinates
      triangle: string;
      star: string;
    };
    // Heart and Feather Scene SVGs
    heartFeather: {
      connectionRay: (patience: number) => string;
      leftDossierPath: string;
      rightDossierPath: string;
      jointCorePath: string;
    };
    // Memory teeth nodes
    wisdomToothMemories: {
      tooth: string;
      bicycle: string;
      headphones: string;
      draft: string;
    };
  };

  // 3. LOTTIE ANIMATIONS PLACEHOLDERS (Future-proof replacement)
  lottie: {
    introAmbient: LottieAsset;
    scaleBalanceTick: LottieAsset;
    empathyUnionFlow: LottieAsset;
    toothEruption: LottieAsset;
  };

  // 4. GLB 3D MODELS PLACEHOLDERS (Future Three.js / R3F replacement)
  glb: {
    isometricAvatarRoom: GlbAsset;
    balanceScaleSystem: GlbAsset;
    wisdomToothJaw3D: GlbAsset;
    ambientProjectParticles: GlbAsset;
  };

  // 5. WEBM VIDEO LOOPS PLACEHOLDERS (Optimized transparent/alpha recordings)
  webm: {
    breathingTideBackground: VideoAsset;
    heartFeatherOrganicEthers: VideoAsset;
    unconsciousVoidParticleDraft: VideoAsset;
    // NEW: Home/Menu big background movie override
    homeBackground: VideoAsset;
    // NEW: Home/Menu big foreground movie override
    homeForegroundWebm: VideoAsset;
    // NEW: Home/Menu sharp foreground WebM (unblurred / unaffected by post-processing)
    homeSharpForegroundWebm: VideoAsset;
    // NEW: Transition WebM clip between Scale Girl & Growth pages
    transitionScaleToGrow: VideoAsset;
    // NEW: Transition WebM clip between Growth & Understanding pages
    transitionGrowToUnderstand: VideoAsset;
  };
}

export const assets: AssetRegistry = {
  metadata: {
    systemName: 'QLin Interactive Narrative Base Asset System',
    version: '1.5.0',
    lastUpdated: '2026-06-13',
  },

  // ==========================================================================
  // 1. IMAGE ASSETS CONFIG
  // ==========================================================================
  images: {
    qlinProfile: {
      src: '/src/assets/images/portf1.jpg',
      alt: '林经纬 QLin - Lead designer and media interaction artist avatar',
      description: 'The primary profile portrait featured in basic identity dossier card.',
    },
    logoFallback: {
      src: '', // Optional future logo path
      alt: 'Wuhuanxing Creative Logo',
    },
    certStamp: {
      src: '', // Optional certified watermark PNG override
      alt: 'Official Metric Department Ink stamp',
    },
    // NEW: Home screen logo image to replace the big text "物换星" in the future
    homeTitleLogo: {
      enabled: true, // Turn on to substitute the title "物换星" with a custom image logo
      src: '/src/assets/images/logo1.png',
      alt: '物换星 Wuhuanxing Official Brand Logo',
    },
    // NEW: Home screen top emblem logo image override (replaces the upper SVG)
    homeTopEmblem: {
      enabled: true, // Turn on to replace the top SVG emblem with a custom logo image
      src: '/src/assets/images/logo4.png',
      alt: '物换星 Wuhuanxing Official Top Emblem',
    },
    // NEW: Foreground trees overlay pinned at home bottom (disabled, replaced by multi-layer)
    treesForeground: {
      enabled: false, // Turn on to overlay trees foreground silhouette PNG at home screen bottom
      src: '/src/assets/images/树木前景.png',
      alt: '树木前景 Trees Foreground Silhouette',
    },
    treesLayer0: {
      enabled: true,
      src: '/src/assets/images/树冠0.png',
      alt: '树冠0 (最底层)',
    },
    treesLayer1: {
      enabled: true,
      src: '/src/assets/images/树冠1.png',
      alt: '树冠1 (第二层)',
    },
    treesLayer2: {
      enabled: true,
      src: '/src/assets/images/树冠2.png',
      alt: '树冠2 (第三层)',
    },
    treesLayer3: {
      enabled: true,
      src: '/src/assets/images/树冠3.png',
      alt: '树冠3 (最顶层)',
    },
    // NEW: Falling leaf image source for animation
    fallingLeafPlaceholder: {
      enabled: true, // Turn on to use the custom leaf PNG for falling leaf animation
      src: '/src/assets/images/树叶0.png',
      alt: '飘落树叶 Falling Leaf silhouette',
    },
    // NEW: Dossier paper texture background png
    questionnaireCardBg: {
      enabled: false, // Turn on to substitute the beige dossier card backplate with a PNG texture
      src: '/src/assets/images/dossier_paper_bg.png',
      alt: 'Ink dossier paper texture backdrop',
    },
    // NEW: Three distinct resume portrait PNGs
    girlStudent: {
      src: '/src/assets/images/girl1.png',
      alt: 'Naive Student Portrait (girl1.png)',
    },
    girlCreator: {
      src: '/src/assets/images/girl2.png',
      alt: 'Late-night Creator Portrait (girl2.png)',
    },
    girlArtPractitioner: {
      src: '/src/assets/images/girl3.png',
      alt: 'Art Practitioner Portrait (girl3.png)',
    },
    // NEW: Centralized Portfolio Custom images and custom video embeds
    portfolioProjects: {
      drift_of_the_unfixed: {
        cardImageSrc: '/src/assets/作品集/无定之流/无定之流封面1.jpg',
        detailImageSrc: '/src/assets/作品集/无定之流/无定之流2.jpg',
        videoEmbedEnabled: true,
        videoEmbedUrl: '/src/assets/作品集/无定之流/IMG_1608.mov',
      },
      animism: {
        cardImageSrc: '/src/assets/作品集/泛灵/泛灵海报.png',
        detailImageSrc: '/src/assets/作品集/泛灵/泛灵海报.png',
        videoEmbedEnabled: false,
        videoEmbedUrl: '',
      },
      wuxingxing: {
        cardImageSrc: '/src/assets/作品集/物换星/物换星海报.png',
        detailImageSrc: '/src/assets/作品集/物换星/物换星海报.png',
        videoEmbedEnabled: false,
        videoEmbedUrl: '',
        staticPortfolioImages: [
          '/src/assets/作品集/物换星/物换星0.png',
          '/src/assets/作品集/物换星/物换星1.png',
          '/src/assets/作品集/物换星/物换星2.png',
          '/src/assets/作品集/物换星/物换星3.png',
          '/src/assets/作品集/物换星/物换星4.png',
          '/src/assets/作品集/物换星/物换星5.png',
          '/src/assets/作品集/物换星/物换星6.png',
          '/src/assets/作品集/物换星/物换星7.png',
          '/src/assets/作品集/物换星/物换星8.png',
          '/src/assets/作品集/物换星/物换星9.png',
          '/src/assets/作品集/物换星/物换星10.png',
        ],
      },
      edge_of_irrationality: {
        cardImageSrc: '/src/assets/作品集/非理性边缘/非理性边缘海报.png',
        detailImageSrc: '/src/assets/作品集/非理性边缘/非理性边缘海报.png',
        videoEmbedEnabled: false,
        videoEmbedUrl: '',
      },
      clockwork_greenhouse: {
        cardImageSrc: '',
        detailImageSrc: '',
        videoEmbedEnabled: false,
        videoEmbedUrl: '',
      },
      telescope_dust: {
        cardImageSrc: '',
        detailImageSrc: '',
        videoEmbedEnabled: false,
        videoEmbedUrl: '',
      },
      paper_lighthouse: {
        cardImageSrc: '',
        detailImageSrc: '',
        videoEmbedEnabled: false,
        videoEmbedUrl: '',
      }
    }
  },

  // ==========================================================================
  // 2. SVG VECTOR PATHS CONFIG
  // ==========================================================================
  svgs: {
    introBlobAbout: "M -38,-10 C -38,-35 -15,-38 10,-38 C 35,-38 38,-15 38,10 C 38,35 15,38 -10,38 C -35,38 -38,15 -38,-10 Z",
    introBackgroundLines: {
      leftCurve: "M 120,0 C 220,280 180,580 380,1100",
      topHorizontal: "M 0,140 Q 550,110 1200,160",
    },
    questionnaireStamp: {
      textLine1: 'OFFICIAL CERTIFIED',
      textLine2: 'METRIC SYSTEM',
    },
    identities: {
      art_practitioner: {
        hornLeft: "M 35,30 Q 30,10 40,25",
        hornRight: "M 65,30 Q 70,10 60,25",
        body: "M 20,85 L 35,56 L 65,56 L 80,85",
        tie: "M 48,72 L 52,72 L 53,88 L 50,92 L 47,88 Z",
      },
      creator: {
        hairLeft: "M 30,22 C 30,5 70,5 70,22",
        hairRight: "C 75,10 25,10 30,22",
        hairTop: "M 30,22 C 30,5 70,5 70,22 C 75,10 25,10 30,22",
        body: "M 22,85 C 28,62 38,51 50,51 C 62,51 72,62 78,85 Z",
      },
      student: {
        questionMarkerLeft: "?",
        questionMarkerRight: "?",
        body: "M 28,85 Q 26,60 50,60 Q 74,60 72,85 Z",
      },
    },
    scaleGirlBodies: {
      // Postures of the hanging character representing their respective burdens of identity parameters
      art_practitioner: "M 185,110 L 165,260 A 10,10 0 0,0 175,270 L 225,270 A 10,10 0 0,0 235,260 L 215,110 Z",
      student: "M 175,150 C 145,150 145,260 200,260 C 255,260 255,150 225,150 Z",
      creator: "M 180,120 Q 145,175 185,255 T 225,130 Z",
    },
    // NEW: Centralized configurable paths for the balance scale geometry vectors
    scaleElements: {
      base: "M 282,340 L 318,340 L 300,210 Z", // Central support column pyramid
      pivotPin: "M 300 210", // Position pointer for pivot
      leverCross: "M 100,210 L 500,210", // Straight horizontal bar
      leftPanString1: { x1: 120, y1: 210, x2: 55, y2: 285 },
      leftPanString2: { x1: 120, y1: 210, x2: 185, y2: 285 },
      leftPanBase: "M 35,285 L 205,285",
      rightPanString1: { x1: 480, y1: 210, x2: 415, y2: 285 },
      rightPanString2: { x1: 480, y1: 210, x2: 545, y2: 285 },
      rightPanBase: "M 395,285 L 565,285",
    },
    // NEW: Customizable falling shapes on calibration page
    scaleShapes: {
      circle: "M 0 0 A 18 18 0 1 1 0.01 0 Z", // Circle path formula 
      triangle: "M 0,-18 L -20,16 L 20,16 Z", // Centered triangle
      star: "", // Calculated dynamically via helper, but supports fallback static path coordinates too
    },
    heartFeather: {
      connectionRay: (patience: number) => `M ${100 + patience * 1.5},150 Q 250,${150 - patience * 0.3} ${400 - patience * 1.5},150`,
      leftDossierPath: "M 90,40 C 90,20 60,10 50,20 C 40,30 50,50 60,60 C 50,70 30,100 20,130 C 10,160 15,190 30,195 C 45,200 80,195 85,180 C 90,165 75,130 90,40 Z",
      rightDossierPath: "M 90,40 C 90,20 60,10 50,20 C 40,30 50,50 60,60 C 50,70 30,100 20,130 C 10,160 15,190 30,195 C 45,200 80,195 85,180 C 90,165 75,130 90,40 Z",
      jointCorePath: "M 50,30 C 45,15 20,15 20,40 C 20,60 50,85 50,85 C 50,85 80,60 80,40 C 80,15 55,15 50,30 Z",
    },
    wisdomToothMemories: {
      tooth: "M 30,20 C 35,15 45,15 50,22 C 55,15 65,15 70,20 C 75,30 75,50 65,70 C 60,80 55,75 50,90 C 45,75 40,80 35,70 C 25,50 25,30 30,20 Z",
      bicycle: "M 10,10 L 90,90", // stylized geometry placeholder representation
      headphones: "M 30,70 C 20,40 80,40 70,70",
      draft: "M 30,20 M 30,20 w 40 h 60",
    }
  },

  // ==========================================================================
  // 3. LOTTIE ANIMATIONS PLACEHOLDERS
  // ==========================================================================
  lottie: {
    introAmbient: {
      enabled: false, // Default is false, falling back to clean CSS
      jsonUrl: '/src/assets/lottie/intro_ambient.json',
      loop: true,
      autoplay: true,
    },
    scaleBalanceTick: {
      enabled: false, 
      jsonUrl: '/src/assets/lottie/scale_girl_weight_balance.json',
      loop: false,
      autoplay: false,
    },
    empathyUnionFlow: {
      enabled: false, 
      jsonUrl: '/src/assets/lottie/empathy_union_flow.json',
      loop: true,
      autoplay: true,
    },
    toothEruption: {
      enabled: false, 
      jsonUrl: '/src/assets/lottie/tooth_grow.json',
      loop: false,
      autoplay: false,
    },
  },

  // ==========================================================================
  // 4. GLB 3D MODELS PLACEHOLDERS
  // ==========================================================================
  glb: {
    isometricAvatarRoom: {
      enabled: false, 
      modelUrl: '/src/assets/glb/avatar_studio_room.glb',
      scale: [1, 1, 1],
    },
    balanceScaleSystem: {
      enabled: false, 
      modelUrl: '/src/assets/glb/weight_scale_girl.glb',
      scale: [2.5, 2.5, 2.5],
      position: [0, -2, 0],
    },
    wisdomToothJaw3D: {
      enabled: false,
      modelUrl: '/src/assets/glb/tooth_jaw_poetic.glb',
      position: [0, 0, 0],
    },
    ambientProjectParticles: {
      enabled: false,
      modelUrl: '/src/assets/glb/particles.glb',
    }
  },

  // ==========================================================================
  // 5. WEBM HIGH-QUALITY ORGANIC VIDEO CODES
  // ==========================================================================
  webm: {
    breathingTideBackground: {
      enabled: false, 
      src: '/src/assets/video/tide_breathing.webm',
      poster: '/src/assets/images/video_poster_fallback.jpg',
    },
    heartFeatherOrganicEthers: {
      enabled: false, 
      src: '/src/assets/video/ether_spark_empathy.webm',
    },
    unconsciousVoidParticleDraft: {
      enabled: false, 
      src: '/src/assets/video/ink_bleeding.webm',
    },
    // NEW: Home/Menu screen big background loop, can be replaced in the future
    homeBackground: {
      enabled: true, // Set to true to display home background video layer (2.webm)
      src: '/src/assets/video/2.webm',
      poster: '/src/assets/images/home_bg_fallback.jpg',
    },
    // NEW: Home/Menu screen foreground sway loop (such as trees swaying overlay)
    homeForegroundWebm: {
      enabled: true,
      src: '/src/assets/video/1.webm',
      poster: '/src/assets/images/video_poster_fallback.jpg',
    },
    // NEW: Home/Menu sharp foreground WebM loop that is untouched by blur effects
    homeSharpForegroundWebm: {
      enabled: true,
      src: '/src/assets/video/5.webm',
      poster: '/src/assets/images/video_poster_fallback.jpg',
    },
    // NEW: Transition WebM clip between Scale Girl & Growth pages
    transitionScaleToGrow: {
      enabled: false,
      src: '/src/assets/video/transition_scale_to_grow.webm',
    },
    // NEW: Transition WebM clip between Growth & Understanding/Heart-feather pages
    transitionGrowToUnderstand: {
      enabled: false,
      src: '/src/assets/video/transition_grow_to_understand.webm',
    }
  }
};
