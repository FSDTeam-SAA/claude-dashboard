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
import { DistributionStats } from "@/components/types/player-distribution-stats-data-type";

type PlayerDistributionFormValues = {
  passes: string;
  passesinFinalThird: string;
  passesinMiddleThird: string;
  passesinOerensiveThird: string;

  kevPasses: string;
  longPasses: string;
  mediumPasses: string;
  shortPasses: string;

  passesForward: string;
  passesSidewavs: string;
  passesBackward: string;

  passesReceived: string;
  crosses: string;
  stepIn: string;
  turnoverConceded: string;
  // mostPassesPlayerBetween: string;
  passTheMost: string;
  ballTheMost: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultData?: DistributionStats | null;
  playerId?: string;
}

// ----------------------
// Zod Validation Schema
// ----------------------
export const PlayerDistributionSchema = z.object({
  passes: z.string().min(1, "Passes is required"),

  passesinFinalThird: z.string().min(1, "Passes in final third is required"),
  passesinMiddleThird: z.string().min(1, "Passes in middle third  is required"),
  passesinOerensiveThird: z
    .string()
    .min(1, "Passes in offensive third is required"),
  kevPasses: z.string().min(1, "Key passes is required"),
  longPasses: z.string().min(1, "Long passes is required"),
  mediumPasses: z.string().min(1, "Medium passes is required"),
  shortPasses: z.string().min(1, "Short passes is required"),
  passesForward: z.string().min(1, "Forward passes is required"),
  passesSidewavs: z.string().min(1, "Passes Sideways is required"),
  passesBackward: z.string().min(1, "Backward passes is required"),
  passesReceived: z.string().min(1, "Passes received is required"),
  crosses: z.string().min(1, "Crosses is required"),
  stepIn: z.string().min(1, "Step-ins is required"),
  turnoverConceded: z.string().min(1, "Turnovers conceded is required"),

  // mostPassesPlayerBetween: z
  //   .number({ message: "Most passes between players must be a number" })
  //   .min(0, "Most passes between players cannot be negative"),

  passTheMost: z.string().min(1, "Pass The Most is required"),

  ballTheMost: z.string().min(1, "Ball The Most is required"),
});

const AddEditPlayerDistributionForm = ({
  open,
  onOpenChange,
  defaultData,
  playerId,
}: Props) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const isEdit = Boolean(defaultData?._id);

  const form = useForm<PlayerDistributionFormValues>({
    resolver: zodResolver(PlayerDistributionSchema),
    defaultValues: {
      passes: "",
      passesinFinalThird: "",
      passesinMiddleThird: "",
      passesinOerensiveThird: "",

      kevPasses: "",
      longPasses: "",
      mediumPasses: "",
      shortPasses: "",

      passesForward: "",
      passesSidewavs: "",
      passesBackward: "",

      passesReceived: "",
      crosses: "",
      stepIn: "",
      turnoverConceded: "",
      // mostPassesPlayerBetween: "",
      passTheMost: "",
      ballTheMost: "",
    },
  });

  // 🔁 Edit mode prefill
  useEffect(() => {
    if (defaultData) {
      form.reset({
        passes: defaultData?.passes ?? "",
        passesinFinalThird: defaultData?.passesinFinalThird ?? "",
        passesinMiddleThird: defaultData?.passesinMiddleThird ?? "",
        passesinOerensiveThird: defaultData?.passesinOerensiveThird ?? "",

        kevPasses: defaultData?.kevPasses ?? "",
        longPasses: defaultData?.longPasses ?? "",
        mediumPasses: defaultData?.mediumPasses ?? "",
        shortPasses: defaultData?.shortPasses ?? "",

        passesForward: defaultData?.passesForward ?? "",
        passesSidewavs: defaultData?.passesSidewavs ?? "",
        passesBackward: defaultData?.passesBackward ?? "",

        passesReceived: defaultData?.passesReceived ?? "",
        crosses: defaultData?.crosses ?? "",
        stepIn: defaultData?.stepIn ?? "",
        turnoverConceded: defaultData?.turnoverConceded ?? "",
        // mostPassesPlayerBetween: defaultData?.mostPassesPlayerBetween ?? 0,
        passTheMost: defaultData?.passTheMost ?? "",
        ballTheMost: defaultData?.ballTheMost ?? "",
      });
    }
  }, [defaultData, form]);

  // 🔥 Add / Update mutation (JSON version)
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: PlayerDistributionFormValues) => {
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/distributionstats/${defaultData?._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/distributionstats/${playerId}`;

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
        isEdit
          ? "Player Distribution Stats updated"
          : "Player Distribution Stats added",
      );
      queryClient.invalidateQueries({ queryKey: ["all-distributionstats"] });
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="undefined max-w-2xl min-h-[400px] md:max-h-[600px] overflow-auto  !rounded-[12px]  bg-white">
        <h3 className="text-xl font-semibold mb-4">
          {isEdit
            ? "Edit Player Distribution Stats"
            : "Add Player Distribution Stats"}
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className=" space-y-4"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="passes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Passes
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Passes"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passesinFinalThird"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Passes in Final Third
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Passes in final third"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passesinMiddleThird"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Passes in Middle Third
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter passes in middle third"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passesinOerensiveThird"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Passes in the Defensive Third
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Passes in the defensive third"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kevPasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Key Passes
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Key Passes"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longPasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Long Passes
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter long passes"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mediumPasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Medium Passes
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Medium Passes"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortPasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Short Passes
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Short Passes"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passesForward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Passes Forward
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Passes Forward"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passesSidewavs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Passes Sideways
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter passes sideways"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passesBackward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Passes Backward
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter passes backward"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passesReceived"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Passes Received
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter passes received"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="crosses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Crosses
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Crosses"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stepIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Step In
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Step In"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="turnoverConceded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Turnover Conceded
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Turnover Conceded"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passTheMost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Who do you pass the ball to the most?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter who do you pass the ball to the most?"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ballTheMost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold leading-[120%] text-[#131313]">
                      Who passes the ball to you the most?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter who passes the ball to you the most?"
                        className="h-[44px] w-full rounded-[12px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]"
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

export default AddEditPlayerDistributionForm;
