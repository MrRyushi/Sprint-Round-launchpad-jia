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

const workSetupOptions = [
  {
    name: "Fully Remote",
  },
  {
    name: "Onsite",
  },
  {
    name: "Hybrid",
  },
];

const employmentTypeOptions = [
  {
    name: "Full-Time",
  },
  {
    name: "Part-Time",
  },
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
  },
  {
    title: "Work Setup",
    question: "How often are you willing to report to the office each week?",
  },
  {
    title: "Asking Salary",
    question: "How much is your expected monthly salary?",
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

  const isFormValid = () => {
    return (
      jobTitle?.trim().length > 0 &&
      description?.trim().length > 0 &&
      questions.some((q) => q.questions.length > 0) &&
      workSetup?.trim().length > 0
    );
  };

  // Save form data to localStorage
  const saveFormProgress = () => {
    const formData = {
      jobTitle,
      description,
      workSetup,
      workSetupRemarks,
      screeningSetting,
      aiScreeningSetting,
      employmentType,
      requireVideo,
      salaryNegotiable,
      minimumSalary,
      maximumSalary,
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

  // Load saved form data from localStorage
  const loadFormProgress = () => {
    if (career?._id) return; // Don't load draft if editing an existing career

    const savedData = localStorage.getItem(`career-form-${formId}`);
    if (savedData) {
      try {
        const {
          jobTitle: savedJobTitle,
          description: savedDescription,
          workSetup: savedWorkSetup,
          workSetupRemarks: savedWorkSetupRemarks,
          screeningSetting: savedScreeningSetting,
          aiScreeningSetting: savedAiScreeningSetting,
          employmentType: savedEmploymentType,
          requireVideo: savedRequireVideo,
          salaryNegotiable: savedSalaryNegotiable,
          minimumSalary: savedMinimumSalary,
          maximumSalary: savedMaximumSalary,
          questions: savedQuestions,
          country: savedCountry,
          province: savedProvince,
          city: savedCity,
          secretPrompt: savedSecretPrompt,
          aiSecretPrompt: savedAiSecretPrompt,
          currentStep: savedCurrentStep,
        } = JSON.parse(savedData);

        if (savedJobTitle) setJobTitle(savedJobTitle);
        if (savedDescription) setDescription(savedDescription);
        if (savedWorkSetup) setWorkSetup(savedWorkSetup);
        if (savedWorkSetupRemarks) setWorkSetupRemarks(savedWorkSetupRemarks);
        if (savedScreeningSetting) setScreeningSetting(savedScreeningSetting);
        if (savedAiScreeningSetting)
          setAIScreeningSetting(savedAiScreeningSetting);
        if (savedEmploymentType) setEmploymentType(savedEmploymentType);
        if (savedRequireVideo !== undefined) setRequireVideo(savedRequireVideo);
        if (savedSalaryNegotiable !== undefined)
          setSalaryNegotiable(savedSalaryNegotiable);
        if (savedMinimumSalary) setMinimumSalary(savedMinimumSalary);
        if (savedMaximumSalary) setMaximumSalary(savedMaximumSalary);
        if (savedQuestions) setQuestions(savedQuestions);
        if (savedCountry) setCountry(savedCountry);
        if (savedProvince) setProvince(savedProvince);
        if (savedCity) setCity(savedCity);
        if (savedSecretPrompt) setSecretPrompt(savedSecretPrompt);
        if (savedAiSecretPrompt) setAiSecretPrompt(savedAiSecretPrompt);
        if (savedCurrentStep !== undefined) setCurrent(savedCurrentStep);
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  };

  // Clear saved form data
  const clearFormProgress = () => {
    localStorage.removeItem(`career-form-${formId}`);
  };

  // Load saved data on component mount
  useEffect(() => {
    loadFormProgress();

    // Clear saved data when component unmounts if the form was submitted
    return () => {
      if (formType === "add" && !isSavingCareer) {
        clearFormProgress();
      }
    };
  }, []);

  const updateCareer = async (status: string) => {
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
      _id: career._id,
      jobTitle,
      description,
      workSetup,
      workSetupRemarks,
      questions,
      lastEditedBy: userInfoSlice,
      status,
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
        setTimeout(() => {
          window.location.href = `/recruiter-dashboard/careers/manage/${career._id}`;
        }, 1300);
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

  const saveCareer = async (status: string) => {
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
        orgID,
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
        status,
        employmentType,
      };

      try {
        const response = await axios.post("/api/add-career", career);
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
                Career added {status === "active" ? "and published" : ""}
              </span>
            </div>,
            1300,
            <i
              className="la la-check-circle"
              style={{ color: "#039855", fontSize: 32 }}
            ></i>
          );
          setTimeout(() => {
            window.location.href = `/recruiter-dashboard/careers`;
          }, 1300);
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
      }
    }
    if (current === 1) {
      if (
        !screeningSetting
      ) {
        errorToast("Please fill in all fields before saving!", 1300);
        return;
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
      }
    }
    setCurrent((prev) => prev + 1);

    saveCareer()
  };

  return (
    <div className="col">
      {formType === "add" ? (
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
            Add new career
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
                confirmSaveCareer("inactive");
              }}
            >
              Save as Unpublished
            </button>
            {current < 3 ? (
              <button
                style={{
                  width: "fit-content",
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
                updateCareer("inactive");
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
                updateCareer("active");
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
      <Steps size="small" current={current} items={formSteps} />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          gap: 16,
          alignItems: "flex-start",
          marginTop: 16,
          marginBottom: 16,
        }}
      >
        {current === 0 && (
          <div
            style={{
              width: "75%",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {/*Career Details & Team Access*/}
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
                    1. Career Information
                  </span>
                </div>
                <div className="layered-card-content space-y-2">
                  <div className="space-y-2">
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#181D27",
                      }}
                      className="block"
                    >
                      Basic Information
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#414651",
                      }}
                      className="block"
                    >
                      Job Title
                    </span>
                    <input
                      value={jobTitle}
                      className="form-control"
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#717680",
                      }}
                      placeholder="Enter job title"
                      onChange={(e) => {
                        setJobTitle(e.target.value || "");
                      }}
                      required
                    ></input>
                  </div>

                  <div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#181D27",
                      }}
                    >
                      Work Setting
                    </span>
                    <div className="flex flex-row gap-4">
                      <div className="space-y-2 w-full">
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#414651",
                          }}
                          className="block"
                        >
                          Employment Type
                        </span>
                        <CustomDropdown
                          onSelectSetting={(employmentType) => {
                            setEmploymentType(employmentType);
                          }}
                          screeningSetting={employmentType}
                          settingList={employmentTypeOptions}
                          placeholder="Choose Employment Type"
                          required
                        />
                      </div>

                      <div className="space-y-2 w-full">
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#414651",
                          }}
                          className="block"
                        >
                          Arrangement
                        </span>
                        <CustomDropdown
                          onSelectSetting={(setting) => {
                            setWorkSetup(setting);
                          }}
                          screeningSetting={workSetup}
                          settingList={workSetupOptions}
                          placeholder="Choose work arrangement"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#181D27",
                      }}
                    >
                      Location
                    </span>
                    <div className="flex flex-row gap-4">
                      <div className="space-y-2 w-full">
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#414651",
                          }}
                          className="block"
                        >
                          Country
                        </span>
                        <CustomDropdown
                          onSelectSetting={(setting) => {
                            setCountry(setting);
                          }}
                          screeningSetting={country}
                          settingList={[]}
                          placeholder="Select Country"
                          required
                        />
                      </div>

                      <div className="space-y-2 w-full">
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#414651",
                          }}
                          className="block"
                        >
                          State / Province
                        </span>
                        <CustomDropdown
                          onSelectSetting={(province) => {
                            setProvince(province);
                            const provinceObj = provinceList.find(
                              (p) => p.name === province
                            );
                            const cities =
                              philippineCitiesAndProvinces.cities.filter(
                                (city) => city.province === provinceObj.key
                              );
                            setCityList(cities);
                            setCity(cities[0].name);
                          }}
                          screeningSetting={province}
                          settingList={provinceList}
                          placeholder="Choose State / Province"
                          required
                        />
                      </div>

                      <div className="space-y-2 w-full">
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#414651",
                          }}
                          className="block"
                        >
                          City
                        </span>
                        <CustomDropdown
                          onSelectSetting={(city) => {
                            setCity(city);
                          }}
                          screeningSetting={city}
                          settingList={cityList}
                          placeholder="Choose City"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#181D27",
                      }}
                    >
                      Salary
                    </span>
                    <div className="flex flex-row gap-4">
                      <div className="space-y-2 w-full">
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#414651",
                          }}
                          className="block"
                        >
                          Minimum Salary
                        </span>
                        <div style={{ position: "relative" }}>
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
                            P
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            style={{ paddingLeft: "28px" }}
                            placeholder="0"
                            min={0}
                            value={minimumSalary}
                            onChange={(e) => {
                              setMinimumSalary(e.target.value || "");
                            }}
                            required
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "30px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#6c757d",
                              fontSize: "16px",
                              pointerEvents: "none",
                            }}
                          >
                            PHP
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 w-full">
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#414651",
                          }}
                          className="block"
                        >
                          Maximum Salary
                        </span>
                        <div style={{ position: "relative" }}>
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
                            P
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            style={{ paddingLeft: "28px" }}
                            placeholder="0"
                            min={0}
                            value={maximumSalary}
                            onChange={(e) => {
                              setMaximumSalary(e.target.value || "");
                            }}
                          ></input>
                          <span
                            style={{
                              position: "absolute",
                              right: "30px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#6c757d",
                              fontSize: "16px",
                              pointerEvents: "none",
                            }}
                          >
                            PHP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                    2. Job Description
                  </span>
                </div>
                <div className="layered-card-content">
                  <span>Description</span>
                  <RichTextEditor
                    setText={setDescription}
                    text={description}
                    placeholder={"Enter description"}
                  />
                  *
                </div>
              </div>
            </div>
          </div>
        )}

        {current === 1 && (
          <div
            style={{
              width: "75%",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
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
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingLeft: 5,
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
                    className="block"
                  >
                    2. Pre-Screening Questions{" "}
                    <span style={{ color: "#717680", fontWeight: 500 }}>
                      (optional)
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
            style={{
              width: "75%",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
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
                    <div style={{ width: "50%" }}>
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
          />
        )}

        {/* Put tips below this line */}
        {current !== 3 && (
          <div
            style={{
              width: "25%",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
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

      <div
        className="flex flex-row justify-end gap-4 mb-4"
        style={{ width: "75%" }}
      >
        {/* {current > 0 && (
          <button
            onClick={() => {
              setCurrent((prev) => prev - 1);
            }}
            style={{ borderRadius: 10 }}
            className="border rounded-full px-4 py-2 hover:bg-gray-50"
          >
            Previous
          </button>
        )}
        {current < 3 && (
          <button
            onClick={() => {
              // Save progress before moving to next step
              saveFormProgress();
              setCurrent((prev) => prev + 1);
            }}
            style={{ borderRadius: 10 }}
            className="border rounded-full px-4 py-2 hover:bg-gray-50"
          >
            Save and Continue
          </button>
        )} */}
      </div>
      {showSaveModal && (
        <CareerActionModal
          action={showSaveModal}
          onAction={(action) => saveCareer(action)}
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
