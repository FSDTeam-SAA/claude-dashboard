"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
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
import { Rating } from "@/components/types/rating-data-type";
import moment from "moment";

type RatingFormValues = {
  rating: number;
  // position: string[];
  // numberOfGames: number;
  minutes: number;
  date: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultData?: Rating | null;
  playerId?: string;
}

// ----------------------
// Zod Validation Schema
// ----------------------
const ratingSchema = z.object({
  rating: z
    .number({ message: "Rating must be a number" })
    .min(0, "Rating cannot be less than 0")
    .max(10, "Rating cannot be more than 10"),
  // position: z.array(z.string()).min(1, "Select at least one position").max(2, "Maximum 2 positions"),
  // numberOfGames: z
  //   .number({ message: "Number of Games must be a number" })
  //   .min(0, "Number of Games cannot be negative"),
  minutes: z
    .number({ message: "Minutes must be a number" })
    .min(0, "Minutes cannot be negative"),
  date: z.string().min(1, "Date is required"),
});

const AddEditRatingForm = ({
  open,
  onOpenChange,
  defaultData,
  playerId,
}: Props) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const isEdit = Boolean(defaultData?._id);

  //    const POSITIONS = [
  //     { label: "GK", value: "gk" },
  //     { label: "RB", value: "rb" },
  //     { label: "LB", value: "lb" },
  //     { label: "CBL", value: "cbl" },
  //     { label: "CBR", value: "cbr" },
  //     { label: "CM", value: "cm" },
  //     { label: "AML", value: "aml" },
  //     { label: "AMR", value: "amr" },
  //     { label: "RW", value: "rw" },
  //     { label: "LW", value: "lw" },
  //     { label: "10", value: "10" },
  //     { label: "Striker", value: "striker" },
  // ]

  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: undefined,
      // position: [],
      // numberOfGames: 0,
      minutes: undefined,
      date: "",
    },
  });

  // 🔁 Edit mode prefill
  useEffect(() => {
    if (defaultData) {
      form.reset({
        rating: defaultData.rating,
        // position: defaultData.position,
        // numberOfGames: defaultData.numberOfGames,
        minutes: defaultData.minutes,
        date: moment(defaultData.date).format("YYYY-MM-DD"),
      });
    }
  }, [defaultData, form]);

  // 🔥 Add / Update mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: RatingFormValues) => {
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/rating/${defaultData?._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/rating/${playerId}`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json", // 🔥 important
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values), // 🔥 send JSON instead of FormData
      });

      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }

      toast.success(isEdit ? "Rating updated" : "Rating added");
      queryClient.invalidateQueries({ queryKey: ["all-rating"] });
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg !rounded-[12px] bg-white">
        <h3 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Rating" : "Add Rating"}
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                    Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                    Rating
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Enter Rating"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-normal leading-[150%] text-[#131313]">
                    Position (select up to 2)
                  </FormLabel>

                  <Popover >
                    <PopoverTrigger asChild>
                      <FormControl >
                        <Button
                          variant="outline"
                          className="w-full justify-between h-[48px] border border-[#645949]"
                        >
                          {field.value?.length
                            ? field.value
                              .map(
                                (v) =>
                                  POSITIONS.find((p) => p.value === v)?.label
                              )
                              .join(", ")
                            : "Select position"}

                          <span className="ml-2">▾</span>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="min-w-[320px] p-3">
                      <div className="space-y-2">
                        {POSITIONS.map((pos) => {
                          const checked = field.value?.includes(pos.value)
                          const disabled =
                            !checked && field.value?.length >= 2

                          return (
                            <label
                              key={pos.value}
                              className={`flex items-center gap-3 text-sm cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={disabled}
                                
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    field.onChange([...field.value, pos.value])
                                  } else {
                                    field.onChange(
                                      field.value.filter((v) => v !== pos.value)
                                    )
                                  }
                                }}
                                className="h-4 w-4 accent-black"
                              />
                              {pos.label}
                            </label>
                          )
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            /> */}

            <div className="grid grid-cols-1 gap-4">
              {/* <FormField
                control={form.control}
                name="numberOfGames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Number of Games
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
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
                name="minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Minutes
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        placeholder="Enter Minutes"
                        value={field.value ?? ""}
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

export default AddEditRatingForm;
