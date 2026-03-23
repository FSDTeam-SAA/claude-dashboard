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
import { SetpiecesStats } from "@/components/types/set-pieces-data-type";

type SetPiecesFormValues = {
  freekicks: string;
  freekicksShots: string;
  freekicksShotsonTarget: string;
  penaltyKicks: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultData?: SetpiecesStats | null;
  playerId?: string;
}

// ----------------------
// Zod Validation Schema
// ----------------------
const setPiecesSchema = z.object({
  freekicks: z.string().min(1, "Freekicks is required"),
  freekicksShots: z.string().min(1, "Freekicks shots is required"),
  freekicksShotsonTarget: z
    .string()
    .min(1, "Freekicks shots on target is required"),
  penaltyKicks: z.string().min(1, "Penalty kicks is required"),
});

const AddEditSetPiecesForm = ({
  open,
  onOpenChange,
  defaultData,
  playerId,
}: Props) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const isEdit = Boolean(defaultData?._id);

  const form = useForm<SetPiecesFormValues>({
    resolver: zodResolver(setPiecesSchema),
    defaultValues: {
      freekicks: "",
      freekicksShots: "",
      freekicksShotsonTarget: "",
      penaltyKicks: "",
    },
  });

  // 🔁 Edit mode prefill
  useEffect(() => {
    if (defaultData) {
      form.reset({
        freekicks: defaultData.freekicks ?? "",
        freekicksShots: defaultData.freekicksShots ?? "",
        freekicksShotsonTarget: defaultData.freekicksShotsonTarget ?? "",
        penaltyKicks: defaultData.penaltyKicks ?? "",
      });
    }
  }, [defaultData, form]);

  // 🔥 Add / Update mutation (JSON version)
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: SetPiecesFormValues) => {
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/setpieces/${defaultData?._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/setpieces/${playerId}`;

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

      toast.success(isEdit ? "Set Pieces updated" : "Set Pieces added");
      queryClient.invalidateQueries({ queryKey: ["all-setpieces"] });
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg  !rounded-[12px]  bg-white">
        <h3 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Set Pieces" : "Add Set Pieces"}
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="freekicks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                    Freekicks
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Freekicks"
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
                name="freekicksShots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Freekicks Shots
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Freekicks shots"
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
                name="freekicksShotsonTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Freekicks Shots on Target
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Freekicks shots on target"
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
                name="penaltyKicks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Penalty Kicks
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Penalty kicks"
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

export default AddEditSetPiecesForm;
