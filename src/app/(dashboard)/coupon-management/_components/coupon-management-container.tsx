"use client";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteModal from "@/components/modals/delete-modal";
import ClaudePagination from "@/components/ui/claude-pagination";
import { Trash, SquarePen } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import moment from "moment";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/NotFound/NotFound";
import { toast } from "sonner";
import AddEditCouponForm from "./add-edit-coupon-form";
import { Coupon, CouponApiResponse } from "./coupon-data-type";

const CouponManagementContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const [selectedCouponId, setSelectedCouponId] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error, isError } = useQuery<CouponApiResponse>({
    queryKey: ["coupon-management", currentPage],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/copon/get-all-copon?page=${currentPage}&limit=8`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to fetch coupons");
      }
      return json;
    },
    enabled: !!token,
  });

  const totalPages = data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : 0;
  const limit = data?.meta?.limit || 8;
  const showingFrom = data?.meta?.total ? (currentPage - 1) * limit + 1 : 0;
  const showingTo = data?.meta?.total ? Math.min(currentPage * limit, data.meta.total) : 0;
  let content;


  if (isLoading) {
    content = (
      <div>
        <TableSkeletonWrapper count={5} />
      </div>
    );
  } else if (isError) {
    content = (
      <div>
        <ErrorContainer message={error?.message || "Something went wrong"} />
      </div>
    );
  } else if (
    data &&
    data?.data &&
    data?.data?.length === 0
  ) {
    content = (
      <div>
        <NotFound message="Oops! No data available. Modify your filters or check your internet connection." />
      </div>
    );
  }
  else if (data && data?.data && data?.data?.length > 0) {
    content = (
      <Table className="">
        <TableHeader className="bg-[#E6F4E6] rounded-t-[12px]">
          <TableRow className="">
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] py-4 pl-6">
                Coupon Code
              </TableHead>
              <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4">
                Discount
              </TableHead>
              <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4">
                User
              </TableHead>
              <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4">
               Applies To
              </TableHead>

              <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4">
                Expiry Date
              </TableHead>
              <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4">
                Status
              </TableHead>
              <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4">
                Action
              </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-b border-x border-[#E6E7E6] rounded-b-[12px]">
          {data?.data?.map((item) => {
            return (
              <TableRow key={item._id} className="">
                <TableCell className="text-base font-medium text-[#68706A] leading-[150%] pl-6 py-4">
                  {item?.code}
                </TableCell>
                <TableCell className="text-base font-medium text-[#343A40] leading-[150%] text-center py-4">
                  {item?.discountType === "percent"
                    ? `${item?.discountValue}%`
                    : `$${item?.discountValue}`}
                </TableCell>
                <TableCell className="text-base font-medium text-[#343A40] leading-[150%] text-center py-4">
                  {item?.usedCount}/{item?.maxUses}
                </TableCell>
                   <TableCell className="text-base font-medium text-[#343A40] leading-[150%] text-center py-4">
                  {item?.appliesTo}
                </TableCell>
                <TableCell className="text-base font-medium text-[#343A40] leading-[150%] text-center py-4">
                  {moment(item?.expiryDate).format("MMM DD YYYY")}
                </TableCell>
                <TableCell className="text-base font-medium text-[#343A40] leading-[150%] text-center py-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      item?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item?.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="h-full flex items-center justify-center gap-6 py-4">
                  <button
                    onClick={() => {
                      setSelectedCoupon(item);
                      setAddEditModalOpen(true);
                    }}
                    className="cursor-pointer mt-2"
                  >
                    <SquarePen className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setSelectedCouponId(item?._id);
                    }}
                    className="cursor-pointer mt-2"
                  >
                    <Trash className="h-6 w-6 text-red-500" />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  // delete coupon api
  const { mutate } = useMutation({
    mutationKey: ["delete-coupon"],
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/copon/delete-copon/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Coupon deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["coupon-management"] });
    },
  });

  const handleDelete = () => {
    if (selectedCouponId) {
      mutate(selectedCouponId);
    }
    setDeleteModalOpen(false);
  };
  return (
    <div>
      {/* table container */}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-end">
          <button
            onClick={() => {
              setSelectedCoupon(null);
              setAddEditModalOpen(true);
            }}
            className="bg-primary text-white text-base leading-normal font-semibold py-2 px-4 rounded-[12px]"
          >
            Add Coupon
          </button>
        </div>

        {/* table  */}
        <div>{content}</div>

        {/* pagination  */}
        {totalPages > 1 && (
          <div className="w-full flex items-center justify-between py-6">
            <p className="text-base font-normal text-[#68706A] leading-[150%]">
              Showing {showingFrom} to {showingTo} of {data?.meta?.total} results
            </p>
            <div>
              <ClaudePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        )}

        {/* delete modal  */}
        {deleteModalOpen && (
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Are You Sure?"
            desc="Are you sure you want to delete this coupon?"
          />
        )}

        <AddEditCouponForm
          open={addEditModalOpen}
          onOpenChange={setAddEditModalOpen}
          defaultData={selectedCoupon}
        />
      </div>
    </div>
  );
};

export default CouponManagementContainer;
