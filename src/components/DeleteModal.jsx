import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { MdDeleteForever } from "react-icons/md";
import { Button } from "./ui/button";
import { useDeleteClassesMutation } from "../app/api/classApi";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useDeleteSubjectMutation } from "../app/api/allSubjectApi";
import { useDeleteSessionMutation } from "../app/api/sessionsApi";
import { useDeleteTeacherMutation } from "../app/api/teachersApi";
import { useDeleteStudentMutation } from "../app/api/studentsApi";
import { useDeleteAssessmentMutation } from "../app/api/assessmentsApi";
import { showToast } from "./ToastMessages/Notification";

const DeleteModal = ({ id, type }) => {
  const [deleteClasses, { isLoading, error, isSuccess }] =
    useDeleteClassesMutation();
  const [
    deleteTeacher,
    {
      isLoading: isTeacherLoading,
      error: isTeacherError,
      isSuccess: isTeacherSuccess,
    },
  ] = useDeleteTeacherMutation();
  const [
    deleteSubject,
    {
      isLoading: isSubjectLoading,
      error: subjectError,
      isSuccess: isSubjectSuccess,
    },
  ] = useDeleteSubjectMutation();
  const [
    deleteSession,
    {
      isLoading: isSessionLoading,
      error: sessionError,
      isSuccess: isSessionSuccess,
    },
  ] = useDeleteSessionMutation();
  const [
    deleteStudent,
    {
      isLoading: isStudentLoading,
      error: studentError,
      isSuccess: isStudentSuccess,
    },
  ] = useDeleteStudentMutation();
  const [
    deleteAssessment,
    {
      isLoading: isAssessmentsLoading,
      error: assessmentsError,
      isSuccess: isAssessmentsSuccess,
    },
  ] = useDeleteAssessmentMutation();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // 🔹 Handle Errors
    const errors = [
      { condition: error, message: error?.data?.message || "An error occurred" },
      { condition: subjectError, message: subjectError?.data?.message || "An error occurred" },
      { condition: sessionError, message: sessionError?.data?.message || "An error occurred" },
      { condition: isTeacherError, message: sessionError?.data?.message || "An error occurred" },
      { condition: studentError, message: studentError?.data?.message || "An error occurred" },
      { condition: assessmentsError, message: assessmentsError?.data?.message || "An error occurred" },
    ];
  
    errors.forEach(({ condition, message }) => {
      if (condition) showToast("error", "Error", message);
    });
  
    // 🔹 Handle Success Messages
    const successMessages = [
      { condition: isSuccess, message: "Class Deleted Successfully" },
      { condition: isSubjectSuccess, message: "Subject Deleted Successfully" },
      { condition: isSessionSuccess, message: "Session Deleted Successfully" },
      { condition: isTeacherSuccess, message: "Teacher Deleted Successfully" },
      { condition: isStudentSuccess, message: "Student Deleted Successfully" },
      { condition: isAssessmentsSuccess, message: "Assessment Deleted Successfully" },
    ];
  
    successMessages.forEach(({ condition, message }) => {
      if (condition) {
        showToast("success", "Success", message);
        setOpenDialog(false);
      }
    });
  
  }, [
    error, subjectError, sessionError, studentError, isTeacherError, assessmentsError,
    isSuccess, isSubjectSuccess, isSessionSuccess, isTeacherSuccess, isStudentSuccess, isAssessmentsSuccess,
  ]);
  

  const handleDeleteClass = () => {
    deleteClasses(id);
  };

  const handleDeleteSubject = () => {
    deleteSubject(id);
  };
  const handleDeleteSession = () => {
    deleteSession(id);
  };
  const handleDeleteTeacher = () => {
    deleteTeacher(id);
  };
  const handleDeleteStudent = () => {
    deleteStudent(id);
  };
  const handleDeleteAssessment = () => {
    deleteAssessment(id);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <MdDeleteForever size={24} className="text-red-600" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex justify-center flex-col">
        <DialogHeader>
          <DialogTitle className="text-center text-[20px]">
            Are You sure you want to delete?
          </DialogTitle>
          <DialogDescription className="text-center">
            By deleting you are permanently removing
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center flex-col justify-center">
          {type === "class" ? (
            <Button
              onClick={handleDeleteClass}
              className="bg-[#e90404] hover:bg-[rgb(233,4,4)]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Delete Class"
              )}
            </Button>
          ) : type === "students" ? (
            <Button className="bg-[#e90404] hover:bg-[rgb(233,4,4)]">
              Delete Student
            </Button>
          ) : type === "subjects" ? (
            <Button
              onClick={handleDeleteSubject}
              className="bg-[#e90404] hover:bg-[rgb(233,4,4)]"
            >
              {isSubjectLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Delete Subject"
              )}
            </Button>
          ) : type === "sessions" ? (
            <Button
              onClick={handleDeleteSession}
              className="bg-[#e90404] hover:bg-[rgb(233,4,4)]"
            >
              {isSessionLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Delete Session"
              )}
            </Button>
          ) : type === "teacher" ? (
            <Button
              onClick={handleDeleteTeacher}
              className="bg-[#e90404] hover:bg-[rgb(233,4,4)]"
            >
              {isTeacherLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Delete Teacher"
              )}
            </Button>
          ) : type === "student" ? (
            <Button
              onClick={handleDeleteStudent}
              className="bg-[#e90404] hover:bg-[rgb(233,4,4)]"
            >
              {isStudentLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Delete Student"
              )}
            </Button>
          ) : type === "assessment" ? (
            <Button
              onClick={handleDeleteAssessment}
              className="bg-[#e90404] hover:bg-[rgb(233,4,4)]"
            >
              {isAssessmentsLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Delete Assessment"
              )}
            </Button>
          ) : (
            ""
          )}
        </div>
        <DialogFooter>
          {/* <Button type="submit">Save changes</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
