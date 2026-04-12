import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import moment from "moment";
import { Newsletter } from "./newsletter-data-type";

const NewsletterManagementView = ({
  open,
  onOpenChange,
  contactData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactData: Newsletter | null;
}) => {
  if (!contactData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 space-y-4 bg-white !rounded-[12px]">

        <div className="space-y-4">
          <p className="text-base font-normal text-[#6C757D)] leading-[150%]">
            <strong className="text-base font-semibold text-[#343A40] leading-[150%]">Email :</strong> <br/> {contactData?.email}
          </p>
          <p className="text-base font-normal text-[#6C757D)] leading-[150%]">
            <strong className="text-base font-semibold text-[#343A40] leading-[150%]">Date :</strong> <br/> {moment(contactData?.createdAt).format("MMM DD, YYYY")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterManagementView;

