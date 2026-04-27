"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Coupon } from "./coupon-data-type";

const appliesToOptions = [
  "Individual",
  "TeamGame",
  "Evaluation",
  "Development",
  "Combine_2026",
];

const couponFormSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  discountValue: z
    .string()
    .min(1, "Discount value is required")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: "Discount value must be a valid number",
    }),
  maxUses: z
    .string()
    .min(1, "Max uses is required")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, {
      message: "Max uses must be greater than 0",
    }),
  expiryDate: z.string().min(1, "Expiry date is required"),
  appliesTo: z.string().min(1, "Please select applies to"),
  isActive: z.boolean(),
});

type CouponFormValues = z.infer<typeof couponFormSchema>;

interface AddEditCouponFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultData?: Coupon | null;
}

const AddEditCouponForm = ({
  open,
  onOpenChange,
  defaultData,
}: AddEditCouponFormProps) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const isEdit = Boolean(defaultData?._id);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      discountValue: "0",
      maxUses: "1",
      expiryDate: "",
      appliesTo: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        code: defaultData.code || "",
        discountValue: String(defaultData.discountValue ?? 0),
        maxUses: String(defaultData.maxUses ?? 1),
        expiryDate: defaultData.expiryDate
          ? defaultData.expiryDate.slice(0, 10)
          : "",
        appliesTo: defaultData.appliesTo || "",
        isActive: Boolean(defaultData.isActive),
      });
      return;
    }

    form.reset({
      code: "",
      discountValue: "0",
      maxUses: "1",
      expiryDate: "",
      appliesTo: "",
      isActive: true,
    });
  }, [defaultData, form, open]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: CouponFormValues) => {
      const endpoint = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/copon/update-copon/${defaultData?._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/copon/create-copon`;

      const payload = {
        code: values.code,
        discountType: defaultData?.discountType || "percent",
        discountValue: Number(values.discountValue),
        maxUses: Number(values.maxUses),
        usedCount: defaultData?.usedCount ?? 0,
        expiryDate: `${values.expiryDate}T23:59:59.000Z`,
        appliesTo: values.appliesTo,
        isActive: values.isActive,
      };

      const res = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Request failed");
      }
      return json;
    },
    onSuccess: (data) => {
      toast.success(
        data?.message ||
          (isEdit
            ? "Coupon updated successfully"
            : "Coupon created successfully"),
      );
      queryClient.invalidateQueries({ queryKey: ["coupon-management"] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const systemDiscountType = defaultData?.discountType || "percent";

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) {
          form.reset();
        }
      }}
    >
      <DialogContent className="max-w-2xl bg-[#FCFFFA] !rounded-[16px] p-0 overflow-hidden border border-[#E4EBDD]">
        <div className="px-6 py-5 bg-[linear-gradient(135deg,hsl(var(--primary-darker))_0%,hsl(var(--primary))_52%,hsl(var(--primary-light))_100%)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {isEdit ? "Refine Coupon Details" : "Create A Fresh Coupon"}
              </h3>
              <p className="text-sm text-[#E8F5E9] mt-1">
                {isEdit
                  ? "Keep your campaign sharp by updating this coupon."
                  : "Set up a coupon fast with clear limits and expiry."}
              </p>
            </div>
            {/* <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
              Type : {systemDiscountType === "fixed" ? "Fixed" : "Percent"}
            </span> */}
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className="px-6 py-5 space-y-5"
          >
            <div className="rounded-[14px] border border-[#DCE8D6] bg-white p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[15px] font-semibold text-[#1E2B20]">
                  Core Coupon Setup
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#2A2E2A]">
                        Coupon Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="EX: SAVE10"
                          className="h-11 rounded-[10px] border-[#C9D3C5] focus-visible:ring-[#5E8E5B] bg-[#FBFDF9]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#2A2E2A]">
                        Discount Value
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...field}
                          placeholder={
                            systemDiscountType === "fixed"
                              ? "Enter fixed amount"
                              : "Enter percentage value"
                          }
                          className="no-spinner h-11 rounded-[10px] border-[#C9D3C5] focus-visible:ring-[#5E8E5B] bg-[#FBFDF9]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxUses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#2A2E2A]">
                        Max User
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          placeholder="Maximum redeem count"
                          className="h-11 rounded-[10px] border-[#C9D3C5] focus-visible:ring-[#5E8E5B] bg-[#FBFDF9]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#2A2E2A]">
                        Expiry Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="h-11 rounded-[10px] border-[#C9D3C5] focus-visible:ring-[#5E8E5B] bg-[#FBFDF9]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="appliesTo"
              render={({ field }) => (
                <FormItem className="rounded-[14px] border border-[#DCE8D6] bg-white p-4 md:p-5">
                  <FormLabel className="text-sm font-medium text-[#2A2E2A]">
                    Applies To
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11 rounded-[10px] border-[#C9D3C5] focus:ring-[#5E8E5B] bg-[#FBFDF9]">
                        <SelectValue placeholder="Select who this coupon applies to" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {appliesToOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="rounded-[14px] border border-[#DCE8D6] bg-[linear-gradient(135deg,#F5FAF4_0%,#EEF6EB_100%)] px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <FormLabel className="text-sm font-medium text-[#2A2E2A]">
                        Coupon Status
                      </FormLabel>
                      <p className="text-xs text-[#6A7568] mt-1">
                        Enable this coupon to make it available for use.
                      </p>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(value) =>
                          field.onChange(Boolean(value))
                        }
                        className="h-5 w-5 rounded border-[#8FA98C] data-[state=checked]:bg-[#3B7B38] data-[state=checked]:text-white"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-11 px-5 rounded-[10px] bg-[#EEF3EA] text-[#2F3A2E] hover:bg-[#E3EBDE]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-11 px-5 rounded-[10px] bg-primary text-white hover:opacity-90"
              >
                {isPending
                  ? "Saving..."
                  : isEdit
                    ? "Update Coupon"
                    : "Create Coupon"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCouponForm;
