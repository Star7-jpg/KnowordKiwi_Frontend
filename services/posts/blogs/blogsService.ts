import privateApiClient from "@/services/client/privateApiClient";
import { BlogPost, BlogsByCommunity } from "@/types/posts/blog";

export const createBlogPost = async (data: BlogPost) => {
  try {
    const response = await privateApiClient.post("/posts/blogs/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
};

export const getBlogPostsByCommunity = async (communityId: number) => {
  try {
    const response = await privateApiClient.get(
      `/posts/blogs/community/${communityId}`,
    );
    return response.data as BlogsByCommunity[];
  } catch (error) {
    console.error("Error getting blog posts by community:", error);
    throw error;
  }
};
