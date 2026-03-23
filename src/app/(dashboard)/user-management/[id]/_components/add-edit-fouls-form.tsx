"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FoulsData } from "@/components/types/fouls-data-type";

type FoulsFormValues = {
  fouls: string;
  foulswon: string;
  redCards: string;
  yellowCards: string;
  offside: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultData?: FoulsData | null;
  playerId?: string;
}

// ----------------------
// Zod Validation Schema
// ----------------------
const foulsSchema = z.object({
  fouls: z.string().min(1, "Fouls is required"),
  foulswon: z.string().min(1, "Fouls Won is required"),
  redCards: z.string().min(1, "Red Card is required"),
  yellowCards: z.string().min(1, "Yellow Cards is required"),
  offside: z.string().min(1, "Off Side is required"),
});

const AddEditFoulsForm = ({
  open,
  onOpenChange,
  defaultData,
  playerId,
}: Props) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const isEdit = Boolean(defaultData?._id);

  const form = useForm<FoulsFormValues>({
    resolver: zodResolver(foulsSchema),
    defaultValues: {
      fouls: "",
      foulswon: "",
      redCards: "",
      yellowCards: "",
      offside: "",
    },
  });

  // 🔁 Edit mode prefill
  useEffect(() => {
    if (defaultData) {
      form.reset({
        fouls: defaultData.fouls ?? "",
        foulswon: defaultData.foulswon ?? "",
        redCards: defaultData.redCards ?? "",
        yellowCards: defaultData.yellowCards ?? "",
        offside: defaultData.offside ?? "",
      });
    }
  }, [defaultData, form]);

  // 🔥 Add / Update mutation (JSON version)
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FoulsFormValues) => {
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/fouls/${defaultData?._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/fouls/${playerId}`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json", // 🔥 important
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values), // 🔥 send JSON
      });

      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }

      toast.success(isEdit ? "Fouls updated" : "Fouls added");
      queryClient.invalidateQueries({ queryKey: ["all-fouls"] });
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg  !rounded-[12px]  bg-white">
        <h3 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Fouls" : "Add Fouls"}
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className=" space-y-4"
          >


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
              control={form.control}
              name="fouls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                    Fouls
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Fouls"
                      className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              <FormField
                control={form.control}
                name="foulswon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Fouls Won
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Fouls won"
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="redCards"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Red Card
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Red card"
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="yellowCards"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Yello Card
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Yello Card"
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              
            </div>
             <FormField
                control={form.control}
                name="offside"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Off Side
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter off side"
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isEdit ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditFoulsForm;
