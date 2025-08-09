export type Community = {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
  banner: string | null;
  is_private: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  read_tags: ReadTag[];
  is_member: boolean;
  is_owner: boolean;
  can_edit: boolean;
};

type ReadTag = {
  id: string;
  name: string;
};
