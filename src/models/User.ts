interface UserID {
  userId: string;
}

export interface User {
  id: string;
  nickname: string;
  image: string;
  Followers: UserID[];
  Followings: UserID[];
  _count: {
    Followers: number;
    Followings: number;
  }
}