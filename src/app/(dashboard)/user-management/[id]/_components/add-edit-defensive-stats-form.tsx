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
  tackleAttempts: number;
  tackleSucceededPossession: number;
  tackleSucceededNOPossession: number;
  tackleFailed: number;

  turnoverwon: number;
  interceptions: number;
  recoveries: number;
  clearance: number;

  totalBlocked: number;
  shotBlocked: number;
  crossBlocked: number;

  mistakes: number;
  aerialDuels: string;
  phvsicalDuels: string;
  ownGoals: number;
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
  tackleAttempts: z
    .number({ message: "Tackle Attempts must be a number" })
    .min(0, "Tackle Attempts cannot be negative"),

  tackleSucceededPossession: z
    .number({ message: "Succeeded Tackles (Possession) must be a number" })
    .min(0, "Succeeded Tackles (Possession) cannot be negative"),

  tackleSucceededNOPossession: z
    .number({ message: "Succeeded Tackles (No Possession) must be a number" })
    .min(0, "Succeeded Tackles (No Possession) cannot be negative"),

  tackleFailed: z
    .number({ message: "Failed Tackles must be a number" })
    .min(0, "Failed Tackles cannot be negative"),

  turnoverwon: z
    .number({ message: "Turnovers Won must be a number" })
    .min(0, "Turnovers Won cannot be negative"),

  interceptions: z
    .number({ message: "Interceptions must be a number" })
    .min(0, "Interceptions cannot be negative"),

  recoveries: z
    .number({ message: "Recoveries must be a number" })
    .min(0, "Recoveries cannot be negative"),

  clearance: z
    .number({ message: "Clearances must be a number" })
    .min(0, "Clearances cannot be negative"),

  totalBlocked: z
    .number({ message: "Total Blocks must be a number" })
    .min(0, "Total Blocks cannot be negative"),

  shotBlocked: z
    .number({ message: "Shots Blocked must be a number" })
    .min(0, "Shots Blocked cannot be negative"),

  crossBlocked: z
    .number({ message: "Crosses Blocked must be a number" })
    .min(0, "Crosses Blocked cannot be negative"),

  mistakes: z
    .number({ message: "Mistakes must be a number" })
    .min(0, "Mistakes cannot be negative"),

  aerialDuels: z.string().min(1, "Aerial Duels is required"),

  phvsicalDuels: z.string().min(1, "Physical Duels is required"),

  ownGoals: z
    .number({ message: "Own Goals must be a number" })
    .min(0, "Own Goals cannot be negative"),
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
      tackleAttempts: undefined,
      tackleSucceededPossession: undefined,
      tackleSucceededNOPossession: undefined,
      tackleFailed: undefined,

      turnoverwon: undefined,
      interceptions: undefined,
      recoveries: undefined,
      clearance: undefined,

      totalBlocked: undefined,
      shotBlocked: undefined,
      crossBlocked: undefined,

      mistakes: undefined,
      aerialDuels: "",
      phvsicalDuels: "",
      ownGoals: undefined,
    },
  });

  // 🔁 Edit mode prefill
  useEffect(() => {
    if (defaultData) {
      form.reset({
        tackleAttempts: defaultData?.tackleAttempts ?? 0,
        tackleSucceededPossession: defaultData?.tackleSucceededPossession ?? 0,
        tackleSucceededNOPossession:
          defaultData?.tackleSucceededNOPossession ?? 0,
        tackleFailed: defaultData?.tackleFailed ?? 0,

        turnoverwon: defaultData?.turnoverwon ?? 0,
        interceptions: defaultData?.interceptions ?? 0,
        recoveries: defaultData?.recoveries ?? 0,
        clearance: defaultData?.clearance ?? 0,

        totalBlocked: defaultData?.totalBlocked ?? 0,
        shotBlocked: defaultData?.shotBlocked ?? 0,
        crossBlocked: defaultData?.crossBlocked ?? 0,

        mistakes: defaultData?.mistakes ?? 0,
        aerialDuels: defaultData?.aerialDuels ?? "",
        phvsicalDuels: defaultData?.phvsicalDuels ?? "",
        ownGoals: defaultData?.ownGoals ?? 0,
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
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Tackle Attempts"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
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
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Tackle Succeeded"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
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
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Tackle Succeeded"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
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
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Tackie Failed"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
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
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Turnover Won"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
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
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Interceptions"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
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
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Recoveries"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
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
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Clearance"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
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
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Total Blocked"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
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
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Shot Blocked"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
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
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Cross Blocked"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
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
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Mistakes"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
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
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Own Goals"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
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
