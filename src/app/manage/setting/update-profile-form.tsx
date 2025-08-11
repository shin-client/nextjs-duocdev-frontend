"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { useAccountMe, useUpdateMeMutation } from "@/queries/useAccount";
import { useUploadMediaMutation } from "@/queries/useMedia";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils";

export default function UpdateProfileForm() {
  const { data, refetch } = useAccountMe();
  const updateMeMutation = useUpdateMeMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const [file, setFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: "Đang lấy dữ liệu",
      avatar: undefined,
    },
  });

  const avatar = form.watch("avatar");
  const name = form.watch("name");

  useEffect(() => {
    if (data) {
      const { name, avatar } = data.payload.data;
      form.reset({ name, avatar: avatar ?? undefined });
    }
    refetch();
  }, [data, form, refetch]);

  const previewAvatar = file ? URL.createObjectURL(file) : avatar;

  const reset = () => {
    form.reset();
    setFile(null);
  };

  const onSubmit = async (values: UpdateMeBodyType) => {
    if (updateMeMutation.isPending) return;
    try {
      let body = values;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadImageResult =
          await uploadMediaMutation.mutateAsync(formData);
        const imageUrl = uploadImageResult.payload.data;
        body = {
          ...values,
          avatar: imageUrl,
        };
      }
      const result = await updateMeMutation.mutateAsync(body);
      toast.success(result.payload.message);
      refetch();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card x-chunk="dashboard-07-chunk-0">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="avatar"
                render={() => (
                  <FormItem>
                    <div className="flex items-start justify-start gap-2">
                      <Avatar className="aspect-square h-[100px] w-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatar} />
                        <AvatarFallback className="rounded-none text-center">
                          {name}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                          }
                        }}
                      />
                      <button
                        className={`flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed${!data?.payload.data.avatar ? " cursor-not-allowed" : ""}`}
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={!data?.payload.data.avatar}
                      >
                        <Upload className="text-muted-foreground h-4 w-4" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        {...field}
                        disabled={!data?.payload.data.name}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2 md:ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  type="reset"
                  onClick={reset}
                >
                  Hủy
                </Button>
                <Button size="sm" type="submit">
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
