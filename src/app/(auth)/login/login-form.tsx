"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import envConfig from "@/config";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { toast } from "sonner";

const LoginForm = () => {
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginBodyType) => {
    try {
      const result = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
        {
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      ).then(async (res) => {
        const payload = await res.json();
        const data = {
          result: res.status,
          payload,
        };
        if (!res.ok) throw data;
        return data;
      });
      toast.success(result.payload.message);
      const resultFromNextServer = await fetch("/api/auth", {
        body: JSON.stringify(result),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(async (res) => {
        const payload = await res.json();
        const data = {
          result: res.status,
          payload,
        };
        if (!res.ok) throw data;
        return data;
      });
      console.log(resultFromNextServer);
    } catch (error) {
      const err = error as {
        payload?: { errors?: unknown; message: string };
        result?: number;
      };
      const errors = err.payload?.errors as {
        field: string;
        message: string;
      }[];
      const status = err.result;
      if (status === 422) {
        errors.forEach((error) => {
          if (["email", "password"].includes(error.field)) {
            form.setError(error.field as "email" | "password", {
              type: "server",
              message: error.message,
            });
          }
        });
      } else {
        toast("Lỗi", {
          description: err.payload?.message,
        });
      }
    }
  };

  const formDataConfig = [
    {
      name: "email",
      label: "Email",
      type: "email",
    },
    {
      name: "password",
      label: "Mật khẩu",
      type: "password",
    },
  ];
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[400] space-y-2"
        noValidate
      >
        {formDataConfig.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as keyof LoginBodyType}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input type={field.type || "text"} {...formField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" className="mt-6 flex w-full justify-self-center">
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
};
export default LoginForm;
