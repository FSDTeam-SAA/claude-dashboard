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
import { NationalTeam } from "@/components/types/national-team-career-data-type";
import { useSession } from "next-auth/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type NationalTeamFormValues = {
  teamName: string;
  category: string;
  debut: string;
  goals: string;
  match: string;
  flag: File | null;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultData?: NationalTeam | null;
  playerId?: string;
}

// ----------------------
// Zod Validation Schema
// ----------------------
const nationalTeamSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
   category: z
    .string()
    .min(1, "Category is required"),
  debut: z.string().min(1, "Debut date is required"),
  goals: z.string().min(1, "Goals is required"),
  match: z.string().min(1, "Matches is required"),
  flag: z
    .any()
    .nullable()
    .refine((file) => file === null || file instanceof File, "Invalid file"),
});

const AddNationalTeamForm = ({
  open,
  onOpenChange,
  defaultData,
  playerId,
}: Props) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const [preview, setPreview] = useState<string | null>(null);
  const isEdit = Boolean(defaultData?._id);

  const form = useForm<NationalTeamFormValues>({
    resolver: zodResolver(nationalTeamSchema),
    defaultValues: {
      teamName: "",
      category: "",
      debut: "",
      goals: "",
      match: "",
      flag: null,
    },
  });

  // 🔁 Edit mode prefill
  useEffect(() => {
    if (defaultData) {
      form.reset({
        teamName: defaultData.teamName,
        category: defaultData.category,
        debut: moment(defaultData.debut).format("YYYY-MM-DD"),
        goals: defaultData.goals ?? "",
        match: defaultData.match ?? "",
        flag: null,
      });
      setPreview(defaultData.flag);
    }
  }, [defaultData, form]);

  // 🔥 Add / Update mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: NationalTeamFormValues) => {
      const formData = new FormData();
      formData.append("teamName", values.teamName);
      formData.append("category", values.category);
      formData.append("debut", values.debut);
      formData.append("goals", String(values.goals));
      formData.append("match", String(values.match));
      if (values.flag) formData.append("flag", values.flag);

      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/national/${defaultData?._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/national/${playerId}`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }

      toast.success(isEdit ? "National team updated" : "National team added");
      queryClient.invalidateQueries({ queryKey: ["all-national-team-career"] });
      onOpenChange(false);
      form.reset();
      setPreview(null);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg  !rounded-[12px]  bg-white">
        <h3 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit National Team Career" : "Add National Team Career"}
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className="space-y-4"
          >
           

            {/* Goals & Match */}
            <div className="grid grid-cols-2 gap-4">
               {/* Team Name */}
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                    Team Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-[44px] w-full rounded-[12px] text-base leading-[120%] text-[#131313] font-medium border border-[#645949]"
                      {...field}
                      placeholder="Enter team name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Debut */}
            <FormField
              control={form.control}
              name="debut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                    Debut Date
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
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Goals
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter goals"
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
                name="match"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                      Matches
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter matches"
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-normal leading-[150%] text-[#131313]">
                      Category
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#645949] text-base font-medium leading-[120%] text-[#131313]">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="h-[200px] overflow-y-auto bg-white">
                          {/* <SelectItem value="semi-professional">Semi Professional</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="adult">Adult</SelectItem>
                          <SelectItem value="U9">U9</SelectItem>
                          <SelectItem value="U10">U10</SelectItem>
                          <SelectItem value="U11">U11</SelectItem>
                          <SelectItem value="U12">U12</SelectItem>
                          <SelectItem value="U13">U13</SelectItem> */}
                          <SelectItem value="U14">U14</SelectItem>
                          <SelectItem value="U15">U15</SelectItem>
                          <SelectItem value="U16">U16</SelectItem>
                          <SelectItem value="U17">U17</SelectItem>
                          <SelectItem value="U18">U18</SelectItem>
                          <SelectItem value="U19">U19</SelectItem>
                          <SelectItem value="U20">U20</SelectItem>
                          <SelectItem value="U21">U21</SelectItem>
                          <SelectItem value="U23">U23</SelectItem>
                          <SelectItem value="men's national team">Men&rsquo;s National Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

            {/* Flag Upload */}
            <FormField
              control={form.control}
              name="flag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base leading-[120%] font-semibold text-[#131313]">
                    Team Flag
                  </FormLabel>
                  <FormControl>
                    <div className="w-auto flex items-center gap-4 border-2 border-dashed border-gray-500 rounded-[12px]">
                      {preview ? (
                        <div className="relative w-full h-40 rounded-xl overflow-hidden group">
                          <Image
                            src={preview}
                            alt="Flag"
                            fill
                            className="object-contain py-2"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                setPreview(null);
                                field.onChange(null);
                              }}
                              className="bg-white rounded-full p-2"
                            >
                              <X className="h-5 w-5 text-red-600" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="w-full h-40 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted transition">
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
                              setPreview(url);
                            }}
                          />
                        </label>
                      )}
                    </div>
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
                  setPreview(null);
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

export default AddNationalTeamForm;






