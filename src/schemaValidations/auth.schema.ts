import z from "zod";

export const FormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Tên tối thiểu 2 ký tự")
      .max(50, "Tên tối đa 50 ký tự")
      .nonempty("Tên không được để trống"),
    email: z
      .string()
      .trim()
      .email("Email không hợp lệ")
      .nonempty("Email không được để trống"),
    password: z
      .string()
      .min(6, "Mật khẩu tối thiểu 6 ký tự")
      .nonempty("Mật khẩu không được để trống"),
    confirmPassword: z.string().nonempty("Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type FormValue = z.infer<typeof FormSchema>;