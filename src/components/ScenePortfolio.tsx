import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { PROJECTS } from '../data/projects';
import { 
  Bookmark, 
  Cpu, 
  Award, 
  Volume2, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Activity, 
  Database,
  ArrowLeft,
  Layers
} from 'lucide-react';
import { audioManager } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { assets } from '../utils/assets';

interface ScenePortfolioProps {
  isEnglish: boolean;
  onEnterWorld?: () => void;
  isDialogueCompleted?: boolean;
}

const ANIMISM_SECTIONS = [
  {
    title: '项目简介',
    enTitle: 'Project Introduction',
    summary: '《泛灵》是一件结合3D Mapping、空间感知与实体交互的沉浸式装置作品。',
    enSummary: 'An immersive 3D Mapping spatial installation exploring existential wandering, utilizing flashlight interaction to trace nomadic targets.',
    details: [
      '项目以奥德赛神话中的漫长归途与“万物有灵论”的世界观为灵感，将人生中不断追逐、失去、回归的状态转化为一段可被感知的空间旅程。',
      '观众通过手电筒与光影进行互动，在追逐某个目标的过程中不断遭遇偏离、转移与消失，最终回到最初的位置。',
      '作品试图讨论当代青年在二十至三十岁阶段普遍存在的漂浮感与不确定性。当社会不断鼓励人们追逐更远的目标时，我们是否仍然能够停下来思考，自己真正想要抵达的地方是什么？'
    ],
    enDetails: [
      'Inspired by Odyssey\'s homecoming journey and animism, translating chase, loss, and return into a tangible journey.',
      'Audience uses flashlights to interact with light and shadow, encountering deviations and disappearance of targets.',
      'Discusses the wandering and uncertainty felt by contemporary youth aged 20-30. When society encourages chasing endless goals, can we pause and reflect on what we truly desire?'
    ]
  },
  {
    title: '创作背景',
    enTitle: 'Creative Background',
    summary: '过去几年里，我和身边许多朋友都因升学、求职、搬迁而体验着深刻的漂浮感。',
    enSummary: 'Reflecting the nomadic shifting of modern generation going through graduation, recruitment, and constant relocations.',
    details: [
      '毕业、升学、求职、迁居、进入新的城市。新的机会不断出现，新的目标也不断被提出。',
      '我们似乎始终在前往某个更好的地方，却很难明确回答自己究竟在追逐什么。这种感受让我联想到《奥德赛》中漫长的归乡旅程。主人公不断前进，却不断被新的事件带离原本的航线。',
      '而在许多古老的万物有灵观念中，人并不是世界的中心，而只是庞大循环中的一部分。如果是这样，在循环中追逐是否仍然具有意义？'
    ],
    enDetails: [
      'In the past years, my friends and I migrated frequently across cities, with new targets and options constantly emerging.',
      'We always seem to head toward a better place but can\'t answer what we are chasing. This resembles Odyssey, where the protagonist is continuously drifted and detoured.',
      'In ancient animistic perspectives, humans are not the center but parts of a cyclic loop. If life is cyclic rather than linear, does the chase still hold meaning?'
    ]
  },
  {
    title: '设计与实现',
    enTitle: 'Design & Implementation',
    summary: '项目以“追逐 → 接近 → 失去 → 追逐”的循环结构作为核心体验逻辑与视觉重标。',
    enSummary: 'Featuring a tight "chase -> approach -> lose" cyclic feedback loop with precise 3D mapping overlay.',
    details: [
      '观众通过手电筒在空间中寻找并追踪投影中的目标。当目标即将被捕获时，它会产生变形、迁移或消散，并在空间的另一处重新出现。',
      '在体验过程中，观众不断做出选择：继续追逐、停下观察、改变方向，或回到起点。这些行为共同构成一段关于寻找与失去的旅程。',
      '技术实现上，项目结合了3D Mapping、实时视觉反馈与空间交互系统，使观众的行为能够即时影响投影内容与物理空间状态。'
    ],
    enDetails: [
      'Audience traces projected abstract elements using flashlights. When a target is about to be captured, it deforms, migrates, or dissipates.',
      'During the test, participants made active choices: to pursue, stop and watch, redirect, or go back to start, crafting their unique path.',
      'Built using custom 3D Mapping projection masks, real-time computer vision tracking, and low-latency feedback architecture.'
    ]
  },
  {
    title: '项目反思',
    enTitle: 'Project Reflection',
    summary: '在测试中，我发现许多人会在反复追逐后放慢脚步转向审视自身，用自发的沉静确立回归。',
    enSummary: 'Testers shifted from frantic chasing to quiet contemplation, validating the central artistic inquiry.',
    details: [
      '相比单纯的视觉表现，我更关注观众在体验过程中产生的情绪变化。',
      '许多人会在反复追逐后逐渐放慢脚步，开始观察周围环境，而不再执着于追上目标本身。这种行为变化恰好回应了项目最初提出的问题。',
      '未来我希望进一步强化观众行为与叙事之间的关联，使每一次选择都能够留下更加清晰的痕迹，从而构建更完整的空间叙事。'
    ],
    enDetails: [
      'Focused on emotional feedback rather than purely technical display.',
      'Testers slowed down after repeated chases, choosing to observe and embrace the environment instead of frantically reaching targets.',
      'In the future, I plan to leave durable path traces of user choices, deepening the spatial narrative complexity.'
    ]
  }
];

const WUXINGXING_SECTIONS = [
  {
    title: '项目简介',
    enTitle: 'Project Introduction',
    summary: '《物换星》交互网页 Demo 是同名游戏项目的前期实验作品，探索将世界观抽离为交互网页的非线性叙事。',
    enSummary: 'A web-based worldbuilding demo of the game WUXINGXING, exploring nonlinear environmental storytelling.',
    details: [
      '在构思《物换星》的过程中，我发现许多关于成长、身份认同与人生选择的体验，并不适合仅通过线性叙事传达。相比直接讲述一个故事，我更希望让观众主动探索、发现，并逐渐拼凑出自己对于这个世界的理解。',
      '因此，我尝试将部分世界观内容从传统文本叙事中抽离，转化为一个可探索的交互网页。',
      '网站以非线性的结构组织信息，用户通过浏览、选择与互动逐步接触隐藏在页面中的内容。每一次点击都不仅是信息获取的过程，也是理解世界规则的过程。',
      '这个 Demo 并非游戏本体，而是一次关于叙事媒介的实验。我希望探索：当故事不再依赖角色对白与剧情推进，而是隐藏在环境、符号与交互行为之中时，玩家将如何理解它。'
    ],
    enDetails: [
      'In conceiving WUXINGXING, I realized that growth, identity, and personal choice are best conveyed non-linearly. Rather than telling a passive story, I want the audience to actively discover the world rules themselves.',
      'I abstracted parts of the world lore from traditional text format into an interactive, explorable webpage.',
      'The structure organizes information non-linearly. Every interactive choice or click is not just obtaining data, but an act of understanding structural rules.',
      'This demo represents a medium-centric paradigm shift, exploring how story emerges from environments, icons, and micro-interactions without heavy dialogue.'
    ]
  },
  {
    title: '创作背景',
    enTitle: 'Creative Background',
    summary: '起点来源于对成长惯性与目标的长期观察，引发关于社会追寻标准和人生选择的疑问与反思。',
    enSummary: 'Originating from life-long observation of academic pressure, social rating metrics, and the emptiness of endless goals.',
    details: [
      '《物换星》的起点来源于我对成长过程的长期观察。',
      '从升学、考试到职业选择，我们似乎总是在沿着某种既定轨迹前进。社会不断提供明确的评价标准，而个体也在不断追逐下一个目标。',
      '然而，当一个目标被完成之后，新的目标又会立刻出现。',
      '在这种持续向前的惯性中，我开始思考：如果不预存一个人生的绝对正确答案，我们究竟是在追逐什么？',
      '围绕这个问题，我逐渐构建出了《物换星》的世界观，并尝试通过不同媒介去呈现其中的主题。'
    ],
    enDetails: [
      'The project stems from my long-term observation of expectations—from examinations to careers, we seem locked onto predetermined tracks.',
      'Society continuously yields assessment metrics, pushing individuals to chase the next checkpoint, only to see another replace it instantly.',
      'Amidst this perpetual thrust, I wondered: if there isn\'t a single "correct" destination or answer, what are we chasing?',
      'Around this inquiry, I engineered the lore of WUXINGXING and expressed it across mixed experimental media.'
    ]
  },
  {
    title: '世界观构建',
    enTitle: 'Worldbuilding Structure',
    summary: '故事发生在一所特殊的学校，学生被划分、评价、引导，最终揭开真实社会规则与期待的博弈。',
    enSummary: 'Set in a mysterious academy where student talents are classified, discussing freedom, expectations, and rules.',
    details: [
      '《物换星》的故事发生在一所特殊的学校。',
      '这里聚集着拥有不同天赋的学生，他们被划分、评价，并被引导走向各自被期待的人生轨迹。',
      '表面上，这是一所关于成长与教育的学校。',
      '但随着探索不断深入，玩家会逐渐意识到，这个世界讨论的并不仅仅是校园生活，而是人与规则、自由与选择、自我认知与社会期待之间的关系。',
      '我希望通过一个带有轻微怪诞色彩的架空世界，将现实中难以被直接讨论的情绪与经验转化为可被感知的体验。'
    ],
    enDetails: [
      'The narrative unfolds inside a peculiar academy grouping students with distinct talents under restrictive classification systems.',
      'Outwardly dealing with education and academic transition, deeper exploration reveals structural power patterns, rules vs. freedom, and selfhood under societal gaze.',
      'Using a slightly surrealist, uncanny world framework, I localized contemporary youth anxieties into touchable interactive metaphors.'
    ]
  },
  {
    title: '设计与实现',
    enTitle: 'Design & Implementation',
    summary: '刻意弱化传统导航，让页面结构、交互行为与视觉符号共同承担非线性世界规则的设计转译。',
    enSummary: 'Deliberately thinning classical navigation, converting UI anatomy and interactions into active parts of story rules.',
    details: [
      '在网页 Demo 的设计过程中，我刻意弱化了传统导航结构。',
      '用户不会按照固定顺序阅读内容，而是在探索过程中不断遭遇新的信息、隐喻与选择。',
      '我尝试将叙事融入界面本身：',
      '页面结构成为世界规则的一部分；交互行为成为理解内容的方式；符号与视觉元素承担部分叙事功能；',
      '相比于直接传达结论，我更关注用户在探索过程中产生的感受与联想。'
    ],
    enDetails: [
      'In the web demo, standard navigation lists are removed to encourage orientation loss, stumbling upon metadata fragments and symbols.',
      'The UI anatomy mirrors the school rules; clicking and scrolling become simulated tasks, and icons convey partial semantic layers.',
      'Instead of throwing predefined results, I prioritize users sparking personal connections through free-form web exploration.'
    ]
  },
  {
    title: '项目反思',
    enTitle: 'Project Reflection',
    summary: '叙事不仅在文本中，也存在于交互逻辑中；未来将继续深耕环境叙事并推出完整版独立游戏。',
    enSummary: 'Realizing story-arcs reside within user paths and system rules, shifting toward the standalone game version.',
    details: [
      '《物换星》是我持续时间最长的个人项目之一。',
      '它让我开始从单纯的内容创作转向对媒介本身的思考。',
      '在开发过程中，我逐渐意识到，叙事不仅存在于文本之中，也存在于空间、界面、交互逻辑以及用户的行为路径之中。',
      '目前网页 Demo 仍在持续迭代，而同名游戏项目也在同步开发。',
      '未来我希望继续探索交互设计、环境叙事与游戏媒介之间的关系，并将这些实验进一步扩展为完整的游戏体验。'
    ],
    enDetails: [
      'As my longest-running personal project, WUXINGXING pivoted my perspective from simple content generation to holistic media research.',
      'Narratives live not just in textual paragraphs, but inside CSS flows, button logic, feedback delay, and navigation footprints.',
      'While the web demo updates iteratively, the full game is under active concurrent design.',
      'I seek to push limits on where system design and ludic narrative intersect, bridging digital art and full gameplay loops.'
    ]
  }
];

const DRIFT_SECTIONS = [
  {
    title: '项目简介',
    enTitle: 'Project Introduction',
    summary: '《无定之流》是一件两人合作完成的交互装置作品，将现代社会中不断变化的人际关系转化为可被感知的动态流体体验。',
    enSummary: 'A collaborative interactive installation translating shifting modern human relations into sensory fluid dynamics.',
    details: [
      '《无定之流》是一件由两人合作完成的交互装置作品。',
      '项目受到社会学家齐格蒙特·鲍曼（Zygmunt Bauman）提出的“液态社会（Liquid Modernity）”概念启发，尝试将现代社会中不断变化的人际关系转化为一种可被感知的实体体验。',
      '我们使用约三十米透明硅胶管道构建装置主体，并让水流在系统中持续循环。观众的行为将影响水流的状态与流动路径，使整个装置始终处于动态变化之中。',
      '通过将关系具象化为流体，我们试图讨论一种普遍存在于当代生活中的经验：人与人之间的联系正在变得更加自由，也更加不稳定。'
    ],
    enDetails: [
      'Drift of the Unfixed is a collaborative interactive installation.',
      'Inspired by Zygmunt Bauman\'s concept of "Liquid Modernity," it translates modern fluid relationships into concrete tactile encounters.',
      'Constructed with 30 meters of clear silicone tubing, water circulates through a closed-loop system where audience activity alters flow patterns.',
      'By turning human connection into fluid, we discuss the contemporary experience where relationships are freer but highly transient.'
    ]
  },
  {
    title: '创作背景',
    enTitle: 'Creative Background',
    summary: '互联网时代低成本、易消失的关系犹如流动连通却毫无固定心态的液体，触发关于人际实质和流动物质层面的叩问。',
    enSummary: 'Reflecting on low-cost, short-lived online relationships that represent liquid property—connective but constantly shifting states.',
    details: [
      '在互联网与移动媒介高度普及的环境下，人们建立联系的成本越来越低。',
      '我们能够快速认识新的朋友、进入新的社群、接触新的信息。',
      '与此同时，关系的持续时间似乎也在不断缩短。',
      '许多连接在形成之后迅速消散，人们不断进入新的关系，又不断离开旧的关系。',
      '这种状态让我联想到液体：液体能够连接不同空间，却无法长期维持固定形态。',
      '因此，我开始思考：如果将人与人之间的关系转化为一种持续流动的物质，它会呈现出怎样的状态？'
    ],
    enDetails: [
      'In a hyper-connected digital landscape, the cost of establishing connections is close to zero.',
      'We quickly encounter new friends, enter digital niches, and obtain vast streams of information.',
      'At the same time, the duration of these relationships appears to have significantly shortened.',
      'Connections dissolve suddenly. This state reminds me of liquids: able to connect different areas but unable to hold fixed states.',
      'Thus, I wondered: if human relations are manifested as a continuously moving fluid substance, what states will they assume?'
    ]
  },
  {
    title: '世界观构建',
    enTitle: 'Worldbuilding Structure',
    summary: '虽然是空间装置，但建立在人与规则、不确定性与动态能量流转等关系系统的叙事重组基础之上。',
    enSummary: 'Narrativizing safety vs. instability, creating a cyclic, fluid spatial ecosystem of relational loops.',
    details: [
      '虽然是一件空间交互装置而非传统戏剧或游戏，其世界观立足于“关系系统的能量流动与不稳定性”。',
      '处于这个封闭而又向公众敞开的管道循环系统内，流体的温度、流速、波纹状态，构成了抽象社会关系的实体化叙事。',
      '观众在此不仅仅是观察者，更是这一微型生态规则演进的一部分，任何微小的机械挤压或手势气流都将在流体上泛起可控与不可控的多重应答，投射出“液态社会”的荒诞与温存。'
    ],
    enDetails: [
      'Though a spatial installation rather than a formal video game, the narrative is built upon "relational system loop energy and flux."',
      'Within this closed-yet-open tube grid, fluid velocity, temperature, and ripples establish an embodied narration of social metrics.',
      'Audience members are not mere external viewers; they are active agents in a micro-ecology where compression prompts unpredictable feedback loops.'
    ]
  },
  {
    title: '设计与实现',
    enTitle: 'Design & Implementation',
    summary: '系统放弃稳定而选择透明硅胶管循环水流，通过传感器检测观众挤压与阻断，实时改变水流运动与阻降节奏。',
    enSummary: 'Utilizing non-stable architecture with clear tubing and flow sensors, altering flow speed and sensory feedback live.',
    details: [
      '项目以“流动”作为核心设计语言。我们放弃了稳定、封闭的结构，而选择使用透明管道构建开放式循环系统。',
      '在视觉上，观众能够直接观察水流在系统中的运动轨迹。',
      '在交互层面，观众的介入（例如挤压特定气囊或遮挡红外传感器）会改变水流的速度与状态，从而影响整体装置的运行节奏。',
      '这种设计并不试图模拟某一种具体关系，而是希望创造一种体验：当个体进入系统之后，关系本身也会随之发生变化。',
      '作品最终形成了一种介于可控与不可控之间的状态。观众能够施加影响，却无法完全掌控结果。'
    ],
    enDetails: [
      'Flow serves as our core design language, replacing rigid structures with flexible open-loop tubing arrays.',
      'Visually, participants trace water streams navigating clear silicone tubing lines.',
      'Interactive control triggers (physical valves, squeezing nodes, and sensors) adjust velocity and pump rhythm.',
      'Instead of simulating specific interactions, this layout fosters a shifting space: once inside, your presence alters the system state.',
      'The result balances control with organic unpredictability, where participants influence but never fully command the flow.'
    ]
  },
  {
    title: '项目反思',
    enTitle: 'Project Reflection',
    summary: '深切体悟到相比硬件技术，交互和体验逻辑才是传达核心议题的关键，极大促进了后续项目媒介反思。',
    enSummary: 'Realizing that system logic and interactive empathy always supersede mere technical complexity in media arts.',
    details: [
      '《无定之流》是我第一次尝试将抽象社会学概念转化为空间装置。',
      '在项目完成后，我开始重新思考一个问题：当一个概念被转化为交互体验时，究竟是技术本身更重要，还是体验逻辑更重要？',
      '在后续的创作中，我逐渐意识到，技术与媒介只是表达工具，而真正决定作品是否成立的，是观众能否通过体验理解作品所提出的问题。',
      '这种思考也影响了我之后的《泛灵》与《物换星》等项目。'
    ],
    enDetails: [
      'Drift of the Unfixed was my first foray translating sociological concepts into physical spatial structures.',
      'Post-completion, I pondered: in converting concepts to interaction, is technology paramount, or is experience logic?',
      'I grew to understand that hardware is solely a delivery courier; true resonance occurs when viewers grasp the inquiry.',
      'This foundational shift directly shaped my subsequent projects like ANIMISM and WUXINGXING.'
    ]
  }
];

const IRRATIONALITY_SECTIONS = [
  {
    title: '项目简介',
    enTitle: 'Project Introduction',
    summary: '《非理智边缘》结合身体动作识别、实时视觉与AI文本生成，将音乐、身体、情绪与文字连接在同一体验空间。',
    enSummary: 'Edge of Irrationality combines body motion tracking, real-time visuals, and AI-generated text over a unified physical zone.',
    details: [
      '《非理智边缘》是一件结合身体动作识别、实时视觉生成与AI文本生成的交互实验作品。',
      '项目尝试将音乐、身体、情绪与文字连接在同一体验空间中。',
      '观众通过动作与声音触发不同的视觉反馈，系统则持续生成变化的图像与文本内容，使整个体验处于一种不断流动、难以被准确定义的状态。',
      '相比传达明确的信息，我更关注那些难以被语言描述的感知经验。',
      '作品希望探索：当情绪尚未被整理成语言时，它会以什么样的形式存在？'
    ],
    enDetails: [
      'Edge of Irrationality combines body motion tracking, real-time visuals, and AI-generated text.',
      'The research loops music, physical expression, emotional states, and typography inside a single interactive environment.',
      'Participants alter visual outputs, while generative scripts produce evolving graphics and text stream layers.',
      'Prioritizing micro-sensory feelings over legible messages, it probes: how does emotion exist before words translate it?'
    ]
  },
  {
    title: '创作背景',
    enTitle: 'Creative Background',
    summary: '在逻辑消隐的感官探索中寻找绕开言语条框的直觉化情绪浸入，提供动作、声音与实时视觉搭建的感知场域。',
    enSummary: 'Reflecting on sensory expressions that skip word frameworks, inviting direct primal immersion through kinetic fields.',
    details: [
      '很多情绪并不会直接以语言的形式出现。',
      '它们更像是身体中的某种冲动、一段旋律带来的联想、或者一瞬间无法被解释的感受。',
      '在创作《非理智边缘》时，我希望寻找一种能够绕开逻辑与叙事的表达方式。',
      '与其描述一种情绪，我更想让观众直接进入这种情绪之中。',
      '因此，项目从一开始便没有预设明确故事，而是试图通过动作、声音与实时生成内容构建一种感知场域。'
    ],
    enDetails: [
      'Many emotional currents avoid raw linguistic articulation, residing as raw bodily pulses.',
      'They surface as musical associations, temporary shivers, or unexplainable transient impulses.',
      'I sought a route bypassing standard logic-structures to allow audiences immediate emotional submersion.',
      'Rather than describing a sentiment, we construct an immersive spatial sensory field via custom sensors and acoustics.'
    ]
  },
  {
    title: '设计与实现',
    enTitle: 'Design & Implementation',
    summary: '基于 TouchDesigner 研制，动作、音乐、非线性AI文本与多媒体流动共同织就无边际的多维情绪信息交互流。',
    enSummary: 'Engineered on TouchDesigner, marrying movement trackers, music, and AI-driven dynamic typography feeds.',
    details: [
      '作品基于 TouchDesigner 开发。',
      '观众的动作会触发不同的视觉变化，音乐则持续影响画面生成逻辑。',
      '与此同时，AI生成文本不断出现在空间之中，并随着时间推进逐渐发生变化。',
      '这些元素共同构成一种非线性的体验结构。',
      '我并没有试图为观众提供明确的目标，而是希望他们在不断变化的信息流中建立属于自己的理解。'
    ],
    enDetails: [
      'The installation is built upon a TouchDesigner pipeline capturing camera feedback.',
      'Acoustic triggers transform the pixel streams, while dynamic neural text populates the scene.',
      'These materials create a nonlinear perceptual architecture without clear checkpoints or missions.',
      'Participants are invited to extract subjective semantic codes from the continuously shifting media streams.'
    ]
  },
  {
    title: '项目反思',
    enTitle: 'Project Reflection',
    summary: '反思早期创作中视觉喧哗与深刻体验设计逻辑的博弈，实现从效果营造朝整体体验结构建隔的思维跃迁。',
    enSummary: 'Pondering deep experience mapping over basic aesthetic triggers, guiding the pivot to holistic systems.',
    details: [
      '回顾这个项目时，我意识到自己当时更关注视觉效果与感知刺激本身。',
      '虽然作品成功建立了一种氛围，但不同阶段之间缺少足够清晰的体验逻辑。',
      '观众能够感受到变化，却未必能够理解变化产生的原因。',
      '这种不足促使我在后续项目中开始更加关注叙事结构与体验设计的问题。',
      '从《非理智边缘》到《泛灵》，我逐渐将注意力从“如何创造效果”转向“如何构建体验”。'
    ],
    enDetails: [
      'Retrospectively, early stages prioritized direct aesthetic stimulation and high-contrast visuals.',
      'While atmosphere felt potent, it missed coherent behavioral transition logic across different phases.',
      'Participants felt the shift but missed the underlying mechanics connecting gesture to output.',
      'This realized friction shifted my trajectory from superficial special effects toward system empathy and unified experience structures shown in ANIMISM.'
    ]
  }
];

interface Experiment {
  id: string;
  title: string;
  enTitle: string;
  time: string;
  tools: string;
  description: string;
  enDescription: string;
  coverAnimType: 'lyrics' | 'particles' | 'web' | 'text' | 'animation';
}

const EXPERIMENTS: Experiment[] = [
  {
    id: 'dynamic_lyrics',
    title: '动态歌词海报',
    enTitle: 'Dynamic Lyric Poster',
    time: '2025',
    tools: 'TD × Blender × Audio Reactive',
    description: '这个实验尝试将音乐中的节奏与情绪转化为实时变化的动态图形。通过音频频谱驱动画面参数，使歌词、空间与视觉反馈形成同步关系。',
    enDescription: 'Translating lyrics and music spectrums into real-time displacement waves, creating synchronized kinetic grids.',
    coverAnimType: 'lyrics'
  },
  {
    id: 'particles',
    title: '粒子实验',
    enTitle: 'Particle Experiment',
    time: '2024',
    tools: 'TouchDesigner',
    description: '探索万千粒子在大尺度引力场与流体动力场中的扩散、积聚与游散，以此仿真复杂而难以名状的内部情感起伏。',
    enDescription: 'Simulating large-scale particle flow fields driven by vector noise and interactive point obstacles.',
    coverAnimType: 'particles'
  },
  {
    id: 'web_interaction',
    title: '网页交互测试',
    enTitle: 'Web Interaction Test',
    time: '2024',
    tools: 'HTML + CSS + JS',
    description: '测试极致的微动作悬挪、物理碰撞以及符合动力学与软缓冲模型的拖拽阻尼，打磨人机连结的第一层皮肤。',
    enDescription: 'Experimenting with spring-rigged drag vectors, elastic boxes, and tactile kinetic transitions.',
    coverAnimType: 'web'
  },
  {
    id: 'text_llm',
    title: '生成文字实验',
    enTitle: 'Generative Word Experiment',
    time: '2025',
    tools: 'TD + LLM',
    description: '通过实时语义向量提取大语言模型输出，并在TouchDesigner中动态重组像素字型，探寻人工智能冰冷符号下的拟态温度。',
    enDescription: 'Coupling LLM semantic output streams with fluid dynamic grid lettering for living texts.',
    coverAnimType: 'text'
  },
  {
    id: 'character_anim',
    title: '角色动画实验',
    enTitle: 'Character Animation Experiment',
    time: '2024',
    tools: 'Unity',
    description: '实验非线性动力步态与逆向运动学（IK）在微重力软体小人上的实时力学响应，还原虚拟世界中的惯性与拉扯。',
    enDescription: 'Applying Inverse Kinematics and ragdoll gravity centers to inspect procedural organic gait cycles.',
    coverAnimType: 'animation'
  }
];

const renderExperimentCover = (type: 'lyrics' | 'particles' | 'web' | 'text' | 'animation') => {
  if (type === 'lyrics') {
    return (
      <div className="w-full h-full bg-stone-950 flex flex-col justify-between p-3 select-none overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff6b21_1px,transparent_1px)] [background-size:12px_12px]" />
        
        <div className="flex-1 flex flex-col justify-center space-y-1.5 font-mono text-[9px] text-[#ff6b21] font-bold">
          <motion.div 
            animate={{ x: [-100, 10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap tracking-widest opacity-80"
          >
            KINETIC LYRIC LAB // WAVE PATTERN
          </motion.div>
          <motion.div 
            animate={{ x: [10, -100] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap tracking-wider font-extrabold text-white"
          >
            REALTIME GENERATIVE TYPOGRAPHY RIPPLES
          </motion.div>
          <motion.div 
            animate={{ x: [-80, 20] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap tracking-widest opacity-60"
          >
            AUDIO FREQUENCY DISPLACEMENT FIELD
          </motion.div>
        </div>

        <div className="h-10 w-full flex items-end gap-[2px] border-t border-stone-800 pt-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-[#ff6b21]"
              animate={{ height: [`${20 + Math.random() * 80}%`, `${15 + Math.random() * 40}%`, `${30 + Math.random() * 70}%`] }}
              transition={{ duration: 0.5 + Math.random() * 0.7, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'particles') {
    return (
      <div className="w-full h-full bg-[#1c1917] flex flex-col items-center justify-center p-3 relative overflow-hidden select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 opacity-45">
          <circle cx="50" cy="50" r="35" stroke="#44403c" strokeDasharray="2 3" fill="none" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="22" stroke="#292524" strokeDasharray="1 2" fill="none" strokeWidth="0.5" />
          
          <motion.circle 
            cx="50" 
            cy="50" 
            r="4.5" 
            fill="#feb73d" 
            animate={{ r: [3.5, 6, 3.5], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4;
            const r = 24 + (i % 2) * 8;
            return (
              <motion.circle
                key={i}
                r="1.8"
                fill="#fed7aa"
                animate={{
                  cx: [
                    50 + Math.cos(angle) * r,
                    50 + Math.cos(angle + Math.PI) * r,
                    50 + Math.cos(angle + Math.PI * 2) * r
                  ],
                  cy: [
                    50 + Math.sin(angle) * r,
                    50 + Math.sin(angle + Math.PI) * r,
                    50 + Math.sin(angle + Math.PI * 2) * r
                  ]
                }}
                transition={{ duration: 4 + (i % 3) * 2, repeat: Infinity, ease: "linear" }}
              />
            );
          })}
        </svg>

        <div className="absolute top-2 left-2 text-[6px] font-mono text-stone-550 tracking-widest uppercase font-black">
          VECTOR FIELD TRACE v1.2
        </div>
      </div>
    );
  }

  if (type === 'web') {
    return (
      <div className="w-full h-full bg-[#faf5f0] flex items-center justify-center p-3 border border-stone-200 relative overflow-hidden select-none">
        <div className="absolute inset-2 border border-dashed border-stone-300 flex flex-col justify-between p-2">
          <div className="flex justify-between items-center text-[6px] font-mono text-stone-400 font-bold">
            <span>DAMPED OSCILLATOR</span>
            <span>GRID: ACTIVE</span>
          </div>

          <div className="relative w-full h-24 flex items-center justify-center">
            <svg viewBox="0 0 100 60" className="w-full h-full absolute inset-0">
              <motion.path 
                d="M 10 30 Q 50 30 90 30" 
                fill="none" 
                stroke="#1c1917" 
                strokeWidth="1.2"
                animate={{ d: ["M 10 30 Q 50 15 90 30", "M 10 30 Q 50 45 90 30", "M 10 30 Q 50 30 90 30"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.circle 
                r="4.5" 
                fill="#D08465" 
                stroke="#1c1917" 
                strokeWidth="1.5"
                animate={{ cx: [50, 50, 50], cy: [15, 45, 30] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </div>

          <div className="flex justify-between text-[6px] font-mono text-stone-400">
            <span>STIFFNESS: 15N/M</span>
            <span>REST: READY</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="w-full h-full bg-[#0a0f0d] flex flex-col justify-between p-3 relative overflow-hidden select-none border border-stone-900/30">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:8px_8px]" />

        <div className="flex justify-between text-[6px] font-mono text-[#10b981] tracking-wider opacity-80">
          <span>SEMANTIC ENCODER</span>
          <span>TD × LLM</span>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-1 font-mono text-[8.5px] text-[#10b981]">
          <div className="font-serif text-[11px] text-white tracking-widest text-center my-1 select-none flex items-center justify-center gap-1">
            <motion.span 
              animate={{ opacity: [0.2, 1, 0.2] }} 
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[#10b981]"
            >
              ●
            </motion.span>
            <span>言语重叠</span>
          </div>
          <div className="text-[6.5px] text-stone-500 font-bold overflow-hidden h-6 leading-tight flex flex-col items-center">
            <motion.p 
              className="whitespace-nowrap animate-pulse"
              animate={{ y: [0, -16] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              LLM_SYS_INIT_PROMPT_EMBEDDINGS
            </motion.p>
          </div>
        </div>

        <div className="h-1 bg-[#10b981] w-full" />
      </div>
    );
  }

  if (type === 'animation') {
    return (
      <div className="w-full h-full bg-stone-950 flex flex-col justify-between p-3 relative overflow-hidden select-none border border-stone-850">
        <svg viewBox="0 0 100 80" className="w-full h-full absolute inset-0 opacity-80">
          <g transform="translate(50, 40)">
            <motion.line
              x1="0" y1="-20" x2="0" y2="10"
              stroke="#e11d48" strokeWidth="2"
              animate={{ rotate: [-6, 6, -6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.line
              x1="0" y1="10" x2="-15" y2="25"
              stroke="#f43f5e" strokeWidth="1.5"
              animate={{ rotate: [-15, 15, -15] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.line
              x1="0" y1="10" x2="15" y2="25"
              stroke="#f43f5e" strokeWidth="1.5"
              animate={{ rotate: [15, -15, 15] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx="0" cy="-20" r="4" fill="#f43f5e" />
            <circle cx="0" cy="10" r="3" fill="#e11d48" />
          </g>
        </svg>

        <div className="flex justify-between text-[6px] font-mono text-rose-500">
          <span>IK ENGINE v0.98</span>
          <span>SKELETON BONES: ACTIVE</span>
        </div>
      </div>
    );
  }

  return null;
};

const renderDetailDiagrams = (type: 'lyrics' | 'particles' | 'web' | 'text' | 'animation') => {
  if (type === 'lyrics') {
    return (
      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="border border-stone-300 p-2.5 bg-stone-50/50 flex flex-col justify-between h-36">
          <div className="font-mono text-[7px] text-stone-400 font-bold uppercase">FIG 01 // ACC ACOUSTIC SPECTRAL MATRIX</div>
          <svg viewBox="0 0 100 50" className="w-full h-16">
            <polyline
              fill="none"
              stroke="#D08465"
              strokeWidth="1.2"
              points="0,40 15,35 30,12 45,42 60,15 75,32 90,6 100,28"
            />
            <line x1="0" y1="25" x2="100" y2="25" stroke="#e0e0e0" strokeWidth="0.5" strokeDasharray="2 2" />
          </svg>
          <div className="font-mono text-[6px] text-stone-500 font-extrabold text-right">TD CHATTER RESPONSE OVERRIDE</div>
        </div>
        <div className="border border-stone-300 p-2.5 bg-stone-50/50 flex flex-col justify-between h-36">
          <div className="font-mono text-[7px] text-stone-400 font-bold uppercase">FIG 02 // BLENDER WEB UV DISPLACEMENT FRAME</div>
          <svg viewBox="0 0 100 50" className="w-full h-16">
            <rect x="20" y="5" width="60" height="40" fill="none" stroke="#78716c" strokeWidth="0.8" />
            <line x1="20" y1="5" x2="80" y2="45" stroke="#e7e5e4" strokeWidth="0.5" />
            <line x1="80" y1="5" x2="20" y2="45" stroke="#e7e5e4" strokeWidth="0.5" />
            <circle cx="50" cy="25" r="11" fill="none" stroke="#D08465" strokeWidth="1" />
          </svg>
          <div className="font-mono text-[6px] text-stone-500 font-extrabold text-right">3D SHADER DEPTH GRAPH</div>
        </div>
      </div>
    );
  }

  if (type === 'particles') {
    return (
      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="border border-stone-300 p-2.5 bg-stone-50/50 flex flex-col justify-between h-36">
          <div className="font-mono text-[7px] text-stone-400 font-bold uppercase">FIG 01 // DYNAMIC GRADIAL VECTOR NOISE FIELD</div>
          <svg viewBox="0 0 100 50" className="w-full h-16 stroke-stone-500 fill-none" strokeWidth="0.5">
            <path d="M5,10 Q25,5 45,15 T95,10" />
            <path d="M5,25 Q25,35 50,20 T95,30" />
            <circle cx="50" cy="22" r="2.5" fill="#D08465" />
          </svg>
          <div className="font-mono text-[6px] text-stone-500 font-extrabold text-right">PERLIN GRADIENT FIELD</div>
        </div>
        <div className="border border-stone-300 p-2.5 bg-stone-50/50 flex flex-col justify-between h-36">
          <div className="font-mono text-[7px] text-stone-400 font-bold uppercase">FIG 02 // MASS DENSITIES OVER TIMELINE</div>
          <svg viewBox="0 0 100 50" className="w-full h-16">
            <rect x="15" y="10" width="10" height="30" fill="#78716c" />
            <rect x="35" y="20" width="10" height="20" fill="#a8a29e" />
            <rect x="55" y="5" width="10" height="35" fill="#D08465" />
            <rect x="75" y="15" width="10" height="25" fill="#d6d3d1" />
          </svg>
          <div className="font-mono text-[6px] text-stone-500 font-extrabold text-right">STABLE BOUND BOUNDS</div>
        </div>
      </div>
    );
  }

  if (type === 'web') {
    return (
      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="border border-stone-300 p-2.5 bg-stone-50/50 flex flex-col justify-between h-36">
          <div className="font-mono text-[7px] text-stone-400 font-bold uppercase">FIG 01 // HOVER DRAG DECAY DAMPING</div>
          <svg viewBox="0 0 100 50" className="w-full h-16">
            <path
              d="M0,25 Q12,5 24,25 T48,25 T72,25 T96,25"
              fill="none"
              stroke="#D08465"
              strokeWidth="1.2"
            />
          </svg>
          <div className="font-mono text-[6px] text-stone-500 font-extrabold text-right">F_DECAY = -kX - cV LOG</div>
        </div>
        <div className="border border-stone-300 p-2.5 bg-stone-50/50 flex flex-col justify-between h-36">
          <div className="font-mono text-[7px] text-stone-400 font-bold uppercase">FIG 02 // SPRING LAYOUT BOUND BOX</div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-14 h-10 border border-dashed border-stone-400 flex items-center justify-center rounded gap-1 scale-90">
              <span className="w-2.5 h-2.5 bg-orange-600 rounded-full" />
              <span className="w-8 h-1 bg-stone-900" />
            </div>
          </div>
          <div className="font-mono text-[6px] text-stone-500 font-extrabold text-right">MATRIX ACCENT SHEAR</div>
        </div>
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="border border-stone-300 p-2.5 bg-stone-50/50 flex flex-col justify-between h-36">
          <div className="font-mono text-[7px] text-stone-400 font-bold uppercase">FIG 01 // TEXT VECTOR DISTANCE PLOT</div>
          <svg viewBox="0 0 100 50" className="w-full h-16" fill="none">
            <circle cx="35" cy="25" r="14" stroke="#78716c" strokeWidth="0.5" />
            <circle cx="65" cy="25" r="14" stroke="#D08465" strokeWidth="0.5" />
            <path d="M35,25 Q50,42 65,25" stroke="#D08465" strokeWidth="0.8" />
          </svg>
          <div className="font-mono text-[6px] text-stone-500 font-extrabold text-right">LLM ENTRAINER WEIGHTS</div>
        </div>
        <div className="border border-stone-300 p-2.5 bg-stone-50/50 flex flex-col justify-between h-36">
          <div className="font-mono text-[7px] text-stone-400 font-bold uppercase">FIG 02 // TD TEXT INTEGRATOR ENGINE</div>
          <div className="flex-1 flex flex-col justify-center font-mono text-[6px] text-stone-600 font-bold space-y-1 bg-stone-100 p-1 rounded">
            <div>import {'{ fluid }'} from 'td-gl';</div>
            <div className="text-orange-600">const val = model.entropy();</div>
            <div>shader.u_fluid(val * 12.5);</div>
          </div>
          <div className="font-mono text-[6px] text-stone-500 font-extrabold text-right">GLSL DISPLACEMENT CORRELATION</div>
        </div>
      </div>
    );
  }

  if (type === 'animation') {
    return (
      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="border border-stone-300 p-2.5 bg-stone-50/50 flex flex-col justify-between h-36">
          <div className="font-mono text-[7px] text-stone-400 font-bold uppercase">FIG 01 // INVERSE KINEMATICS JOINT WIRE</div>
          <svg viewBox="0 0 100 50" className="w-full h-16" fill="none" strokeWidth="0.8">
            <line x1="20" y1="40" x2="50" y2="15" stroke="#78716c" />
            <line x1="50" y1="15" x2="80" y2="35" stroke="#D08465" />
            <circle cx="20" cy="40" r="2" fill="#78716c" />
            <circle cx="50" cy="15" r="2" fill="#D08465" />
            <circle cx="80" cy="35" r="2" fill="#D08465" />
          </svg>
          <div className="font-mono text-[6px] text-stone-500 font-extrabold text-right">IK MASS ANGULAR ACCEL</div>
        </div>
        <div className="border border-stone-300 p-2.5 bg-stone-50/50 flex flex-col justify-between h-36">
          <div className="font-mono text-[7px] text-stone-400 font-bold uppercase">FIG 02 // DYNAMIC COEFFICIENT OF INERTIA</div>
          <svg viewBox="0 0 100 50" className="w-full h-16" fill="none">
            <path d="M10,40 Q25,8 50,30 T90,40" stroke="#D08465" strokeWidth="1" />
            <line x1="10" y1="40" x2="90" y2="40" stroke="#dddddd" strokeWidth="0.5" />
          </svg>
          <div className="font-mono text-[6px] text-stone-500 font-extrabold text-right">G_FORCE TORQUE MATRIX</div>
        </div>
      </div>
    );
  }

  return null;
};

export const ScenePortfolio: React.FC<ScenePortfolioProps> = ({ isEnglish, onEnterWorld, isDialogueCompleted }) => {
  // Constrain card count to exactly 5 as requested
  const DISPLAY_PROJECTS = PROJECTS.slice(0, 5);
  
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [isSynthPlaying, setIsSynthPlaying] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [selectedExperiment, setSelectedExperiment] = useState<any | null>(null);

  // States for Static Portfolio Slideshow Viewer
  const [isSlideshowOpen, setIsSlideshowOpen] = useState<boolean>(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // States to track hovered card ID for spotlight glow/dim effect
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Preload project static portfolio images helper
  const preloadProjectSlides = (projId: string) => {
    const slides = assets.images.portfolioProjects[projId]?.staticPortfolioImages || [];
    slides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  };

  // Preload all portfolio images upon mounting to guarantee instant, smooth transitions
  useEffect(() => {
    Object.values(assets.images.portfolioProjects).forEach((projConfig) => {
      projConfig.staticPortfolioImages?.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });
  }, []);

  // Keyboard navigation for static portfolio slideshow
  useEffect(() => {
    if (!isSlideshowOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSlideshowOpen(false);
        audioManager.playClick();
      } else if (e.key === 'ArrowLeft') {
        const slides = assets.images.portfolioProjects[activeProject?.id || '']?.staticPortfolioImages || [];
        if (slides.length > 0) {
          setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
          audioManager.playClick();
        }
      } else if (e.key === 'ArrowRight') {
        const slides = assets.images.portfolioProjects[activeProject?.id || '']?.staticPortfolioImages || [];
        if (slides.length > 0) {
          setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
          audioManager.playClick();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSlideshowOpen, activeProject]);

  const configs = [
    { id: 'drift_of_the_unfixed', color: '#32c0b9', badge: 'ARCH-01' },
    { id: 'animism', color: '#fed7aa', badge: 'ARCH-02' },
    { id: 'wuxingxing', color: '#ffb8d1', badge: 'ARCH-03' },
    { id: 'edge_of_irrationality', color: '#cbf0ed', badge: 'ARCH-04' },
    { id: 'explorations_archive', color: '#ffe0ea', badge: 'ARCH-05' }
  ];

  // Hover handler - simple ID state triggers glowing & dimming instantly without heavy mouse calculations
  const handleCardMouseMove = (projId: string) => {
    setHoveredCardId(projId);
  };

  const handleCardMouseLeave = () => {
    setHoveredCardId(null);
  };

  const handleProjectClick = (proj: Project) => {
    setActiveProject(proj);
    setIsSlideshowOpen(false);
    setCurrentSlideIndex(0);
    // Explicitly preload all static images for this clicked project
    preloadProjectSlides(proj.id);
    if (!visitedNodes.includes(proj.id)) {
      setVisitedNodes((prev) => [...prev, proj.id]);
    }
    audioManager.playChime();
  };

  const handleCloseDetail = () => {
    setIsSlideshowOpen(false);
    setActiveProject(null);
    audioManager.playClick();
  };

  const handleOpenSlideshow = () => {
    setCurrentSlideIndex(0);
    setIsSlideshowOpen(true);
    audioManager.playClick();
  };

  const handleCloseSlideshow = () => {
    setIsSlideshowOpen(false);
    audioManager.playClick();
  };

  // Sound Synthesizer: generating distinct geometric melodies
  const triggerProjectSynth = (projId: string) => {
    if (isSynthPlaying) return;
    setIsSynthPlaying(projId);
    audioManager.playWaterDrop();

    let chords = [300, 450, 600];
    if (projId === 'drift_of_the_unfixed') chords = [261.63, 329.63, 392.00, 523.25];
    else if (projId === 'animism') chords = [293.66, 349.23, 440.00, 587.33];
    else if (projId === 'wuxingxing') chords = [329.63, 392.00, 493.88, 659.25];
    else if (projId === 'edge_of_irrationality') chords = [349.23, 440.00, 523.25, 698.46];
    else if (projId === 'explorations_archive') chords = [392.00, 493.88, 587.33, 783.99];

    chords.forEach((freq, idx) => {
      setTimeout(() => {
        audioManager.playTone(freq, 'sine', 1.0, 0.08);
      }, idx * 160);
    });

    setTimeout(() => {
      audioManager.playChime();
      setIsSynthPlaying(null);
    }, chords.length * 160 + 100);
  };

  // Organic, staggered untidy parameters: default vertical shifts & micro-rotations to break robotic order
  const staggeredConfigs = [
    { baseY: -12, rotate: -4.5, floatDuration: 3.2 },
    { baseY: 8, rotate: 2.5, floatDuration: 4.1 },
    { baseY: -22, rotate: -1.8, floatDuration: 3.6 },
    { baseY: 14, rotate: 3.2, floatDuration: 4.5 },
    { baseY: -6, rotate: -2.8, floatDuration: 3.8 }
  ];

  // Blueprint SVG Vector Graphic details with measurement lines
  const renderBlueprint = (proj: Project, fillColor: string, active: boolean) => {
    const config = assets.images.portfolioProjects[proj.id];
    if (config?.cardImageSrc) {
      return (
        <div className="w-full h-full relative z-10 flex items-center justify-center overflow-hidden bg-stone-900/5 group">
          <img 
            src={config.cardImageSrc} 
            alt={proj.title} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-110 transition-transform duration-500 ease-out group-hover:scale-120"
          />
        </div>
      );
    }
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 p-1.5 overflow-visible select-none">
        <defs>
          <pattern id={`grid-pattern-${proj.id}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#E5E2D8" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-pattern-${proj.id})`} />
        
        {/* Optical Axis & Precision Alignment bars */}
        <circle cx="60" cy="60" r="48" fill="none" stroke="#DFDDD5" strokeWidth="0.6" />
        <circle cx="60" cy="60" r="28" fill="none" stroke="#E3E1DA" strokeWidth="0.4" strokeDasharray="3 3" />
        
        {/* Horizon crosshair */}
        <line x1="10" y1="60" x2="110" y2="60" stroke="#DFDDD5" strokeWidth="0.7" strokeDasharray="1 3" />
        <line x1="60" y1="10" x2="60" y2="110" stroke="#DFDDD5" strokeWidth="0.7" strokeDasharray="1 3" />

        {/* Abstract organic vector shape from the database */}
        <g transform="translate(10, 10) scale(0.8)">
          <motion.path
            d={proj.imageBg}
            className="stroke-stone-900"
            strokeWidth="2.2"
            fill={fillColor}
            fillOpacity="0.8"
            animate={active ? { 
              fillOpacity: [0.7, 0.9, 0.7],
              strokeWidth: [2.2, 2.8, 2.2]
            } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <path
            d={proj.imageBg}
            className="stroke-stone-800/20"
            strokeWidth="0.8"
            fill="none"
            strokeDasharray="2 1"
          />
        </g>

        {/* Technical Coordinate Indicators */}
        <text x="6" y="112" className="fill-stone-500 font-mono text-[6.5px]" letterSpacing="0.05em">
          Nº 0{PROJECTS.findIndex(p => p.id === proj.id) + 1} / D_STAGE
        </text>
        <text x="114" y="10" textAnchor="end" className="fill-stone-400 font-mono text-[5.5px]">
          [STABLE RES_07]
        </text>

        {/* Floating cross markers on corner angles */}
        <path d="M 4 4 L 10 4 M 7 1 L 7 7" stroke="#9E9C94" strokeWidth="0.5" />
        <path d="M 110 110 L 116 110 M 113 107 L 113 113" stroke="#9E9C94" strokeWidth="0.5" />
      </svg>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#effffb] flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-6 py-20 md:py-24 select-none" id="scene_portfolio" style={{ backgroundColor: '#effffb' }}>
      
      {/* Background coordinate grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-stone-300/60 fill-none" viewBox="0 0 1000 800" style={{ zIndex: 1 }}>
        <path d="M 0,150 L 1000,150 M 0,350 L 1000,350 M 0,550 L 1000,550" strokeWidth="0.5" strokeDasharray="3 6" />
        <path d="M 200,0 L 200,800 M 500,0 L 500,800 M 800,0 L 800,800" strokeWidth="0.5" strokeDasharray="3 6" />
        <circle cx="500" cy="350" r="220" strokeWidth="0.5" strokeDasharray="1 8" />
      </svg>

      <AnimatePresence mode="wait">
        {!activeProject ? (
          /* ================= 3D STACK GALLERY VIEW ================= */
          <motion.div
            key="gallery"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-6xl flex flex-col items-center z-10"
          >
            {/* Header statement */}
            <div className="text-center max-w-2xl mb-6 px-4">
              <span className="font-mono text-[9px] text-stone-500 tracking-[0.3em] font-bold block">
                [ {isEnglish ? 'AMBIENT FLOATING GALERIE' : '物换星移 · 微重力悬浮纸页'} ]
              </span>
            </div>

            {/* Core Interactive Platform Viewport with clean standard layout */}
            <div 
              className="w-full flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-8 py-10 px-4 select-none relative max-w-6xl"
            >
              {DISPLAY_PROJECTS.map((proj, idx) => {
                const conf = configs.find(c => c.id === proj.id) || configs[0];
                const isVisited = visitedNodes.includes(proj.id);

                // Get staggered floating templates
                const stag = staggeredConfigs[idx] || { baseY: 0, rotate: 0, floatDuration: 3 };

                // Handle spotlight states
                const isThisCardHovered = hoveredCardId === proj.id;
                const someCardIsHovered = hoveredCardId !== null;

                // Opacity dimming: unhovered ones down to 0.3
                let finalOpacity = 0.95;
                if (someCardIsHovered && !isThisCardHovered) {
                  finalOpacity = 0.3;
                } else if (isThisCardHovered) {
                  finalOpacity = 1.0;
                }

                // If hovered, raise higher and remove slant; otherwise float ambiently
                const currentY = isThisCardHovered ? stag.baseY - 24 : [stag.baseY, stag.baseY - 12, stag.baseY];
                const currentRotate = isThisCardHovered ? 0 : stag.rotate;
                const currentScale = isThisCardHovered ? 1.07 : 1.0;

                return (
                  <motion.div
                    key={proj.id}
                    animate={{
                      y: currentY,
                      rotate: currentRotate,
                      scale: currentScale,
                      opacity: finalOpacity
                    }}
                    style={{
                      zIndex: isThisCardHovered ? 40 : 10,
                      width: '185px',
                      height: '255px'
                    }}
                    onMouseMove={() => handleCardMouseMove(proj.id)}
                    onMouseLeave={handleCardMouseLeave}
                    transition={isThisCardHovered ? {
                      type: 'spring',
                      stiffness: 150,
                      damping: 14
                    } : {
                      y: {
                        duration: stag.floatDuration,
                        repeat: Infinity,
                        ease: "easeInOut"
                      },
                      rotate: {
                        type: 'spring',
                        stiffness: 80,
                        damping: 18
                      },
                      opacity: { duration: 0.3 }
                    }}
                    onClick={() => handleProjectClick(proj)}
                    className="group cursor-pointer shrink-0 relative"
                  >
                    {/* Twinkling 4-point stars above and below for Wuhuanxing project: staggered, pale pink fill, teal/cyan stroke */}
                    {proj.id === 'wuxingxing' && (
                      <>
                        {/* Above Stars (Scattered / Staggered) */}
                        <div className="absolute -top-14 inset-x-0 h-12 pointer-events-none z-30">
                          {/* Star 1 - Top Left */}
                          <motion.div
                            animate={{ 
                              scale: [0.7, 1.25, 0.7], 
                              opacity: [0.4, 0.95, 0.4], 
                              rotate: [0, 90, 180],
                              y: [-2, 3, -2]
                            }}
                            transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute left-[12%] top-2 filter drop-shadow-[0_0_6px_rgba(244,114,182,0.6)]"
                          >
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#fce7f3] stroke-[#0d9488] stroke-[1.4]">
                              <path d="M 12 1 Q 12 12 1 12 Q 12 12 12 23 Q 12 12 23 12 Q 12 12 12 1 Z" />
                            </svg>
                          </motion.div>

                          {/* Star 2 - Center High */}
                          <motion.div
                            animate={{ 
                              scale: [0.9, 1.4, 0.9], 
                              opacity: [0.6, 1, 0.6], 
                              rotate: [0, 45, 90],
                              y: [2, -4, 2]
                            }}
                            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                            className="absolute left-[48%] -top-1 filter drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]"
                          >
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#fdf2f8] stroke-[#0f766e] stroke-[1.5]">
                              <path d="M 12 1 Q 12 12 1 12 Q 12 12 12 23 Q 12 12 23 12 Q 12 12 12 1 Z" />
                            </svg>
                          </motion.div>

                          {/* Star 3 - Right Lower */}
                          <motion.div
                            animate={{ 
                              scale: [0.75, 1.2, 0.75], 
                              opacity: [0.4, 0.9, 0.4], 
                              rotate: [0, -90, -180],
                              y: [-1, 3, -1]
                            }}
                            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
                            className="absolute right-[16%] top-4 filter drop-shadow-[0_0_6px_rgba(244,114,182,0.6)]"
                          >
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#fce7f3] stroke-[#0d9488] stroke-[1.4]">
                              <path d="M 12 1 Q 12 12 1 12 Q 12 12 12 23 Q 12 12 23 12 Q 12 12 12 1 Z" />
                            </svg>
                          </motion.div>
                        </div>

                        {/* Below Stars (Scattered / Staggered) */}
                        <div className="absolute -bottom-14 inset-x-0 h-12 pointer-events-none z-30">
                          {/* Star 4 - Bottom Left Low */}
                          <motion.div
                            animate={{ 
                              scale: [0.8, 1.25, 0.8], 
                              opacity: [0.45, 0.95, 0.45], 
                              rotate: [0, -90, -180],
                              y: [2, -3, 2]
                            }}
                            transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                            className="absolute left-[18%] top-4 filter drop-shadow-[0_0_6px_rgba(244,114,182,0.6)]"
                          >
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#fce7f3] stroke-[#0d9488] stroke-[1.4]">
                              <path d="M 12 1 Q 12 12 1 12 Q 12 12 12 23 Q 12 12 23 12 Q 12 12 12 1 Z" />
                            </svg>
                          </motion.div>

                          {/* Star 5 - Bottom Center Lower */}
                          <motion.div
                            animate={{ 
                              scale: [0.85, 1.35, 0.85], 
                              opacity: [0.5, 1, 0.5], 
                              rotate: [0, -45, -90],
                              y: [-3, 3, -3]
                            }}
                            transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                            className="absolute left-[54%] top-1 filter drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]"
                          >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#fdf2f8] stroke-[#0f766e] stroke-[1.5]">
                              <path d="M 12 1 Q 12 12 1 12 Q 12 12 12 23 Q 12 12 23 12 Q 12 12 12 1 Z" />
                            </svg>
                          </motion.div>

                          {/* Star 6 - Bottom Right Higher */}
                          <motion.div
                            animate={{ 
                              scale: [0.7, 1.2, 0.7], 
                              opacity: [0.4, 0.9, 0.4], 
                              rotate: [0, 90, 180],
                              y: [1, -2, 1]
                            }}
                            transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                            className="absolute right-[12%] -top-1 filter drop-shadow-[0_0_6px_rgba(244,114,182,0.6)]"
                          >
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#fce7f3] stroke-[#0d9488] stroke-[1.4]">
                              <path d="M 12 1 Q 12 12 1 12 Q 12 12 12 23 Q 12 12 23 12 Q 12 12 12 1 Z" />
                            </svg>
                          </motion.div>
                        </div>
                      </>
                    )}

                    {/* The premium paper-like Card frame */}
                    <div className={`w-full h-full bg-white border-2 rounded-none overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                      isThisCardHovered
                        ? 'border-orange-500 shadow-[0_0_28px_rgba(249,115,22,0.55)] ring-2 ring-orange-400'
                        : 'border-stone-900 shadow-[4px_4px_0px_rgba(28,25,22,0.45)] hover:shadow-[6px_6px_0px_rgba(28,25,22,0.7)] opacity-95'
                    }`}>
                      
                      {/* Top blueprint grid frame */}
                      <div className="h-[175px] bg-[#F2EFE7] border-b-2 border-stone-900 relative overflow-hidden flex items-center justify-center p-0">
                        {renderBlueprint(proj, conf.color, isThisCardHovered)}
                        
                        {/* Custom Floating status flags */}
                        <div className="absolute top-2 left-2 bg-stone-900 text-[#FAF8F5] text-[6.5px] font-mono tracking-wider font-extrabold px-1.5 py-0.5">
                          {conf.badge}
                        </div>

                        {isVisited && (
                          <div className="absolute top-2 right-2 bg-[#C7D4C9] text-stone-900 text-[6px] font-mono font-black px-1.5 py-0.5 border border-stone-900">
                            READ
                          </div>
                        )}
                        
                        {/* Compass grid background circle */}
                        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 font-mono text-[5px] text-stone-400">
                          <Compass size={6.5} className={isThisCardHovered ? 'animate-spin-slow' : ''} />
                          <span>ST.0{idx + 1}</span>
                        </div>
                      </div>

                      {/* Bottom Info details structure */}
                      <div className="p-2.5 flex-1 flex flex-col justify-between bg-white relative">
                        <div className="z-10">
                          <div className="flex items-center justify-between text-[7.5px] font-mono tracking-normal text-stone-550 font-extrabold mb-0.5 uppercase">
                            <span className="truncate max-w-[110px]">{proj.category.split(' ')[0]}</span>
                            <span className="text-stone-400 font-mono text-[7px]">{proj.year}</span>
                          </div>
                          
                          <h3 className={`font-serif text-[12.5px] md:text-[13px] font-black tracking-wide line-clamp-1 leading-snug transition-colors duration-200 ${
                            isThisCardHovered ? 'text-orange-600' : 'text-stone-900'
                          }`}>
                            {isEnglish ? proj.enTitle : proj.title}
                          </h3>
                        </div>

                        {/* Interactive trigger indicator */}
                        <div className="border-t border-dashed border-stone-200 pt-1.5 flex justify-between items-center text-[7.5px] font-mono font-extrabold text-stone-900 uppercase">
                          <span className="flex items-center gap-1 text-stone-500">
                            {isThisCardHovered ? (
                              <span className="text-orange-600 font-black flex items-center gap-0.5 animate-pulse">
                                <Activity size={8} className="text-orange-500" />
                                {isEnglish ? 'EXPAND FILE' : '查阅案卷'}
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5 text-stone-450">
                                <Database size={8} />
                                {isEnglish ? 'STABLE' : '封存'}
                              </span>
                            )}
                          </span>
                          <span className={`transition-transform duration-300 text-[10px] ${
                            isThisCardHovered ? 'translate-x-1 font-bold text-orange-600' : 'text-stone-400'
                          }`}>
                            ➔
                          </span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>



          </motion.div>
        ) : (
          /* ================= DETAIL FILE OVERLAY ================= */

        <motion.div
          key="details-pane"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-5xl bg-white border-2 border-stone-900 shadow-[8px_8px_0px_rgba(28,25,22,1)] z-30 relative rounded-none select-none max-h-[92vh] flex flex-col"
        >
          {/* Split Page double dashed accent borders mock */}
          <div className="absolute inset-1.5 border border-dashed border-stone-300 pointer-events-none z-10" />

          {/* DETAIL TOP CRITICAL BARS */}
          <div className="p-4 border-b-2 border-stone-900 bg-[#F5F3ED] flex justify-between items-center z-20">
            <button
              onClick={handleCloseDetail}
              className="flex items-center md:gap-2 gap-1 text-[11px] font-mono font-black text-stone-950 bg-white hover:bg-stone-50 border border-stone-900 px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-left"
            >
              <ArrowLeft size={12} />
              {isEnglish ? 'BACK TO EXHIBITION' : '← 返回 3D 陈列室'}
            </button>

            <div className="font-mono text-[8.5px] md:text-[10px] text-stone-600 font-extrabold flex items-center md:gap-3 gap-1.5">
              <span className="hidden md:inline">[ PORTFOLIO CLASSIFIED ]</span>
              <span className="px-2 py-0.5 bg-stone-900 text-white select-none">STABLE</span>
              <span>FILE: {activeProject.id.toUpperCase()}</span>
            </div>
          </div>

          {/* MIDDLE LAYOUT: FLEXIBLE SCROLLABLE BLUEPRINT DETAILS */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 z-20">
            {activeProject.id === 'explorations_archive' ? (
              <div className="flex flex-col gap-6" id="experiments_archive_viewport">
                
                {/* EXPLORATIONS ARCHIVE TOP AREA */}
                <div className="border-b-2 border-stone-900 pb-5 mb-5 border-dashed">
                  <h3 className="text-3xl font-serif font-black text-stone-900 tracking-wide mb-2 flex items-center gap-1.5 uppercase">
                    <Database size={24} className="text-[#D08465]" strokeWidth={2.5} />
                    <span>Experiments Archive</span>
                  </h3>
                  <div className="p-4 bg-[#FAF9F5] border-l-4 border-stone-950 text-xs md:text-sm text-stone-700 leading-relaxed font-bold tracking-wide select-text border border-stone-300 shadow-[3px_3px_0px_rgba(28,25,22,1)]">
                    {isEnglish ? (
                      <p>
                        These experiment logs record my trajectory across multiple creative mediums. 
                        They are not completed systems, but fragment pieces, conceptual tests, and curious attempts. 
                        Some elements later grew into mature projects, while others stayed as sandbox creations.
                      </p>
                    ) : (
                      <p>
                        这些实验记录了我在不同媒介中的探索过程。
                        它们并非完整项目，而是创作过程中留下的片段、测试与尝试。
                        部分实验后来发展成为独立作品，也有一些仅仅停留在一次好奇心驱动的实践之中。
                      </p>
                    )}
                  </div>
                </div>

                {/* WATERFALL CARDS GRID (PRACTICAL COLUMNS) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {EXPERIMENTS.map((exp, idx) => (
                    <div 
                      key={exp.id}
                      onClick={() => {
                        setSelectedExperiment(exp);
                        audioManager.playChime();
                      }}
                      className="border-2 border-stone-900 bg-white shadow-[4px_4px_0px_rgba(28,25,22,1)] hover:shadow-[6px_6px_0px_rgba(28,25,22,1)] hover:-translate-y-0.5 transition-all cursor-pointer p-4 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Live Cover container mimicking dynamic [封面GIF] */}
                        <div className="h-44 border border-stone-900 overflow-hidden relative mb-3 bg-[#FAF8F5]">
                          {renderExperimentCover(exp.coverAnimType)}
                        </div>

                        <div className="flex justify-between items-center text-[7.5px] font-mono text-stone-450 font-bold mb-1 uppercase">
                          <span>REG REC. N°0{idx+1}</span>
                          <span className="font-extrabold text-stone-900">{exp.time}</span>
                        </div>

                        <h4 className="font-serif text-[15px] font-black text-stone-900 group-hover:text-[#D08465] transition-colors">
                          {isEnglish ? exp.enTitle : exp.title}
                        </h4>
                        
                        <p className="font-mono text-[9px] text-[#D08465] uppercase tracking-widest font-black mt-1">
                          {exp.tools}
                        </p>
                      </div>

                      <div className="border-t border-dashed border-stone-200 pt-2 mt-3 flex justify-between items-center text-[8px] font-mono text-stone-500 font-bold uppercase">
                        <span>OPEN LAB FILE</span>
                        <span className="text-[11px] group-hover:translate-x-1 transition-transform">➔</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
              
              {/* LEFT POSTER PANEL: Col-span 5 */}
              <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
                
                {/* Heavy blueprint detail box */}
                <div className="border-2 border-stone-900 bg-white p-4 shadow-[4px_4px_0px_rgba(28,25,22,1)] flex flex-col">
                  <div className="h-56 bg-[#FAF9F5] border border-stone-200 relative overflow-hidden p-0.5">
                    {assets.images.portfolioProjects[activeProject.id]?.detailImageSrc ? (
                      <div className="w-full h-full relative z-10 flex items-center justify-center overflow-hidden bg-stone-900/5">
                        <img 
                          src={assets.images.portfolioProjects[activeProject.id].detailImageSrc} 
                          alt={activeProject.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      /* Generative design view */
                      renderBlueprint(
                        activeProject, 
                        configs.find(c => c.id === activeProject.id)?.color || '#FAF8F5',
                        true
                      )
                    )}
                  </div>

                  {/* Static Portfolio Viewer Entry Button */}
                  <button
                    onClick={handleOpenSlideshow}
                    className="mt-4 px-3.5 py-3 border-2 border-stone-900 font-mono text-[10.5px] md:text-[11px] font-black flex items-center justify-center gap-2 md:gap-3 transition-all bg-white hover:bg-[#FAF8F5] text-stone-950 shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer group select-none"
                  >
                    <Layers size={14} className="text-stone-850 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="tracking-wider">
                      {isEnglish ? 'STATIC PORTFOLIO BROWSING' : '静态作品集项目浏览'}
                    </span>
                    <span className="font-mono text-xs group-hover:translate-x-1 transition-transform ml-0.5">➔</span>
                  </button>
                  
                  <div className="flex justify-between text-[7.5px] font-mono text-stone-400 mt-1.5 px-1 font-bold">
                    <span>PORTFOLIO SLIDESHOW MODE</span>
                    <span>{assets.images.portfolioProjects[activeProject.id]?.staticPortfolioImages?.length ? `${assets.images.portfolioProjects[activeProject.id].staticPortfolioImages?.length} PAGES READY` : 'ARCHIVE PENDING'}</span>
                  </div>
                </div>

                {/* Metadata sheet box */}
                <div className="border-2 border-stone-900 bg-[#EAD3C6]/30 p-4 border-dashed relative">
                  <h5 className="font-mono text-[9px] font-black text-stone-850 uppercase tracking-widest block mb-3 border-b border-stone-200 pb-1.5 flex items-center gap-1">
                    <Bookmark size={9} />
                    {isEnglish ? 'SPECIFICATIONS' : '仪具规格记录'}
                  </h5>
                  
                  <div className="space-y-2 text-[10px] md:text-xs">
                    <div className="flex justify-between">
                      <span className="font-mono text-stone-500 font-bold uppercase">{isEnglish ? 'CATEGORY' : '项目范畴'}</span>
                      <span className="font-bold text-stone-900 text-right">{activeProject.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-stone-500 font-bold uppercase">{isEnglish ? 'DEVELOPED' : '筑造周期'}</span>
                      <span className="font-bold text-stone-900 flex items-center gap-1">
                        <Calendar size={11} />
                        {activeProject.year} / ACTIVE
                      </span>
                    </div>
                    <div className="flex justify-between whitespace-normal">
                      <span className="font-mono text-stone-500 font-bold uppercase shrink-0">{isEnglish ? 'PARTICIPATION' : '我的角色'}</span>
                      <span className="font-bold text-stone-900 text-right font-serif">
                        {isEnglish ? activeProject.enRole || activeProject.role : activeProject.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT EDITORIAL TEXT: Col-span 7 */}
              <div className="col-span-1 lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Index label stamp */}
                  <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500 font-bold uppercase tracking-widest mb-1.5">
                    <Sparkles size={11} className="text-[#C7D4C9]" />
                    <span>ARCHIVE REC N° 0{PROJECTS.findIndex(p => p.id === activeProject.id) + 1}</span>
                  </div>

                  {/* Master Titles */}
                  <h3 className="text-2xl md:text-3xl font-serif font-black text-stone-900 tracking-wide leading-tight">
                    {activeProject.title}
                  </h3>
                  {activeProject.enTitle && (
                    <p className="font-mono text-xs text-stone-500 uppercase tracking-[0.15em] font-extrabold mt-1">
                      {activeProject.enTitle}
                    </p>
                  )}

                  {/* Deep explanation text */}
                  <div className="border-l-4 border-stone-900 bg-[#FAF9F5] pl-4 p-4 my-5 select-text text-xs md:text-sm text-stone-700 leading-relaxed font-wenkai font-bold tracking-wide antialiased">
                    {isEnglish 
                      ? activeProject.enDescription || activeProject.description 
                      : activeProject.description}
                  </div>

                  {/* Clinical milestones checklist or custom Animism/Wuxingxing accordion */}
                  <div className="space-y-3.5 my-5">
                    <h4 className="text-[10px] font-mono text-stone-500 uppercase tracking-widest flex items-center gap-1.5 font-black border-b border-stone-200 pb-2">
                      <Award size={12} className="text-stone-900" />
                      <span>
                        {activeProject.id === 'animism' || activeProject.id === 'wuxingxing' || activeProject.id === 'drift_of_the_unfixed' || activeProject.id === 'edge_of_irrationality'
                          ? (isEnglish ? 'PROJECT FILE SECTIONS (CLICK TO EXPAND)' : '参展档案分册研究 (点击以下分卷可展开)')
                          : (isEnglish ? 'CREATIVE RESEARCH FOOTPRINTS' : '筑造纪事印痕')}
                      </span>
                    </h4>

                    {activeProject.id === 'animism' || activeProject.id === 'wuxingxing' || activeProject.id === 'drift_of_the_unfixed' || activeProject.id === 'edge_of_irrationality' ? (
                      <div className="space-y-3 mt-3">
                        {(activeProject.id === 'animism' 
                          ? ANIMISM_SECTIONS 
                          : activeProject.id === 'wuxingxing' 
                          ? WUXINGXING_SECTIONS 
                          : activeProject.id === 'drift_of_the_unfixed' 
                          ? DRIFT_SECTIONS 
                          : IRRATIONALITY_SECTIONS).map((section, idx) => {
                          const isExpanded = expandedSection === idx;
                          return (
                            <div 
                              key={idx}
                              className={`border-2 border-stone-900 overflow-hidden transition-all duration-200 bg-white ${
                                isExpanded ? 'shadow-[4px_4px_0px_rgba(28,25,22,1)]' : 'shadow-[2px_2px_0px_rgba(28,25,22,0.6)]'
                              }`}
                            >
                              {/* Accordion Header */}
                              <button
                                onClick={() => {
                                  setExpandedSection(isExpanded ? null : idx);
                                  audioManager.playClick();
                                }}
                                className={`w-full flex justify-between items-center p-3 text-left border-b border-stone-900 transition-colors ${
                                  isExpanded ? 'bg-amber-50/50' : 'bg-[#FAF9F5] hover:bg-stone-100/70'
                                }`}
                              >
                                <div className="flex flex-col gap-0.5 text-left">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[9px] text-[#D08465] font-black tracking-widest">
                                      VOL. 0{idx + 1}
                                    </span>
                                    <h5 className="font-serif text-[13px] md:text-[14px] font-black text-stone-950">
                                      {isEnglish ? section.enTitle : section.title}
                                    </h5>
                                  </div>
                                  <p className="text-[11px] text-stone-600 font-bold leading-relaxed max-w-[92%] select-text mt-0.5 whitespace-normal">
                                    {isEnglish ? section.enSummary : section.summary}
                                  </p>
                                </div>
                                <span className="font-mono text-xs text-stone-500 font-extrabold ml-2 shrink-0 select-none">
                                  {isExpanded ? '[ 收起 - ]' : '[ 展开 + ]'}
                                </span>
                              </button>

                              {/* Accordion Content with real-time text */}
                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                  >
                                    <div className="p-3 bg-stone-50/30 border-t border-stone-200 space-y-2.5">
                                      {(isEnglish ? section.enDetails : section.details).map((paragraph, pIdx) => (
                                        <p key={pIdx} className="text-[11.5px] md:text-xs text-stone-850 leading-relaxed font-bold select-text pl-2 border-l-2 border-stone-300">
                                          {paragraph}
                                        </p>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <ul className="space-y-2.5">
                        {(isEnglish && activeProject.enDetails ? activeProject.enDetails : activeProject.details).map((detail, index) => (
                          <li key={index} className="text-[11.5px] md:text-xs text-stone-855 leading-relaxed flex items-start gap-2.5 font-bold">
                            <span className="mt-0.5 shrink-0 p-0.5 bg-white border border-stone-900 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                              <ShieldCheck size={9} className="text-stone-900 fill-transparent" />
                            </span>
                            <span className="select-text">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* ==================================================================== */}
                  {/* PLACEHOLDER: PROJECT DEMO VIDEO PLAYER / EMBED POSITION */}
                  {/* ==================================================================== */}
                  {assets.images.portfolioProjects[activeProject.id]?.videoEmbedEnabled && (
                    <div className="border-2 border-stone-900 bg-black/5 p-2.5 mt-6 shadow-[3px_3px_0px_rgba(28,25,22,1)]" id="portfolio_project_video_container">
                      <div className="font-mono text-[9px] font-black text-stone-500 uppercase tracking-widest block mb-2 px-1">
                        🎬 DIGITAL PERFORMANCE VIDEO DEMO // ACTIVE LINK
                      </div>
                      <div className="relative w-full aspect-video border border-stone-900 bg-black overflow-hidden">
                        {assets.images.portfolioProjects[activeProject.id].videoEmbedUrl?.includes('embed') ? (
                          <iframe 
                            src={assets.images.portfolioProjects[activeProject.id].videoEmbedUrl} 
                            title={`${activeProject.title} Video Presentation`}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        ) : (
                          <video 
                            controls 
                            playsInline
                            className="absolute inset-0 w-full h-full object-contain"
                          >
                            <source src={assets.images.portfolioProjects[activeProject.id].videoEmbedUrl} />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Stamped instruments tag lists */}
                <div className="border-t-2 border-stone-200 pt-5 mt-4">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-2.5 font-black">
                    <Cpu size={12} className="text-stone-900" />
                    <span>{isEnglish ? 'INSTRUMENT COMPOSITION' : '筑造仪具 / 技术底座'}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tools.map((tool) => (
                      <span 
                        key={tool} 
                        className="px-2.5 py-1 text-[10px] font-mono text-stone-900 font-black bg-[#F5F3ED] border border-stone-900 shadow-[2px_2px_0px_rgba(28,25,22,1)]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

          {/* SELECTED EXPERIMENT POPUP DIALOG */}
          <AnimatePresence>
            {selectedExperiment && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-950/80 backdrop-blur-[2px] flex items-center justify-center p-4 z-50 select-none cursor-pointer"
                onClick={() => setSelectedExperiment(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 15 }}
                  transition={{ type: "spring", stiffness: 350, damping: 24 }}
                  className="w-full max-w-lg bg-[#FAF9F5] border-2 border-stone-900 shadow-[8px_8px_0px_rgba(28,25,22,1)] p-6 relative flex flex-col cursor-default"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute inset-1 border border-dashed border-stone-300 pointer-events-none" />

                  {/* Window Control Panel header */}
                  <div className="flex justify-between items-start border-b-2 border-stone-900 pb-3 mb-4 z-10">
                    <div>
                      <span className="font-mono text-[7.5px] text-[#D08465] font-black tracking-widest block uppercase">
                        LAB EXPERIMENT REC N°0{EXPERIMENTS.indexOf(selectedExperiment) + 1} // {selectedExperiment.time}
                      </span>
                      <h4 className="text-xl font-serif font-black text-stone-900">
                        {isEnglish ? selectedExperiment.enTitle : selectedExperiment.title}
                      </h4>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedExperiment(null);
                        audioManager.playClick();
                      }}
                      className="px-2.5 py-1.5 border border-stone-950 bg-white text-[10px] font-mono hover:bg-stone-100 font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                    >
                      [ CLOSE × ]
                    </button>
                  </div>

                  {/* Content structure: Technical Diagrams (2-3 diagrams) */}
                  <div className="z-10">
                    <div className="flex items-center gap-1 text-[8.5px] font-mono text-stone-500 font-extrabold uppercase">
                      <Compass size={11} className="text-[#D08465]" />
                      <span>SCHEMATIC WIREFRAMES / 2-3 IMAGES TEST</span>
                    </div>
                    
                    {renderDetailDiagrams(selectedExperiment.coverAnimType)}
                  </div>

                  {/* Description (max 50 words) */}
                  <div className="mt-2 border-l-4 border-[#D08465] bg-white border-2 border-stone-900 p-3 shadow-[3px_3px_0px_rgba(28,25,22,1)] z-10 transition-all select-text">
                    <span className="font-mono text-[7px] text-stone-400 font-black block uppercase tracking-widest mb-1 select-none">
                      50-WORD SYSTEM INSIGHT // 说明
                    </span>
                    <p className="text-[11px] md:text-[12px] text-stone-700 leading-relaxed font-bold">
                      {isEnglish ? selectedExperiment.enDescription : selectedExperiment.description}
                    </p>
                  </div>

                  {/* Meta specifics */}
                  <div className="mt-5 pt-3 border-t border-dashed border-stone-300 flex justify-between items-center text-[8px] font-mono text-stone-500 font-extrabold uppercase z-10 select-none">
                    <span>TOOLS: <span className="text-[#D08465] font-black">{selectedExperiment.tools}</span></span>
                    <span className="px-1.5 py-0.5 bg-stone-900 text-white select-none">SANDBOX STABLE</span>
                  </div>

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Small Detail footer bar */}
          <div className="p-3 border-t-2 border-stone-900 text-center bg-stone-50 font-mono text-[8px] text-stone-400 font-extrabold select-none">
            WUHUANXING CHRONICLES // PRECISE EXPERIENCER ID // ALL RECORDS STABLE.
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* ==================================================================== */}
    {/* FLOATING ACTION: ENTER WUHUANXING WORLD (SUSPENDED AT BOTTOM CENTER) */}
    {/* ==================================================================== */}
    <AnimatePresence>
      {activeProject && activeProject.id === 'wuxingxing' && onEnterWorld && !isSlideshowOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 30, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 25, x: '-50%' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-8 sm:bottom-10 left-1/2 z-[80] flex flex-col items-center pointer-events-auto select-none"
        >
          <motion.button
            onClick={() => {
              audioManager.playUI1();
              onEnterWorld();
            }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(20, 184, 166, 0.45), 0 6px 20px 0 rgba(0,0,0,0.3)',
                '0 0 0 10px rgba(20, 184, 166, 0), 0 8px 28px 0 rgba(20, 184, 166, 0.35)',
                '0 0 0 0 rgba(20, 184, 166, 0.45), 0 6px 20px 0 rgba(0,0,0,0.3)'
              ],
              y: [-2, 2, -2]
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ borderRadius: '2px' }}
            className="px-6 py-3 sm:px-8 sm:py-3.5 bg-stone-900/95 hover:bg-stone-950 text-white border border-teal-400/70 flex items-center gap-3.5 backdrop-blur-md transition-colors duration-300 cursor-pointer group relative overflow-hidden"
            id="btn_floating_enter_wuxingxing_world"
          >
            {/* Shimmer light sweep animation across button */}
            <motion.div
              animate={{ x: ['-150%', '220%'] }}
              transition={{ duration: 3.0, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.0 }}
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-teal-300/25 to-transparent skew-x-12 pointer-events-none"
            />

            <div className="flex items-center gap-2.5 z-10">
              <motion.span 
                animate={{ rotate: [0, 180, 360], scale: [1, 1.3, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="inline-flex text-teal-300 text-xs sm:text-sm"
              >
                ✦
              </motion.span>
              <span className="font-wenkai md:font-mono font-black text-xs sm:text-sm tracking-widest text-teal-50 group-hover:text-white">
                {isEnglish ? 'ENTER WUHUANXING WORLD' : '进入物换星世界'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-teal-300 group-hover:text-teal-200 z-10 font-mono text-xs sm:text-sm">
              <span className="text-[10px] tracking-wider opacity-80 uppercase hidden sm:inline font-bold">
                {isEnglish ? 'ENTER' : '开始'}
              </span>
              <span className="group-hover:translate-x-1 transition-transform font-bold">➔</span>
            </div>
          </motion.button>
          
          <span className="text-[8.5px] font-mono text-stone-400 font-bold tracking-widest mt-1.5 text-center drop-shadow-sm select-none">
            {isEnglish ? '★ INTERACTIVE NARRATIVE ENTRY' : '★ 点击开启物换星网页交互世界'}
          </span>
        </motion.div>
      )}
    </AnimatePresence>

    {/* ==================================================================== */}
    {/* FLOATING GUIDE CARD (ONLY FOR FRUIT SHELF VIEW, NOT IN DETAILS VIEW) */}
    {/* ==================================================================== */}
    <AnimatePresence>
      {isDialogueCompleted && !activeProject && !isSlideshowOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ 
            opacity: [0.45, 1, 0.45], 
            x: '-50%',
            y: 0
          }}
          exit={{ opacity: 0, y: 15, x: '-50%' }}
          transition={{ 
            opacity: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
            exit: { duration: 0.25 }
          }}
          style={{ borderRadius: '2px' }}
          className="fixed bottom-6 sm:bottom-8 left-1/2 z-40 w-[94%] max-w-2xl pointer-events-auto select-none bg-white/90 hover:bg-white backdrop-blur-md px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-5 shadow-[0_8px_30px_rgba(0,0,0,0.09)] transition-colors"
          id="card_floating_fruit_guide"
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="text-stone-400 font-mono text-xs select-none shrink-0 font-black">
              ✦
            </span>
            <p className="font-wenkai md:font-serif text-xs sm:text-[13px] text-stone-800 font-medium leading-relaxed text-left line-clamp-2 sm:line-clamp-none tracking-wide">
              {isEnglish 
                ? "“Shift of the Constellations” is an interactive portfolio and an experimental demo for the visual novel."
                : "《物换星》是一部作者的交互作品集网页，同时也是视觉小说《物换星》的实验性demo。"}
            </p>
          </div>
          
          <button
            onClick={() => {
              audioManager.playUI1();
              if (onEnterWorld) onEnterWorld();
            }}
            style={{ borderRadius: '2px' }}
            className="shrink-0 px-3.5 py-2.5 sm:px-4 sm:py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-mono text-xs font-bold tracking-wider transition-all duration-150 cursor-pointer shadow-none hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
            id="btn_enter_wuxingxing_guide_card"
          >
            <span className="font-wenkai md:font-mono font-bold whitespace-nowrap">
              {isEnglish ? 'ENTER WUHUANXING' : '进入物换星'}
            </span>
            <span className="font-mono text-xs">➔</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>

    {/* ==================================================================== */}
    {/* STATIC PORTFOLIO SLIDESHOW / COMING SOON OVERLAY */}
    {/* ==================================================================== */}
    <AnimatePresence>
      {isSlideshowOpen && activeProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 bg-black flex flex-col justify-between select-none overflow-hidden pt-16 md:pt-20"
          id="static_portfolio_viewer_modal"
        >
          {/* Top-Left: Return to Project Detail Button (Below Menu Bar, unified project details style) */}
          <button
            onClick={handleCloseSlideshow}
            className="fixed top-16 left-4 md:top-20 md:left-6 z-50 flex items-center md:gap-2 gap-1 text-[11px] font-mono font-black text-stone-950 bg-white hover:bg-stone-50 border border-stone-900 px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-left cursor-pointer"
          >
            <ArrowLeft size={12} />
            <span>{isEnglish ? 'BACK TO PROJECT' : '← 返回项目详情'}</span>
          </button>

          {/* Top-Right: Project Title Info Indicator */}
          <div className="fixed top-16 right-4 md:top-20 md:right-6 z-50 hidden sm:flex items-center gap-2 font-mono text-[9.5px] text-stone-300 bg-stone-900/85 border border-stone-700/80 px-2.5 py-1.5 backdrop-blur-sm shadow-md">
            <span className="w-1.5 h-1.5 bg-amber-400 rotate-45" />
            <span className="font-bold tracking-wider">{activeProject.title}</span>
            <span className="text-stone-500">|</span>
            <span className="text-stone-400">{isEnglish ? 'PORTFOLIO ARCHIVE' : '静态项目档案'}</span>
          </div>

          {/* Main Content Area */}
          {(() => {
            const slides = assets.images.portfolioProjects[activeProject.id]?.staticPortfolioImages || [];
            const totalSlides = slides.length;

            if (totalSlides > 0) {
              return (
                <div className="relative flex-1 w-full h-full min-h-0 flex items-center justify-center overflow-hidden p-0 pt-2 md:pt-4 pb-1">
                  {/* Left Triangular Navigation Button */}
                  <button
                    onClick={() => {
                      setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
                      audioManager.playClick();
                    }}
                    aria-label="Previous Slide"
                    className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 z-40 w-11 h-11 md:w-14 md:h-14 bg-stone-950/80 hover:bg-stone-900 border border-stone-700/80 hover:border-amber-200/90 text-stone-200 hover:text-white rounded-full shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer group"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 fill-current transition-transform group-hover:-translate-x-0.5">
                      <polygon points="17,4 5,12 17,20" />
                    </svg>
                  </button>

                  {/* Right Triangular Navigation Button */}
                  <button
                    onClick={() => {
                      setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
                      audioManager.playClick();
                    }}
                    aria-label="Next Slide"
                    className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 z-40 w-11 h-11 md:w-14 md:h-14 bg-stone-950/80 hover:bg-stone-900 border border-stone-700/80 hover:border-amber-200/90 text-stone-200 hover:text-white rounded-full shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer group"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 fill-current transition-transform group-hover:translate-x-0.5">
                      <polygon points="7,4 19,12 7,20" />
                    </svg>
                  </button>

                  {/* Image Presentation - Width fitting without side black bars, shifted downwards, instant switch without fading */}
                  <div className="relative w-full h-full min-h-0 flex items-center justify-center translate-y-1 md:translate-y-2">
                    <img
                      key={currentSlideIndex}
                      src={slides[currentSlideIndex]}
                      alt={`${activeProject.title} - Page ${currentSlideIndex + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto max-h-[82vh] object-contain select-none shadow-2xl"
                    />
                  </div>
                </div>
              );
            }

            // Fallback for un-uploaded projects: Black background with large white text "敬请期待"
            return (
              <div className="relative flex-1 w-full h-full flex flex-col items-center justify-center select-none bg-black text-white px-4">
                {/* Subtle geometric lines */}
                <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
                  <div className="w-96 h-96 border border-dashed border-stone-600 rounded-full" />
                  <div className="absolute w-[500px] h-[500px] border border-stone-800 rounded-full" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-2 h-2 bg-amber-400/80 rotate-45" />
                    <span className="font-mono text-xs text-stone-400 tracking-[0.3em] uppercase">
                      {isEnglish ? 'PORTFOLIO ARCHIVE' : '静态项目档案'}
                    </span>
                    <span className="w-2 h-2 bg-amber-400/80 rotate-45" />
                  </div>

                  <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-[0.35em] text-white drop-shadow-[0_4px_30px_rgba(255,255,255,0.2)] pl-[0.35em]">
                    {isEnglish ? 'COMING SOON' : '敬请期待'}
                  </h2>

                  <p className="font-mono text-xs md:text-sm text-stone-400 tracking-[0.35em] uppercase mt-6 font-bold">
                    {isEnglish ? 'DOCUMENTATION ARCHIVE IN PROGRESS' : '作品集静态图鉴正在整理筑造中'}
                  </p>

                  <div className="mt-8 px-4 py-2 border border-dashed border-stone-700 bg-stone-900/60 font-mono text-[11px] text-stone-500 tracking-wider">
                    {activeProject.title} // {activeProject.year}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Bottom Footer Bar */}
          {(() => {
            const slides = assets.images.portfolioProjects[activeProject.id]?.staticPortfolioImages || [];
            const totalSlides = slides.length;

            if (totalSlides > 0) {
              return (
                <div className="relative z-50 w-full px-3 py-1.5 md:py-2 flex flex-col items-center justify-center gap-1.5 border-t border-stone-800/80 bg-stone-950/95 backdrop-blur-md shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs md:text-sm text-amber-300 font-bold tracking-widest">
                      {String(currentSlideIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Progress Dots */}
                  <div className="flex gap-1.5 max-w-[85vw] overflow-x-auto py-0.5">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentSlideIndex(idx);
                          audioManager.playClick();
                        }}
                        className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                          idx === currentSlideIndex 
                            ? 'w-6 bg-amber-300' 
                            : 'w-2 bg-stone-700 hover:bg-stone-500'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <div className="relative z-50 w-full py-2.5 text-center border-t border-stone-900 bg-stone-950 text-stone-600 font-mono text-[9px] tracking-wider shrink-0">
                STATIC PORTFOLIO PREVIEW SYSTEM // WUHUANXING CHRONICLES
              </div>
            );
          })()}
        </motion.div>
      )}
    </AnimatePresence>

    {/* Chapter Marker */}
    <div className="absolute bottom-8 left-12 hidden md:block">
      <span className="font-mono text-[9px] text-stone-400 tracking-wider font-bold">
        CHAPTER 07 / PORTFOLIO EXHIBITION
      </span>
    </div>
  </div>
);
};
