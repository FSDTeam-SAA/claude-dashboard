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
import Image from "next/image"

// import Link from 'next/link';
import { GuestManagementApiResponse } from "./guest-management-data-type";

import NoUser from "../../../../../public/assets/images/no-user.jpeg"



const GuestManagementContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const [selectedUserId, setSelectedUserId] = useState("");
  const queryClient = useQueryClient();





  const { data, isLoading, error, isError } = useQuery<GuestManagementApiResponse>({
    queryKey: ["user-management", currentPage],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/all-guest?page=${currentPage}&limit=8`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return res.json()
    },
    enabled: !!token
  })

  const totalPages = data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : 0;

  // console.log(totalPages)


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
              User
            </TableHead>
           
             <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
              Phone Number
            </TableHead>
             <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
              Citizeship
            </TableHead>
             <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
              Gender
            </TableHead>
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
              Role
            </TableHead>
            {/* <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
              Plan Type
            </TableHead> */}
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
              Joined
            </TableHead>
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-b border-x border-[#E6E7E6] rounded-b-[12px]">
          {data?.data?.map((item, index) => {
            return (
              <TableRow key={index} className="">
                <TableCell className="text-left pl-6 py-4">
                  <div className='flex items-center gap-2'>
                    <div>
                      <Image src={item?.profileImage || NoUser} alt="Profile" width={100} height={100} className="w-10 h-10 rounded-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold leading-[150%] text-[#181818]">
                        {item?.firstName} {item?.lastName}
                      </h4>
                      <p className="flex items-center gap-2 text-sm font-normal leading-[150%] text-[#616161]">
                        {item?.email}
                      </p>
                    </div>

                  </div>
                </TableCell>

                <TableCell className="text-base font-normal text-[#68706A] leading-[150%] text-center py-4">
                 {item?.phoneCode} {item?.phone || "N/A"}
                </TableCell>

                <TableCell className="text-base font-normal text-[#68706A] leading-[150%] text-center py-4">
                  {item?.citizenship || "N/A"}
                </TableCell>
                <TableCell className="text-base font-normal text-[#68706A] leading-[150%] text-center capitalize py-4">
                  {item?.gender || "N/A"}
                </TableCell>

                <TableCell className="text-base font-normal text-[#68706A] leading-[150%] text-center capitalize py-4">
                  {item?.role}
                </TableCell>

                {/* <TableCell className="text-base font-normal text-[#68706A] leading-[150%] text-center py-4">
                  Premium
                </TableCell> */}
                <TableCell className="text-base font-medium text-[#68706A] leading-[150%] text-center py-4">
                  {moment(item?.createdAt).format("MMM DD YYYY")}
                </TableCell>
                <TableCell className="h-full flex items-center justify-center gap-6 py-4">
                  {/* <Link href={`/user-management/${item?._id}`}>
                    <button
                      className="cursor-pointer mt-2 "
                    >
                      <Eye className="h-6 w-6" />
                    </button>
                  </Link> */}
                  <button
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setSelectedUserId(item?._id)
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

  // delete user api
  const { mutate } = useMutation({
    mutationKey: ["delete-user"],
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
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
      toast.success(data?.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["user-management"] });
    },
  });

  const handleDelete = () => {
    if (selectedUserId) {
      mutate(selectedUserId);
    }
    setDeleteModalOpen(false);
  };
  return (
    <div className="">
      {/* table container */}
      <div className="p-6 space-y-6">

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
            desc="Are you sure you want to delete this guest?"
          />
        )}
      </div>
    </div>
  );
};

export default GuestManagementContainer;
