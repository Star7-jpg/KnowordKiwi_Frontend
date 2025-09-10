import privateApiClient from "../client/privateApiClient";

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

export const createCommunity = async (communityData) => {
  try {
  const response = await privateApiClient.post("/communities/create", communityData);
  return response.data;
  } catch(error) {
    console.error("Error creating community", error);
    throw error;
  }
};
