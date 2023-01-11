export interface News {
  id: number;
  title: string;
  description: string;
  author: string;
  cover?: string;
  countView?: number;
  comments?: Comment[];
}
