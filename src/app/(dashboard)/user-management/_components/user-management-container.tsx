"use client";
import React, { useState, useEffect, useCallback } from "react";

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
import { Trash, Eye, Search, ChevronDown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import moment from "moment";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/NotFound/NotFound";
import { toast } from "sonner";
// import { UserManagementApiResponse } from "./user-management-data-type";
import Image from "next/image"

import Link from 'next/link';
import { UserManagementApiResponse } from "../../_components/user-data-type";

import NoUser from "../../../../../public/assets/images/no-user.jpeg"

const UserManagementContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const [selectedUserId, setSelectedUserId] = useState("");
  const queryClient = useQueryClient();

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roles = [
    { label: "All Roles", value: "" },
    { label: "Player", value: "player" },
    { label: "Goalkeeper", value: "gk" },
  ];

  // Debounce search input (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when role changes
  const handleRoleChange = useCallback((role: string) => {
    setSelectedRole(role);
    setCurrentPage(1);
    setIsRoleDropdownOpen(false);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#role-dropdown-wrapper")) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Build query params
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", "8");
    if (debouncedSearch) params.set("searchTerm", debouncedSearch);
    if (selectedRole) params.set("role", selectedRole);
    return params.toString();
  };

  // emailVerified=true&sortOrder=desc&

  const { data, isLoading, error, isError } = useQuery<UserManagementApiResponse>({
    queryKey: ["user-management", currentPage, debouncedSearch, selectedRole],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/all-user?${buildQueryParams()}`, {
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
            <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
              Login Provider
            </TableHead>
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

                <TableCell className="text-base font-normal text-[#68706A] leading-[150%] text-center py-4">
                  {item?.provider || "N/A"}
                </TableCell>
                <TableCell className="text-base font-medium text-[#68706A] leading-[150%] text-center py-4">
                  {moment(item?.createdAt).format("MMM DD YYYY")}
                </TableCell>
                <TableCell className="h-full flex items-center justify-center gap-6 py-4">
                  <Link href={`/user-management/${item?._id}`}>
                    <button
                      className="cursor-pointer mt-2 "
                    >
                      <Eye className="h-6 w-6" />
                    </button>
                  </Link>
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
      <div className="p-6 space-y-6">

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
            <input
              type="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E6E7E6] rounded-[8px] text-sm text-[#343A40] placeholder:text-[#9CA3AF] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="relative" id="role-dropdown-wrapper">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#E6E7E6] rounded-[8px] text-sm text-[#343A40] bg-white hover:border-primary transition-colors min-w-[160px] justify-between"
            >
              <span>{roles.find((r) => r.value === selectedRole)?.label || "All Roles"}</span>
              <ChevronDown className={`h-4 w-4 text-[#9CA3AF] transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {isRoleDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#E6E7E6] rounded-[8px] shadow-lg z-10 overflow-hidden">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => handleRoleChange(role.value)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#E6F4E6] transition-colors ${
                      selectedRole === role.value
                        ? "bg-[#E6F4E6] text-primary font-medium"
                        : "text-[#343A40]"
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="">{content}</div>

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
            desc="Are you sure you want to delete this player?"
          />
        )}
      </div>
    </div>
  );
};

export default UserManagementContainer;
