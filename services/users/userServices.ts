import privateApiClient from "@/services/client/privateApiClient";

interface UserProfileResponse {
  user: {
    id: number;
    username: string;
    email: string;
    realName: string;
    avatar: string | null;
    bio: string | null;
  };
}

export const getMe = async (): Promise<UserProfileResponse> => {
  try {
    const response =
      await privateApiClient.get<UserProfileResponse>("/users/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
