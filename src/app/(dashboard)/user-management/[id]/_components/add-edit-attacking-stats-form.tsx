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
import { AttackingStat } from "@/components/types/attacking-stats-data-type";

type AttackingStatsFormValues = {
  goals: string;
  assists: string;
  shotsNsidePr: string;
  shotsOutsidePa: string;
  totalShots: string;
  shotsOnTarget: string;
  shootingAccuracy: string;
  shotsOffTarget: string;
  passesAccuracy: string;
  takeOn: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultData?: AttackingStat | null;
  playerId?: string;
}

// ----------------------
// Zod Validation Schema
// ----------------------
export const attackingStatsSchema = z.object({
  goals: z.string().min(1, "Goals is required"),

  assists: z.string().min(1, "Assists is required"),

  shotsNsidePr: z.string().min(1, "Shots inside penalty area is required"),

  shotsOutsidePa: z.string().min(1, "Shots outside penalty area is required"),

  totalShots: z.string().min(1, "Total shots is required"),

  shotsOnTarget: z.string().min(1, "Shots on target is required"),

  shootingAccuracy: z.string().min(1, "Shooting Accuracy is required"),

  shotsOffTarget: z.string().min(1, "Shots off target is required"),

  passesAccuracy: z.string().min(1, "Passes Accuracy is required"),

  takeOn: z.string().min(1, "Aerial Duels is required"),
});

const AddEditAttackingStatsForm = ({
  open,
  onOpenChange,
  defaultData,
  playerId,
}: Props) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const isEdit = Boolean(defaultData?._id);

  const form = useForm<AttackingStatsFormValues>({
    resolver: zodResolver(attackingStatsSchema),
    defaultValues: {
      goals: "",
      assists: "",

      shotsNsidePr: "",
      shotsOutsidePa: "",
      totalShots: "",

      shotsOnTarget: "",
      shotsOffTarget: "",

      shootingAccuracy: "",
      passesAccuracy: "",

      takeOn: "",
    },
  });

  // 🔁 Edit mode prefill
  useEffect(() => {
    if (defaultData) {
      form.reset({
        goals: defaultData?.goals ?? "",
        assists: defaultData?.assists ?? "",

        shotsNsidePr: defaultData?.shotsNsidePr ?? "",
        shotsOutsidePa: defaultData?.shotsOutsidePa ?? "",
        totalShots: defaultData?.totalShots ?? "",

        shotsOnTarget: defaultData?.shotsOnTarget ?? "",
        shotsOffTarget: defaultData?.shotsOffTarget ?? "",

        shootingAccuracy: defaultData?.shootingAccuracy ?? "",
        passesAccuracy: defaultData?.passesAccuracy ?? "",

        takeOn: defaultData?.takeOn ?? "",
      });
    }
  }, [defaultData, form]);

  // 🔥 Add / Update mutation (JSON version)
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: AttackingStatsFormValues) => {
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/attacking/${defaultData?._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/attacking/${playerId}`;

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

      toast.success(
        isEdit ? "Attacking Stats updated" : "Attacking Stats added",
      );
      queryClient.invalidateQueries({ queryKey: ["all-attacking"] });
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl !rounded-[12px] bg-white">
        <h3 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Attacking Stats" : "Add Attacking Stats"}
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className=" space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Goals
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Goals"
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
                name="assists"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Assists
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Assists"
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
                name="shotsNsidePr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Shots inside PA
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Shots inside pa"
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
                name="shotsOutsidePa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Shots outside PA
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Shots outside pa"
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
                name="totalShots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Total Shots
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Total Shots"
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
                name="shotsOnTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Shots On Target
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Shots On Target"
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
                name="shotsOffTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Shots Off Target
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter off target"
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
                name="shootingAccuracy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Shooting Accuracy
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                        {...field}
                        placeholder="Enter Shooting accuracy"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="shootingAccuracy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Shooting Accuracy
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter shooting accuracy"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* <FormField
                control={form.control}
                name="passesAccuracy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Passes Accuracy
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter passes accuracy"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="passesAccuracy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Passes Accuracy
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                        {...field}
                        placeholder="Enter passes accuracy"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="takeOn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Take On
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                        {...field}
                        placeholder="Enter Take on"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

export default AddEditAttackingStatsForm;
