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
import { DefensiveStats } from "@/components/types/defensive-stats-data-type";

type DefensiveStatsFormValues = {
  tackleAttempts: string;
  tackleSucceededPossession: string;
  tackleSucceededNOPossession: string;
  tackleFailed: string;

  turnoverwon: string;
  interceptions: string;
  recoveries: string;
  clearance: string;

  totalBlocked: string;
  shotBlocked: string;
  crossBlocked: string;

  mistakes: string;
  aerialDuels: string;
  phvsicalDuels: string;
  ownGoals: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultData?: DefensiveStats | null;
  playerId?: string;
}

// ----------------------
// Zod Validation Schema
// ----------------------
export const defensiveStatsSchema = z.object({
  tackleAttempts: z.string().min(1, "Tackle Attempts is required"),

  tackleSucceededPossession: z
    .string()
    .min(1, "Succeeded Tackles (Possession) is required"),

  tackleSucceededNOPossession: z
    .string()
    .min(1, "Succeeded Tackles (No Possession) is required"),

  tackleFailed: z.string().min(1, "Failed Tackles is required"),

  turnoverwon: z.string().min(1, "Turnovers Won is required"),

  interceptions: z.string().min(1, "Interceptions is required"),

  recoveries: z.string().min(1, "Recoveries is required"),

  clearance: z.string().min(1, "Clearances is required"),

  totalBlocked: z.string().min(1, "Total Blocks is required"),

  shotBlocked: z.string().min(1, "Shots Blocked is required"),

  crossBlocked: z.string().min(1, "Crosses Blocked is required"),

  mistakes: z.string().min(1, "Mistakes is required"),

  aerialDuels: z.string().min(1, "Aerial Duels is required"),

  phvsicalDuels: z.string().min(1, "Physical Duels is required"),

  ownGoals: z.string().min(1, "Own Goals is required"),
});

const AddEditDefensiveStatsForm = ({
  open,
  onOpenChange,
  defaultData,
  playerId,
}: Props) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const isEdit = Boolean(defaultData?._id);

  const form = useForm<DefensiveStatsFormValues>({
    resolver: zodResolver(defensiveStatsSchema),
    defaultValues: {
      tackleAttempts: "",
      tackleSucceededPossession: "",
      tackleSucceededNOPossession: "",
      tackleFailed: "",

      turnoverwon: "",
      interceptions: "",
      recoveries: "",
      clearance: "",

      totalBlocked: "",
      shotBlocked: "",
      crossBlocked: "",

      mistakes: "",
      aerialDuels: "",
      phvsicalDuels: "",
      ownGoals: "",
    },
  });

  // 🔁 Edit mode prefill
  useEffect(() => {
    if (defaultData) {
      form.reset({
        tackleAttempts: defaultData?.tackleAttempts ?? "",
        tackleSucceededPossession:
          defaultData?.tackleSucceededPossession ?? "",
        tackleSucceededNOPossession:
          defaultData?.tackleSucceededNOPossession ?? "",
        tackleFailed: defaultData?.tackleFailed ?? "",

        turnoverwon: defaultData?.turnoverwon ?? "",
        interceptions: defaultData?.interceptions ?? "",
        recoveries: defaultData?.recoveries ?? "",
        clearance: defaultData?.clearance ?? "",

        totalBlocked: defaultData?.totalBlocked ?? "",
        shotBlocked: defaultData?.shotBlocked ?? "",
        crossBlocked: defaultData?.crossBlocked ?? "",

        mistakes: defaultData?.mistakes ?? "",
        aerialDuels: defaultData?.aerialDuels ?? "",
        phvsicalDuels: defaultData?.phvsicalDuels ?? "",
        ownGoals: defaultData?.ownGoals ?? "",
      });
    }
  }, [defaultData, form]);

  // 🔥 Add / Update mutation (JSON version)
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: DefensiveStatsFormValues) => {
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/defensive/${defaultData?._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/defensive/${playerId}`;

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
        isEdit ? "Defensive Stats updated" : "Defensive Stats added",
      );
      queryClient.invalidateQueries({ queryKey: ["all-defensive"] });
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl min-h-[400px] md:max-h-[600px] overflow-auto !rounded-[12px] bg-white">
        <h3 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Defensive Stats" : "Add Defensive Stats"}
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className=" space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tackleAttempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Tackle Attempts
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Tackle Attempts"
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
                name="tackleSucceededPossession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Tackle Succeeded: Possession
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Tackle Succeeded"
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
                name="tackleSucceededNOPossession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Tackle Succeeded: No Possession
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Tackle Succeeded"
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
                name="tackleFailed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Tackie Failed
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Tackie Failed"
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
                name="turnoverwon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Turnover Won
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Turnover Won"
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
                name="interceptions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Interceptions
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Interceptions"
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
                name="recoveries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Recoveries
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Recoveries"
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
                name="clearance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Clearance
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Clearance"
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
                name="totalBlocked"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Total Blocked
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Total Blocked"
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
                name="shotBlocked"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Shot Blocked
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Shot Blocked"
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
                name="crossBlocked"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Cross Blocked
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Cross Blocked"
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
                name="mistakes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Mistakes
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Mistakes"
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
                name="aerialDuels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Aerial Duels
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                        {...field}
                        placeholder="Enter Aerial Duels"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phvsicalDuels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Physical Duels
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                        {...field}
                        placeholder="Enter Physical Duels"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Own Goals
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Own Goals"
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                        {...field}
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

export default AddEditDefensiveStatsForm;
