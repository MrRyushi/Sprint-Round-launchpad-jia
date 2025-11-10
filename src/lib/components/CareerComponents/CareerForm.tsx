"use client";

import { useEffect, useRef, useState } from "react";
import InterviewQuestionGeneratorV2 from "./InterviewQuestionGeneratorV2";
import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import philippineCitiesAndProvinces from "../../../../public/philippines-locations.json";
import { candidateActionToast, errorToast } from "@/lib/Utils";
import { useAppContext } from "@/lib/context/AppContext";
import axios from "axios";
import CareerActionModal from "./CareerActionModal";
import FullScreenLoadingAnimation from "./FullScreenLoadingAnimation";
import { Steps } from "antd";
import ReviewCareer from "./ReviewCareer";
import CareerDetails from "./CareerDetails";
import CVReview from "./CVReview";
import AiInterview from "./AiInterview";
import Tips from "./Tips";
// Setting List icons

const formSteps = [
  {
    title: "Career Details & Team Access",
  },
  {
    title: "CV Review & Pre-Screening",
  },
  {
    title: "AI Interview Setup",
  },
  {
    title: "Review Career",
  },
];

export default function CareerForm({
  career,
  formType,
  setShowEditModal,
}: {
  career?: any;
  formType: string;
  setShowEditModal?: (show: boolean) => void;
}) {
  const { user, orgID } = useAppContext();
  const [current, setCurrent] = useState(0);
  const [jobTitle, setJobTitle] = useState(career?.jobTitle || "");
  const [description, setDescription] = useState(career?.description || "");
  const [secretPrompt, setSecretPrompt] = useState("");
  const [aiSecretPrompt, setAiSecretPrompt] = useState("");
  const [preScreeningQuestions, setPreScreeningQuestions] = useState([]);
  const [workSetup, setWorkSetup] = useState(career?.workSetup || "");
  const [workSetupRemarks, setWorkSetupRemarks] = useState(
    career?.workSetupRemarks || ""
  );
  const [screeningSetting, setScreeningSetting] = useState(
    career?.screeningSetting || "Good Fit and above"
  );
  const [aiScreeningSetting, setAIScreeningSetting] = useState(
    career?.aiScreeningSetting || "Good Fit and above"
  );
  const [employmentType, setEmploymentType] = useState(
    career?.employmentType || "Full-Time"
  );
  const [requireVideo, setRequireVideo] = useState(
    career?.requireVideo || true
  );
  const [salaryNegotiable, setSalaryNegotiable] = useState(
    career?.salaryNegotiable || true
  );
  const [minimumSalary, setMinimumSalary] = useState(
    career?.minimumSalary || ""
  );
  const [maximumSalary, setMaximumSalary] = useState(
    career?.maximumSalary || ""
  );
  const [questions, setQuestions] = useState(
    career?.questions || [
      {
        id: 1,
        category: "CV Validation / Experience",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 2,
        category: "Technical",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 3,
        category: "Behavioral",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 4,
        category: "Analytical",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 5,
        category: "Others",
        questionCountToAsk: null,
        questions: [],
      },
    ]
  );

  const [country, setCountry] = useState(career?.country || "Philippines");
  const [province, setProvince] = useState(career?.province || "");
  const [city, setCity] = useState(career?.location || "");
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState("");
  const [isSavingCareer, setIsSavingCareer] = useState(false);
  const savingCareerRef = useRef(false);
  const formId = career?._id || "new-career-draft";
  const [isLoading, setIsLoading] = useState(true);
  const [documentId, setDocumentId] = useState("");

  const isFormValid = () => {
    return (
      jobTitle?.trim().length > 0 &&
      description?.trim().length > 0 &&
      questions.some((q) => q.questions.length > 0) &&
      workSetup?.trim().length > 0
    );
  };


  useEffect(() => {
    const fetchLatestCareer = async () => {
      try {
        const response = await fetch("/api/latest-career");
        const data = await response.json();
        if (data?.temporarySave) {
          // Update all form states in a single batch
          setPreScreeningQuestions(data.preScreeningQuestions);
          setAiSecretPrompt(data.aiSecretPrompt);
          setSecretPrompt(data.secretPrompt);
          setCountry(data.country);
          setProvince(data.province);
          setCity(data.city);
          setEmploymentType(data.employmentType);
          setRequireVideo(data.requireVideo);
          setSalaryNegotiable(data.salaryNegotiable);
          setMinimumSalary(data.minimumSalary);
          setMaximumSalary(data.maximumSalary);
          setQuestions(data.questions);
          setDocumentId(data._id);
          setJobTitle(data.jobTitle);
          setDescription(data.description);
          setWorkSetup(data.workSetup || "");
          setWorkSetupRemarks(data.workSetupRemarks || "");
          setScreeningSetting(data.screeningSetting || "");
          setAIScreeningSetting(data.aiScreeningSetting || "");
          setSalaryNegotiable(data.salaryNegotiable ?? true);
          setMinimumSalary(data.minimumSalary || "");
          setMaximumSalary(data.maximumSalary || "");
          setQuestions(data.questions || []);
          setCurrent(data.currentStep || 0);
        }
      } catch (error) {
        console.error("Error fetching latest career:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 100);
      }
    };

    // Only fetch if it's a new career form
    if (!career?._id && formType !== "edit") {
      fetchLatestCareer();
    } else {
      setIsLoading(false);
    }
  }, []);

  const updateCareer = async (status: string, isSaveAndContinue: boolean) => {
    if (
      Number(minimumSalary) &&
      Number(maximumSalary) &&
      Number(minimumSalary) > Number(maximumSalary)
    ) {
      errorToast("Minimum salary cannot be greater than maximum salary", 1300);
      return;
    }
    let userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };
    const updatedCareer = {
      _id: documentId || career._id,
      jobTitle,
      description,
      workSetup,
      workSetupRemarks,
      questions,
      lastEditedBy: userInfoSlice,
      status,
      secretPrompt,
      preScreeningQuestions,
      currentStep: isSaveAndContinue ? current + 1 : 0,
      temporarySave: isSaveAndContinue,
      aiScreeningSetting,
      aiSecretPrompt,
      updatedAt: Date.now(),
      screeningSetting,
      requireVideo,
      salaryNegotiable,
      minimumSalary: isNaN(Number(minimumSalary))
        ? null
        : Number(minimumSalary),
      maximumSalary: isNaN(Number(maximumSalary))
        ? null
        : Number(maximumSalary),
      country,
      province,
      // Backwards compatibility
      location: city,
      employmentType,
    };
    try {
      setIsSavingCareer(true);
      const response = await axios.post("/api/update-career", updatedCareer);
      if (response.status === 200) {
        candidateActionToast(
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginLeft: 8,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>
              Career updated
            </span>
          </div>,
          1300,
          <i
            className="la la-check-circle"
            style={{ color: "#039855", fontSize: 32 }}
          ></i>
        );
        if(!isSaveAndContinue){
          setTimeout(() => {
            window.location.href = `/recruiter-dashboard/careers/manage/${documentId || career._id}`;
          }, 1300);
        }
      }
    } catch (error) {
      console.error(error);
      errorToast("Failed to update career", 1300);
    } finally {
      setIsSavingCareer(false);
    }
  };

  const confirmSaveCareer = (status: string) => {
    if (
      Number(minimumSalary) &&
      Number(maximumSalary) &&
      Number(minimumSalary) > Number(maximumSalary)
    ) {
      errorToast("Minimum salary cannot be greater than maximum salary", 1300);
      return;
    }

    setShowSaveModal(status);
  };

  const saveCareer = async (status: string, isSaveAndContinue: boolean) => {
    setShowSaveModal("");
    if (!status) {
      return;
    }

    if (!savingCareerRef.current) {
      setIsSavingCareer(true);
      savingCareerRef.current = true;
      let userInfoSlice = {
        image: user.image,
        name: user.name,
        email: user.email,
      };
      const career = {
        jobTitle,
        description,
        workSetup,
        workSetupRemarks,
        questions,
        lastEditedBy: userInfoSlice,
        createdBy: userInfoSlice,
        screeningSetting,
        preScreeningQuestions,
        secretPrompt,
        aiSecretPrompt,
        aiScreeningSetting,
        orgID,
        requireVideo,
        salaryNegotiable,
        currentStep: current + 1,
        temporarySave: isSaveAndContinue,
        minimumSalary: isNaN(Number(minimumSalary))
          ? null
          : Number(minimumSalary),
        maximumSalary: isNaN(Number(maximumSalary))
          ? null
          : Number(maximumSalary),
        country,
        province,
        // Backwards compatibility
        location: city,
        status,
        employmentType,
      };

      try {
        const response = await axios.post("/api/add-career", career);
        if (response.status === 200) {
          // Capture the created document ID for subsequent updates
          if (response.data?.career?._id) {
            setDocumentId(response.data.career._id);
          }
          
          candidateActionToast(
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginLeft: 8,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>
                Career added {status === "active" ? "and published" : ""}
              </span>
            </div>,
            1300,
            <i
              className="la la-check-circle"
              style={{ color: "#039855", fontSize: 32 }}
            ></i>
          );
          if (!saveAndContinue) {
            setTimeout(() => {
              window.location.href = `/recruiter-dashboard/careers`;
            }, 1300);
          }
        }
      } catch (error) {
        errorToast("Failed to add career", 1300);
      } finally {
        savingCareerRef.current = false;
        setIsSavingCareer(false);
      }
    }
  };

  useEffect(() => {
    const parseProvinces = () => {
      setProvinceList(philippineCitiesAndProvinces.provinces);
      const defaultProvince = philippineCitiesAndProvinces.provinces[0];
      if (!career?.province) {
        setProvince(defaultProvince.name);
      }
      const cities = philippineCitiesAndProvinces.cities.filter(
        (city) => city.province === defaultProvince.key
      );
      setCityList(cities);
      if (!career?.location) {
        setCity(cities[0].name);
      }
    };
    parseProvinces();
  }, [career]);

  const saveAndContinue = () => {
    // Career Details and Team Access Page
    if (current === 0) {
      if (
        !jobTitle ||
        !employmentType ||
        !workSetup ||
        !country ||
        !province ||
        !city ||
        !minimumSalary ||
        !maximumSalary ||
        !description
      ) {
        errorToast("Please fill in all fields before saving!", 1300);
        return;
      } else {
        saveCareer("inactive", true);
      }
    }
    // CV Screening
    if (current === 1) {
      if (!screeningSetting) {
        errorToast("Please fill in all fields before saving!", 1300);
        return;
      } else {
        updateCareer("inactive", true);
      }
    }
    // AI Interview
    if (current === 2) {
      if (
        !aiScreeningSetting ||
        !requireVideo ||
        !questions.some((q) => q.questions.length > 0)
      ) {
        errorToast("Please fill in all fields before saving!", 1300);
        return;
      } else {
        updateCareer("inactive", true);
      }
    }
    setCurrent((prev) => prev + 1);
  };

  if (isLoading) {
    return <div>Loading form data...</div>;
  }
  return (
    <div className="col">
      {formType === "add" ? (
        <div
          className="mb-3 mt-25 lg:mt-4 px-2 flex flex-row flex-wrap justify-between items-center w-full"
        >
          <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>
            Add new career
          </h1>
          <div
            className="flex flex-row flex-wrap items-center md:gap-3 gap-2"
          >
            <button
              disabled={!isFormValid() || isSavingCareer}
              style={{
                color: "#414651",
                background: "#fff",
                border: "1px solid #D5D7DA",
                padding: "8px 16px",
                borderRadius: "60px",
                cursor:
                  !isFormValid() || isSavingCareer ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                confirmSaveCareer("inactive");
              }}
              className="w-full md:w-max"
            >
              Save as Unpublished
            </button>
            {current < 3 ? (
              <button
                style={{
                  background: "black",
                  color: "#fff",
                  border: "1px solid #E9EAEB",
                  padding: "8px 16px",
                  borderRadius: "60px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onClick={() => {
                  saveAndContinue();
                }}
                className="w-full md:w-max"
                form="careerForm"
                type="submit"
              >
                <i
                  className="la la-check-circle"
                  style={{ color: "#fff", fontSize: 20, marginRight: 8 }}
                ></i>
                Save and Continue
              </button>
            ) : (
              <button
                disabled={!isFormValid() || isSavingCareer}
                style={{
                  width: "fit-content",
                  background:
                    !isFormValid() || isSavingCareer ? "#D5D7DA" : "black",
                  color: "#fff",
                  border: "1px solid #E9EAEB",
                  padding: "8px 16px",
                  borderRadius: "60px",
                  cursor:
                    !isFormValid() || isSavingCareer
                      ? "not-allowed"
                      : "pointer",
                  whiteSpace: "nowrap",
                }}
                onClick={() => {
                  confirmSaveCareer("active");
                }}
              >
                <i
                  className="la la-check-circle"
                  style={{ color: "#fff", fontSize: 20, marginRight: 8 }}
                ></i>
                Publish
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            marginBottom: "35px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>
            Edit Career Details
          </h1>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button
              style={{
                width: "fit-content",
                color: "#414651",
                background: "#fff",
                border: "1px solid #D5D7DA",
                padding: "8px 16px",
                borderRadius: "60px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                setShowEditModal?.(false);
              }}
            >
              Cancel
            </button>
            <button
              disabled={!isFormValid() || isSavingCareer}
              style={{
                width: "fit-content",
                color: "#414651",
                background: "#fff",
                border: "1px solid #D5D7DA",
                padding: "8px 16px",
                borderRadius: "60px",
                cursor:
                  !isFormValid() || isSavingCareer ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                updateCareer("inactive", false);
              }}
            >
              Save Changes as Unpublished
            </button>
            <button
              disabled={!isFormValid() || isSavingCareer}
              style={{
                width: "fit-content",
                background:
                  !isFormValid() || isSavingCareer ? "#D5D7DA" : "black",
                color: "#fff",
                border: "1px solid #E9EAEB",
                padding: "8px 16px",
                borderRadius: "60px",
                cursor:
                  !isFormValid() || isSavingCareer ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                updateCareer("active", false);
              }}
            >
              <i
                className="la la-check-circle"
                style={{ color: "#fff", fontSize: 20, marginRight: 8 }}
              ></i>
              Save Changes as Published
            </button>
          </div>
        </div>
      )}
      <div className="px-2 w-full">
      <Steps size="small" current={current} items={formSteps} />
      </div>

      <div
      
        className="flex flex-col-reverse md:flex-row justify-between w-100 gap-4 items-start md:my-16"
      >
        {/* Career Details */}
        {current === 0 && (
          <CareerDetails
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            employmentType={employmentType}
            setEmploymentType={setEmploymentType}
            workSetup={workSetup}
            setWorkSetup={setWorkSetup}
            country={country}
            setCountry={setCountry}
            province={province}
            setProvince={setProvince}
            city={city}
            setCity={setCity}
            minimumSalary={minimumSalary}
            setMinimumSalary={setMinimumSalary}
            maximumSalary={maximumSalary}
            setMaximumSalary={setMaximumSalary}
            description={description}
            setDescription={setDescription}
            career={career}
          />
        )}

        {/* CV Review */}
        {current === 1 && (
          <CVReview 
            secretPrompt={secretPrompt}
            setSecretPrompt={setSecretPrompt}
            screeningSetting={screeningSetting}
            setScreeningSetting={setScreeningSetting}
            preScreeningQuestions={preScreeningQuestions}
            setPreScreeningQuestions={setPreScreeningQuestions}
          />
        )}  

        {/* AI Interview */}
        {current === 2 && (
          <AiInterview 
            aiScreeningSetting={aiScreeningSetting}
            requireVideo={requireVideo}
            setRequireVideo={setRequireVideo}
            setAiSecretPrompt={setAiSecretPrompt}
            aiSecretPrompt={aiSecretPrompt}
            questions={questions}
            jobTitle={jobTitle}
            description={description}
            setAIScreeningSetting={setAIScreeningSetting}
          />
        )}

        {/* Review Career */}
        {current === 3 && (
          <ReviewCareer
            jobTitle={jobTitle}
            employmentType={employmentType}
            workArrangement={workSetup}
            country={country}
            province={province}
            city={city}
            minimumSalary={minimumSalary}
            maximumSalary={maximumSalary}
            description={description}
            screeningSetting={screeningSetting}
            secretPrompt={secretPrompt}
            aiSecretPrompt={aiSecretPrompt}
            aiScreeningSetting={aiScreeningSetting}
            requireVideo={requireVideo}
            interviewQuestionsCount={questions.length}
            questions={questions}
            preScreeningQuestionsCount={preScreeningQuestions.length}
            preScreeningQuestions={preScreeningQuestions}
            
          />
        )}

        {/* Tips */}
        {current !== 3 && (
          <Tips current={current}/>
        )}
      </div>

      {showSaveModal && (
        <CareerActionModal
          action={showSaveModal}
          onAction={(action) => updateCareer(action, false)}
        />
      )}
      {isSavingCareer && (
        <FullScreenLoadingAnimation
          title={formType === "add" ? "Saving career..." : "Updating career..."}
          subtext={`Please wait while we are ${
            formType === "add" ? "saving" : "updating"
          } the career`}
        />
      )}
    </div>
  );
}
