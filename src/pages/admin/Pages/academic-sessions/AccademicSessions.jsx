import { Button } from "@mui/material";
import { ArrowRightSquare, Loader2 } from "lucide-react";
import React, { useState } from "react";
import AddSession from "./AddSession";
import { useGetAllSessionsQuery } from "../../../../app/api/sessionsApi";
import SingleSession from "./SingleSession";
import CreateTerms from "./CreateTerms";
import DeleteModal from "../../../../components/DeleteModal";

const AccademicSessions = () => {
  const { data, isLoading } = useGetAllSessionsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="animate-spin w-[60px] h-[60px]" />
      </div>
    );
  }

  return (
    <section className="bg-white w-full h-auto md:h-screen">
      <div className="max-w-7xl mx-auto p-4 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <img src="/newFolder.png" alt="img" className="w-[90px]" />
            <div className="flex flex-col">
              <h1 className="text-[20px] sm:text-[32px]">
                All Academic Sessions,
              </h1>
              <p className="text-sm">
                Total Sessions: {data ? data.length : 0}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AddSession />
            <CreateTerms />
          </div>
        </div>

        {!data || data.length === 0 ? (
          <div className="flex items-center justify-center w-full flex-col gap-2 mt-12">
            <img src="/paper.png" alt="img" className="w-[300px]" />
            <p className="text-black text-[18px] font-semibold tracking-wide">
              No academic session created!
            </p>
          </div>
        ) : (
          <div className="mt-4 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((session) => (
              <div key={session.id} className="bg-white shadow-md p-4">
              <h2 className="text-[18px]">{session.name}</h2>
            
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-sm">
                  Start Date: {new Date(session.startDate).toISOString().split("T")[0]}
                </p>
                <p className="text-sm">
                  End Date: {new Date(session.endDate).toISOString().split("T")[0]}
                </p>
              </div>
            
              {/* Display Terms */}
              {session.terms && session.terms.length > 0 ? (
                <div className="mt-2">
                  <h3 className="text-sm font-semibold">Registered Terms:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {session.terms.map((term, index) => (
                      <li key={index}>{term.name || term}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No terms registered.</p>
              )}
            
              <div className="flex justify-between mt-4">
                <div>
                  <DeleteModal type={"sessions"} id={session.id} />
                </div>
                <div>
                  <SingleSession session={session} />
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AccademicSessions;
