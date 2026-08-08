"use client";
import { Calendar, DollarSign, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import DashboardOverviewSkeleton from "./dashboard-overview-skeleton";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import { useSession } from "next-auth/react";

export interface DashboardOverviewApiResponse {
  statusCode: number
  success: boolean
  message: string
  data: DashboardOverviewData
}

export interface DashboardOverviewData {
  totalRevenew: number
  totalPlayers: number
  totalContact: number
  totalGk: number
  totalVerifiedPlayers: number
  totalVerifiedGk: number
}



export function DashboardOverview() {

  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading, isError, error } = useQuery<DashboardOverviewApiResponse>({
    queryKey: ["dashboard-overview"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/overview`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })
      return await res.json()
    },
    enabled: !!token
  })

  console.log(data)

  let content;

  if (isLoading) {
    content = (
      <div className="p-6">
        <DashboardOverviewSkeleton />
      </div>
    );
  } else if (isError) {
    content = <div className="p-6">
      <ErrorContainer message={error?.message || "Something went wrong"} />
    </div>;
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">

        <div className="md:col-span-1 h-[139px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
          <div>
            <p className="text-sm font-semibold text-[#424242] leading-[120%]">
              Total Revenue
            </p>
            <p className="text-3xl leading-[120%] text-[#424242] font-bold font-hexco pt-1">
             ${data?.data?.totalRevenew?.toFixed(2) || 0}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#E6F4E6] p-3 rounded-full">
              <DollarSign  className="w-6 h-6 text-primary" />
            </span>
          </div>
        </div>

        <div className="md:col-span-1 h-[139px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
          <div>
            <p className="text-sm font-semibold text-[#424242] leading-[120%]">
              Total Players
            </p>
            <p className="text-3xl leading-[120%] text-[#424242] font-bold font-hexco pt-1">
              {data?.data?.totalPlayers || 0}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#E6F4E6] p-3 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </span>
          </div>
        </div>

        <div className="md:col-span-1 h-[139px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
          <div>
            <p className="text-sm font-semibold text-[#424242] leading-[120%]">
              Total Contact
            </p>
            <p className="text-3xl leading-[120%] text-[#424242] font-bold font-hexco pt-1">
              {data?.data?.totalContact || 0}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#E6F4E6] p-3 rounded-full">
              <Calendar className="w-6 h-6 text-primary" />
            </span>
          </div>
        </div>

        <div className="md:col-span-1 h-[139px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
          <div>
            <p className="text-sm font-semibold text-[#424242] leading-[120%]">
              Total GK
            </p>
            <p className="text-3xl leading-[120%] text-[#424242] font-bold font-hexco pt-1">
              {data?.data?.totalGk || 0}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#E6F4E6] p-3 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </span>
          </div>
        </div>
        <div className="md:col-span-1 h-[139px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
          <div>
            <p className="text-sm font-semibold text-[#424242] leading-[120%]">
              Total Verified Players
            </p>
            <p className="text-3xl leading-[120%] text-[#424242] font-bold font-hexco pt-1">
              {data?.data?.totalVerifiedPlayers || 0}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#E6F4E6] p-3 rounded-full">
              <Calendar className="w-6 h-6 text-primary" />
            </span>
          </div>
        </div>

        <div className="md:col-span-1 h-[139px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
          <div>
            <p className="text-sm font-semibold text-[#424242] leading-[120%]">
              Total Verified GK
            </p>
            <p className="text-3xl leading-[120%] text-[#424242] font-bold font-hexco pt-1">
              {data?.data?.totalVerifiedGk || 0}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#E6F4E6] p-3 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </span>
          </div>
        </div>

      </div> 
    );
  }



  return (
    <div className="">
      {content}

    </div>
  );
}
