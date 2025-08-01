import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useRouter } from "next/navigation";

interface Payload {
  title: string;
  category: string;
  description: string;
  content: string;
  thumbnail: File | null;
}

const useCreateBlog = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const form = new FormData();
      form.append("thumbnail", payload.thumbnail!);
      form.append("title", payload.title!);
      form.append("category", payload.category!);
      form.append("description", payload.description!);
      form.append("content", payload.content!);

      await axiosInstance.post("/blogs", form, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });
    },
    onSuccess: async () => {
      alert("create blog success");
      await queryClient.invalidateQueries({ queryKey: ["blogs"] });
      router.push("/");
    },
    onError: (error: AxiosError<{ message: string; code: number }>) => {
      alert(error.response?.data.message ?? "Something went wrong!");
    },
  });
};

export default useCreateBlog;
