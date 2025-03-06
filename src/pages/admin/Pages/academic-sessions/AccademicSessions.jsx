import { Button } from "@mui/material";
import { ArrowRightSquare, Loader2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import AddSession from "./AddSession";
import CreateTerms from "./CreateTerms";
import { useGetAllSessionsQuery } from "../../../../app/api/sessionsApi";
import SingleSession from "./SingleSession";
import DeleteModal from "../../../../components/DeleteModal";

const AcademicSessions = () => {
  const { data, isLoading, error } = useGetAllSessionsQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="animate-spin w-[60px] h-[60px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <p className="text-red-500 text-lg">Error loading academic sessions</p>
      </div>
    );
  }

  return (
    <section className="bg-white w-full h-auto md:h-screen">
      <div className="max-w-7xl mx-auto p-4 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <img
              src="/newFolder.png"
              alt="Academic sessions icon"
              className="w-[90px]"
            />
            <div className="flex flex-col">
              <h1 className="text-[20px] sm:text-[32px]">
                All Academic Sessions
              </h1>
              <p className="text-sm">Total Sessions: {data?.length ?? 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AddSession />
            <CreateTerms />
          </div>
        </div>

        {data?.length === 0 ? (
          <div className="flex items-center justify-center w-full flex-col gap-2 mt-12">
            <img
              src="/paper.png"
              alt="No sessions illustration"
              className="w-[300px]"
            />
            <p className="text-black text-[18px] font-semibold tracking-wide">
              No academic session created!
            </p>
          </div>
        ) : (
          <div className="mt-4 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((session) => (
              <div
                key={session.id}
                className="bg-white shadow-md p-4 rounded-lg"
              >
                <div className="border-b pb-2 mb-2">
                  <h2 className="text-[18px] font-semibold">{session.name}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(session.startDate).toLocaleDateString()} -{" "}
                    {new Date(session.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium mb-2">
                    Terms ({session.terms?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {session.terms?.length > 0 ? (
                      session.terms.map((term) => (
                        <div
                          key={term.id}
                          className="bg-gray-50 p-2 rounded-md"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium">{term.name}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(term.startDate).toLocaleDateString()}{" "}
                                - {new Date(term.endDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                term.isCurrent
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {term.isCurrent ? "Current" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No terms created</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t pt-2">
                  <div className="flex gap-2">
                    <DeleteModal type="sessions" id={session.id} />
                    <SingleSession session={session} />
                  </div>
                  {/* <div className="flex gap-2">
                    <CreateTerms sessionId={session.id} />
                    <Button
                      size="small"
                      endIcon={<ArrowRightSquare size={16} />}
                      onClick={() => navigate(`/sessions/${session.id}/terms`)}
                    >
                      Manage
                    </Button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AcademicSessions;
