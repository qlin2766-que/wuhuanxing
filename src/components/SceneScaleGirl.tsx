import React, { useState, useEffect } from 'react';
import { QuestionnaireAnswers } from '../types';
import { audioManager } from '../utils/audio';
import { assets } from '../utils/assets';

interface SceneScaleGirlProps {
  answers: QuestionnaireAnswers;
  isEnglish: boolean;
  onComplete: () => void;
  isDialogueCompleted?: boolean;
  currentDialogueLineId?: string;
}

interface DraggableShape {
  id: string;
  type: 'marble_pink' | 'marble_yellow' | 'marble_blue' | 'ticket_1' | 'ticket_2' | 'ticket_3' | 'pearl' | 'feather';
  weight: number;
  x: number;
  y: number;
  state: 'scattered' | 'left-pan' | 'right-pan';
  panOffset: { x: number; y: number };
}

// Thought bubble reaction dialogue for different girl identities and item categories
const GIRL_THOUGHTS: Record<string, Record<string, string>> = {
  student: {
    pearl: '真漂亮，戴在耳朵上，\n 一定会很好看。',
    marble: '小时候和伙伴玩弹珠，\n一颗一颗散落走，\n 我们说弹珠飞去了神秘的国度。\n每次打扫房间的角落，总是能发现几颗。',
    ticket: '以后我会有很多时间。\n想去哪里，随时都可以出发。',
    feather: '每次考试的时候，\n 我的脑袋都跟羽毛一样轻飘飘的。',
  },
  art_practitioner: {
    pearl: '淡水珍珠？海水珍珠？\n产出水域不同的珍珠价格也不同。',
    marble: '无论再怎么打扫房间，\n也无法在角落找到新的弹珠了。',
    ticket: '这张票是哪年的？\n原来已经过期这么久了……',
    feather: '这是什么鸟的羽毛？\n如果查一下，应该能知道。',
  },
  creator: {
    pearl: '在贝壳吐出珍珠之前，\n 它还没有被磨圆。\n那时候的它，会是什么形状呢？',
    marble: '它里面藏着一小片彩虹，好神奇。',
    ticket: '车票的目的地被涂鸦遮住了？\n没关系，那好像并不重要。',
    feather: '如果人的心脏和羽毛一样重，\n是不是就能飞去天堂？',
  },
};

const GIRL_THOUGHTS_EN: Record<string, Record<string, string>> = {
  student: {
    pearl: 'So pretty. \nThey would look lovely worn on ears.',
    marble: 'When I played marbles with friends, \nthey bounced away into a mysterious kingdom.\nEvery time I cleaned room corners, I found a few.',
    ticket: 'I will have plenty of time in the future.\nI can head off wherever I want.',
    feather: 'Every time during exams, \nmy head feels light as a feather.',
  },
  art_practitioner: {
    pearl: 'Freshwater or saltwater pearls?\nPearls from different waters carry different prices.',
    marble: 'No matter how much I clean room corners,\nI can no longer find new marbles.',
    ticket: 'Which year is this ticket from?\nIt has been expired for so long...',
    feather: 'What bird feather is this?\nSearching it up should tell.',
  },
  creator: {
    pearl: 'Before the clam spat out the pearl,\n it had not been smoothed yet.\nWhat shape was it back then?',
    marble: 'There is a tiny rainbow hidden inside. \nHow magical.',
    ticket: 'The ticket destination is covered in graffiti?\nThat is fine, it does not seem important anyway.',
    feather: 'If human hearts weighed as light as a feather,\ncould we fly straight to heaven?',
  },
};

const getItemCategory = (type: string): 'pearl' | 'marble' | 'ticket' | 'feather' | null => {
  if (type === 'pearl') return 'pearl';
  if (type.startsWith('marble')) return 'marble';
  if (type.startsWith('ticket')) return 'ticket';
  if (type === 'feather') return 'feather';
  return null;
};

// Procedural generator to randomly and beautifully scatter shapes in safe margins around the scale
const generateRandomScatteredShapes = (): DraggableShape[] => {
  const shapes: DraggableShape[] = [];

  // Helper helper for cleaner random offsets
  const rand = (min: number, range: number) => min + Math.floor(Math.random() * range);

  // 2 Pearls (珍珠) - Weight: 20
  // Balanced lower down on the left desk/table (not floating, placed down neatly close to each other, split by ~150px)
  shapes.push({
    id: 'pearl_0',
    type: 'pearl',
    weight: 20,
    x: rand(150, 50),
    y: rand(1220, 30),
    state: 'scattered',
    panOffset: { x: -90, y: -40 }
  });
  shapes.push({
    id: 'pearl_1',
    type: 'pearl',
    weight: 20,
    x: rand(300, 50),
    y: rand(1275, 30),
    state: 'scattered',
    panOffset: { x: 10, y: -40 }
  });

  // 3 Tickets (车票) - Weight: 10, 2x scaled (width 312, height 192)
  // Stacked and overlapping elegantly on the right desk/table (placed down neatly)
  const basex = rand(1650, 100);
  const basey = rand(1120, 60);

  shapes.push({
    id: 'ticket_0',
    type: 'ticket_1',
    weight: 10,
    x: basex,
    y: basey,
    state: 'scattered',
    panOffset: { x: -80, y: -86 }
  });
  shapes.push({
    id: 'ticket_1',
    type: 'ticket_2',
    weight: 10,
    x: basex + rand(35, 45),
    y: basey + rand(25, 30),
    state: 'scattered',
    panOffset: { x: 60, y: -86 }
  });
  shapes.push({
    id: 'ticket_2',
    type: 'ticket_3',
    weight: 10,
    x: basex - rand(45, 35),
    y: basey + rand(55, 30),
    state: 'scattered',
    panOffset: { x: -10, y: -86 }
  });

  // 3 Marbles (玻璃弹珠) - 1 of each color (pink, yellow, blue), Weight: 1
  // Floating high above the scale in a perfectly balanced manner, not obscured by text/UI
  shapes.push({
    id: 'marble_pink_0',
    type: 'marble_pink',
    weight: 1,
    x: rand(280, 120),
    y: rand(180, 100),
    state: 'scattered',
    panOffset: { x: -120, y: -25 }
  });
  shapes.push({
    id: 'marble_yellow_0',
    type: 'marble_yellow',
    weight: 1,
    x: rand(1420, 150),
    y: rand(185, 110),
    state: 'scattered',
    panOffset: { x: -80, y: -25 }
  });
  shapes.push({
    id: 'marble_blue_0',
    type: 'marble_blue',
    weight: 1,
    x: rand(580, 150),
    y: rand(220, 110),
    state: 'scattered',
    panOffset: { x: 30, y: -25 }
  });

  // Exactly 1 Feather (羽毛) - Weight: 0, 2x scaled (width 260, height 260)
  // Positioned beautifully in the bottom-right corner (further to the right)
  shapes.push({
    id: 'feather_0',
    type: 'feather',
    weight: 0,
    x: rand(2050, 100),
    y: rand(1240, 70),
    state: 'scattered',
    panOffset: { x: 0, y: -120 }
  });

  return shapes;
};

export const SceneScaleGirl: React.FC<SceneScaleGirlProps> = ({ 
  answers, 
  isEnglish, 
  onComplete, 
  isDialogueCompleted = false,
  currentDialogueLineId = ''
}) => {
  const [hoveredExpectation, setHoveredExpectation] = useState<string | null>(null);
  const [shaking, setShaking] = useState<boolean>(false);

  // Scattered shapes state
  const [shapes, setShapes] = useState<DraggableShape[]>(() => generateRandomScatteredShapes());

  // Dragging interaction state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Girl thought bubble state
  const [activeThoughtText, setActiveThoughtText] = useState<string | null>(null);
  const [typedThoughtText, setTypedThoughtText] = useState<string>('');
  const [isThoughtVisible, setIsThoughtVisible] = useState<boolean>(false);
  const thoughtTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Balanced dialogue steps (3 sequential text boxes)
  const [balancedStep, setBalancedStep] = useState<number>(0);
  const [typedBalancedText, setTypedBalancedText] = useState<string>('');

  // Interactive guidance sequence state:
  // Step 1: 'place_items' ("放入物品")
  // Step 2: 'ratio_hint' (在数字处提示用户说明这是两端重量比例)
  // Step 3: 'drag_item_hint' (随机一个物品举例指引拖动)
  // 'completed' (dismissed)
  const [guideStep, setGuideStep] = useState<'idle' | 'place_items' | 'ratio_hint' | 'drag_item_hint' | 'completed'>('idle');
  const [highlightedShapeId, setHighlightedShapeId] = useState<string | null>(null);
  const guideTimersRef = React.useRef<NodeJS.Timeout[]>([]);

  const clearGuideTimers = () => {
    guideTimersRef.current.forEach(t => clearTimeout(t));
    guideTimersRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearGuideTimers();
    };
  }, []);

  const balancedLines = isEnglish
    ? ['Was it successful?', 'But why...', 'I still feel like something is missing?']
    : ['成功了吗？', '可为什么……', '我还是觉得少了一点东西？'];

  useEffect(() => {
    return () => {
      if (thoughtTimerRef.current) clearTimeout(thoughtTimerRef.current);
    };
  }, []);

  // Typewriter effect for thought bubble
  useEffect(() => {
    if (!activeThoughtText || !isThoughtVisible) {
      setTypedThoughtText('');
      return;
    }

    setTypedThoughtText('');
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < activeThoughtText.length) {
        currentIndex++;
        setTypedThoughtText(activeThoughtText.slice(0, currentIndex));
      } else {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [activeThoughtText, isThoughtVisible]);

  // Sum up weights
  const leftObjectsWeight = shapes
    .filter((s) => s.state === 'left-pan')
    .reduce((sum, s) => sum + s.weight, 0);

  const rightObjectsWeight = shapes
    .filter((s) => s.state === 'right-pan')
    .reduce((sum, s) => sum + s.weight, 0);

  // Derive initial tilt and shape parameters from questionnaire state
  const isAchievement = answers.valuableAspect === 'achievement';
  const isConnections = answers.valuableAspect === 'connections';
  const isInnerPeace = answers.valuableAspect === 'inner_peace';
  const identity = answers.identity || (isAchievement ? 'art_practitioner' : isInnerPeace ? 'student' : 'creator');

  useEffect(() => {
    // Each time answers or shapes change, play scale movement sound
    audioManager.playScaleMovement();
    setShaking(true);
    const t = setTimeout(() => setShaking(false), 1200);
    return () => clearTimeout(t);
  }, [answers, leftObjectsWeight, rightObjectsWeight]);

  // Calculate dynamic tilt based on weights!
  const hasFeatherOnRight = shapes.some(s => s.type === 'feather' && s.state === 'right-pan');
  const hasOtherOnRight = shapes.some(s => s.state === 'right-pan' && s.type !== 'feather');
  const hasAnyOnLeft = shapes.some(s => s.state === 'left-pan');
  const isStudentBalanced = identity === 'student' && hasFeatherOnRight && !hasOtherOnRight && !hasAnyOnLeft;

  let totalLeftWeight = 0;
  let totalRightWeight = 0;
  let finalTilt = 0;
  let isBalanced = false;

  if (identity === 'art_practitioner') {
    totalLeftWeight = 59 + leftObjectsWeight;
    totalRightWeight = rightObjectsWeight;
    const weightDiff = totalLeftWeight - totalRightWeight;
    finalTilt = -Math.min(Math.max(weightDiff * 0.45, -16.5), 16.5);
    isBalanced = totalLeftWeight === totalRightWeight;
  } else if (identity === 'creator') {
    totalLeftWeight = 23 + leftObjectsWeight;
    totalRightWeight = rightObjectsWeight;
    const weightDiff = totalLeftWeight - totalRightWeight;
    finalTilt = -Math.min(Math.max(weightDiff * 0.45, -16.5), 16.5);
    isBalanced = totalLeftWeight === totalRightWeight;
  } else if (identity === 'student') {
    isBalanced = isStudentBalanced;
    if (isBalanced) {
      totalLeftWeight = 0;
      totalRightWeight = 0;
      finalTilt = 0;
    } else {
      totalLeftWeight = leftObjectsWeight;
      totalRightWeight = rightObjectsWeight;
      const rightWeight = shapes.filter(s => s.state === 'right-pan').reduce((sum, s) => sum + s.weight, 0);
      const leftWeight = shapes.filter(s => s.state === 'left-pan').reduce((sum, s) => sum + s.weight, 0);
      const virtualDiff = 25 + rightWeight - leftWeight; // Left is lighter (deficit)
      finalTilt = Math.min(Math.max(virtualDiff * 0.45, -16.5), 16.5);
    }
  }

  // Trigger guidance sequence once dialogue is completed
  useEffect(() => {
    if (!isDialogueCompleted || isBalanced) {
      return;
    }

    clearGuideTimers();
    setGuideStep('place_items');

    // Timer 1: Transition to ratio_hint after 3.2s
    const t1 = setTimeout(() => {
      setGuideStep('ratio_hint');
    }, 3200);

    // Timer 2: Transition to drag_item_hint after 7.2s
    const t2 = setTimeout(() => {
      // Pick a random scattered shape to highlight
      setShapes(currentShapes => {
        const scattered = currentShapes.filter(s => s.state === 'scattered');
        if (scattered.length > 0) {
          const randomIndex = Math.floor(Math.random() * scattered.length);
          setHighlightedShapeId(scattered[randomIndex].id);
        }
        return currentShapes;
      });
      setGuideStep('drag_item_hint');
    }, 7200);

    // Timer 3: Complete guidance after 13s
    const t3 = setTimeout(() => {
      setGuideStep('completed');
    }, 13000);

    guideTimersRef.current = [t1, t2, t3];
  }, [isDialogueCompleted]);

  // Dismiss guide immediately upon user drag interaction or if balanced
  useEffect(() => {
    if (draggedId || isBalanced) {
      if (guideStep !== 'completed') {
        clearGuideTimers();
        setGuideStep('completed');
      }
    }
  }, [draggedId, isBalanced, guideStep]);

  // Helper helper to rotate a point (x, y) around pivot (cx, cy)
  const getRotatedPoint = (x: number, y: number, cx: number, cy: number, angleDegrees: number) => {
    const rad = (angleDegrees * Math.PI) / 180;
    const dx = x - cx;
    const dy = y - cy;
    return {
      x: cx + dx * Math.cos(rad) - dy * Math.sin(rad),
      y: cy + dx * Math.sin(rad) + dy * Math.cos(rad)
    };
  };

  // Typewriter effect for balanced dialogue box
  useEffect(() => {
    if (!isBalanced) {
      setBalancedStep(0);
      setTypedBalancedText('');
      return;
    }

    const currentText = balancedLines[balancedStep] || '';
    setTypedBalancedText('');
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < currentText.length) {
        idx++;
        setTypedBalancedText(currentText.slice(0, idx));
        if (idx % 2 === 0) {
          audioManager.playClick();
        }
      } else {
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [isBalanced, balancedStep, isEnglish]);

  // Helper for generating star coordinates centered at (cx, cy)
  const getStarPoints = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    const points = [];

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      points.push(`${Math.round(x)},${Math.round(y)}`);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      points.push(`${Math.round(x)},${Math.round(y)}`);
      rot += step;
    }
    return points.join(' ');
  };

  // Drag Handlers
  const handlePointerDown = (e: React.PointerEvent, shapeId: string) => {
    if (!isDialogueCompleted) return;
    e.preventDefault();
    const targetElement = e.currentTarget as SVGElement;
    const svgElement = targetElement.ownerSVGElement;
    if (!svgElement) return;
    
    // Acquire pointer capture to move shape smoothly even when index leaves element
    targetElement.setPointerCapture(e.pointerId);

    const rect = svgElement.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 2388;
    const clickY = ((e.clientY - rect.top) / rect.height) * 1668;

    const targetShape = shapes.find(s => s.id === shapeId);
    if (!targetShape) return;

    // Trigger girl thought reaction for dragged shape
    const category = getItemCategory(targetShape.type);
    if (category) {
      const thoughtMap = isEnglish ? GIRL_THOUGHTS_EN : GIRL_THOUGHTS;
      const thought = thoughtMap[identity]?.[category];
      if (thought) {
        if (thoughtTimerRef.current) {
          clearTimeout(thoughtTimerRef.current);
          thoughtTimerRef.current = null;
        }
        setActiveThoughtText(thought);
        setIsThoughtVisible(true);
      }
    }

    // Trigger micro click / paper pickup audio
    if (targetShape.type.startsWith('ticket')) {
      audioManager.playPaperSound();
    } else {
      audioManager.playClick();
    }
    setDraggedId(shapeId);

    // Instantly snap geometric center of shape under the mouse pointer
    setShapes(prev => prev.map(s => {
      if (s.id === shapeId) {
        return {
          ...s,
          state: 'scattered', // Force to scattered state so coordinates follow mouse
          x: clickX,
          y: clickY
        };
      }
      return s;
    }));

    setDragOffset({
      x: 0,
      y: 0
    });
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggedId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 2388;
    const rawY = ((e.clientY - rect.top) / rect.height) * 1668;

    // Keep shapes in safe viewport bounds
    const targetX = Math.min(Math.max(rawX, 80), 2308);
    const targetY = Math.min(Math.max(rawY, 80), 1588);

    setShapes(prev => prev.map(s => {
      if (s.id === draggedId) {
        return {
          ...s,
          state: 'scattered', // detachment on active move
          x: targetX,
          y: targetY
        };
      }
      return s;
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggedId) return;
    
    // Release capture
    (e.currentTarget as SVGElement).releasePointerCapture(e.pointerId);

    // Keep thought bubble visible for 5.0s after dropping before slowly fading out
    if (thoughtTimerRef.current) {
      clearTimeout(thoughtTimerRef.current);
    }
    thoughtTimerRef.current = setTimeout(() => {
      setIsThoughtVisible(false);
    }, 5000);

    const targetShape = shapes.find(s => s.id === draggedId);
    if (targetShape) {
      // Physically suspended pans hang straight down from their crossbar endpoints
      const leftPivot = getRotatedPoint(491, 513.5, 1214.5, 513.5, finalTilt);
      const leftPanRotated = { x: leftPivot.x, y: leftPivot.y + 340.0 };

      const rightPivot = getRotatedPoint(1938, 513.5, 1214.5, 513.5, finalTilt);
      const rightPanRotated = { x: rightPivot.x, y: rightPivot.y + 340.0 };

      const distToLeft = Math.hypot(targetShape.x - leftPanRotated.x, targetShape.y - leftPanRotated.y);
      const distToRight = Math.hypot(targetShape.x - rightPanRotated.x, targetShape.y - rightPanRotated.y);

      let newState: 'scattered' | 'left-pan' | 'right-pan' = 'scattered';
      let triggeredSound = false;
      let newPanOffset = targetShape.panOffset;

      // Match target zones boundary comfortably (increased to 280 for 2388x1668 viewport)
      if (distToLeft < 280) {
        newState = 'left-pan';
        triggeredSound = true;
        // The surface of the visual pan corresponds to leftPivot.y - 513.5 + 910.0
        const relX = targetShape.x - leftPivot.x;

        // Snapping directly to resting position on the plate (no hovering!)
        const { height } = getImageDimensions(targetShape.type);
        let maxOffset = 15 - height / 2;
        if (targetShape.type.startsWith('marble')) {
          maxOffset -= 10; // Raise marble slightly so it isn't covered too much by foreground rim (adjusted to 10px)
        }

        // Constrain dropped objects comfortably inside concave dish center (+/- 80px)
        const constrainedX = Math.min(Math.max(relX * 0.45, -80), 80);
        const bowlCurveY = (constrainedX * constrainedX) / 850;

        newPanOffset = { x: constrainedX, y: maxOffset + bowlCurveY };
      } else if (distToRight < 280) {
        newState = 'right-pan';
        triggeredSound = true;
        const relX = targetShape.x - rightPivot.x;

        const { height } = getImageDimensions(targetShape.type);
        let maxOffset = 15 - height / 2;
        if (targetShape.type.startsWith('marble')) {
          maxOffset -= 10; // Raise marble slightly so it isn't covered too much by foreground rim (adjusted to 10px)
        }

        const constrainedX = Math.min(Math.max(relX * 0.45, -80), 80);
        const bowlCurveY = (constrainedX * constrainedX) / 850;

        newPanOffset = { x: constrainedX, y: maxOffset + bowlCurveY };
      }

      if (triggeredSound) {
        if (targetShape.type === 'pearl') {
          audioManager.playPearlFall();
        } else if (targetShape.type.startsWith('marble')) {
          audioManager.playGlassMarble();
        } else if (targetShape.type.startsWith('ticket')) {
          audioManager.playPaperSound();
        } else {
          audioManager.playChime();
        }
      } else {
        if (targetShape.type.startsWith('ticket')) {
          audioManager.playPaperSound();
        } else {
          audioManager.playWaterDrop();
        }
      }

      setShapes(prev => prev.map(s => {
        if (s.id === draggedId) {
          return {
            ...s,
            state: newState,
            panOffset: newState !== 'scattered' ? newPanOffset : s.panOffset
          };
        }
        return s;
      }));
    }

    setDraggedId(null);
  };

  // Render SVG paths representing the girl's distorted posture
  const getGirlBodyPath = () => {
    if (identity === 'art_practitioner') {
      // Rigid suite-like/working cattle body posture
      return assets.svgs.scaleGirlBodies.art_practitioner;
    }
    if (identity === 'student') {
      // Completely round, naive, simple capsule shape taking no burden comfortably
      return assets.svgs.scaleGirlBodies.student;
    }
    // Creator: slumped sloped posture representing fatigue and organic curves
    return assets.svgs.scaleGirlBodies.creator;
  };

  const getHeadY = () => {
    if (identity === 'art_practitioner') return 80;
    if (identity === 'student') return 110;
    return 95;
  };

  const resetWeight = () => {
    audioManager.playWaterDrop();
    setHoveredExpectation(null);
    setBalancedStep(0);
    setShapes(generateRandomScatteredShapes());
  };

  const getShapeImageSrc = (type: DraggableShape['type']) => {
    switch (type) {
      case 'pearl':
        return '/src/assets/images/珍珠.png';
      case 'ticket_1':
        return '/src/assets/images/车票1.png';
      case 'ticket_2':
        return '/src/assets/images/车票2.png';
      case 'ticket_3':
        return '/src/assets/images/车票3.png';
      case 'marble_pink':
        return '/src/assets/images/玻璃弹珠-粉1.png';
      case 'marble_yellow':
        return '/src/assets/images/玻璃弹珠-黄1.png';
      case 'marble_blue':
        return '/src/assets/images/玻璃弹珠-蓝.png';
      case 'feather':
        return '/src/assets/images/羽毛.png';
      default:
        return '';
    }
  };

  const getImageDimensions = (type: DraggableShape['type']) => {
    switch (type) {
      case 'pearl':
        return { width: 100, height: 100 };
      case 'ticket_1':
      case 'ticket_2':
      case 'ticket_3':
        return { width: 312, height: 192 };
      case 'marble_pink':
      case 'marble_yellow':
      case 'marble_blue':
        return { width: 70, height: 70 };
      case 'feather':
        return { width: 260, height: 260 };
      default:
        return { width: 100, height: 100 };
    }
  };

  const getShapeLabel = (type: DraggableShape['type'], isEnglish: boolean) => {
    switch (type) {
      case 'pearl':
        return isEnglish ? 'Pearl (20kg)' : '珍珠 (20kg)';
      case 'ticket_1':
      case 'ticket_2':
      case 'ticket_3':
        return isEnglish ? 'Ticket (10kg)' : '车票 (10kg)';
      case 'marble_pink':
        return isEnglish ? 'Pink Marble (1kg)' : '粉色弹珠 (1kg)';
      case 'marble_yellow':
        return isEnglish ? 'Yellow Marble (1kg)' : '黄色弹珠 (1kg)';
      case 'marble_blue':
        return isEnglish ? 'Blue Marble (1kg)' : '蓝色弹珠 (1kg)';
      case 'feather':
        return isEnglish ? 'Feather (0kg)' : '羽毛 (0kg)';
      default:
        return '';
    }
  };

  const renderShape = (shape: DraggableShape, isAttachedToPan: boolean) => {
    const isDragging = draggedId === shape.id;
    const labelText = getShapeLabel(shape.type, isEnglish);
    const imgSrc = getShapeImageSrc(shape.type);
    const { width, height } = getImageDimensions(shape.type);
    const imageX = shape.x - width / 2;
    const imageY = shape.y - height / 2;

    let glowClass = 'shape-glow-pink';
    if (shape.type === 'pearl') {
      glowClass = 'shape-glow-white';
    } else if (shape.type.startsWith('ticket')) {
      glowClass = 'shape-glow-ticket';
    } else if (shape.type === 'feather') {
      glowClass = 'shape-glow-green';
    } else if (shape.type === 'marble_blue') {
      glowClass = 'shape-glow-blue';
    } else if (shape.type === 'marble_yellow') {
      glowClass = 'shape-glow-yellow';
    }

    const activeGlowClass = isAttachedToPan 
      ? 'centered-svg-shape' 
      : `shape-breathe-glow ${glowClass}`;

    const cursorClass = isDragging ? 'cursor-grabbing scale-110' : `cursor-grab ${activeGlowClass}`;
    const shadowClass = isDragging ? 'drop-shadow-md' : 'drop-shadow-sm';

    // Move character animation up slightly if it's the scale girl to avoid clipping/sinking
    const yAdjustedOffset = isAttachedToPan ? 0 : 0;

    return (
      <g
        key={shape.id}
        id={`draggable_${shape.id}`}
        className={`select-none transition-all duration-200 ease-out ${cursorClass} ${shadowClass}`}
        onPointerDown={(e) => handlePointerDown(e, shape.id)}
      >
        <title>{labelText}</title>
        <image
          href={imgSrc}
          x={imageX}
          y={imageY + yAdjustedOffset}
          width={width}
          height={height}
          pointerEvents="visiblePainted"
        />
      </g>
    );
  };

  // Helper rotated positions for indicator guides (matching vertical suspension physics)
  const leftPivot = getRotatedPoint(491, 513.5, 1214.5, 513.5, finalTilt);
  const leftPanZone = { x: leftPivot.x, y: leftPivot.y + 340.0 };

  const rightPivot = getRotatedPoint(1938, 513.5, 1214.5, 513.5, finalTilt);
  const rightPanZone = { x: rightPivot.x, y: rightPivot.y + 340.0 };

  // Guide target shape and destination pan for interactive dragging guidance step
  const guideShape = guideStep === 'drag_item_hint' && !isBalanced
    ? (shapes.find(s => s.id === highlightedShapeId && s.state === 'scattered') || shapes.find(s => s.state === 'scattered'))
    : null;
  const targetPanForGuide = guideShape ? (guideShape.x > 1214.5 ? rightPanZone : leftPanZone) : null;

  return (
    <div className="w-full h-screen max-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden select-none" id="scale_girl_scene" style={{ backgroundColor: '#3a4143', color: '#eef4ff', borderColor: '#6d6e7e' }}>
      
      {/* Black screen overlay for line s1 ("没错，那个住在天平上的女孩就是我。") - fades out as soon as s1 is dismissed */}
      <div 
        className={`fixed inset-0 z-40 bg-black pointer-events-none transition-opacity duration-700 ease-in-out ${
          currentDialogueLineId === 's1' || (!currentDialogueLineId && !isDialogueCompleted) 
            ? 'opacity-100' 
            : 'opacity-0'
        }`}
      />


      {/* ==================================================================== */}
      {/* PLACEHOLDER: WEB M VIDEO BACKGROUND LAYER */}
      {/* ==================================================================== */}
      {assets.webm.unconsciousVoidParticleDraft.enabled ? (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0"
        >
          <source src={assets.webm.unconsciousVoidParticleDraft.src} type="video/webm" />
        </video>
      ) : null}

      {/* ==================================================================== */}
      {/* PLACEHOLDER: GLB 3D INTERACTIVE CANVAS OVERLAY */}
      {/* ==================================================================== */}
      {assets.glb.balanceScaleSystem.enabled ? (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-10" id="glb_physics_scale_placeholder">
          {/* Use Canvas here. Model link: assets.glb.balanceScaleSystem.modelUrl */}
        </div>
      ) : null}

      {/* ==================================================================== */}
      {/* PLACEHOLDER: LOTTIE WEIGHING SCALE BALANCE ACTION EFFECT */}
      {/* ==================================================================== */}
      {assets.lottie.scaleBalanceTick.enabled ? (
        <div className="absolute inset-0 pointer-events-none z-0" id="lottie_scale_girl_placeholder">
          {/* Render Lottie player. Player link: assets.lottie.scaleBalanceTick.jsonUrl */}
        </div>
      ) : null}

      {/* Background Grid Lines */}
      <div className="absolute inset-x-0 top-1/4 h-px bg-stone-300 pointer-events-none" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-stone-300 pointer-events-none" />

      {/* Interactive Scale Canvas container - Adapts to viewport height & prevents vertical overflow */}
      <div className="w-full h-full max-h-screen flex items-center justify-center relative z-10 p-0 overflow-hidden">
        
        {/* Dynamic Interactive SVG Canvas - height-constrained aspect box */}
        <div className="relative h-full max-h-full max-w-full aspect-[2388/1668] flex items-center justify-center">
          
          <svg 
            className="w-full h-full max-h-full max-w-full select-none" 
            style={{ borderColor: '#373746' }}
            viewBox="0 0 2388 1668"
            preserveAspectRatio="xMidYMid meet"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* 1. 天平底图 (Updated to PNG) */}
            <image href="/src/assets/images/天平底图.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />

            {/* 2. 秤后星星3 */}
            <image href="/src/assets/images/秤后星星3.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" className="animate-star-float-3" />

            {/* 3. 秤后星星2 */}
            <image href="/src/assets/images/秤后星星2.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" className="animate-star-float-2" />

            {/* 4. 秤后星星1 */}
            <image href="/src/assets/images/秤后星星1.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" className="animate-star-float-1" />

            {/* 5. 秤柱 */}
            <image href="/src/assets/images/秤柱.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />

            {/* Dotted target zone drop indicators when dragging a shape */}
            {draggedId && (
              <>
                <circle 
                  cx={leftPanZone.x} 
                  cy={leftPanZone.y} 
                  r="180" 
                  fill="none" 
                  stroke="#E2CEAB" 
                  strokeWidth="4" 
                  strokeDasharray="16 16" 
                  className="animate-pulse"
                />
                <circle 
                  cx={rightPanZone.x} 
                  cy={rightPanZone.y} 
                  r="180" 
                  fill="none" 
                  stroke="#E2CEAB" 
                  strokeWidth="4" 
                  strokeDasharray="16 16" 
                  className="animate-pulse"
                />
              </>
            )}
            
            {/* Interactive Scale Bar pivot rotating around (1214.5, 513.5) */}
            <g transform={`rotate(${finalTilt}, 1214.5, 513.5)`} className="transition-transform duration-500 ease-out pointer-events-none">
              {/* Main crossbar of scale */}
              <image href="/src/assets/images/秤杆.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />
            </g>

            {/* Left Hand Suspended Pan (stays horizontal, moves with pivot translation) */}
            <g transform={`translate(${leftPivot.x - 491}, ${leftPivot.y - 513.5})`} className="transition-transform duration-500 ease-out">
              <g className={shaking ? 'animate-sway-left' : ''}>
                {/* Left Pan Backplate */}
                <image href="/src/assets/images/秤盘-后景.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />

                {/* Character BACK Layers (rendered on top of "秤盘-后景" but under items and foreground) */}
                <g className={`transition-opacity duration-[1000ms] ${isDialogueCompleted ? 'opacity-100' : 'opacity-0'}`}>
                  {identity === 'creator' && (
                    <image href="/src/assets/images/创作者-后.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />
                  )}
                  {identity === 'art_practitioner' && (
                    <image href="/src/assets/images/从业者-后.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />
                  )}
                  {identity === 'student' && (
                    <foreignObject x="0" y="0" width="2388" height="1668" style={{ pointerEvents: 'none' }}>
                      <div className="w-full h-full bg-transparent overflow-hidden">
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="auto"
                          className="w-full h-full object-contain bg-transparent"
                          style={{ background: 'transparent' }}
                        >
                          <source src="/src/assets/video/学生女孩.webm" type="video/webm" />
                        </video>
                      </div>
                    </foreignObject>
                  )}
                </g>

                {/* Expectations Label Spawning and Floating Identity Tag (Clean relative labels, no vector bodies) */}
                <g className="pointer-events-none">
                  {/* Expectations hover labels */}
                  {hoveredExpectation && (
                    <g className="animate-fade-in" transform="translate(491, 750)">
                      <rect x="-65" y="-12" width="130" height="24" className="fill-[#FAF8F5] stroke-stone-900 stroke-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
                      <text x="0" y="4" textAnchor="middle" className="font-mono text-[9.5px] font-bold fill-stone-900 uppercase">
                        {hoveredExpectation} +10kg
                      </text>
                    </g>
                  )}

                  {/* Girl Thought Bubble above girl head (low-opacity, gentle float & slow fade animation) */}
                  {activeThoughtText && (
                    <g transform="translate(491, 380)" className={`transition-all duration-700 ease-out ${isThoughtVisible ? 'opacity-90 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'}`}>
                      <foreignObject x="-290" y="-250" width="580" height="260">
                        <div className="w-full h-full flex flex-col items-center justify-end pb-4">
                          <div className="relative max-w-[500px] px-8 py-5 bg-[#FAF8F5]/92 backdrop-blur-md border border-stone-800/20 rounded-[36px] shadow-[0_10px_32px_rgba(0,0,0,0.12)] text-stone-900 font-wenkai text-xl md:text-2xl leading-relaxed md:leading-loose text-center tracking-wide font-medium whitespace-pre-wrap">
                            <span>{typedThoughtText}</span>
                            {typedThoughtText.length < activeThoughtText.length && (
                              <span className="inline-block w-1.5 h-5 ml-1 bg-stone-700 animate-pulse align-middle" />
                            )}

                            {/* Classic thought bubble tail with multiple descending bubble dots */}
                            <div className="absolute -bottom-11 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1.5 opacity-90 pointer-events-none">
                              <span className="w-5 h-5 rounded-full bg-[#FAF8F5]/92 border border-stone-800/20 shadow-sm -ml-1" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#FAF8F5]/90 border border-stone-800/20 shadow-sm ml-2" />
                              <span className="w-2.5 h-2.5 rounded-full bg-[#FAF8F5]/88 border border-stone-800/20 shadow-sm -ml-2" />
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FAF8F5]/85 border border-stone-800/20 shadow-sm ml-1" />
                            </div>
                          </div>
                        </div>
                      </foreignObject>
                    </g>
                  )}
                </g>

                {/* Render shapes dropped onto Left Pan */}
                {shapes.filter(s => s.state === 'left-pan').map(shape => {
                  return renderShape({
                    ...shape,
                    x: 491 + shape.panOffset.x,
                    y: 910 + shape.panOffset.y
                  }, true);
                })}

                {/* Left Pan Foreground overlay (creating nesting sandwich effect) */}
                <image href="/src/assets/images/秤盘-前景.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />

                {/* FRONT Layers: Render on top of the left plate foreground for layered depth */}
                <g className={`transition-opacity duration-[1000ms] ${isDialogueCompleted ? 'opacity-100' : 'opacity-0'}`}>
                  {identity === 'creator' && (
                    <foreignObject x="0" y="0" width="2388" height="1668" style={{ pointerEvents: 'none' }}>
                      <div className="w-full h-full bg-transparent overflow-hidden">
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="auto"
                          className="w-full h-full object-contain bg-transparent"
                          style={{ background: 'transparent' }}
                        >
                          <source src="/src/assets/video/创作者-前.webm" type="video/webm" />
                        </video>
                      </div>
                    </foreignObject>
                  )}
                  {identity === 'art_practitioner' && (
                    <foreignObject x="0" y="0" width="2388" height="1668" style={{ pointerEvents: 'none' }}>
                      <div className="w-full h-full bg-transparent overflow-hidden">
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="auto"
                          className="w-full h-full object-contain bg-transparent"
                          style={{ background: 'transparent' }}
                        >
                          <source src="/src/assets/video/从业者-前.webm" type="video/webm" />
                        </video>
                      </div>
                    </foreignObject>
                  )}
                </g>
              </g>
            </g>

            {/* Right Hand Suspended Pan (stays horizontal, moves with pivot translation) */}
            <g transform={`translate(${rightPivot.x - 1938}, ${rightPivot.y - 513.5})`} className="transition-transform duration-500 ease-out">
              <g className={shaking ? 'animate-sway-right' : ''}>
                {/* Right Pan mirrored background */}
                <g transform="translate(1938, 0) scale(-1, 1) translate(-491, 0)" className="pointer-events-none">
                  <image href="/src/assets/images/秤盘-后景.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />
                </g>

                {/* Render shapes dropped onto Right Pan */}
                {shapes.filter(s => s.state === 'right-pan').map(shape => {
                  return renderShape({
                    ...shape,
                    x: 1938 + shape.panOffset.x,
                    y: 910 + shape.panOffset.y
                  }, true);
                })}

                {/* Right Pan mirrored foreground overlay */}
                <g transform="translate(1938, 0) scale(-1, 1) translate(-491, 0)" className="pointer-events-none">
                  <image href="/src/assets/images/秤盘-前景.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />
                </g>
              </g>
            </g>

            {/* Scattered shapes scattered around that can be dragged into active zones */}
            {shapes.filter(s => s.state === 'scattered').map(shape => {
              return renderShape(shape, false);
            })}

            {/* Interactive Drag Guidance on Random Item (Step 3) */}
            {guideStep === 'drag_item_hint' && !isBalanced && guideShape && targetPanForGuide && (
              <g className="pointer-events-none select-none animate-fade-in" id="guide_item_highlight">
                {/* Concentric subtle pulsing / spinning rings around the shape */}
                <circle
                  cx={guideShape.x}
                  cy={guideShape.y}
                  r="85"
                  fill="none"
                  stroke="#FAF8F5"
                  strokeWidth="3"
                  strokeDasharray="12 12"
                  className="animate-spin opacity-85"
                  style={{ animationDuration: '12s' }}
                />
                <circle
                  cx={guideShape.x}
                  cy={guideShape.y}
                  r="110"
                  fill="none"
                  stroke="#E2CEAB"
                  strokeWidth="2.5"
                  className="animate-ping opacity-40"
                  style={{ animationDuration: '3s' }}
                />

                {/* Arced dotted trajectory leading towards the scale pan */}
                <path
                  d={`M ${guideShape.x} ${guideShape.y} Q ${(guideShape.x + targetPanForGuide.x) / 2} ${Math.min(guideShape.y, targetPanForGuide.y) - 180} ${targetPanForGuide.x} ${targetPanForGuide.y}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="4"
                  strokeDasharray="14 14"
                  className="animate-pulse"
                />

                {/* Floating Guidance Badge positioned above the item - Unified Single Card */}
                <foreignObject
                  x={guideShape.x - 300}
                  y={guideShape.y - 190}
                  width="600"
                  height="170"
                  className="overflow-visible"
                >
                  <div className="w-full h-full flex flex-col items-center justify-end">
                    <div className="p-1.5 bg-[#FAF8F5]/95 backdrop-blur-md border border-stone-800/20 shadow-[0_12px_36px_rgba(0,0,0,0.3)]">
                      <div className="px-6 py-3 border border-stone-800/10 flex flex-col items-center justify-center space-y-1.5">
                        <div className="flex items-center space-x-2.5">
                          <span className="text-amber-700 text-lg">✦</span>
                          <span className="font-wenkai text-2xl font-bold text-stone-900 tracking-wider whitespace-nowrap">
                            {isEnglish ? 'Drag items to the scale pan' : '可将物品拖曳至天平托盘'}
                          </span>
                          <span className="text-amber-700 text-lg">✦</span>
                        </div>
                        <div className="text-base font-mono text-stone-600 tracking-wider flex items-center space-x-1.5">
                          <span>{isEnglish ? `e.g. Press & drag ${getShapeLabel(guideShape.type, isEnglish)}` : `例如：按住并拖动「${getShapeLabel(guideShape.type, isEnglish)}」`}</span>
                          <span className="animate-bounce text-stone-800 font-bold">↓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </foreignObject>
              </g>
            )}

            {/* 11. 秤前星 (Static forefront overlay star) */}
            <image href="/src/assets/images/秤前星.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />
          </svg>


          {/* Top Center Ratio Display (e.g. "10:0" in pure white numbers) */}
          <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
            <div className="relative flex flex-col items-center">
              {/* Focus frame highlight during ratio_hint step */}
              {guideStep === 'ratio_hint' && !isBalanced && (
                <div className="absolute -inset-x-8 -inset-y-3 border border-dashed border-amber-300/80 bg-amber-400/10 rounded animate-pulse" />
              )}

              <div className="text-white font-mono text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                {totalLeftWeight}:{totalRightWeight}
              </div>
            </div>
          </div>

          {/* Ratio Guidance Callout (Step 2) - Unified Single Card */}
          {guideStep === 'ratio_hint' && !isBalanced && (
            <div className="absolute top-28 md:top-36 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-fade-in flex flex-col items-center select-none">
              {/* Upward connector indicator line */}
              <div className="w-px h-3 md:h-5 bg-white/60 mb-1 animate-pulse" />
              <div className="p-1 bg-[#FAF8F5]/95 backdrop-blur-md border border-stone-800/20 shadow-[0_10px_28px_rgba(0,0,0,0.25)]">
                <div className="px-5 py-2.5 border border-stone-800/10 flex flex-col items-center justify-center space-y-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-1.5 h-1.5 bg-amber-600 rotate-45" />
                    <span className="font-wenkai text-xs md:text-sm font-bold text-stone-900 tracking-wider whitespace-nowrap">
                      {isEnglish ? 'Weight ratio between both pans' : '数字为天平两端的重量比例'}
                    </span>
                    <span className="w-1.5 h-1.5 bg-amber-600 rotate-45" />
                  </div>
                  <div className="text-[11px] md:text-xs font-mono text-stone-600 tracking-wider">
                    {isEnglish ? '(Left Pan Weight : Right Pan Weight)' : '( 左盘重量 : 右盘重量 )'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Refined square hint overlay in screen center: white translucent bg, black text, subtle gentle flash (Step 1) */}
          {guideStep === 'place_items' && !isBalanced && (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-fade-in">
              <div className="p-1 bg-white/80 backdrop-blur-md border border-stone-800/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-none">
                <div className="px-6 py-2.5 border border-stone-800/10 flex items-center justify-center space-x-2.5">
                  <span className="w-1.5 h-1.5 bg-stone-700/60 rotate-45" />
                  <span className="font-wenkai text-xs md:text-sm font-medium tracking-[0.25em] text-stone-900 whitespace-nowrap">
                    {isEnglish ? 'PLACE ITEMS ON THE SCALE' : '放入物品'}
                  </span>
                  <span className="w-1.5 h-1.5 bg-stone-700/60 rotate-45" />
                </div>
              </div>
            </div>
          )}

          {/* Left Bottom: 天平提示.png (at original bottom-57px/89px location, enlarged to 1.5x) */}
          <div className="absolute bottom-[57px] md:bottom-[89px] left-6 md:left-8 z-35 pointer-events-none">
            <img 
              src="/src/assets/UI/天平提示.png" 
              alt="天平提示" 
              className="w-[420px] sm:w-[510px] md:w-[600px] lg:w-[690px] max-w-[85vw] h-auto object-contain pointer-events-none select-none filter drop-shadow-md"
              referrerPolicy="no-referrer" 
            />
          </div>

          {/* Interactive balanced final dialogue overlay (3 sequential text boxes) */}
          {isBalanced && (
            <div 
              onClick={() => {
                audioManager.playWaterDrop();
                if (balancedStep < 2) {
                  setBalancedStep(prev => prev + 1);
                } else {
                  if (onComplete) onComplete();
                }
              }}
              className="fixed top-[72%] md:top-[74%] left-1/2 -translate-x-1/2 -translate-y-1/2 scale-105 md:scale-110 w-[88vw] max-w-[560px] aspect-[907/484] z-50 select-none animate-fade-in pointer-events-auto cursor-pointer filter drop-shadow-xl flex flex-col items-center justify-center p-6 md:p-10 text-center group"
              id="scale_balanced_dialog"
            >
              {/* Uploaded Dialogue PNG Frame */}
              <img 
                src="/src/assets/UI/对话框b.png" 
                alt="Dialogue Frame" 
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none group-hover:brightness-105 transition-all"
                referrerPolicy="no-referrer"
              />

              {/* Narrative Text */}
              <div className="relative z-10 w-full px-6 text-white text-sm md:text-base leading-relaxed tracking-wider font-wenkai font-bold min-h-[48px] flex items-center justify-center whitespace-pre-wrap">
                <span>{typedBalancedText}</span>
                {typedBalancedText.length < (balancedLines[balancedStep]?.length || 0) && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-white animate-pulse align-middle" />
                )}
              </div>

              {/* Step indicator / Subtitle */}
              <div className="relative z-10 w-full text-[9px] md:text-[10px] font-mono text-white/70 uppercase tracking-widest pt-2 mt-1 flex items-center justify-between px-6">
                <span>({balancedStep + 1}/3)</span>
                <span className="animate-bounce opacity-75 text-xs">▼</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Chapter Marker */}
      <div className="absolute bottom-8 left-12 hidden md:block">
        <span className="font-mono text-[9px] tracking-wider font-bold text-stone-400">
          CHAPTER 04 / WEIGHING
        </span>
      </div>

      {/* Right Bottom Control Bar shifted up 15px */}
      <div className="absolute bottom-[60px] md:bottom-[75px] right-6 md:right-8 z-40 pointer-events-auto flex items-center space-x-3 bg-[#2d3235]/80 backdrop-blur-md px-4 py-2.5 border border-[#6d6e7e]/20 rounded-md shadow-lg">
        <button
          onClick={resetWeight}
          className="px-3.5 py-2 bg-white/10 border border-stone-500 hover:bg-white/20 text-white font-bold text-[10px] md:text-xs uppercase tracking-wider rounded transition-all cursor-pointer"
        >
          {isEnglish ? 'Reset' : '重置'}
        </button>

        {isBalanced ? (
          <button
            onClick={() => {
              audioManager.playUI1();
              if (balancedStep < 2) {
                setBalancedStep(prev => prev + 1);
              } else {
                if (onComplete) onComplete();
              }
            }}
            className="px-6 py-2 bg-white hover:bg-stone-100 text-stone-900 font-black text-[10px] md:text-xs uppercase tracking-widest rounded cursor-pointer flex items-center space-x-1.5 border border-white/80 transition-all active:translate-y-px shadow-[0_0_12px_rgba(255,255,255,0.4)]"
          >
            <span>{isEnglish ? (balancedStep < 2 ? 'Next' : 'Proceed') : (balancedStep < 2 ? '下一步' : '前进')}</span>
            <span>→</span>
          </button>
        ) : (
          <span className="text-[10px] md:text-[11px] font-serif italic py-1.5 select-none opacity-85 text-stone-300">
            {identity === 'student' ? (isEnglish ? '* Add feather...' : '* 放上羽毛以获得平衡...') : (isEnglish ? '* Align weight...' : '* 待重量配平...')}
          </span>
        )}
      </div>
    </div>
  );
};
