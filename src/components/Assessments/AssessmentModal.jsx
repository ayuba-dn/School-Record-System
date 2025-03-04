import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetAllClassesQuery } from "../../app/api/classApi";
import {
  useGetAllSessionsQuery,
  useGetSessionTermsQuery,
} from "../../app/api/sessionsApi"; // Import session and terms query
import { useGetAllSubjectsQuery } from "../../app/api/allSubjectApi";
import { useCreateAssessmentMutation } from "../../app/api/assessmentsApi";
import "./AssessmentModal.css";
import { showToast } from "../ToastMessages/Notification";

const AssessmentsModal = () => {
  const { subjectId: routeSubjectId, classId } = useParams();
  console.log("routeSubjectId", routeSubjectId);
  console.log("classId", classId);
  const subjectId = routeSubjectId ? parseInt(routeSubjectId) : null;

  const {
    data: classesData,
    isLoading: classesLoading,
    error: classesError,
  } = useGetAllClassesQuery();
  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useGetAllSessionsQuery();
  const {
    data: subjectsData,
    isLoading: subjectsLoading,
    error: subjectsError,
  } = useGetAllSubjectsQuery();
  const [selectedSession, setSelectedSession] = useState(""); // Track selected session
  const {
    data: sessionTermsData,
    isLoading: termsLoading,
    error: termsError,
  } = useGetSessionTermsQuery(selectedSession, {
    skip: !selectedSession, // Skip fetching terms if no session is selected
  });

  const [assessment, setAssessment] = useState({
    class: "",
    session: "",
    subject: subjectId ? subjectId : "",
    term: "",
    weight: "",
    name: "",
  });

  const [createAssessment, { isLoading: isCreating }] =
    useCreateAssessmentMutation();

  // Preselect the class based on the preselected subject
  useEffect(() => {
    if (subjectId && subjectsData) {
      const selectedSubject = subjectsData.find(
        (subject) => subject.id === subjectId,
      );
      if (selectedSubject && selectedSubject.class) {
        setAssessment((prev) => ({
          ...prev,
          class: selectedSubject.class.id,
        }));
      }
    }
  }, [subjectId, subjectsData]);

  // Preselect the last session when sessionsData is available
  useEffect(() => {
    if (sessionsData && sessionsData.length > 0) {
      const lastSession = sessionsData[sessionsData.length - 1].id;
      setAssessment((prev) => ({ ...prev, session: lastSession }));
      setSelectedSession(lastSession); // Update selected session for terms
    }
  }, [sessionsData]);

  // Handle session change and update terms based on selected session
  const handleSessionChange = (e) => {
    const selectedSessionId = e.target.value;
    setSelectedSession(selectedSessionId); // Update selected session
    setAssessment((prev) => ({
      ...prev,
      session: selectedSessionId,
      term: "",
    })); // Clear term when session changes
  };
// Select last term when terms are available
useEffect(() => {
  if (sessionTermsData?.length > 0) {
    const lastTerm = sessionTermsData[sessionTermsData.length - 1].id;
    setAssessment((prev) => ({ ...prev, term: lastTerm }));
  }
}, [sessionTermsData]);

const handleChange = (e) => {
  setAssessment({ ...assessment, [e.target.name]: e.target.value });
};

const handleSubmit = async () => {
  const assessmentData = {
    name: assessment.name,
    subjectId: parseInt(assessment.subject),
    classId: parseInt(assessment.class),
    sessionId: parseInt(assessment.session),
    termId: parseInt(assessment.term),
    weight: parseInt(assessment.weight),
  };

  try {
    await createAssessment(assessmentData).unwrap();
    showToast("success", "Success", "Assessment created successfully");
  } catch (error) {
    showToast("error", "Error", "Error creating assessment");
  }
};

// Handle API errors
useEffect(() => {
  const errors = [
    { condition: classesError, message: "Error fetching classes" },
    { condition: sessionsError, message: "Error fetching sessions" },
    { condition: subjectsError, message: "Error fetching subjects" },
    { condition: termsError, message: "Error fetching terms" },
  ];

  errors.forEach(({ condition, message }) => {
    if (condition) showToast("error", "Error", message);
  });

}, [classesError, sessionsError, subjectsError, termsError]);

const filteredSubjects = subjectId
  ? subjectsData?.filter((subject) => subject.id === subjectId)
  : subjectsData;

  return (
    <Dialog>
      <DialogTrigger className="text-[#4A3AFF]">Add Assessment</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] flex justify-center flex-col">
        <DialogHeader>
          <DialogTitle className="text-center text-[24px]">
            Add Assessment
          </DialogTitle>
          <DialogDescription className="text-center">
            Fill in the details for the new assessment.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <div className="w-full">
            <label className="block text-gray-700">Assessment Name</label>
            <input
              type="text"
              name="name"
              value={assessment.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter assessment name"
            />
          </div>

          <div className="w-full">
            <label className="block text-gray-700">Weight</label>
            <input
              type="number"
              name="weight"
              value={assessment.weight}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter weight"
            />
          </div>

          <div className="w-full">
            <label className="block text-gray-700">Subject</label>
            <select
              name="subject"
              value={assessment.subject}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Subject</option>
              {subjectsLoading ? (
                <option>Loading...</option>
              ) : (
                filteredSubjects?.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subjectName}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-gray-700">Class</label>
            <select
              name="class"
              value={assessment.class}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Class</option>
              {classesLoading ? (
                <option>Loading...</option>
              ) : (
                classesData?.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-gray-700">Session</label>
            <select
              name="session"
              value={assessment.session}
              onChange={handleSessionChange} // Change session and update terms
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Session</option>
              {sessionsLoading ? (
                <option>Loading...</option>
              ) : (
                sessionsData?.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-gray-700">Term</label>
            <select
              name="term"
              value={assessment.term}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              disabled={!selectedSession || termsLoading} // Disable until session is selected
            >
              <option value="">Select Term</option>
              {termsLoading ? (
                <option>Loading...</option>
              ) : (
                sessionTermsData?.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-[#4A3AFF] text-white">
            {isCreating ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Save Assessment"
            )}
          </Button>
          <DialogTrigger asChild>
            <Button className="bg-gray-500 text-white">Close</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentsModal;
