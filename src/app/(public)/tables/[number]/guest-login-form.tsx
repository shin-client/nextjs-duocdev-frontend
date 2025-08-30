"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "@/schemaValidations/guest.schema";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useGuestLogin } from "@/queries/useGuest";
import { useAppContext } from "@/components/app-provider";
import { createSocket, handleErrorApi } from "@/lib/utils";
import { toast } from "sonner";

export default function GuestLoginForm() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const { setRole, setSocket } = useAppContext();

  const { isPending, mutateAsync: guestLogin } = useGuestLogin();

  const tableNumber = Number(params.number);
  const token = searchParams.get("token");

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      token: token ?? "",
      tableNumber: tableNumber,
    },
  });

  useEffect(() => {
    if (!token) return router.push("/");
  }, [router, token]);

  const onSubmit = async (values: GuestLoginBodyType) => {
    try {
      const result = await guestLogin(values);
      setRole(result.payload.data.guest.role);
      setSocket(createSocket(result.payload.data.accessToken));
      toast.success(result.payload.message);
      router.push("/guest/menu");
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="w-full max-w-[600px] flex-shrink-0 space-y-2"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Tên khách hàng</Label>
                      <Input id="name" type="text" required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" isLoading={isPending}>
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
