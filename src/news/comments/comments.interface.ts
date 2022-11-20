export interface Comment {
  id: string;
  author: string;
  text: string;
}

export type Comments = Record<string | number, Comment[]>;
