import { PostImage } from './PostImage';
import { User } from './User';

interface UserID {
  userId: string;
}

export interface Post {
  postId: number;
  content: string;
  createdAt: Date;
  User: User;
  Images: PostImage[];
  Hearts: UserID[];
  Reposts: UserID[];
  Comments: UserID[];
  _count: {
    Hearts: number,
    Reposts: number,
    Comments: number
  },
  Original?: Post; // 있으면 재개시 글
  Parent?: Post; // 있으면 답글
}