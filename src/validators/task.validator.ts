import { z } from "zod";

export const createTaskSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
    }),
});

export const updateTaskSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ID"),
    }),
    body: z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
    }),
});