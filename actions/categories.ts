import { useToast } from "@/components/toasts";
import { queryClient } from "@/lib";
import { axiosInstance } from "@/lib/axios";
import { Category, CreateCategoryBody, UpdateCategoryBody } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get("/api/categories");
    return response.data.data;
  },
  getCategory: async (id: string): Promise<Category> => {
    const response = await axiosInstance.get(`/api/categories/${id}`);
    return response.data.data;
  },

  updateCategory: async (
    id: string,
    body: UpdateCategoryBody,
  ): Promise<Category> => {
    const response = await axiosInstance.patch(`/api/categories/${id}`, body);
    return response.data.data;
  },

  createCategory: async (body: CreateCategoryBody): Promise<Category> => {
    const response = await axiosInstance.post("/api/categories", body);
    return response.data.data;
  },
  deleteCategory: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/categories/${id}`);
  },
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => categoryApi.getCategory(id),
    enabled: !!id,
  });
};

export const useUpdateCategory = (id: string) => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (body: UpdateCategoryBody) =>
      categoryApi.updateCategory(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to update category";
      toast.error(errorMessage);
    },
  });
};

export const useCreateCategory = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (body: CreateCategoryBody) => categoryApi.createCategory(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to create category";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteCategory = (id: string) => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: () => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to delete category";
      toast.error(errorMessage);
    },
  });
};
