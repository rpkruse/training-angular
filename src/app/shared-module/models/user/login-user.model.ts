export interface UserLogin {
  username: string;
  password: string;
}

export interface User {
  userID: number;
  username: string;
}

export interface readPost{
  title: string;
  imageURL: string;
  postID: number;
  message: string;
  rating: number;
  createdBy: number;
  user: User;
  createdDate: Date;
}

export interface writePost{
  title: string;
  message: string;
  rating: number;
  createdBy: number;
  createdDate: Date;
  image: string;
}


