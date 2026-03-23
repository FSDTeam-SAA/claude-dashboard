"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
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
import moment from "moment";
import { useSession } from "next-auth/react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransferHistory } from "@/components/types/transfer-history-data-type";

type TransferHistoryFormValues = {
  season: string;
  date: string; // ISO date string
  leftClubName: string;
  leftClub: File | null; // image URL
  leftCountery: File | null; // image URL
  joinedclubName: string;
  joinedClub: File | null; // image URL
  joinedCountery: File | null;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultData?: TransferHistory | null;
  playerId?: string;
}

// ----------------------
// Zod Validation Schema
// ----------------------

export const transferHistorySchema = z.object({
  season: z.string(),

  date: z.string(), // ISO string

  leftClubName: z.string(),

  leftClub: z
    .any()
    .nullable()
    .refine(
      (file) => file === null || file instanceof File,
      "Left club image must be a valid file",
    ),

  leftCountery: z
    .any()
    .nullable()
    .refine(
      (file) => file === null || file instanceof File,
      "Left country image must be a valid file",
    ),

  joinedclubName: z.string(),

  joinedClub: z
    .any()
    .nullable()
    .refine(
      (file) => file === null || file instanceof File,
      "Joined club image must be a valid file",
    ),

  joinedCountery: z
    .any()
    .nullable()
    .refine(
      (file) => file === null || file instanceof File,
      "Joined country image must be a valid file",
    ),
});

const AddEditTransferHistoryForm = ({
  open,
  onOpenChange,
  defaultData,
  playerId,
}: Props) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const [leftClubPreview, setLeftClubPreview] = useState<string | null>(null);
  const [leftCountryPreview, setLeftCountryPreview] = useState<string | null>(
    null,
  );
  const [joinedClubPreview, setJoinedClubPreview] = useState<string | null>(
    null,
  );
  const [joinedCountryPreview, setJoinedCountryPreview] = useState<
    string | null
  >(null);
  const isEdit = Boolean(defaultData?._id);

  const form = useForm<TransferHistoryFormValues>({
    resolver: zodResolver(transferHistorySchema),
    defaultValues: {
      season: "",
      date: "",
      leftClubName: "",
      leftClub: null,
      leftCountery: null,
      joinedclubName: "",
      joinedClub: null,
      joinedCountery: null,
    },
  });

  // 🔁 Edit mode prefill

  useEffect(() => {
    if (defaultData) {
      form.reset({
        season: defaultData.season,
        date: moment(defaultData.date).format("YYYY-MM-DD"),
        leftClubName: defaultData.leftClubName,
        leftClub: null,
        leftCountery: null,
        joinedclubName: defaultData.joinedclubName,
        joinedClub: null,
        joinedCountery: null,
      });

      setLeftClubPreview(defaultData.leftClub);
      setLeftCountryPreview(defaultData.leftCountery);
      setJoinedClubPreview(defaultData.joinedClub);
      setJoinedCountryPreview(defaultData.joinedCountery);
    }
  }, [defaultData, form]);

  // 🔥 Add / Update mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: TransferHistoryFormValues) => {
      const formData = new FormData();

      formData.append("season", values.season);
      formData.append("date", values.date);
      formData.append("leftClubName", values.leftClubName);
      formData.append("joinedclubName", values.joinedclubName);

      if (values.leftClub) formData.append("leftClub", values.leftClub);
      if (values.leftCountery)
        formData.append("leftCountery", values.leftCountery);
      if (values.joinedClub) formData.append("joinedClub", values.joinedClub);
      if (values.joinedCountery)
        formData.append("joinedCountery", values.joinedCountery);

      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/transferhistory/${defaultData?._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/transferhistory/${playerId}`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }

      toast.success(
        isEdit ? "Transfer history updated" : "Transfer history added",
      );
      queryClient.invalidateQueries({ queryKey: ["all-transferhistory"] });
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg  !rounded-[12px]  bg-white">
        <h3 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Transfer History" : "Add Transfer History"}
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className="space-y-4"
          >
            {/* Goals & Match */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Season
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                        {...field}
                        placeholder="Enter team name"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Debut */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Departure Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="leftClubName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                    Left Club Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                      {...field}
                      placeholder="Enter Left Club Name"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* left club Flag Upload */}
              <FormField
                control={form.control}
                name="leftClub"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Left Club Flag
                    </FormLabel>
                    <FormControl>
                      <div className="w-auto flex items-center gap-4 border-2 border-dashed border-gray-500 rounded-[12px]">
                        {leftClubPreview ? (
                          <div className="relative w-full h-28 rounded-xl overflow-hidden group">
                            <Image
                              src={leftClubPreview}
                              alt="Flag"
                              fill
                              className="object-contain py-2"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setLeftClubPreview(null);
                                  field.onChange(null);
                                }}
                                className="bg-white rounded-full p-2"
                              >
                                <X className="h-5 w-5 text-red-600" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="w-full h-28 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted transition">
                            <UploadCloud className="h-6 w-6 text-muted-foreground" />
                            <span className="text-sm font-medium text-[#131313] leading-normal">
                              Upload Flag
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                field.onChange(file);
                                const url = URL.createObjectURL(file);
                                setLeftClubPreview(url);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* left country Flag Upload */}
              <FormField
                control={form.control}
                name="leftCountery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Left Country Flag
                    </FormLabel>
                    <FormControl>
                      <div className="w-auto flex items-center gap-4 border-2 border-dashed border-gray-500 rounded-[12px]">
                        {leftCountryPreview ? (
                          <div className="relative w-full h-28 rounded-xl overflow-hidden group">
                            <Image
                              src={leftCountryPreview}
                              alt="Flag"
                              fill
                              className="object-contain py-2"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setLeftCountryPreview(null);
                                  field.onChange(null);
                                }}
                                className="bg-white rounded-full p-2"
                              >
                                <X className="h-5 w-5 text-red-600" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="w-full h-28 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted transition">
                            <UploadCloud className="h-6 w-6 text-muted-foreground" />
                            <span className="text-sm font-medium text-[#131313] leading-normal">
                              Upload Flag
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                field.onChange(file);
                                const url = URL.createObjectURL(file);
                                setLeftCountryPreview(url);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="joinedclubName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                    Joined Club Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                      {...field}
                      placeholder="Enter Joined Club Name"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* left club Flag Upload */}
              <FormField
                control={form.control}
                name="joinedClub"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Joined Club Flag
                    </FormLabel>
                    <FormControl>
                      <div className="w-auto flex items-center gap-4 border-2 border-dashed border-gray-500 rounded-[12px]">
                        {joinedClubPreview ? (
                          <div className="relative w-full h-28 rounded-xl overflow-hidden group">
                            <Image
                              src={joinedClubPreview}
                              alt="Flag"
                              fill
                              className="object-contain py-2"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setJoinedClubPreview(null);
                                  field.onChange(null);
                                }}
                                className="bg-white rounded-full p-2"
                              >
                                <X className="h-5 w-5 text-red-600" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="w-full h-28 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted transition">
                            <UploadCloud className="h-6 w-6 text-muted-foreground" />
                            <span className="text-sm font-medium text-[#131313] leading-normal">
                              Upload Flag
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                field.onChange(file);
                                const url = URL.createObjectURL(file);
                                setJoinedClubPreview(url);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* left club Flag Upload */}
              <FormField
                control={form.control}
                name="joinedCountery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Joined Country Flag
                    </FormLabel>
                    <FormControl>
                      <div className="w-auto flex items-center gap-4 border-2 border-dashed border-gray-500 rounded-[12px]">
                        {joinedCountryPreview ? (
                          <div className="relative w-full h-28 rounded-xl overflow-hidden group">
                            <Image
                              src={joinedCountryPreview}
                              alt="Flag"
                              fill
                              className="object-contain py-2"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setJoinedCountryPreview(null);
                                  field.onChange(null);
                                }}
                                className="bg-white rounded-full p-2"
                              >
                                <X className="h-5 w-5 text-red-600" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="w-full h-28 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted transition">
                            <UploadCloud className="h-6 w-6 text-muted-foreground" />
                            <span className="text-sm font-medium text-[#131313] leading-normal">
                              Upload Flag
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                field.onChange(file);
                                const url = URL.createObjectURL(file);
                                setJoinedCountryPreview(url);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
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
                  setLeftClubPreview(null);
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

export default AddEditTransferHistoryForm;
