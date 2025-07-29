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
import { FormSchema, FormValue } from "@/schemaValidations/auth.schema";

const RegisterForm = () => {
  const form = useForm<FormValue>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: FormValue) => {
    // Fetch your API
    console.log(envConfig.NEXT_PUBLIC_API_ENDPOINT);
    console.log(values);
  };

  const formDataConfig = [
    {
      name: "name",
      label: "Tên",
      type: "",
    },
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
    {
      name: "confirmPassword",
      label: "Nhập lại mật khẩu",
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
            name={field.name as keyof FormValue}
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
          Đăng ký
        </Button>
      </form>
    </Form>
  );
};
export default RegisterForm;
