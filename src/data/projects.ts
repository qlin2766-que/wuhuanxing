import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'drift_of_the_unfixed',
    title: '无定之流',
    enTitle: 'Drift of the Unfixed',
    description: '一件由两人合作完成的交互装置作品，将现代社会中不断变化的人际关系转化为一种可被感知的实体流体体验。',
    enDescription: 'A collaborative interactive installation translating shifting modern human relations into a tangible fluid experience.',
    role: '项目共同发起人 / 交互系统设计师与开发',
    enRole: 'Co-Creator & Interaction Developer',
    tools: ['Installation', 'Silicone Hardware', 'Circulation Pump', 'Flow Sensors', 'Interactive Light'],
    category: 'Interaction Hardware / Spatial Media Experiment',
    year: '2024',
    imageBg: 'm -10,30 c 20,-30 40,-45 70,-45 c 30,0 50,20 60,40 c 10,20 -10,50 -30,60 c -20,10 -80,5 -100,-5 c -20,-10 -20,-20 0,-50 Z',
    details: [
      '《无定之流》是一件由两人合作完成的交互装置作品。',
      '受到齐格蒙特·鲍曼的“液态社会”启发，用三十米透明硅胶管和循环水流将抽象人际关系具象化。',
      '观众的按压气囊或遮挡行为实时改变流速，作品处于一种介于可控与不可控之间的动态状态。',
      '反思技术载体与交互体验逻辑的设计博弈，并将这些媒介反思引伸至后期的《泛灵》和《物换星》。'
    ],
    enDetails: [
      '"Drift of the Unfixed" is a collaborative interactive installation created by two artists.',
      'Inspired by Zygmunt Bauman\'s "Liquid Modernity", using 30m of silicone tubing and circulating water to embody shifting human relations.',
      'Squeezing air pumps or blocking flow alters water speed in real time, placing the work in a dynamic state between controllable and uncontrollable.',
      'Reflecting on the design balance between technology and interactive logic, extending these reflections to later works like "ANIMISM" and "Wuhuanxing".'
    ]
  },
  {
    id: 'animism',
    title: '泛灵',
    enTitle: 'ANIMISM',
    description: '一个结合3D Mapping、空间感知与手电筒实体光影交互的一万物有灵沉浸式空间旅程。',
    enDescription: 'An immersive 3D Mapping spatial installation exploring existential wandering, utilizing flashlight interaction to trace nomadic targets.',
    role: '独立创作者 / 空间交互设计师',
    enRole: 'Lead Artist / Interaction Designer',
    tools: ['3D Mapping', 'OpenCV', 'Oscillators', 'Processing / MaxMSP', 'Serial Comm'],
    category: 'Spatial Interaction / Media Art',
    year: '2024',
    imageBg: 'm 30,10 c 35,-20 70,-10 70,30 c 0,35 -30,45 -60,40 c -30,-5 -50,-20 -40,-50 c 10,-30 10,-10 30,-20 Z',
    details: [
      '《泛灵》是一件结合3D Mapping、空间感知与实体交互的沉浸式装置作品。',
      '灵感源自当代青年在不断迁徙和求职迁居中，产生的深刻漂泊感与对自己追逐目标的哲学反思。',
      '以手电筒在投影空间中追踪动态目标的微交互，将“追逐→接近→失去”的逻辑实体化为空间光影循环。',
      '在测试中，人们往往在反复追寻后逐渐放慢脚步、审视周围的空无，用自发的沉静完成自我的心智解压。'
    ],
    enDetails: [
      '"ANIMISM" is an immersive installation combining 3D Mapping, spatial sensing, and physical interaction.',
      'Inspired by the deep sense of drift and philosophical reflection on goals among contemporary youth during frequent relocation and job seeking.',
      'Using flashlight tracking micro-interactions in projected space to materialize the "chase → approach → loss" logic into a spatial light loop.',
      'In testing, people often slowed down after repeated chasing to contemplate the empty space, finding peace through quiet reflection.'
    ]
  },
  {
    id: 'wuxingxing',
    title: '物换星',
    enTitle: 'WUXINGXING',
    description: '一个关于成长、规则与社会期待的架空世界观交互网页实验，探索隐藏在环境与交互之中的非线性叙事。',
    enDescription: 'An interactive web narrative experiment exploring a mysterious school’s rules, growth, and expectations through environmental storytelling.',
    role: '项目发起人 / 独立设计师与开发',
    enRole: 'Solo Creator & Interaction Developer',
    tools: ['Vite', 'React', 'Framer Motion', 'Web Narrative', 'Tailwind'],
    category: 'Worldbuilding Narrative / Interactive Web Experiment',
    year: '2025',
    imageBg: 'm 10,10 c 30,-20 60,0 80,20 c 25,25 0,60 -30,70 c -30,10 -55,-15 -65,-40 c -10,-25 -15,-30 15,-50 Z',
    details: [
      '《物换星》交互网页 Demo 是同名游戏项目的前期实验作品。',
      '将世界观内容从传统文本叙事中抽离，转化为一个网页，用户通过浏览、选择与互动非线性地拼凑真相。',
      '故事发生在一所特殊的学校，学生被划分、评价，并在不断的探索中逐渐意识到规则、自由与期待的博弈。',
      '探索交互逻辑作为叙事本身的可能性，同名独立游戏项目依然在同步开发与持续迭代中。'
    ],
    enDetails: [
      'The "Wuhuanxing" interactive web demo is an early experimental piece for the game project of the same name.',
      'Abstracting worldbuilding lore from linear text into a webpage where users piece together truth non-linearly through browsing and choice.',
      'Set in a peculiar school where students are classified and evaluated, realizing the play between rules, freedom, and expectations.',
      'Exploring interactive logic as narrative itself; the indie game of the same name remains in active development.'
    ]
  },
  {
    id: 'edge_of_irrationality',
    title: '非理智边缘',
    enTitle: 'Edge of Irrationality',
    description: '一件结合身体动作识别、实时视觉生成与AI文本生成的交互实验作品，探索情绪尚未被整理成语言时的感知存在形式。',
    enDescription: 'An interactive physical-virtual sensory field coupling body motion tracking, real-time visuals, and AI-generated narration.',
    role: '独立艺术与系统开发',
    enRole: 'Solo Artist & Systems Developer',
    tools: ['TouchDesigner', 'Body Tracking', 'AI Audio-Visuals', 'Dynamic Typography'],
    category: 'Body Interaction / Real-time Generative Experiment',
    year: '2024',
    imageBg: 'm -20,60 c 40,-40 60,-40 80,0 c 20,40 -20,40 -40,10 c -20,-30 0,-50 0,-10 Z',
    details: [
      '《非理智边缘》结合身体动作识别、实时视觉与AI文本生成，将音乐、身体、情绪与文字连接。',
      '旨在寻找一种绕开逻辑与叙事的表达方式，让观众通过动作与声音反馈，直接浸入未整理入文字的情绪中。',
      '基于 TouchDesigner 开发，交互会实时促变非线性多媒体流动，让情绪在不可定义的抽象流动中投射。',
      '促使创作重点由单纯的“感知效果刺激”反思过渡到更完备的“叙事逻辑与体验系统”深度构建，启迪后续《泛灵》等作。'
    ],
    enDetails: [
      '"Edge of Irrationality" couples body motion tracking, real-time visuals, and AI text generation, connecting music, body, emotion, and words.',
      'Aiming to bypass logical narration, allowing audiences to immerse directly into raw emotions through movement and sound feedback.',
      'Developed in TouchDesigner, interactions drive non-linear media flows in real time, projecting emotions into abstract motion.',
      'Shifting focus from simple sensory stimuli to deep construction of narrative systems, inspiring subsequent works like "ANIMISM".'
    ]
  },
  {
    id: 'explorations_archive',
    title: '探索档案室',
    enTitle: 'Explorations Archive',
    description: '这些实验记录了我在不同媒介中的探索过程。它们并非完整项目，而是创作过程中留下的片段、测试与尝试。',
    enDescription: 'A playground archive documenting various creative clips, physical tests, and code experiments across multiple mediums.',
    role: '创作者 / 媒介实验员',
    enRole: 'Creator / Media Lab Researcher',
    tools: ['TouchDesigner', 'Blender', 'Unity', 'HTML/JS', 'LLM'],
    category: 'Creative Technology Lab / Sketches',
    year: '2024-2025',
    imageBg: 'm 10,70 c 20,-50 80,-50 100,0 c -10,30 -90,30 -100,0',
    details: [
      '包含动态歌词海报、粒子动作实验、生成文字实验、角色动画等多维创意媒介探索片段。',
      '不是最终的商业项目或大型装置，而是饱含好奇心、用于探索材质特征和感官互动的先锋程序测试。',
      '部分实验已经被有机地吸收、拓展，并在后续如《无定之流》与《泛灵》大作中获得了长足的应用。'
    ],
    enDetails: [
      'Contains creative media exploration clips including kinetic typography, particle physics, generative text, and character animation.',
      'Not commercial projects or massive installations, but curious code experiments testing texture traits and sensory interactions.',
      'Several experiments have been organically absorbed and extended into major projects like "Drift of the Unfixed" and "ANIMISM".'
    ]
  },
  {
    id: 'telescope_dust',
    title: '尘埃望远镜',
    enTitle: 'Telescope Dust',
    description: '一个利用超高精度振动传感器，将落在玻璃面板上的微小灰尘敲击转化为星云画布的物理媒介艺术。',
    enDescription: 'A generative viewport translating physical micro-dust settling on glass panels into procedural active stargazing nebulas.',
    role: '物理媒介系统工程师',
    enRole: 'Creative Hardware Engineer',
    tools: ['Tone.js', 'HTML5 Canvas', 'Oscilloscopes', 'Solid State Sensors'],
    category: 'Sensing installation',
    year: '2025',
    imageBg: 'm 30,30 c 15,-15 45,-15 60,0 c 15,15 15,45 0,60 c -15,15 -15,-45 -60,-60 Z',
    details: [
      '高精度固态振动发生探针，实时将落在光学玻璃表面的微落叶尘埃压力重标。',
      '灰尘颗粒的落点在数字画布上化作超新星爆发核，颗粒质量越轻、扩散和声越加寂寥。',
      '声音采用温暖舒缓的和弦，探索“宇宙是一粒不可见的灰尘，而落下的尘埃则是一个倒影”的微观哲学。',
      '在快餐式的像素泛滥时代，试图唤起人们对那些遗忘、微末、失焦事物的瞩目凝视。'
    ],
    enDetails: [
      'High-precision solid-state vibration sensors map the micro-pressure of dust particles settling on optical glass in real time.',
      'Dust contact points transform into supernova cores on the digital canvas; lighter particles yield sparser, quieter harmonic diffusion.',
      'Soothed by warm chords, exploring the micro-philosophy: "The universe is an invisible dust, and falling dust is its reflection."',
      'In an era overwhelmed by fast-paced pixels, attempting to draw gaze toward forgotten, tiny, and out-of-focus details.'
    ]
  },
  {
    id: 'paper_lighthouse',
    title: '纸上灯塔',
    enTitle: 'Paper Lighthouse',
    description: '扫描练习簿边缘的潦草笔记和涂鸦，在网页终端实时渲染，以一道孤独的灯塔光流照亮整个无尽黑夜的墨水深渊。',
    enDescription: 'A mobile generative scanner reading student margins, rendering a 3D procedural lighthouse casting light over abstract ink waves.',
    role: '机器视觉与渲染程序员',
    enRole: 'Computer Vision & Rendering Developer',
    tools: ['React', 'Three.js', 'SVG Filter', 'OpenCV.js'],
    category: 'Visual Archeology',
    year: '2025',
    imageBg: 'm 50,15 l 28,65 l -56,0 z',
    details: [
      '核心算法：边缘提取，自动探测扫描出的白纸边缘墨印起伏，将其转换为巍峨的礁石断崖地形。',
      '灯塔的光柱随着鼠标或手指拖拽旋转，被它扫到的潦草画痕会动态泛起发光的粒子重组，转化为温热的信息碎片。',
      '用虚空间中的微光交互，纪念那些在枯燥的、按部就班的学习生涯中，课本边缘闪烁过的纯净狂想。',
      '探索触手可得的平凡草稿所承载的巨大生命活力，给青春一张随时可以返航的温暖坐标图。'
    ],
    enDetails: [
      'Core algorithm: Edge extraction detecting ink contours on scanned notebook paper, converting them into towering cliff terrain.',
      'The lighthouse beam rotates with drag interactions; scribbles caught in the light dissolve into glowing particle recombinations.',
      'Using subtle light interactions in virtual space to honor pure reveries flickered on textbook margins during routine study years.',
      'Exploring the vibrant vitality carried in everyday drafts, providing a warm coordinate map for returning to youth.'
    ]
  }
];
