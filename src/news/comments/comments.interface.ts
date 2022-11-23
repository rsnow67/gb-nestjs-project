export interface Comment {
  id: string;
  author: string;
  text: string;
  replies?: Comment[];
}

export interface Comments {
  [key: string | number]: Comment[];
}
