import privateApiClient from "../client/privateApiClient";
import { Question } from "@/types/posts/quiz/question";

interface CreateManyQuestionsRequest {
  postId: number;
  questions: {
    title: string;
    options: Array<{ text: string; isCorrect: boolean }>;
  }[];
}

interface CreateManyQuestionsResponse {
  count: number;
}

export const questionsService = {
  createManyQuestions: async (
    request: CreateManyQuestionsRequest
  ): Promise<CreateManyQuestionsResponse> => {
    const response = await privateApiClient.post<CreateManyQuestionsResponse>(
      "/questions/create-many",
      request
    );
    return response.data;
  },
};