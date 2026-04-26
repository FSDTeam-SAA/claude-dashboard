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
import { Trash } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import moment from "moment";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/NotFound/NotFound";
import { toast } from "sonner";
import { GetRevenueApiResponse } from "./revenue-data-type";
import Image from "next/image";
import NoUser from "../../../../../public/assets/images/no-user.jpeg"

const RevenueContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const [selectedContactId, setSelectedContactId] = useState("");
  const queryClient = useQueryClient();



  const { data, isLoading, error, isError } = useQuery<GetRevenueApiResponse>({
    queryKey: ["all-revenue", currentPage],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/total-revenue?page=${currentPage}&limit=8`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return res.json()
    },
    enabled: !!token
  })

  console.log(data?.data?.data)

  const totalPages = data?.meta ? Math.ceil(data?.meta?.total / data?.meta?.limit) : 0;



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
    data?.data?.data &&
    data?.data?.data?.length === 0
  ) {
    content = (
      <div>
        <NotFound message="Oops! No data available. Modify your filters or check your internet connection." />
      </div>
    );
  }
  else if (data && data?.data && data?.data?.data && data?.data?.data?.length > 0) {
    content = (
      <Table className="">
        <TableHeader className="bg-[#E6F4E6] rounded-t-[12px]">
          <TableRow className="">
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] py-4 pl-6">
              Customer Name
            </TableHead>
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
              Price
            </TableHead>
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
              Payment Type
            </TableHead>
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
              Date
            </TableHead>
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-b border-x border-[#E6E7E6] rounded-b-[12px]">
          {data?.data?.data?.map((item, index) => {
            return (
              <TableRow key={index} className="">
                <TableCell className="flex items-center gap-2 pl-6 py-4">
                   <div>
                  <Image src={item?.user?.profileImage || NoUser} alt="Profile" width={100} height={100}  className="w-10 h-10 rounded-full object-cover" />
                </div>
                  <div className="text-base font-medium text-[#68706A] leading-[150%]">
                    {item?.user?.name && (
                    <span>{item.user.name}</span>
                  )}
                  {item?.team?.teamName && (
                    <span className="block text-sm text-[#68706A]">
                      {item.team.teamName}
                    </span>
                  )}
                  </div>
                </TableCell>
                <TableCell className="text-base font-normal text-[#68706A] leading-[150%] text-center py-4">
                  {item?.amount || "N/A"}
                </TableCell>
                 <TableCell className="text-base font-normal text-[#68706A] leading-[150%] text-center py-4">
                  {item?.paymentType || "N/A"}
                </TableCell>
                <TableCell className="text-base font-medium text-[#343A40] leading-[150%] text-center py-4">
                  {moment(item?.createdAt).format("MMM DD YYYY")}
                </TableCell>
                <TableCell className="h-full flex items-center justify-center gap-6 py-4">
                  <button
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setSelectedContactId(item?.paymentId)
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
    )
  }

  // delete contact api
  const { mutate } = useMutation({
    mutationKey: ["delete-revenue"],
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/delete-player-account/${id}`,
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
      toast.success(data?.message || "Revenue deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["all-revenue"] });
    },
  });

  const handleDelete = () => {
    if (selectedContactId) {
      mutate(selectedContactId);
    }
    setDeleteModalOpen(false);
  };
  return (
    <div className="p-6 ">
      <div className="pt-12 pb-16">
        <span className="bg-primary text-2xl md:text-3xl lg:text-4xl text-[#F4FFF4] font-bold leading-[120%] border border-primary rounded-[6px] py-10 px-16">$ {data?.data?.totalRevenue.toFixed(2) || 0}</span>
      </div>
      {/* table container */}
      <div className=" space-y-6 mb-6">



        {/* table  */}
        <div className="">{content}</div>

        {/* pagination  */}
        {
          totalPages > 1 && (
            <div className="w-full flex items-center justify-between py-6">
              <p className="text-base font-normal text-[#68706A] leading-[150%]">
                Showing {currentPage} to 8 of {data?.meta?.total} results
              </p>
              <div>
                <ClaudePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          )
        }

        {/* delete modal  */}
        {deleteModalOpen && (
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Are You Sure?"
            desc="Are you sure you want to delete this Revenue?"
          />
        )}
      </div>
    </div>
  );
};

export default RevenueContainer;
