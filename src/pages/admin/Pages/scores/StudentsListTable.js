import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { ScoreInputField } from "../../../../components/fields/scoreInput";

export const StudentsListTable = ({ classResultsData }) => {
  const [studentEditIndex, setStudentEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  if (!classResultsData || classResultsData.length === 0) {
    return <div>No student data available.</div>;
  }

  // Get all subjects with their max assessment counts
  const subjectData = classResultsData.reduce((acc, student) => {
    student.subjects?.forEach((subject) => {
      if (!acc[subject.subjectName]) {
        acc[subject.subjectName] = {
          assessmentCount: subject.assessments.length,
          assessments: subject.assessments
        };
      } else {
        acc[subject.subjectName].assessmentCount = Math.max(
          acc[subject.subjectName].assessmentCount,
          subject.assessments.length
        );
      }
    });
    return acc;
  }, {});

  const uniqueSubjects = Object.keys(subjectData);
  const hasSubjects = uniqueSubjects.length > 0;

  const filteredStudents = classResultsData.filter((student) =>
    student.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full overflow-x-scroll text-[1.4rem] font-inter bg-white py-[4rem] px-[2rem] rounded-3xl">
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student name"
          className="p-2 border rounded-md w-full"
        />
      </div>

      <table className="w-full min-w-[50rem]">
        <thead>
          <tr className="*:text-center *:border-[1px] bg-blue_primary text-left *:p-4 *:font-medium text-white">
            <th className="sticky left-[-2rem] w-[5rem] bg-inherit z-10">S/N</th>
            <th className="sticky left-[3rem] bg-inherit z-10 border-r-[1px] border-r-primary/[.5]">Name</th>
            {hasSubjects ? (
              uniqueSubjects.map((subjectName) => (
                <th
                  key={subjectName}
                  colSpan={subjectData[subjectName].assessmentCount}
                  className="text-center"
                >
                  {subjectName}
                </th>
              ))
            ) : (
              <th className="bg-inherit z-10">No Subjects Available</th>
            )}
          </tr>
          
          {hasSubjects && (
            <tr className="*:border-[1px] bg-gray-500 text-left *:p-4 *:font-medium text-white">
              <th className="sticky left-[-2rem] w-[5rem] bg-inherit z-10"></th>
              <th className="sticky left-[3rem] bg-inherit z-10 border-r-[1px] border-r-primary/[.5]"></th>
              {uniqueSubjects.flatMap((subjectName) =>
                Array.from({ length: subjectData[subjectName].assessmentCount }, (_, i) => (
                  <th
                    key={`${subjectName}-${i}`}
                    className="[writing-mode:vertical-rl] scale-[-1]"
                  >
                    {subjectData[subjectName].assessments[i]?.name || `Assessment ${i + 1}`}
                  </th>
                ))
              )}
            </tr>
          )}
        </thead>
        <tbody>
          {filteredStudents.map((student, studentIndex) => (
            <tr
              key={studentIndex}
              className={`[&>*]:p-4 even:bg-slate-50 ${
                studentIndex === studentEditIndex
                  ? "border-b-blue-500/50 border-l-blue-500/50"
                  : "border-transparent"
              } border-b-[1px] border-l-[1px] border-solid odd:bg-white`}
            >
              <td className="sticky left-[-2rem] w-[5rem] bg-inherit z-10">
                {studentIndex + 1}
              </td>
              <td className="min-w-[40rem] sticky left-[3rem] bg-inherit z-10 border-r-[1px] border-r-primary/[.5]">
                <p className="w-full flex flex-row items-center justify-between text-[1.4rem] bg-inherit z-10">
                  <span className="uppercase">{student.studentName}</span>
                  <button onClick={() => setStudentEditIndex(studentIndex)}>
                    <Icon icon="iconoir:page-edit" fontSize={17} />
                  </button>
                </p>
              </td>
              
              {hasSubjects ? (
                uniqueSubjects.flatMap((subjectName) => {
                  const studentSubject = student.subjects?.find(
                    (s) => s.subjectName === subjectName
                  );
                  return Array.from(
                    { length: subjectData[subjectName].assessmentCount },
                    (_, i) => {
                      const assessment = studentSubject?.assessments?.[i] || { score: "N/A" };
                      return (
                        <td key={`${subjectName}-${i}`} className="p-2 min-w-[5rem]">
                          <ScoreInputField
                            value={assessment.score === "N/A" ? "" : assessment.score}
                            name={assessment.name}
                            disabled={studentEditIndex !== studentIndex}
                            handleChange={(e) => {
                              // Handle score change
                            }}
                          />
                        </td>
                      );
                    }
                  );
                })
              ) : (
                <td colSpan="1" className="text-center p-2">
                  No subjects available
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};