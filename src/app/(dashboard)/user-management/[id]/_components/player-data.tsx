import React from "react";
import { User } from "./single-user-data-type";
import Image from "next/image";
import moment from "moment";
import PlayingVideosPage from "./playing-videos";
import PlayerMarketValuePage from "./player-market-value";

const PlayerData = ({ data }: { data: User }) => {
  console.log("view data", data);
  return (
    <div className="pb-10">
      <div className="bg-white shadow[0px_4px_16px_0px_#00000029] rounded-[16px] grid grid-cols-1 md:grid-cols-5 gap-10 p-6 border">
        <div className="md:col-span-1">
          <Image
            src={data?.profileImage || "/assets/images/no-user.jpeg"}
            alt={data?.firstName || "profile image"}
            width={1000}
            height={1000}
            className="w-full h-[400px] object-cover rounded-[16px]"
          />
        </div>
        <div className="md:col-span-4">
          <ul className="grid gris-cols-1 md:gris-cols-2 lg:grid-cols-4 gap-6">
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Full Name
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.firstName || "N/A"} {data?.lastName || "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Phone
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {" "}
                {data?.phoneCode} {data?.phone || "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Nationality
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.nationality || "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Preferred Foot
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.foot || "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Current Club
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.currentClub || "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                GPA
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.gpa || "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Place of birth
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.birthdayPlace || "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Weight
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.weight || "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Category
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.category || "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Agent
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.agent || "N/A"}
              </span>
            </li>

            {/* <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Social media</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.gpa || "N/A"}</span></li> */}

            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Social Media
              </span>

              {data?.socialMedia && data.socialMedia.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {data?.socialMedia?.map((item, index) => (
                    <a
                      key={item._id || index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] hover:underline"
                    >
                      {item?.name || "N/A"}
                    </a>
                  ))}
                </div>
              ) : (
                <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                  N/A
                </span>
              )}
            </li>

            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Age
              </span>
              <span className="text-lg md:text-xl text-[#131313] font-normal leading-[120%]">
                {data?.dob
                  ? `${moment(data.dob).format("DD MMM YYYY")} (${data.age || 0})`
                  : "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Height
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.hight || "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Position
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                <span className="text-lg md:text-xl text-[#131313] font-normal leading-[120%] ">
                  {data?.position?.map((p) => p.toUpperCase()).join("-") ||
                    "N/A"}
                </span>
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                League
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.league || "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Gender
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.gender || "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Citizenship
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.citizenship || "N/A"}
              </span>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Institute Name
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.schoolName || "N/A"}
              </span>
            </li>

            {/* <li className="flex flex-col gap-2"><span className='text-base font-medium text-[#616161] leading-[150%]'>Role</span> <span className='text-lg md:text-xl text-[#131313] font-medium leading-[120%] '>{data?.role || "N/A"}</span></li> */}
            <li className="flex flex-col gap-2">
              <span className="text-base font-medium text-[#616161] leading-[150%]">
                Email
              </span>{" "}
              <span className="text-lg md:text-xl text-[#131313] font-medium leading-[120%] ">
                {data?.email || "N/A"}
              </span>
            </li>
          </ul>
        </div>
        {/* <div className="md:col-span-1 bg-white shadow[0px_4px_16px_0px_#00000029] rounded-[16px] p-3 border">
         <PlayerMarketValuePage id={data?._id || ""}/>
         
      </div> */}
      </div>

      <div className="bg-white shadow[0px_4px_16px_0px_#00000029] rounded-[16px] p-6 border mt-8">
        <PlayerMarketValuePage id={data?._id || ""} />
      </div>

      <PlayingVideosPage videos={data?.playingVideo} />
    </div>
  );
};

export default PlayerData;
