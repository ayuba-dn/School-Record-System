import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import {
  useCreateTermMutation,
  useGetAllSessionsQuery,
  useGetSessionTermsQuery, // Updated hook
} from "../../../../app/api/sessionsApi";

const CreateTerms = () => {
  const navigate = useNavigate();
  const [createTerm, { isLoading, isSuccess, error }] = useCreateTermMutation();
  const { data: sessions, isLoading: isSessionLoading } =
    useGetAllSessionsQuery();
  const [termName, setTermName] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);

  // Use the correct hook: useGetSessionTermsQuery
  const { data: terms, refetch: refetchTerms } = useGetSessionTermsQuery(
    sessionId,
    {
      skip: !sessionId, // Skip the query if no sessionId is selected
    },
  );

  useEffect(() => {
    if (error) {
      toast.error(error.data.message);
    }
    if (isSuccess) {
      toast.success("Term Created Successfully");
      setOpenDialog(false);
      setTermName("");
      setSessionId("");
      refetchTerms(); // Refetch terms after creating a new one
    }
  }, [error, isSuccess, refetchTerms]);

  const formatStartDate = startDate.toISOString().split("T")[0];
  const formatEndDate = endDate.toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();

    createTerm({
      name: termName,
      startDate: formatStartDate,
      endDate: formatEndDate,
      sessionId: sessionId,
    });
  };

  return (
    <Dialog onOpenChange={() => setOpenDialog(false)}>
      <DialogTrigger>
        <span
          onClick={() => setOpenDialog(true)}
          className="text-sm sm:text-[16px] h-10 px-4 py-4 rounded-lg bg-[#4a3aff] text-white hover:bg-[#5446f2] flex items-center gap-2 ]"
        >
          <Plus />
          Create Term
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold">Create A Term</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-3">
          <div className="flex flex-col gap-2">
            <label className="text-gray-500 text-sm">Term Name</label>
            <input
              type="text"
              value={termName}
              onChange={(e) => setTermName(e.target.value)}
              placeholder="First Term"
              className="py-3 bg-[#F9F9F9] outline-none px-3 border-none text-sm"
            />
          </div>

          <div className="flex items-center gap-4 justify-center w-full ">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-gray-500 text-sm">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat={"MM/dd/yyyy"}
                timeInputLabel="Time"
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
                wrapperClassName="date-picker"
                placeholderText="End Date"
                className="py-3 bg-[#F9F9F9] outline-none px-3 border-none text-sm w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-500 text-sm">Select Session</label>
            <select
              name="sessionId"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="text-sm text-gray-600 px-4 py-2 outline-none border border-gray-300 rounded-lg"
            >
              <option value="">Select Session For Term</option>
              {sessions?.map((session) => (
                <option value={session.id} key={session.id}>
                  {session.name}
                </option>
              ))}
            </select>
          </div>

          <Button className="bg-[#4a3aff] text-white hover:bg-[#5446f2]">
            {isLoading ? <Loader2 className="animate-spin" /> : "Create Term"}
          </Button>
        </form>

        {/* Display terms for the selected session */}
        {sessionId && (
          <div className="mt-6">
            <h3 className="font-semibold">Terms for Selected Session</h3>
            <ul className="mt-2">
              {terms?.map((term) => (
                <li key={term.id} className="text-sm text-gray-600">
                  {term.name} - {term.startDate} to {term.endDate}
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateTerms;
