"use client"

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from "sonner";
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
import { Trash, SquarePen } from "lucide-react";
import ClaudePagination from "@/components/ui/claude-pagination";
import DeleteModal from "@/components/modals/delete-modal";
import AddEditDefensiveStatsForm from "./add-edit-defensive-stats-form";
import { DefensiveStats, DefensiveListApiResponse } from "@/components/types/defensive-stats-data-type";

const DefensiveStatsPage = ({ id }: { id?: string }) => {
  const [currentPage, setCurrentPage] = useState(1);
  console.log("view data", id)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [defensiveStatsId, setDefensiveStatsId] = useState("");
  const [selectedDefensiveStates, setSelectedDefensiveStates] =
    useState<DefensiveStats | null>(null);
  const [addDefensiveStatesForm, setAddDefensiveStatesForm] = useState(false);
  const queryClient = useQueryClient();
  console.log(queryClient)
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading, isError, error } = useQuery<DefensiveListApiResponse>({
    queryKey: ["all-defensive", id, currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/defensive/${id}?page=${currentPage}&limit=8`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      );
      return res.json();
    },
    enabled: !!token,
  });

  const totalPages = data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : 0;

  console.log(data)

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
  } else if (
    data &&
    data?.data &&
    data?.data?.length > 0
  ) {
    content = (
      <div>
        <Table className="">
          <TableHeader className="bg-primary/15 rounded-t-[12px]">
            <TableRow className="">
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] py-3 pl-6">
                Tackle Attempts
              </TableHead>
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] text-center py-3 ">
                Tackle Succeeded: Possession 
              </TableHead>
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] text-center py-3 ">
                Tackle Succeeded: No Possession
              </TableHead>
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] text-center py-3 ">
                Tackle Failed
              </TableHead>
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] text-center py-3 ">
                Turnover Won
              </TableHead>
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] text-center py-3 ">
                Interceptions
              </TableHead>
              <TableHead className="text-base font-medium leading-[150%] text-[#131313] text-center py-3 ">
                Recoveries
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
                  <TableCell className="w-[267px] text-base font-medium text-[#131313] leading-[150%] pl-10 py-3">

                    {item?.tackleAttempts || "N/A"}
                  </TableCell>
                  <TableCell className="text-base font-normal text-[#131313] leading-[150%] text-center py-3">
                    {item?.tackleSucceededPossession || "N/A"}
                  </TableCell>
                  <TableCell className="text-base font-normal text-[#131313] leading-[150%] text-center py-3">
                    {item?.tackleSucceededNOPossession || "N/A"}
                  </TableCell>
                  <TableCell className="text-base font-normal text-[#131313] leading-[150%] text-center py-3">
                    {item?.tackleFailed || "N/A"}
                  </TableCell>
                  <TableCell className="text-base font-normal text-[#131313] leading-[150%] text-center py-3">
                    {item?.turnoverwon || "N/A"}
                  </TableCell>
                  <TableCell className="text-base font-normal text-[#131313] leading-[150%] text-center py-3">
                    {item?.interceptions || "N/A"}
                  </TableCell>
                  <TableCell className="text-base font-normal text-[#131313] leading-[150%] text-center py-3">
                    {item?.recoveries || "N/A"}
                  </TableCell>
                  <TableCell >
                    <div className="h-full w-auto flex items-end justify-center gap-6 py-3">

                      <button
                        onClick={() => {
                          setSelectedDefensiveStates(item);
                          setAddDefensiveStatesForm(true);
                        }}
                        className="cursor-pointer"
                      >
                        <SquarePen className="h-6 w-6 text-[#181818]" />
                      </button>


                      <button
                        onClick={() => {
                          setDeleteModalOpen(true);
                          setDefensiveStatsId(item?._id);
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
    mutationKey: ["delete-defensive"],
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/defensive/${id}`,
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
      toast.success(data?.message || "Defensive Stats deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["all-defensive"] });
    },
  });

  const handleDelete = () => {
    if (defensiveStatsId) {
      mutate(defensiveStatsId);
    }
    setDeleteModalOpen(false);
  };
  return (
    <div>
      <div className='pt-2'>
        <div className="w-full flex items-center justify-between">

          <h3 className='text-2xl md:text-3xl  text-[#131313] font-semibold leading-[120%]'>Defensive Stats</h3>
          <div>
          {
            data && data?.data && data?.data?.length < 1 && (
               <button onClick={() => {
            setSelectedDefensiveStates(null);
            setAddDefensiveStatesForm(true);
          }} className="bg-primary text-white py-3 px-4 rounded-[12px] text-base leading-normal font-semibold">Add Defensive Stats</button>
            )
          }
          </div>
        </div>

        <div className="pt-6">
          {content}
        </div>

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
            desc="Are you sure you want to delete this Defensive Stats?"
          />
        )}

        {/* add and edit gkstats form  */}

        <div>
          {
            addDefensiveStatesForm && (
              <AddEditDefensiveStatsForm
                open={addDefensiveStatesForm}
                onOpenChange={(open: boolean) => setAddDefensiveStatesForm(open)}
                defaultData={selectedDefensiveStates}
                playerId={id}
              />
            )
          }
        </div>


      </div>
    </div>
  )
}

export default DefensiveStatsPage


