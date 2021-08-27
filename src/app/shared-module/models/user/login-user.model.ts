export interface UserLogin {
  username: string;
  password?: string;
}

export interface User {
  userID: number;
  username: string;
}

export interface readPost {
  title: string;
  image: string;
  postID: number;
  message: string;
  rating: number;
  createdBy: number;
  user: User;
  createdDate: Date;
  category: Category;
  roomID: number;
}

export interface writePost {
  title: string;
  message: string;
  rating: number;
  createdBy: number;
  createdDate: Date;
  image: string;
  categoryID: number;
  roomID: number;
}

export interface Category {
  categoryID: number;
  name: string;
}

export interface Room {
  roomID: number;
  roomName: string;
  password?: string;
  bio: string;
  imageURL: string;
}

export interface UserRoom {
  userID: number;
  roomID: number;
  userRoomID?: number;
}

export interface RoomToAdd {
  roomName: string;
  password: string;
  bio: string;
  imageURL: string;
  userIDS: number[];
}

export interface RoomLogin {
  roomName: string;
  password: string;
  userID: number;
}

export interface inputModel {
  index: number;
  category: Category;
  image: string;
  message: string;
  title: string;
}

export interface strawPollSent {
  poll: {
    title: string;
    answers: string[];
    ma: boolean;
    enter_name: boolean;
  };
}

export interface strawPollReceived {
  admin_key: string;
  content_id: string;
  success: number;
}

export interface strawPollDeletion {
  message: string;
  success: number;
}
