import { DishStatusValues } from "@/constants/type";
import z from "zod";

export const CreateDishBody = z.object({
  name: z.string().min(1, "Tên món ăn là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  price: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
  image: z.string().optional(),
  status: z.enum(DishStatusValues).optional(),
});

export type CreateDishBodyType = z.infer<typeof CreateDishBody>;

export const DishSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.coerce.number(),
  description: z.string(),
  image: z.url().optional(),
  status: z.enum(DishStatusValues),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const DishRes = z.object({
  data: DishSchema,
  message: z.string(),
});

export type DishResType = z.infer<typeof DishRes>;

export const DishListRes = z.object({
  data: z.array(DishSchema),
  message: z.string(),
});

export type DishListResType = z.infer<typeof DishListRes>;

export const UpdateDishBody = CreateDishBody;
export type UpdateDishBodyType = CreateDishBodyType;
export const DishParams = z.object({
  id: z.coerce.number(),
});
export type DishParamsType = z.infer<typeof DishParams>;
