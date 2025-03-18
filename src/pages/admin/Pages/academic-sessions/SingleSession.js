import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import DatePicker from "react-datepicker";
import DeleteModal from "../../../../components/DeleteModal";
import { useUpdateSessionMutation } from "../../../../app/api/sessionsApi";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { toast } from "react-toastify";
import { useGetAllTermsQuery } from "../../../../app/api/termsApi";

const SingleSession = ({ session }) => {
  const navigate = useNavigate();
  const [updateSession, { isLoading, isSuccess, error }] =
    useUpdateSessionMutation();
  const [sessionName, setSessionName] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);

  const {
    data: terms,
    isLoading: isTermsLoading,
    error: termsError,
  } = useGetAllTermsQuery();

  useEffect(() => {
    if (error) {
      toast.error(error.data.message);
    }

    if (isSuccess) {
      toast.success("Session Updated Successfully");
      setOpenDialog(false);
    }

    setSessionName(session?.name);
    setStartDate(session?.startDate);
    setEndDate(session?.endDate);
  }, [session, error, isSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSession(session.id, { sessionName, startDate, endDate });
  };

  return (
    <Dialog onOpenChange={() => setOpenDialog(false)}>
      <DialogTrigger>
        <span
          onClick={() => setOpenDialog(true)}
          className="p-2 bg-gray-100 rounded-md hover:bg-gray-300 transition duration-300"
        >
          View
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-[20px]">
            {session.name} Session
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-3">
          <div className="flex flex-col gap-2">
            <label className="text-gray-500 text-sm">Session Name</label>
            <input
              type="text"
              disabled
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="2023/2024"
              className="py-3 bg-[#F9F9F9] outline-none px-3 border-none text-sm"
            />
          </div>

          <div className="flex items-center gap-4 justify-center w-full">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-gray-500 text-sm">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat={"MM/dd/yyyy"}
                timeInputLabel="Time"
                disabled
                wrapperClassName="date-picker"
                placeholderText="Start Date"
                className="py-3 bg-[#F9F9F9] outline-none px-3 border-none text-sm w-full"
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-gray-500 text-sm">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat={"MM/dd/yyyy"}
                timeInputLabel="Time"
                disabled
                wrapperClassName="date-picker"
                placeholderText="End Date"
                className="py-3 bg-[#F9F9F9] outline-none px-3 border-none text-sm w-full"
              />
            </div>
          </div>

          {/* Handle loading and errors */}
          {isTermsLoading && <p>Loading terms...</p>}
          {termsError && <p className="text-red-500">Failed to load terms</p>}

          {!isTermsLoading && !termsError && (
            <div className="flex flex-col gap-4 w-full">
              <h2 className="font-semibold text-[20px]">All Terms</h2>
              <Accordion type="single" collapsible className="w-full">
                {terms?.map((term) => (
                  <AccordionItem key={term.id} value={`term-${term.id}`}>
                    <AccordionTrigger>{term.name}</AccordionTrigger>
                    <AccordionContent className="w-full px-4 py-2">
                      <div className="flex items-center gap-4 justify-center w-full">
                        <div className="flex flex-col gap-2 w-full">
                          <label className="text-gray-500 text-sm">
                            Start Date
                          </label>
                          <input
                            type="text"
                            value={term.startDate}
                            disabled
                            className="py-3 bg-[#F9F9F9] outline-none px-3 border-none text-sm"
                          />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <label className="text-gray-500 text-sm">
                            End Date
                          </label>
                          <input
                            type="text"
                            value={term.endDate}
                            disabled
                            className="py-3 bg-[#F9F9F9] outline-none px-3 border-none text-sm"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* Submit Button */}
          {/* Uncomment this when enabling update functionality */}
          {/* <Button className="bg-[#4a3aff] text-white hover:bg-[#5446f2]">
            {isLoading ? <Loader2 className='animate-spin' /> :"Update Session"}
          </Button> */}

          {/* Delete Session */}
          {/* <div className='flex items-center gap-2 w-full justify-center'>
            <h2>Delete Session</h2>
            <div>
              <DeleteModal id={session.id} type={"sessions"} />
            </div>
          </div> */}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SingleSession;
