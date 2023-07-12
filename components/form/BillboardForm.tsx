"use client";
import { Billboard } from "@prisma/client";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/AlertModal";
import ApiAlert from "@/components/ui/ApiAlert";
import { useOrigin } from "@/hooks/useOrigin";
import ImageUpload from "./ImageUpload";

const formSchema = z.object({
  label: z.string().min(2),
  imageUrl: z.string().min(2),
});

type BillboardsFormValues = z.infer<typeof formSchema>;

interface BillboardsFormProps {
  initialData: Billboard | null;
}

const BillboardsForm: React.FC<BillboardsFormProps> = ({ initialData }) => {
  const origin = useOrigin();
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit Billboard" : "Add a New Billboard";
  const toastMessage = initialData
    ? "Billboard Updated!"
    : "Billboard Created!";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<BillboardsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: BillboardsFormValues) => {
    try {
      setIsLoading(true);

      if (initialData) {
        await axios
          .patch(
            `/api/${params.storeId}/billboards/${params.billboardId}`,
            data
          )
          .then(() => {
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
          });
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data).then(() => {
          router.refresh();
          router.push(`/${params.storeId}/billboards`);
        });
      }

      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios
        .delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
        .then(() => {
          router.refresh();
          router.push("/");
          toast.success("Billboard Deleted!");
        });
    } catch (error) {
      toast.error(
        "Make sure you have removed all categories using this Billboard first."
      );
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoading}
      />

      <div className="flex items-center justify-between ">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="sm"
            onClick={() => setIsOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Billboard Label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className="ml-aulto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
      {/* <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      /> */}
    </>
  );
};

export default BillboardsForm;
