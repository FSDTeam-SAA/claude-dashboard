

"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CircleAlert, Calendar } from "lucide-react";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MonthlyRevenueChartApiResponse } from "./revenue-activity-data-type";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/NotFound/NotFound";

export const description = "A simple area chart";


// #10e607 old color 
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#10e607", // stroke color
  },
} satisfies ChartConfig;

  const generateYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = 0; i < 3; i++) {
    years.push(currentYear - i)
  }
  return years
}

export function RevenueActivity() {

    const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const yearOptions = generateYearOptions()



  const {data, isLoading, isError, error} = useQuery<MonthlyRevenueChartApiResponse>({
    queryKey: ["revenue-activity", selectedYear],
    queryFn: async () =>{
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/monthly-revenue-chart?year=${selectedYear}`,{
        method: "GET",
        headers: {
          Authorization : `Bearer ${token}`
        }
      });
      return res.json();
    },
    enabled: !!token
  })

    let content;

  if (isLoading) {
    content = (
      <div className="pt-4">
        <TableSkeletonWrapper count={3} />
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
            <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold leading-[150%] text-[#343A40] font-hexco">
            Revenue Activity <CircleAlert />
          </CardTitle>
          {/* Year Filter Dropdown */}
             <div className="relative">
               <select
                 value={selectedYear}
                 onChange={e => setSelectedYear(Number(e.target.value))}
                 className="appearance-none bg-white border border-[#E6E6E8] rounded-lg px-4 py-2 pr-10 text-sm font-medium text-[#343A40] cursor-pointer hover:border-[#DF1020] focus:outline-none focus:ring-2 focus:ring-[#DF1020] focus:ring-opacity-20 transition-all"
               >
                 {yearOptions.map(year => (
                   <option key={year} value={year}>
                     {year}
                  </option>
                 ))}
               </select>
               <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#616161] pointer-events-none" />
             </div>
             </div>
        </CardHeader>

        <CardContent>
          <ChartContainer config={chartConfig} className="w-full max-h-[373px]">
            <AreaChart accessibilityLayer data={data?.data} className="w-full">
              
              {/* --- Gradient Definition --- */}
              <defs>
                <linearGradient
                  id="desktopGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="rgba(7,146,1,0.20)" />
                  <stop offset="141%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />

              <YAxis stroke="#999" />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />

              <Area
                dataKey="revenue"
                type="monotone"
                stroke="#10e607"
                strokeWidth={2}
                fill="url(#desktopGradient)" // Gradient applied here
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      </div>
    );
  }
  return (
    <div className="px-6 pb-6">
     {content}
    </div>
  );
}


