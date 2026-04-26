
"use client"

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/NotFound/NotFound";
import moment from "moment";
import Image from "next/image"
import { UserManagementApiResponse } from "./user-data-type";

import NoUser from "../../../../public/assets/images/no-user.jpeg"

const UserRegistration = () => {

  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;





  const { data, isLoading, error, isError } = useQuery<UserManagementApiResponse>({
    queryKey: ["user-management"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/all-user?limit=3`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return res.json()
    },
    enabled: !!token
  })

  // console.log(totalPages)


  let content;


  if (isLoading) {
    content = (
      <div className="pt-6">
        <TableSkeletonWrapper count={2} />
      </div>
    );
  } else if (isError) {
    content = (
      <div className="pt-4">
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
      <div>
        {data?.data?.map((item) => {
          return (
            <div
              key={item?._id}
              className="w-full flex items-center justify-between border-b border-[#E6E6E8] py-6 "
            >
              <div className='w-[270px] flex items-center gap-2'>
                <div>
                  <Image src={item?.profileImage || NoUser} alt="Profile" width={100} height={100}  className="w-10 h-10 rounded-full object-cover" />
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
              <p className="w-[150px] text-center text-sm font-normal leading-[150%] text-[#616161]">
                {item?.citizenship || "N/A"}
              </p>
              <p className="w-[150px] text-sm font-normal text-center leading-[150%] text-[#616161]">
               {item?.phoneCode || ""} {item?.phone || "N/A"}
              </p>
              <p className="text-sm font-normal leading-[150%] text-[#616161]">
                {moment(item?.createdAt).format("DD / MM / YYYY")}
              </p>
            </div>
          );
        })}
      </div>
    )
  }
  return (
    <div className="pr-6 pb-20 ">
      <div className="bg-white border border-[#E6E6E8] p-6 rounded-[12px]">
        <div className="w-full flex items-center justify-between">
          <h4 className="text-xl font-semibold leading-[150%] text-[#343A40]">
            User Registrations
          </h4>
          <Link href="/user-management">
            <button className="text-sm font-medium leading-[150%] text-primary cursor-pointer hover:underline">
              View All
            </button>
          </Link>
        </div>
        <div>
          {content}
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
