"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/NotFound/NotFound";
import Image from "next/image";
import { Eye, Trash, SquarePen } from "lucide-react";
import ClaudePagination from "@/components/ui/claude-pagination";
import DeleteModal from "@/components/modals/delete-modal";
import {
  TransferHistory,
  TransferHistoryApiResponse,
} from "@/components/types/transfer-history-data-type";
import TransferHistoryView from "./transfer-history-view";
import AddEditTransferHistoryForm from "./add-edit-transfer-history";

import noImage from "../../../../../../public/assets/images/no-image.png";

const TransferHistoryPage = ({ id }: { id?: string }) => {
  console.log("view data", id);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transferHistoryId, setTransferHistoryId] = useState("");
  const [selectViewTransferHistory, setSelectViewTransferHistory] =
    useState(false);
  const [selectTransferHistory, setSelectTransferHistory] =
    useState<TransferHistory | null>(null);
  const [addTransferHistoryForm, setAddTransferHistoryForm] = useState(false);
  const queryClient = useQueryClient();
  console.log(queryClient);
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading, isError, error } =
    useQuery<TransferHistoryApiResponse>({
      queryKey: ["all-transferhistory", id, currentPage],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/transferhistory/${id}?page=${currentPage}&limit=8`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return res.json();
      },
      enabled: !!token,
    });

  console.log(data);

  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.limit)
    : 0;

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
  } else if (data && data?.data && data?.data?.length === 0) {
    content = (
      <div>
        <NotFound message="Oops! No data available. Modify your filters or check your internet connection." />
      </div>
    );
  } else if (data && data?.data && data?.data?.length > 0) {
    content = (
      <div>
        <Table className="">
          <TableHeader className="bg-primary/15 rounded-t-[12px]">
            <TableRow className="">
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] py-3 pl-6">
                Season
              </TableHead>
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] text-center py-3 ">
                Departure Date
              </TableHead>
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] text-center py-3 ">
                Left Club Name
              </TableHead>
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] text-center py-3 ">
                Left Club
              </TableHead>
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] text-center py-3 ">
                Left Country Flag
              </TableHead>
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] text-center py-3 ">
                Joined Club Name
              </TableHead>
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] text-center py-3 ">
                Joined Club
              </TableHead>
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] text-center py-3 ">
                Joined Country Flag
              </TableHead>
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] text-center py-3">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border-b border-x border-[#E6E7E6] rounded-b-[12px]">
            {data?.data?.map((item, index) => {
              return (
                <TableRow key={index} className="">
                  <TableCell className="w-[267px] text-base font-medium text-[#131313] leading-[150%] pl-6 py-3">
                    {item?.season || "N/A"}
                  </TableCell>
                  <TableCell className="text-base font-normal text-[#131313] leading-[150%] text-center py-3">
                    {/* {moment(item.date).format("MMM DD, YYYY") || "N/A"} */}
                    {item.date && moment(item.date).isValid()
                      ? moment(item.date).format("MMM DD, YYYY")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-base font-normal text-[#131313] leading-[150%] text-center py-3">
                    {item?.leftClubName || "N/A"}
                  </TableCell>
                  <TableCell className=" text-base font-normal text-[#131313] leading-[150%] py-3">
                    <div className="flex items-center justify-center">
                      <Image
                        src={item?.leftClub || noImage}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-12 h-12 rounded-[12px] object-contain"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-base font-normal text-[#131313] leading-[150%] py-3">
                    <div className="flex items-center justify-center">
                      <Image
                        src={item?.leftCountery || noImage}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-12 h-12 rounded-[12px] object-contain"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-base font-normal text-[#131313] leading-[150%] text-center py-3">
                    {item?.joinedclubName || "N/A"}
                  </TableCell>
                  <TableCell className="text-base font-normal text-[#131313] leading-[150%] text-center py-3">
                    <div className="flex items-center justify-center">
                      <Image
                        src={item?.joinedClub || noImage}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-12 h-12 rounded-[12px] object-contain"
                      />
                    </div>
                  </TableCell>
                  <TableCell className=" text-base font-normal text-[#131313] leading-[150%] py-3">
                    <div className="flex items-center justify-center">
                      <Image
                        src={item?.joinedCountery || noImage}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-12 h-12 rounded-[12px] object-contain"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-full w-auto flex items-end justify-center gap-6 py-3">
                      <button
                        onClick={() => {
                          setSelectViewTransferHistory(true);
                          setSelectTransferHistory(item);
                        }}
                        className="cursor-pointer"
                      >
                        <Eye className="h-6 w-6 text-[#181818]" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectTransferHistory(item);
                          setAddTransferHistoryForm(true);
                        }}
                        className="cursor-pointer"
                      >
                        <SquarePen className="h-6 w-6 text-[#181818]" />
                      </button>

                      <button
                        onClick={() => {
                          setDeleteModalOpen(true);
                          setTransferHistoryId(item?._id);
                        }}
                        className="cursor-pointer"
                      >
                        <Trash className="h-6 w-6 text-red-500" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }

  // delete national team player
  const { mutate } = useMutation({
    mutationKey: ["delete-transferhistory"],
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transferhistory/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Transfer History deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["all-transferhistory"] });
    },
  });

  const handleDelete = () => {
    if (transferHistoryId) {
      mutate(transferHistoryId);
    }
    setDeleteModalOpen(false);
  };
  return (
    <div>
      <div className="pt-2">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-2xl md:text-3xl  text-[#131313] font-semibold leading-[120%]">
            Transfer History
          </h3>
          <button
            onClick={() => {
              setSelectTransferHistory(null);
              setAddTransferHistoryForm(true);
            }}
            className="bg-primary text-white py-3 px-4 rounded-[12px] text-base leading-normal font-semibold"
          >
            Add Transfer History
          </button>
        </div>

        <div className="pt-6">{content}</div>
        {/* pagination  */}
        {totalPages > 1 && (
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
        )}

        {/* delete modal  */}
        {deleteModalOpen && (
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Are You Sure?"
            desc="Are you sure you want to delete this Transfer History?"
          />
        )}

        {/* national team career view  */}
        <div>
          {selectViewTransferHistory && (
            <TransferHistoryView
              open={selectViewTransferHistory}
              onOpenChange={(open: boolean) =>
                setSelectViewTransferHistory(open)
              }
              transferHistory={selectTransferHistory}
            />
          )}
        </div>

        {/* add national team career form  */}

        <div>
          {addTransferHistoryForm && (
            <AddEditTransferHistoryForm
              open={addTransferHistoryForm}
              onOpenChange={(open: boolean) => setAddTransferHistoryForm(open)}
              defaultData={selectTransferHistory}
              playerId={id}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferHistoryPage;
