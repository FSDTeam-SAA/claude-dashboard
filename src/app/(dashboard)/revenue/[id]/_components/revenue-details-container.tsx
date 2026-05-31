"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import moment from "moment";
import Image from "next/image";
import NoUser from "../../../../../../public/assets/images/no-user.jpeg";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/NotFound/NotFound";

interface RevenueDetailApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      profileImage: string;
      currentClub: string;
      league: string;
      category: string;
      position: string[];
      jerseyNumber: string;
      teamName: string;
    };
    paymentId: string;
    amount: number;
    currency: string;
    status: string;
    paymentType: string;
    stripeSessionId: string;
    stripePaymentIntentId: string;
    createdAt: string;
    updatedAt: string;
    team: {
      id?: string;
      teamName?: string;
      coachName?: string;
      coachEmail?: string;
      category?: string;
      league?: string;
      players?: {
        _id: string;
        name: string;
        email: string;
        role: string;
        usedGames: number;
      }[];
      createdAt?: string;
    };
    subscription: {
      id: string;
      price: number;
    };
  };
}

const RevenueDetailsContainer = ({ id }: { id: string }) => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading, error, isError } =
    useQuery<RevenueDetailApiResponse>({
      queryKey: ["revenue-detail", id],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/total-revenue/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return res.json();
      },
      enabled: !!token && !!id,
    });

  const payment = data?.data;

  if (isLoading) {
    return (
      <div className="p-6">
        <TableSkeletonWrapper count={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorContainer
          message={error?.message || "Something went wrong"}
        />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="p-6">
        <NotFound message="Revenue details not found." />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back Button */}
      <div className="pb-6">
        <Link href="/revenue">
          <button className="bg-[#B6B6B6] flex items-center gap-2 text-[#131313] leading-[120%] font-semibold py-2 px-4 rounded-[8px] hover:bg-[#a5a5a5] transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
        </Link>
      </div>

      {/* Details Card */}
      <div className="bg-white border border-[#E6E7E6] rounded-[12px] overflow-hidden">
        {/* Customer Info Header */}
        <div className="bg-[#E6F4E6] p-6 flex items-center gap-4">
          <Image
            src={payment?.user?.profileImage || NoUser}
            alt="Profile"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div>
            <h2 className="text-xl font-bold text-[#343A40] leading-[150%]">
              {payment?.user?.name || "N/A"}
            </h2>
            <p className="text-sm font-normal text-[#68706A] leading-[150%]">
              {payment?.user?.email || "N/A"}
            </p>
            {payment?.team?.teamName && (
              <p className="text-sm font-medium text-primary leading-[150%] mt-1">
                {payment.team.teamName}
              </p>
            )}
          </div>
        </div>

        {/* Payment Details Grid */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#343A40] leading-[150%] mb-4">
            Payment Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard label="Payment ID" value={payment?.paymentId || "N/A"} />
            <InfoCard
              label="Amount"
              value={`$${payment?.amount || 0}`}
              highlight
            />
            <InfoCard
              label="Currency"
              value={payment?.currency?.toUpperCase() || "N/A"}
            />
            <InfoCard
              label="Status"
              value={payment?.status || "N/A"}
              statusType={payment?.status}
            />
            <InfoCard
              label="Payment Type"
              value={payment?.paymentType || "N/A"}
            />
            <InfoCard
              label="Date"
              value={moment(payment?.createdAt).format("MMM DD, YYYY hh:mm A")}
            />
          </div>
        </div>

        {/* Customer Details */}
        <div className="p-6 border-t border-[#E6E7E6]">
          <h3 className="text-lg font-semibold text-[#343A40] leading-[150%] mb-4">
            Customer Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              label="Full Name"
              value={
                payment?.user?.firstName && payment?.user?.lastName
                  ? `${payment.user.firstName} ${payment.user.lastName}`
                  : payment?.user?.name || "N/A"
              }
            />
            <InfoCard label="Email" value={payment?.user?.email || "N/A"} />
            <InfoCard label="Role" value={payment?.user?.role || "N/A"} />
            <InfoCard
              label="Current Club"
              value={payment?.user?.currentClub || "N/A"}
            />
            <InfoCard label="League" value={payment?.user?.league || "N/A"} />
            <InfoCard
              label="Category"
              value={payment?.user?.category || "N/A"}
            />
            <InfoCard
              label="Position"
              value={
                payment?.user?.position?.length > 0
                  ? payment.user.position.join(", ").toUpperCase()
                  : "N/A"
              }
            />
            <InfoCard
              label="Jersey Number"
              value={payment?.user?.jerseyNumber || "N/A"}
            />
          </div>
        </div>

        {/* Team Details (if applicable) */}
        {payment?.team && (
          <div className="p-6 border-t border-[#E6E7E6]">
            <h3 className="text-lg font-semibold text-[#343A40] leading-[150%] mb-4">
              Team Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoCard
                label="Team Name"
                value={payment?.team?.teamName || "N/A"}
              />
              <InfoCard
                label="Coach Name"
                value={payment?.team?.coachName || "N/A"}
              />
              <InfoCard
                label="Coach Email"
                value={payment?.team?.coachEmail || "N/A"}
              />
              <InfoCard
                label="Category"
                value={payment?.team?.category || "N/A"}
              />
              <InfoCard
                label="League"
                value={payment?.team?.league || "N/A"}
              />
              <InfoCard
                label="Total Players"
                value={
                  payment?.team?.players
                    ? String(payment.team.players.length)
                    : "N/A"
                }
              />
            </div>

            {/* Players Table */}
            {payment?.team?.players && payment.team.players.length > 0 && (
              <div className="mt-6">
                <h4 className="text-base font-semibold text-[#343A40] leading-[150%] mb-3">
                  Team Players
                </h4>
                <div className="overflow-x-auto border border-[#E6E7E6] rounded-[8px]">
                  <table className="w-full">
                    <thead className="bg-[#F5F5F5]">
                      <tr>
                        <th className="text-left text-sm font-medium text-[#343A40] py-3 px-4">
                          Name
                        </th>
                        <th className="text-left text-sm font-medium text-[#343A40] py-3 px-4">
                          Email
                        </th>
                        <th className="text-center text-sm font-medium text-[#343A40] py-3 px-4">
                          Role
                        </th>
                        <th className="text-center text-sm font-medium text-[#343A40] py-3 px-4">
                          Used Games
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payment.team.players.map((player, index) => (
                        <tr
                          key={player._id || index}
                          className="border-t border-[#E6E7E6]"
                        >
                          <td className="text-sm text-[#68706A] py-3 px-4">
                            {player.name}
                          </td>
                          <td className="text-sm text-[#68706A] py-3 px-4">
                            {player.email}
                          </td>
                          <td className="text-sm text-[#68706A] py-3 px-4 text-center uppercase">
                            {player.role}
                          </td>
                          <td className="text-sm text-[#68706A] py-3 px-4 text-center">
                            {player.usedGames}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stripe Details */}
        <div className="p-6 border-t border-[#E6E7E6]">
          <h3 className="text-lg font-semibold text-[#343A40] leading-[150%] mb-4">
            Stripe Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              label="Session ID"
              value={payment?.stripeSessionId || "N/A"}
              truncate
            />
            <InfoCard
              label="Payment Intent ID"
              value={payment?.stripePaymentIntentId || "N/A"}
              truncate
            />
            {payment?.subscription && (
              <>
                <InfoCard
                  label="Subscription ID"
                  value={payment?.subscription?.id || "N/A"}
                  truncate
                />
                <InfoCard
                  label="Subscription Price"
                  value={`$${payment?.subscription?.price || 0}`}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Info Card Component
const InfoCard = ({
  label,
  value,
  highlight,
  statusType,
  truncate,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  statusType?: string;
  truncate?: boolean;
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-[#68706A]";
    }
  };

  return (
    <div className="bg-[#FAFAFA] rounded-[8px] p-4">
      <p className="text-xs font-medium text-[#9CA3AF] leading-[150%] uppercase tracking-wider mb-1">
        {label}
      </p>
      {statusType ? (
        <span
          className={`inline-block text-sm font-semibold leading-[150%] px-3 py-1 rounded-full ${getStatusColor(statusType)}`}
        >
          {value}
        </span>
      ) : (
        <p
          className={`text-base font-semibold leading-[150%] ${highlight ? "text-primary" : "text-[#343A40]"} ${truncate ? "truncate" : ""}`}
          title={truncate ? value : undefined}
        >
          {value}
        </p>
      )}
    </div>
  );
};

export default RevenueDetailsContainer;
