export interface UserLogin {
  username: string;
  password: string;
}

export interface User {
  userID: number;
  username: string;
}

export interface readPost{
  postID: number;
  message: string;
  rating: number;
  createdBy: number;
  user: User;
}

export interface writePost{
  message: string;
  rating: number;
  createdBy: number;
  createdDate: Date;
}


