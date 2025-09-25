import privateApiClient from "@/services/client/privateApiClient";
import { BlogPost } from "@/types/posts/blog";

export const createBlogPost = async (data: BlogPost) => {
  try {
    const response = await privateApiClient.post("/posts/blogs/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
};
