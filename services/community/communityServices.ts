import privateApiClient from "../client/privateApiClient";
import publicApiClient from "../client/publicApiClient";
import {
  Community,
  CommunityCreateData,
  CommunityUpdateData,
} from "@/types/community";

export const getTagRecommendations = async (query: string) => {
  try {
    const response = await privateApiClient.get(
      `/communities/tags/recommendations?tag=${query}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tag recommendations:", error);
    throw error;
  }
};

export const createCommunity = async (communityData: CommunityCreateData) => {
  try {
    const response = await privateApiClient.post(
      "/communities/create",
      communityData,
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error creating community", error);
    throw error;
  }
};

export const exploreCommunities = async () => {
  try {
    const response = await privateApiClient.get("/communities/explore");
    return response.data;
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
};

export const getCommunityById = async (communityId: number) => {
  try {
    const response = await privateApiClient.get(
      `/communities/community/${communityId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching community:", error);
    throw error;
  }
};

export const getCommunitiesByTag = async (
  tag: string,
): Promise<Community[]> => {
  try {
    const response = await publicApiClient.get(`/communities/by-tag/${tag}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching communities by tag:", error);
    throw error;
  }
};

export const updateCommunity = async (
  communityId: number,
  communityData: CommunityUpdateData,
) => {
  try {
    const response = await privateApiClient.patch(
      `/communities/community/${communityId}`,
      communityData,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating community:", error);
    throw error;
  }
};

export const deleteCommunity = async (communityId: string) => {
  try {
    await privateApiClient.delete(`/communities/community/${communityId}`);
  } catch (error) {
    console.log("Error deleting community:", error);
    throw error;
  }
};
