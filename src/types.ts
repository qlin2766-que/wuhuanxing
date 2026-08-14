export interface QuestionnaireAnswers {
  valuableAspect: 'achievement' | 'connections' | 'inner_peace';
  successDefinition: 'external_recognition' | 'self_contentment' | 'creative_output';
  priority: 'efficiency' | 'happiness' | 'authenticity';
  identity?: 'art_practitioner' | 'creator' | 'student';
}

export interface Project {
  id: string;
  title: string;
  enTitle?: string;
  description: string;
  enDescription?: string;
  role: string;
  enRole?: string;
  tools: string[];
  imageBg: string; // SVG path or pattern ID for abstract geometric illustration
  category: string;
  year: string;
  details: string[];
  enDetails?: string[];
}

export type SceneId = 
  | 'menu' 
  | 'intro' 
  | 'questionnaire' 
  | 'scale_girl' 
  | 'wisdom_tooth' 
  | 'heart_feather' 
  | 'portfolio';
