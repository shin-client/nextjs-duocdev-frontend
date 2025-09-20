import { Role } from "@/constants/type";
import z from "zod";

export const RegisterBody = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Tên tối thiểu 2 ký tự")
      .max(50, "Tên tối đa 50 ký tự")
      .nonempty("Tên không được để trống"),
    email: z.email("Email không hợp lệ"),
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

export type RegisterBodyType = z.infer<typeof RegisterBody>;

export const LoginBody = z
  .object({
    email: z.email("invalidEmail"),
    password: z
      .string()
      .min(6, "Mật khẩu tối thiểu 6 ký tự")
      .max(100, "Mật khẩu tối đa 100 ký tự")
      .nonempty("Mật khẩu không được để trống"),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    account: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      role: z.enum([Role.Owner, Role.Employee]),
    }),
  }),
  message: z.string(),
});

export type LoginResType = z.TypeOf<typeof LoginRes>;

export const RefreshTokenBody = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>;

export const RefreshTokenRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
  message: z.string(),
});

export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>;

export const LogoutBody = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export type LogoutBodyType = z.TypeOf<typeof LogoutBody>;

export const LoginGoogleQuery = z.object({
  code: z.string(),
});

export type LoginGoogleQueryType = z.TypeOf<typeof LoginGoogleQuery>;
