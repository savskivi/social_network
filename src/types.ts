export type User = {
  id: number;
  fullName: string;
  email: string;
  username: string;
  jobTitle: string;
  url: string;
  upload_id: number;
  favorites: number[];
};

export type Post = {
  id: number;
  title: string;
  text: string;
  likes: number[];
  tags: string[];
  comments: {
    name: string;
    text: string;
  }[];
  user: User;
  date: number;
  user_id: number;
};

export type ProfileForm = {
  fullName: string;
  username: string;
  jobTitle: string;
  email: string;
};
