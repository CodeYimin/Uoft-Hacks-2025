import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useCallback } from "react";
import Profile from "../components/Profile";
import { useDropzone } from "react-dropzone";
import { Schedule } from "../types";

// import { fetchSchedule } from './CalendarPage.tsx';

// dotenv.config();

export let currSchedule: Schedule = {events: []};

export const LandingPage = ({onSchedule}: {onSchedule: (data: Schedule) => void}) => {
  const { isAuthenticated, isLoading } = useAuth0();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sliderIndex, setSliderIndex] = useState(1);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      console.log("Selected file:", file);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({ onDrop });

  const uploadPDF = async () => {
    if (!selectedFile) {
      console.error("No file selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await uploadDatasetFile(formData);
      console.log("response", response);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     navigate("/login");
  //   }
  // }, [isLoading, isAuthenticated, navigate]);

  const handleSliderChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = Number(event.target.value);
    setSliderIndex(newIndex);

    try {
      // Send slider index to the backend
      await fetch("/api/updateSliderIndex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sliderIndex: newIndex }),
      });
      console.log(`Slider index ${newIndex} sent to backend`);
    } catch (error) {
      console.error("Error updating slider index:", error);
    }
  };

  async function uploadDatasetFile(formData: FormData) {
    try {
      const response = await fetch("/api/uploadFile", {
        method: "POST",
        body: formData,
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
    
      const data = await response.json();
      console.log(`I AM WITHIN THE UPLOAD FILE AND GOT BACK THIS ${data.stringify}`)
      console.log(`I am setting the curr schedule to be ${data}`)
      currSchedule = data
      console.log(11111 + JSON.stringify(data.schedule))
      onSchedule(data.schedule);
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen w-screen bg-gray-100 text-black text-center">Loading...</div>;
  }
  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <div>
        {/* Header */}
        <header className="text-center mb-12 pt-36">
          <h1 className="text-4xl text-black font-bold mb-2">
            MomTellMeTo.study
          </h1>
          <p className="text-gray-600">
          Mom-Level Motivation, Machine-Level Precision
          </p>
        </header>
        </div>
        {/* Event Description */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-md bg-gray-100 p-6">
            <h2 className="flex justify-center text-lg text-black font-bold mb-1">
              What is YOUR perspective?
            </h2>
            
            {/* Perspective Slider */}
            <div className="w-full p-4">
              <div className="flex justify-between text-black">
                <span>Kind</span>
                <span>Neutral</span>
                <span>Fierce</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={sliderIndex}
                onChange={handleSliderChange}
                className="w-full mt-2 appearance-none h-2 bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 slider-thumb selection-transparent"
                step="1"
              />
              <div className="flex justify-between mt-1 text-sm text-black">
                {[...Array(7)].map((_, index) => (
                  <span key={index} className="w-4 text-center">
                    |
                  </span>
                ))}
              </div>
            </div>
          </div>
          </div><div className="flex flex-col items-center w-full p-4">
  {/* Drop Zone */}
  <div
    className="text-black border-2 p-8 w-full max-w-md flex flex-col items-center"
    {...getRootProps()}
  >
    <input {...getInputProps()} />
    {isDragActive ? (
      <div className="flex flex-col items-center text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height="50"
          width="50"
          fill="currentColor"
        >
          <path d="M1 14.5C1 12.1716 2.22429 10.1291 4.06426 8.9812C4.56469 5.044 7.92686 2 12 2C16.0731 2 19.4353 5.044 19.9357 8.9812C21.7757 10.1291 23 12.1716 23 14.5C23 17.9216 20.3562 20.7257 17 20.9811L7 21C3.64378 20.7257 1 17.9216 1 14.5ZM16.8483 18.9868C19.1817 18.8093 21 16.8561 21 14.5C21 12.927 20.1884 11.4962 18.8771 10.6781L18.0714 10.1754L17.9517 9.23338C17.5735 6.25803 15.0288 4 12 4C8.97116 4 6.42647 6.25803 6.0483 9.23338L5.92856 10.1754L5.12288 10.6781C3.81156 11.4962 3 12.927 3 14.5C3 16.8561 4.81833 18.8093 7.1517 18.9868L7.325 19H16.675L16.8483 18.9868ZM13 13V17H11V13H8L12 8L16 13H13Z"></path>
        </svg>
        <p className="text-center font-medium mt-2">Drop your syllabus here</p>
      </div>
    ) : (
      <div className="flex flex-col items-center text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height="32"
          width="32"
          fill="gray"
        >
          <path d="M1 14.5C1 12.1716 2.22429 10.1291 4.06426 8.9812C4.56469 5.044 7.92686 2 12 2C16.0731 2 19.4353 5.044 19.9357 8.9812C21.7757 10.1291 23 12.1716 23 14.5C23 17.9216 20.3562 20.7257 17 20.9811L7 21C3.64378 20.7257 1 17.9216 1 14.5ZM16.8483 18.9868C19.1817 18.8093 21 16.8561 21 14.5C21 12.927 20.1884 11.4962 18.8771 10.6781L18.0714 10.1754L17.9517 9.23338C17.5735 6.25803 15.0288 4 12 4C8.97116 4 6.42647 6.25803 6.0483 9.23338L5.92856 10.1754L5.12288 10.6781C3.81156 11.4962 3 12.927 3 14.5C3 16.8561 4.81833 18.8093 7.1517 18.9868L7.325 19H16.675L16.8483 18.9868ZM13 13V17H11V13H8L12 8L16 13H13Z"></path>
        </svg>
        <p className="text-center font-medium mt-2">Drop syllabus here or click to select file</p>
        <p className="text-gray-500 text-sm mt-1">Supports: PDF, DOCX, TXT, RTF, JSON</p>
      </div>
    )}
  {selectedFile && (
    <span className="uploaded-url">{selectedFile.name}</span>
  )}  
  </div>
  {/* Upload Button */}
  <button
    className={`mt-4 px-6 py-2 rounded ${
      selectedFile
        ? "bg-indigo-500 text-white hover:bg-indigo-600"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
    onClick={uploadPDF}
    disabled={!selectedFile}
  >
    Upload
  </button>
</div>
        <div className="absolute top-2 right-4">
        {isAuthenticated && <Profile />}
        </div>
    </div>
  );
};

export default LandingPage;
