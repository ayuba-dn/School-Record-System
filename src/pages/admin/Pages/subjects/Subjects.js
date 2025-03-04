import { useState } from "react";
import SubjectTable from "../../../../components/admin/subjects/SubjectTable";
import { Logo } from "../../../../components/images";
import AddSubject from "./AddSubject";
import {
  useGetAllSubjectsQuery,
  useDeleteSubjectMutation,
} from "../../../../app/api/allSubjectApi";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Subjects = () => {
  const { data, isLoading, error, refetch } = useGetAllSubjectsQuery();
  const [deleteSubject] = useDeleteSubjectMutation();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (error) {
      toast.error(error.data.message);
    }
  }, [error]);

  const handleDelete = async (subjectId) => {
    setDeletingId(subjectId);
    try {
      await deleteSubject(subjectId).unwrap();
      toast.success("Subject deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Failed to delete subject");
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "avatar",
      headerName: "Avatar",
      width: 130,
      renderCell: () => (
        <div className="h-[30px] w-[30px] rounded-full">
          <Logo className="w-[10px] h-[10px]" />
        </div>
      ),
    },
    { field: "subjectName", headerName: "Subject Name", width: 170 },
    { field: "addedBy", headerName: "Added By", width: 150 },
    {
      field: "class",
      headerName: "Class",
      width: 150,
      renderCell: (params) => <span>{params.row.class?.name || "N/A"}</span>,
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleDelete(params.row.id)}
            disabled={deletingId === params.row.id}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-red-300"
          >
            {deletingId === params.row.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="animate-spin w-[60px] h-[60px]" />
      </div>
    );
  }

  return (
    <section className="py-4 px-2 sm:p-8 w-full h-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-[32px]">All Subjects</h1>
        <div>
          <AddSubject />
        </div>
      </div>

      <div className="p-2 w-full">
        <SubjectTable columns={columns} row={data} showDelete={true} />
      </div>
    </section>
  );
};

export default Subjects;
