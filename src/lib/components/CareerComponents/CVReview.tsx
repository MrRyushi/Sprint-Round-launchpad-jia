import React from "react";
import CustomDropdown from "./CustomDropdown";
import RichTextEditor from "./RichTextEditor";

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

const questionTypes = [
  { value: "short", label: "Short Answer" },
  { value: "long", label: "Long Answer" },
  { value: "dropdown", label: "Dropdown" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "range", label: "Range" },
];

interface QuestionParams {
  question?: string;
  type?: string;
  options?: string[];
}

const CVReview = (props) => {

    const addQuestion = (params?: QuestionParams) => {
    props.setPreScreeningQuestions((prev) => [
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
    props.setPreScreeningQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    props.setPreScreeningQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (id, index, value) => {
    props.setPreScreeningQuestions((prev) =>
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
    props.setPreScreeningQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, options: [...q.options, ""] } : q))
    );
  };

  const removeOption = (id, optionIndex) => {
    props.setPreScreeningQuestions((prev) =>
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

  return (
    <div className="w-full md:w-3/5 px-2 flex flex-col gap-8">
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
            <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>
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
                    props.setScreeningSetting(screeningSetting);
                  }}
                  screeningSetting={props.screeningSetting}
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
                  evaluation style, complementing her accurate assessment of
                  requirements from the job description.
                </span>
                <RichTextEditor
                  setText={props.setSecretPrompt}
                  text={props.secretPrompt}
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
          <div className="flex flex-row items-center gap-8 pl-1 justify-between">
            <span
              style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
              className="block space-x-2 flex"
            >
              2. Pre-Screening Questions{" "}
              <span style={{ color: "#717680", fontWeight: 500 }} className="">
                (optional)
              </span>
              <span
                className="border-1 px-2 block pt-1"
                style={{ borderRadius: 999, fontSize: 12 }}
              >
                {props.preScreeningQuestions?.length}
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
            {props.preScreeningQuestions.length < 1 ? (
              <span className="border-bottom pb-3">
                No pre-screening questions added yet
              </span>
            ) : (
              <div></div>
            )}

            <div className="space-y-3">
              {props.preScreeningQuestions.map((q) => (
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
                            className="flex flex-row items-center lg:gap-x-2"
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
                              style={{ fontSize: 111, borderRadius: 999 }}
                            >
                              <img src="/iconsV3/x.svg" width={24} height={24} alt="Delete Option" />
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
                        <img src="/iconsv3/trash.svg" className="inline" />
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
  );
};

export default CVReview;
