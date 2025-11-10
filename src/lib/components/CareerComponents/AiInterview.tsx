import React from "react";
import CustomDropdown from "./CustomDropdown";
import RichTextEditor from "./RichTextEditor";
import InterviewQuestionGeneratorV2 from "./InterviewQuestionGeneratorV2";

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

const AiInterview = (props) => {
  return (
    <div className="w-full md:w-3/5 px-2 flex flex-col gap-8">
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
            <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>
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
                    props.setAIScreeningSetting(aiScreeningSetting);
                  }}
                  screeningSetting={props.aiScreeningSetting}
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
                      checked={props.requireVideo}
                      onChange={() => props.setRequireVideo(!props.requireVideo)}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className="pb-2">{props.requireVideo ? "Yes" : "No"}</span>
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
                  evaluation style, complementing her accurate assessment of
                  requirements from the job description.
                </span>
                <RichTextEditor
                  setText={props.setAiSecretPrompt}
                  text={props.aiSecretPrompt}
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
        questions={props.questions}
        setQuestions={(questions) => props.setQuestions(questions)}
        jobTitle={props.jobTitle}
        description={props.description}
      />
    </div>
  );
};

export default AiInterview;
