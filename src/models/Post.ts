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
  }
}