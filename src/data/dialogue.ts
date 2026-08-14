export interface DialogueChoice {
  id: string;
  text: string;
  enText: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  enSpeaker?: string;
  text: string;
  enText: string;
  action?: string;
  choices?: DialogueChoice[];
}

export const DIALOGUE_SCRIPT: Record<string, DialogueLine[]> = {
  menu: [
    {
      id: 'm1',
      speaker: '旁白',
      enSpeaker: 'Narrator',
      text: '欢迎来到《物换星》。有些时候，人就像夜空中的轨迹。看起来静止，实际上正在发生着缓慢的偏转。',
      enText: 'Welcome to Wuhuanxing.\nSometimes, we are like paths in the night sky.\nSeemingly static, but undergoing a slow, silent deflection.'
    },
    {
      id: 'm2',
      speaker: '我',
      enSpeaker: 'Me',
      text: '你好，不期而遇的旅人。这并不是一份枯燥的代码履历，而是一场由我的碎屑拼凑起来的，小小的自白。',
      enText: 'Hello, traveler met by chance.\nThis is not a dry code resume,\nbut a tiny confession pieced together from my fragments.'
    }
  ],
  intro: [
    {
      id: 'i1',
      speaker: '我',
      enSpeaker: 'Me',
      text: '你好，我是林，目前就读于中国传媒大学新媒体艺术专业。\n我的创作主要围绕游戏、交互网页、动态影像与数字媒介展开，希望让技术不仅服务于功能，也成为表达的一部分。',
      enText: 'Hello, I am Lin, studying New Media Art at Communication University of China.\nMy work revolves around games, interactive web, motion graphics, and digital media,\nhoping technology serves not only function, but also as part of expression.'
    },
    {
      id: 'i2',
      speaker: '我',
      enSpeaker: 'Me',
      text: '《物换星》最初是一部视觉小说。\n由于项目规模较大，我将其中的一部分重新整理，制作成了现在这个交互网页。\n它既是一段故事，也是我的作品集。',
      enText: '"Wuhuanxing" was originally a visual novel.\nDue to the project size, I reorganized part of it into this interactive webpage.\nIt is both a story and my portfolio.'
    }
  ],
  questionnaire: [
    {
      id: 'q1',
      speaker: '我',
      enSpeaker: 'Me',
      text: '在很远很远的地方，有一颗星星。',
      enText: 'Far, far away, there is a star.'
    },
    {
      id: 'q2',
      speaker: '我',
      enSpeaker: 'Me',
      text: '它漂浮在云层之上。人们称它为：\n物换星。',
      enText: 'It floats above the clouds. People call it:\nWuhuanxing.'
    },
    {
      id: 'q3',
      speaker: '我',
      enSpeaker: 'Me',
      text: '传说里，每当夜晚有人无法入睡时，物换星都会低头看见他们。',
      enText: 'Legend says whenever someone cannot sleep at night,\nWuhuanxing looks down at them.'
    },
    {
      id: 'q4',
      speaker: '我',
      enSpeaker: 'Me',
      text: '如果你有幸飞到那里，见到物换星，你可以向它许一个愿望。',
      enText: 'If you are lucky enough to fly there and meet Wuhuanxing,\nyou can make a wish.'
    },
    {
      id: 'q5',
      speaker: '我',
      enSpeaker: 'Me',
      text: '但是物换星从不赠予任何东西,它只相信一种规则:\n等价交换。',
      enText: 'But Wuhuanxing never gives anything for free.\nIt believes in only one rule:\nEquivalent Exchange.'
    },
    {
      id: 'q6',
      speaker: '我',
      enSpeaker: 'Me',
      text: '想得到什么。就必须交出什么。',
      enText: 'To gain something, you must give something up.'
    },
    {
      id: 'q7',
      speaker: '女孩',
      enSpeaker: 'The girl',
      text: '……你终于来了。',
      enText: '...You are finally here.'
    },
  ],
  scale_girl: [
    {
      id: 's1',
      speaker: '女孩',
      enSpeaker: 'The girl',
      text: '没错，那个住在天平上的女孩就是我。',
      enText: 'Yes, that girl who lives on the scales is me.'
    },
    {
      id: 's2',
      speaker: '女孩',
      enSpeaker: 'The girl',
      text: '等一下。',
      enText: 'Wait a moment.'
    },
    {
      id: 's3',
      speaker: '女孩',
      enSpeaker: 'The girl',
      text: '我还不能离开。',
      enText: 'I cannot leave yet.',
      choices: [
        {
          id: 'why',
          text: '为什么？',
          enText: 'Why?'
        }
      ]
    },
    {
      id: 's4',
      speaker: '女孩',
      enSpeaker: 'The girl',
      text: '因为天平还没有平衡。',
      enText: 'Because the scale is not yet balanced.'
    },
    {
      id: 's5',
      speaker: '女孩',
      enSpeaker: 'The girl',
      text: '这是物换星的规则。只有达到正确的重量，愿望才会实现。',
      enText: 'This is the rule of Wuhuanxing.\nOnly when the correct weight is reached will the wish come true.'
    }
  ],
  wisdom_tooth: [],
  heart_feather: [
    {
      id: 'h1',
      speaker: '我',
      enSpeaker: 'Me',
      text: '谁会相信，\n 智齿里居然长出了精灵？',
      enText: 'Who would believe that an elf\nactually grew out of a wisdom tooth?'
    }
  ],
  portfolio: [
    {
      id: 'p1',
      speaker: '我',
      enSpeaker: 'Me',
      text: '敬请期待物换星的续集。\n 创作仍然在继续。',
      enText: 'Please stay tuned for the sequel to Wuhuanxing.\nThe creation continues.'
    },
    {
      id: 'p2',
      speaker: '我',
      enSpeaker: 'Me',
      text: '这里保存着我完成的一些作品。',
      enText: 'Here lie some of the works I have completed over the years.'
    },
    {
      id: 'p3',
      speaker: '我',
      enSpeaker: 'Me',
      text: '它们来自不同的阶段，也使用不同的媒介。\n有的是课程项目，有的是实验，\n 也有一些仍在继续生长。',
      enText: 'They come from different stages and use different mediums.\nSome are course projects, some are experiments,\nand some are still growing.'
    }
  ]
};
