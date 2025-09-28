export interface BlogById {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  community: {
    id: number;
  };
  author: {
    user: {
      id: number;
      username: string;
    };
  };
  blogContent: {
    content: string;
    subtitle: string;
  };
}
