export interface ConversionResult {
  original: number;
  converted: number;
  difference: number;
  formula: string;
}

export enum EyeCondition {
  MYOPIA = 'Myopia (近視)',
  HYPEROPIA = 'Hyperopia (遠視)'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}