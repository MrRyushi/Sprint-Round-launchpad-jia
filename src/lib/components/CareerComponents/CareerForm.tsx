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
// Setting List icons
const screeningSettingList = [
  {
    name: "Good Fit and above",
    icon: "la la-check",
  },
  {
    name: "Only Strong Fit",
    icon: "la la-check-double",
  },
  {
    name: "No Automatic Promotion",
    icon: "la la-times",
  },
];

const aiScreeningSettingList = [
  {
    name: "Good Fit and above",
    icon: "la la-check",
  },
  {
    name: "Only Strong Fit",
    icon: "la la-check-double",
  },
  {
    name: "No Automatic Promotion",
    icon: "la la-times",
  },
];

const questionTypes = [
  { value: "short", label: "Short Answer" },
  { value: "long", label: "Long Answer" },
  { value: "dropdown", label: "Dropdown" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "range", label: "Range" },
];

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

const preScreeningQuestionsSuggestion = [
  {
    title: "Notice Period",
    question: "How long is your notice period?",
    type: "dropdown",
    options: ["Immediately", "< 30 days", "> 30 days"],
  },
  {
    title: "Work Setup",
    question: "How often are you willing to report to the office each week?",
    type: "dropdown",
    options: [
      "At most 1-2x a week",
      "At most 3-4x a week",
      "Open to fully onsite work",
      "Only open to fully remote work",
    ],
  },
  {
    title: "Asking Salary",
    question: "How much is your expected monthly salary?",
    type: "range",
  },
];

interface QuestionParams {
  question?: string;
  type?: string;
  options?: string[];
}

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
  const [current, setCurrent] = useState(3);
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
  const [temporarySave, setTemporarySave] = useState(false);
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

  const addQuestion = (params?: QuestionParams) => {
    setPreScreeningQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        question: params?.question ?? "",
        type: params?.type ?? "short",
        options: params?.options ?? [""],
      },
    ]);
  };

  const removeQuestion = (id) => {
    setPreScreeningQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setPreScreeningQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (id, index, value) => {
    setPreScreeningQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === index ? value : opt)),
            }
          : q
      )
    );
  };

  const addOption = (id) => {
    setPreScreeningQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, options: [...q.options, ""] } : q))
    );
  };

  const removeOption = (id, optionIndex) => {
    setPreScreeningQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.filter((_, index) => index !== optionIndex),
            }
          : q
      )
    );
  };

  // Save form data to localStorage
  const saveFormProgress = () => {
    const formData = {
      jobTitle,
      description,
      employmentType,
      workSetup,
      workSetupRemarks,
      screeningSetting,
      aiScreeningSetting,
      requireVideo,
      salaryNegotiable,
      minimumSalary,
      maximumSalary,
      preScreeningQuestions,
      questions,
      country,
      province,
      city,
      secretPrompt,
      aiSecretPrompt,
      currentStep: current, // Save the current step
    };
    localStorage.setItem(`career-form-${formId}`, JSON.stringify(formData));
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
          setAIScreeningSetting(data.aiScreeningSetting);
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

    // Save current progress before final submission
    saveFormProgress();

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
    if (current === 1) {
      if (!screeningSetting) {
        errorToast("Please fill in all fields before saving!", 1300);
        return;
      } else {
        updateCareer("inactive", true);
      }
    }
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
                  //confirmSaveCareer("active");
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

        {current === 1 && (
          <div
            className="w-full md:w-3/5 px-2 flex flex-col gap-8"
          >
            {/*CV Review & Pre-Screening*/}
            <div className="">
              <div className="layered-card-middle">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingLeft: 5,
                  }}
                >
                  <span
                    style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
                  >
                    1. CV Review Settings
                  </span>
                </div>
                <div className="layered-card-content space-y-2">
                  <div className="space-y-2 border-bottom pb-3">
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#181D27",
                      }}
                      className="block"
                    >
                      CV Screening
                    </span>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#414651",
                      }}
                      className="block"
                    >
                      Jia automatically endorses candidates who meet the chosen
                      criteria.
                    </span>
                    <div style={{ width: "50%" }}>
                      <CustomDropdown
                        onSelectSetting={(screeningSetting) => {
                          setScreeningSetting(screeningSetting);
                        }}
                        screeningSetting={screeningSetting}
                        settingList={screeningSettingList}
                        placeholder="Choose Screening Setting"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex space-x-3">
                      <img
                        src="/iconsV3/secretPrompt.svg"
                        alt="Tips Icon"
                        width={16}
                        height={16}
                      />
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          color: "#181D27",
                        }}
                      >
                        CV Secret Prompt{" "}
                        <span style={{ color: "#717680" }}>(optional)</span>
                      </span>
                    </div>

                    <div className="space-y-2 w-full">
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          color: "#414651",
                        }}
                        className="block"
                      >
                        Secret Prompts give you extra control over {"Jia’s"}{" "}
                        evaluation style, complementing her accurate assessment
                        of requirements from the job description.
                      </span>
                      <RichTextEditor
                        setText={setSecretPrompt}
                        text={secretPrompt}
                        placeholder={
                          "Enter a secret prompt (e.g. Give higher fit scores to candidates who participate in hackatons or competitions.)"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              <div className="layered-card-middle">
                <div
                  className="flex flex-row items-center gap-8 pl-1 justify-between"
                >
                  <span
                    style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
                    className="block space-x-2 flex"
                  >
                    2. Pre-Screening Questions{" "}
                    <span style={{ color: "#717680", fontWeight: 500}} className="">
                      (optional)
                    </span>
                    <span
                      className="border-1 px-2 block pt-1"
                      style={{ borderRadius: 999, fontSize: 12 }}
                    >
                      {preScreeningQuestions?.length}
                    </span>
                  </span>
                  <div className="">
                    <button
                      style={{
                        fontWeight: 700,
                        color: "white",
                        fontSize: 14,
                        background: "#181D27",
                        borderRadius: 999,
                      }}
                      className="px-3 py-2 flex flex-row space-x-2 items-center"
                      onClick={() => addQuestion()}
                    >
                      <img
                        src="/iconsV3/add.svg"
                        alt="Add Icon"
                        width={16}
                        height={16}
                        className=""
                      />
                      <span className="">Add Custom</span>
                    </button>
                  </div>
                </div>
                <div className="layered-card-content">
                  {preScreeningQuestions.length < 1 ? (
                    <span className="border-bottom pb-3">
                      No pre-screening questions added yet
                    </span>
                  ) : (
                    <div></div>
                  )}

                  <div className="space-y-3">
                    {preScreeningQuestions.map((q) => (
                      <div key={q.id} className="border rounded-lg space-y-2">
                        {/* Question Title */}
                        <div
                          className="flex flex-col lg:flex-row p-3 gap-x-4 gap-y-2 lg:gap-y-0"
                          style={{ background: "#F8F9FC" }}
                        >
                          <input
                            type="text"
                            placeholder="Write your question..."
                            className="border p-2 rounded bg-white w-full lg:w-2/3"
                            value={q.question}
                            onChange={(e) =>
                              updateQuestion(q.id, "question", e.target.value)
                            }
                            required
                          />

                          {/* Question Type */}
                          <select
                            value={q.type}
                            onChange={(e) =>
                              updateQuestion(q.id, "type", e.target.value)
                            }
                            className="border p-2 rounded bg-white w-full lg:w-1/3"
                          >
                            {questionTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="p-3">
                          {/* Conditional Inputs */}
                          {q.type === "short" && (
                            <input
                              type="text"
                              placeholder="Short answer text"
                              disabled
                              className="border p-2 w-full rounded bg-gray-50"
                            />
                          )}

                          {q.type === "long" && (
                            <textarea
                              placeholder="Long answer text"
                              disabled
                              className="border p-2 w-full rounded bg-gray-50"
                            />
                          )}

                          {["dropdown", "checkbox"].includes(q.type) && (
                            <div className=" space-y-3">
                              {q.options.map((opt, i) => (
                                <div
                                  key={i}
                                  className="flex flex-row items-center gap-x-2"
                                >
                                  <div className="flex flex-row w-full">
                                    <span className=" border p-2 rounded-s-md">
                                      {i + 1}.
                                    </span>
                                    <input
                                      type="text"
                                      placeholder={`Option ${i + 1}`}
                                      className="border p-2 w-full rounded-e-md"
                                      value={opt}
                                      onChange={(e) =>
                                        updateOption(q.id, i, e.target.value)
                                      }
                                      required
                                    />
                                  </div>
                                  <button
                                    onClick={(e) => removeOption(q.id, i)}
                                    className="border p-2 rounded"
                                    style={{ fontSize: 9, borderRadius: 999 }}
                                  >
                                    <img
                                      src="/iconsV3/x.svg"
                                      alt="Delete Option"
                                    />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addOption(q.id)}
                                className="text-sm text-blue-600"
                              >
                                + Add Option
                              </button>
                            </div>
                          )}

                          {q.type === "range" && (
                            <div className="flex items-center space-x-2">
                              <div className="flex flex-col w-full">
                                <label>Minimum</label>
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-block",
                                  }}
                                >
                                  <span
                                    style={{
                                      position: "absolute",
                                      left: "12px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      color: "#6c757d",
                                      fontSize: "16px",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    ₱
                                  </span>
                                  <input
                                    type="number"
                                    placeholder="Min"
                                    className="border p-2 rounded pl-5 w-full"
                                    style={{ paddingLeft: "28px" }}
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col w-full">
                                <label>Maximum</label>
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-block",
                                  }}
                                >
                                  <span
                                    style={{
                                      position: "absolute",
                                      left: "12px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      color: "#6c757d",
                                      fontSize: "16px",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    ₱
                                  </span>
                                  <input
                                    type="number"
                                    placeholder="Max"
                                    className="border p-2 rounded pl-5 w-full"
                                    style={{ paddingLeft: "28px" }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex justify-end xl:p-4">
                            <button
                              onClick={() => removeQuestion(q.id)}
                              style={{
                                fontWeight: 700,
                                color: "#B32318",
                                fontSize: 14,
                                borderRadius: 999,
                                border: "1px solid #B32318",
                              }}
                              className="py-2 px-3 space-x-2 hover:bg-red-200"
                            >
                              <img
                                src="/iconsv3/trash.svg"
                                className="inline"
                              />
                              <span className="">Delete Question</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: "#181D27",
                    }}
                    className="block"
                  >
                    Suggested Pre-screening Questions
                  </span>
                  {preScreeningQuestionsSuggestion.map((question, index) => (
                    <div key={index} className="flex flex-row justify-between">
                      <div className="">
                        <span
                          style={{
                            fontWeight: 500,
                            color: "#414651",
                            fontSize: 14,
                          }}
                        >
                          {question.title}
                        </span>
                        <span
                          style={{
                            fontWeight: 500,
                            color: "#717680",
                            fontSize: 14,
                          }}
                          className="block"
                        >
                          {question.question}
                        </span>
                      </div>
                      <div>
                        <button
                          style={{
                            fontWeight: 700,
                            color: "#414651",
                            fontSize: 14,
                            border: "1px solid #D5D7DA",
                            paddingTop: 8,
                            paddingBottom: 8,
                            paddingLeft: 14,
                            paddingRight: 14,
                            borderRadius: 999,
                          }}
                          onClick={() =>
                            addQuestion({
                              question: question.question,
                              type: question.type,
                              options: question.options,
                            })
                          }
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {current === 2 && (
          <div
           className="w-full md:w-3/5 px-2 flex flex-col gap-8"
          >
            {/*AI Interview Setup*/}
            <div className="">
              <div className="layered-card-middle">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingLeft: 5,
                  }}
                >
                  <span
                    style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
                  >
                    1. AI Interview Settings
                  </span>
                </div>
                <div className="layered-card-content space-y-2">
                  <div className="space-y-2 border-bottom pb-3">
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#181D27",
                      }}
                      className="block"
                    >
                      AI Interview Screening
                    </span>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#414651",
                      }}
                      className="block"
                    >
                      Jia automatically endorses candidates who meet the chosen
                      criteria.
                    </span>
                    <div className="w-full lg:w-1/2">
                      <CustomDropdown
                        onSelectSetting={(aiScreeningSetting) => {
                          setAIScreeningSetting(aiScreeningSetting);
                        }}
                        screeningSetting={aiScreeningSetting}
                        settingList={aiScreeningSettingList}
                        placeholder="Choose Screening Setting"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 border-bottom pb-3">
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#181D27",
                      }}
                      className="block"
                    >
                      Require Video on Interview
                    </span>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#414651",
                      }}
                      className="block"
                    >
                      Require canidates to keep their camera on. Recordings will
                      appear on their analysis page.
                    </span>
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-row items-center gap-2">
                        <img
                          src="/iconsV3/video.svg"
                          alt="Video Icon"
                          width={16}
                          height={16}
                          className="pb-1"
                        />
                        <label>Require Video Interview</label>
                      </div>

                      <div className="flex flex-row items-center space-x-3">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={requireVideo}
                            onChange={() => setRequireVideo(!requireVideo)}
                          />
                          <span className="slider round"></span>
                        </label>
                        <span className="pb-2">
                          {requireVideo ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex space-x-3">
                      <img
                        src="/iconsV3/secretPrompt.svg"
                        alt="Tips Icon"
                        width={16}
                        height={16}
                      />
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          color: "#181D27",
                        }}
                      >
                        AI Interview Secret Prompt{" "}
                        <span style={{ color: "#717680" }}>(optional)</span>
                      </span>
                    </div>

                    <div className="space-y-2 w-full">
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          color: "#414651",
                        }}
                        className="block"
                      >
                        Secret Prompts give you extra control over {"Jia’s"}{" "}
                        evaluation style, complementing her accurate assessment
                        of requirements from the job description.
                      </span>
                      <RichTextEditor
                        setText={setAiSecretPrompt}
                        text={aiSecretPrompt}
                        placeholder={
                          "Enter a secret prompt (e.g. Treat candidates who speak in Taglish, English, or Tagalog equally. Focus on clarity, coherence, and confidence rather than language preference or accent.)"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <InterviewQuestionGeneratorV2
              questions={questions}
              setQuestions={(questions) => setQuestions(questions)}
              jobTitle={jobTitle}
              description={description}
            />
          </div>
        )}

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

        {/* Put tips below this line */}
        {current !== 3 && (
          <div
            className="flex flex-col gap-8 w-full px-2 md:w-2/5"
          >
            <div className="">
              <div className="layered-card-middle">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingLeft: 5,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      paddingLeft: 5,
                    }}
                  >
                    <img
                      src="/iconsV3/tips-lightbulb.svg"
                      alt="Tips Icon"
                      width={16}
                      height={16}
                    />
                    <span
                      style={{
                        fontSize: 16,
                        color: "#181D27",
                        fontWeight: 700,
                      }}
                    >
                      Tips
                    </span>
                  </div>
                </div>
                {/*Tips Content*/}
                <div className="layered-card-content">
                  {current == 0 && (
                    <div className="">
                      <p
                        style={{
                          fontSize: 14,
                          color: "#717680",
                          fontWeight: 500,
                        }}
                        className="text-small"
                      >
                        <span style={{ fontWeight: "600", color: "#181D27" }}>
                          Use clear, standard job titles
                        </span>{" "}
                        for better searchability (e.g., “Software Engineer”
                        instead of “Code Ninja” or “Tech Rockstar”).
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          color: "#717680",
                          fontWeight: 500,
                        }}
                        className="text-small"
                      >
                        <span style={{ fontWeight: "600", color: "#181D27" }}>
                          Avoid abbreviations
                        </span>{" "}
                        or internal role codes that applicants may not
                        understand (e.g., use “QA Engineer” instead of “QE II”
                        or “QA-TL”).
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          color: "#717680",
                          fontWeight: 500,
                        }}
                        className="text-small"
                      >
                        <span style={{ fontWeight: "600", color: "#181D27" }}>
                          Keep it concise
                        </span>{" "}
                        {"–"} job titles should be no more than a few words{" "}
                        {"(2–4 max)"}, avoiding fluff or marketing terms.
                      </p>
                    </div>
                  )}

                  {current == 1 && (
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          color: "#717680",
                          fontWeight: 500,
                        }}
                        className="text-small"
                      >
                        <span style={{ fontWeight: "600", color: "#181D27" }}>
                          Add a Secret Prompt
                        </span>{" "}
                        to fine-tune how Jia scores and evaluates submitted CVs.
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          color: "#717680",
                          fontWeight: 500,
                        }}
                        className="text-small"
                      >
                        <span style={{ fontWeight: "600", color: "#181D27" }}>
                          Add pre-screening questions
                        </span>{" "}
                        to collect key details such as notice period, work
                        setup, or salary expectations to guide your review and
                        candidate discussions.
                      </p>
                    </div>
                  )}

                  {current == 2 && (
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          color: "#717680",
                          fontWeight: 500,
                        }}
                        className="text-small"
                      >
                        <span style={{ fontWeight: "600", color: "#181D27" }}>
                          Add a Secret Prompt
                        </span>{" "}
                        to fine-tune how Jia scores and evaluates submitted CVs.
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          color: "#717680",
                          fontWeight: 500,
                        }}
                        className="text-small"
                      >
                        <span style={{ fontWeight: "600", color: "#181D27" }}>
                          Use "Generate Questions"
                        </span>{" "}
                        to quickly create tailored interview questions, then
                        refine or mix them with your own for balanced results
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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
