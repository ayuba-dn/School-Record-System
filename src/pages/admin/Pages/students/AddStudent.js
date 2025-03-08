import { Button } from "../../../../components/ui/button";
import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useCreateStudentMutation } from "../../../../app/api/studentsApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader, Loader2 } from "lucide-react";
import { useGetAllClassesQuery } from "../../../../app/api/classApi";
import DatePicker from "react-datepicker";
import ToastMessage, {
  showToast,
} from "../../../../components/ToastMessages/Notification";
import { statesWithLgas } from "./statesWithLgas";

// Example states and LGAs data (can be replaced with an API call)

const AddStudent = () => {
  const navigate = useNavigate();
  const { data, isLoading: isClassLoading } = useGetAllClassesQuery();
  const [createStudent, { isLoading, isSuccess, error }] =
    useCreateStudentMutation();
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [studentClass, setStudentClass] = useState();
  const [age, setAge] = useState();
  const [lgas, setLgas] = useState([]); // Local Governments based on selected state
  const [profilePicture, setProfilePicture] = useState(null);
  const [medicalReport, setMedicalReport] = useState(null); // New state for medical report
  const [birthCertificate, setBirthCertificate] = useState(null); // New state for birth certificate

  // Handle state selection to update LGAs
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setStudentDetails((prevValue) => ({
      ...prevValue,
      stateOfOrigin: selectedState,
      lgaOfOrigin: "", // Reset LGA when state changes
    }));
    setLgas(statesWithLgas[selectedState] || []);
  };

  useEffect(() => {
    if (error) {
      showToast("error", "An error occurred. Please try again");
      console.log(error.data);
    }

    if (isSuccess) {
      showToast("success", "Student Created Successfully");
      navigate("/admin/students");
    }
  }, [error, isSuccess]);

  const [studentDetails, setStudentDetails] = useState({
    studentId: "",
    firstName: "",
    middleName: "",
    otherNames: "",
    parentsNumber: "",
    gender: "",
    stateOfOrigin: "",
    lgaOfOrigin: "",
    parentsAddress: "",
    medicalReport: "",
    birthCertificate: "",
    profilePicture: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setStudentDetails((preValue) => {
      return { ...preValue, [name]: value };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file); // Save the uploaded file to state
  };

  const handleMedicalReportChange = (e) => {
    const file = e.target.files[0];
    setMedicalReport(file); // Save the medical report file to state
  };

  const handleBirthCertificateChange = (e) => {
    const file = e.target.files[0];
    setBirthCertificate(file); // Save the birth certificate file to state
  };

  const formatDateOfBirth = dateOfBirth.toISOString().split("T")[0];
  const numAge = Number(age);

  const handleClassChange = (e) => {
    const value = parseInt(e.target.value, 10);
    console.log("Selected Class ID:", value); // Check the value of class ID
    setStudentClass(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", {
      dateOfBirth: formatDateOfBirth,
      studentClass: studentClass,
      age: numAge,
      profilePicture,
      medicalReport,
      birthCertificate,
      ...studentDetails,
    });

    const formData = new FormData(); // Create a FormData object to send data and file
    formData.append("dateOfBirth", formatDateOfBirth);
    formData.append("studentClass", studentClass);
    formData.append("age", numAge);
    formData.append("profilePicture", profilePicture); // Append the uploaded picture file
    formData.append("medicalReport", medicalReport); // Append medical report file
    formData.append("birthCertificate", birthCertificate); // Append birth certificate file

    Object.keys(studentDetails).forEach((key) => {
      formData.append(key, studentDetails[key]);
    });

    createStudent(formData); // Send form data including file
  };

  // console.log(studentDetails)

  return (
    <section className=" max-w-7xl mx-auto">
      <div className="bg-white  min-h-screen px-4 sm:px-10 py-6 flex flex-col gap-6">
        {/* Notification Message */}
        <ToastMessage />
        {/* heading */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKEAAACUCAMAAADMOLmaAAAAMFBMVEXk5ueutLeqsbTP09Xn6erh4+THy83Bxsi6v8LV2NqyuLu2u77c3+DY29zLz9GorrLvMsi2AAADuUlEQVR4nO2b2Y7rIAxAWUxYk/z/3w7JbaetOm3AJDbS5Wg029ORCcbBrhCDwWAwGAwGg8FgMBgM/m8AhDHb1/Zbd2SnWU/WbVg7+dSdpLdBSqWU3L/nH8Em0Y0kpCWsm9sLag2L6cIRjJVvejfJMPEvNojpPXxPjkozrzXM8Yvf7uhYlxr0gd++1J5R0R4LZtaFyw/KBHMYJ54oGlcomBUthyKUC24LTa9YvMQ3NLViyS5+ZSZWNJV++aCmFYRYbUi7W2CpXeONmdAwBYSgjHRBhAkTQrkSHn8rRlBKR+WHDKGkS4oG9RTKbTvTCIJGCmZFQ6NYed49G9IUOfXHyQOahDMjd/IexEQgiN/JGxS7GbA7eY8hxYMILSEkSdqpyTBen2/ANxmG67dKfXH9yvUlGCxNgspfb9iUbHIFRmDYfQzxpzKVYf+r3P9OwVeHOwTZpvuM3f+pJ0Rb5UBg2FZ9UVyN9F/BCt/7W0DTm1SgeaXv/m20oUJcSRa55VaE6moJX96QXbcb5G6ORH7oICrCpgrulpgo1eygzhWC0vAZhCDR9eaduT6IRLebd6o7Koq8D17VGuVpMcPRhMOLIEuD2ZQrKsfSpAdRqki9jR8UzhHwLPGNkuNPsY2KbIAPRxNBMTEPLRn7rdBR68Q/nQbJfZxMk7wjVXcAvFV/OK7BUk9ffATE2wSiUk6bfkYkxT5l6ifnYgwxOmcnD/yTh2/APqlrTDKiO72bkHmQ/9j+24NntjDJ68VaF0PYp3SVDGFf6UXPhtkSIGn7EHvNNP8miqNbZp7x7PzIzYuT32Zgf5P2GiZPPfoMIsdO/pUEP1iqHEtDFsqcV1yF3V0yn9AkGRLEPIVqvV9L5y92BJjjp0O40DFcOaANRoeG+9e7pJouqscAdN3r3WfHcE1J5mve7Q45/UMNkNpaom+s8dxbHFiOin0E7rwtAym2b5B3ts9dnCSomxLMN0d7ThhPfgJfFE94EYSK6X+MYvOVWH4ErxTcaOsPNLa7i1hb7kxgvtxPNrUIwFMINtx+AuKuGseKUwRc0wSFQm2XiivWdjAD+ZU36c1Uny64z3fgqW/sJlI/WZ9zqNdY1k7kg76i3DqgqqOBnhNooSblUG+TGxWbhSWEOSkWB5EphBVN/La5+gZKy1mKovADhaUiOC7B0gnPVP+Jy7Moez9lXOTSLmrbwHUjRTHkewxzSiw6nDlDWDTyjh07O4WilyrGjSKLMiIsq2Kk4OCDWbNS8BzuHUM2SgQHg8HgCn4AIlEx+zn49rYAAAAASUVORK5CYII="
              }
              alt="Profile"
              className="w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] rounded-full"
            />

            <div className="flex flex-col gap-1">
              <h2 className="text-sm sm:text-[16px]">Profile Picture</h2>
              <p className="text-gray-500 text-sm">PNG, JPEG, e.t.c</p>
            </div>
          </div>

          <div>
            <Button
              variant="outline"
              onClick={() => document.getElementById("picture").click()}
            >
              Upload Image
              <AiOutlineCloudUpload className="ml-2" />
            </Button>
            <input
              id="picture"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* body */}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <h2 className="text-[18px]">Add Student Information</h2>

          <div className="w-full border border-gray-200 p-4 flex flex-col gap-4 ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={studentDetails.firstName}
                  onChange={handleChange}
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="middleName" className="text-sm">
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={studentDetails.middleName}
                  onChange={handleChange}
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="otherName" className="text-sm">
                  Other Name
                </label>
                <input
                  type="text"
                  id="otherName"
                  name="otherNames"
                  value={studentDetails.otherNames}
                  onChange={handleChange}
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
              <div className="flex flex-col gap-2">
                <label htmlFor="age" className="text-sm">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="studentClass" className="text-sm">
                  Class
                </label>

                <select
                  name="studentClass"
                  onChange={(e) =>
                    setStudentClass(parseInt(e.target.value, 10))
                  }
                >
                  {isClassLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <option>Select Class</option>
                      {data.map((cls) => (
                        <option value={cls.id} key={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="parentsNumber" className="text-sm">
                  Parents Number
                </label>
                <input
                  type="text"
                  id="parentsNumber"
                  name="parentsNumber"
                  value={studentDetails.parentsNumber}
                  onChange={handleChange}
                  placeholder="+234"
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* second row */}
            <div className="grid   gap-6 grid-cols-12 ">
              <div className="flex flex-col gap-2 col-span-6">
                <label htmlFor="dateOfBirth" className="text-sm">
                  Date of Birth
                </label>
                <DatePicker
                  selected={dateOfBirth}
                  onChange={(date) => setDateOfBirth(date)}
                  dateFormat={"MM/dd/yyyy"}
                  timeInputLabel="Time"
                  wrapperClassName="date-picker"
                  placeholderText="Start Date"
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-2 col-span-6">
                <label htmlFor="gender" className="text-sm">
                  Gender
                </label>
                <select
                  name="gender"
                  value={studentDetails.gender}
                  onChange={handleChange}
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                >
                  <option></option>
                  <option value={"male"}>male</option>
                  <option value={"female"}>female</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 col-span-6">
                <label htmlFor="stateOfOrigin" className="text-sm">
                  State of Origin
                </label>
                <select
                  name="stateOfOrigin"
                  value={studentDetails.stateOfOrigin}
                  onChange={handleStateChange}
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                >
                  <option value="">Select State</option>
                  {Object.keys(statesWithLgas).map((state) => (
                    <option value={state} key={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 col-span-6">
                <label htmlFor="lgaOfOrigin" className="text-sm">
                  Local Government
                </label>
                <select
                  name="lgaOfOrigin"
                  value={studentDetails.lgaOfOrigin}
                  onChange={handleChange}
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                  disabled={!lgas.length}
                >
                  <option value="">Select LGA</option>
                  {lgas.map((lga) => (
                    <option value={lga} key={lga}>
                      {lga}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 col-span-6">
                <label htmlFor="parentsAddress" className="text-sm">
                  Parents Address
                </label>
                <input
                  type="text"
                  id="parentsAddress"
                  name="parentsAddress"
                  value={studentDetails.parentsAddress}
                  onChange={handleChange}
                  placeholder=""
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-2 col-span-6">
                <label htmlFor="password" className="text-sm">
                  Default Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={studentDetails.password}
                  onChange={handleChange}
                  placeholder=""
                  className="px-4 py-2 outline-none border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="flex  gap-6 justify-between items-center mt-6">
            <div className="w-[400px] border border-gray-300 p-6 rounded-lg flex justify-center items-center flex-col gap-2">
              {/* Hidden file input for Birth Certificate */}
              <input
                type="file"
                id="birthCertificate"
                className="hidden"
                onChange={handleBirthCertificateChange}
              />

              {/* Clickable upload icon for Birth Certificate */}
              <AiOutlineCloudUpload
                size={30}
                className="cursor-pointer"
                onClick={() =>
                  document.getElementById("birthCertificate").click()
                }
              />
              <p className="text-sm">Upload Birth Certificate</p>

              {/* Display the file name after selection */}
              {birthCertificate && (
                <p className="text-sm mt-2 text-green-600">
                  {birthCertificate.name}
                </p>
              )}
            </div>

            <div className="w-[400px] border border-gray-300 p-6 rounded-lg flex justify-center items-center flex-col gap-2">
              {/* Hidden file input for Medical Report */}
              <input
                type="file"
                id="medicalReport"
                className="hidden"
                onChange={handleMedicalReportChange}
              />

              {/* Clickable upload icon for Medical Report */}
              <AiOutlineCloudUpload
                size={30}
                className="cursor-pointer"
                onClick={() => document.getElementById("medicalReport").click()}
              />
              <p className="text-sm">Upload Medical Report</p>

              {/* Display the file name after selection */}
              {medicalReport && (
                <p className="text-sm mt-2 text-green-600">
                  {medicalReport.name}
                </p>
              )}
            </div>
          </div>

          <Button className="mt-4 bg-[#4a3aff] hover:bg-[#5144e3]">
            {isLoading ? <Loader className="animate-spin" /> : "Add Student"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default AddStudent;
