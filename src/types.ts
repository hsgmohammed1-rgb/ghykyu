export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: "سهل" | "متوسط" | "صعب";
  category: string;
  imageUrl?: string;
}

export interface Player {
  id: string;
  room_code: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  status: 'idle' | 'thinking' | 'answered' | 'correct' | 'wrong' | string;
  last_answer_time?: string;
}

export interface RoomState {
  code: string;
  status: 'lobby' | 'playing' | 'explaining' | 'leaderboard';
  current_question_index: number;
  question_timer: number;
  show_answer: boolean;
  whiteboard_url?: string;
}
