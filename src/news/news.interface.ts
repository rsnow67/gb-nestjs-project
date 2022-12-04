export interface News {
  id: string;
  title: string;
  description: string;
  author: string;
  cover?: string;
  countView?: number;
  comments?: Comment[];
}
