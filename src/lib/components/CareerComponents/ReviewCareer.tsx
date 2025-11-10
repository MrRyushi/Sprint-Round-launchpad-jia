import React from "react";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";

const ReviewCareer = (props) => {
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Career Details & Team Access",
      children: (
        <div className="space-y-3">
          <div className="flex flex-col border-bottom" style={{ margin: 0 }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#181D27",
                margin: 0,
              }}
              className=""
            >
              Job Title
            </p>
            <p
              style={{ fontWeight: 500, fontSize: 16, color: "#414651" }}
              className=""
            >
              {props.jobTitle}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-x-8 mt-3 border-bottom">
            <div className="grid-cols-1">
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#181D27",
                  margin: 0,
                }}
                className=""
              >
                Employment Type
              </p>
              <p
                style={{ fontWeight: 500, fontSize: 16, color: "#414651" }}
                className=""
              >
                {props.employmentType}
              </p>
            </div>

            <div className="grid-cols-2">
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#181D27",
                  margin: 0,
                }}
                className=""
              >
                Work Arrangement
              </p>
              <p
                style={{ fontWeight: 500, fontSize: 16, color: "#414651" }}
                className=""
              >
                {props.workArrangement}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-x-8 border-bottom">
            <div className="grid-cols-1">
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#181D27",
                  margin: 0,
                }}
                className=""
              >
                Country
              </p>
              <p
                style={{ fontWeight: 500, fontSize: 16, color: "#414651" }}
                className=""
              >
                {props.country}
              </p>
            </div>

            <div className="grid-cols-1 border-bottom">
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#181D27",
                  margin: 0,
                }}
                className=""
              >
                State / Province
              </p>
              <p
                style={{ fontWeight: 500, fontSize: 16, color: "#414651" }}
                className=""
              >
                {props.province}
              </p>
            </div>

            <div className="grid-cols-1">
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#181D27",
                  margin: 0,
                }}
                className=""
              >
                City
              </p>
              <p
                style={{ fontWeight: 500, fontSize: 16, color: "#414651" }}
                className=""
              >
                {props.city}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-8 border-bottom">
            <div className="grid-cols-1">
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#181D27",
                  margin: 0,
                }}
                className=""
              >
                Minimum Salary
              </p>
              <p
                style={{ fontWeight: 500, fontSize: 16, color: "#414651" }}
                className=""
              >
                {props.minimumSalary}
              </p>
            </div>

            <div className="grid-cols-2">
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#181D27",
                  margin: 0,
                }}
                className=""
              >
                Maximum Salary
              </p>
              <p
                style={{ fontWeight: 500, fontSize: 16, color: "#414651" }}
                className=""
              >
                {props.maximumSalary}
              </p>
            </div>
          </div>
          <div>
            <p
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#181D27",
                margin: 0,
              }}
              className=""
            >
              Job Description
            </p>
            <p
              style={{ fontWeight: 500, fontSize: 16, color: "#414651" }}
              className=""
            >
              {props.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "CV Review & Pre-Screening Questions",
      children: (
        <div className="space-y-3">
          <div className="flex flex-col border-bottom" style={{ margin: 0 }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#181D27",
                margin: 0,
              }}
              className=""
            >
              CV Screening
            </p>
            <p
              style={{ fontWeight: 500, fontSize: 16, color: "#414651" }}
              className=""
            >
              Automatically endorse candidates who are{" "}
              <span
                style={{
                  color: "#175CD3",
                  background: "#B2DDFF",
                  borderRadius: 999,
                  borderColor: "#B2DDFF",
                }}
                className="px-2 py-1"
              >
                {props.screeningSetting}
              </span>{" "}
              and above
            </p>
          </div>

          <div
            className="flex flex-col border-bottom mt-3"
            style={{ margin: 0 }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#181D27",
                margin: 0,
              }}
              className="flex items-center space-x-2"
            >
              <img
                src="/iconsV3/secretPrompt.svg"
                alt="Tips Icon"
                width={16}
                height={16}
              />
              <span>CV Secret Prompt</span>
            </p>
            <p
              style={{ fontWeight: 500, fontSize: 16, color: "#414651" }}
              className=""
            >
              {props.secretPrompt}
            </p>
          </div>

          <div className="py-3">
            <div className="flex flex-row">
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#181D27",
                  marginRight: 8,
                }}
                className="block"
              >
                Pre-Screening Questions{" "}
              </p>
              <p
                className="border px-2 block mt-1"
                style={{ borderRadius: 999, fontSize: 12 }}
              >
                {props.preScreeningQuestionsCount}
              </p>
            </div>
            <ol className="list-decimal ms-8">
              {props.preScreeningQuestions.map((question) => (
                <li
                  key={question.id}
                  style={{ fontWeight: 500, fontSize: 16, color: "#414651" }}
                >
                  {question.question}
                  {question.options?.length > 1 && (
                    <ul className="list-disc ms-8">
                      {question.options.map((q, j) => (
                        <li
                          key={q.id || j}
                          style={{
                          fontWeight: 500,
                          fontSize: 16,
                          color: "#414651",
                        }}
                      >
                        {q}
                      </li>
                    ))}
                  </ul>
                )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: "AI Interview Setup",
      children: (
        <div className="space-y-3">
          <div className="flex flex-col border-bottom">
            <p
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#181D27",
                margin: 0,
              }}
              className=""
            >
              AI Interview Screening
            </p>
            <p
              style={{ fontWeight: 500, fontSize: 16, color: "#414651" }}
              className=""
            >
              Automatically endorse candidates who are{" "}
              <span
                style={{
                  color: "#175CD3",
                  background: "#B2DDFF",
                  borderRadius: 999,
                  borderColor: "#B2DDFF",
                }}
                className="px-2 py-1"
              >
                {props.aiScreeningSetting}
              </span>{" "}
              and above
            </p>
          </div>

          <div className="flex justify-between border-bottom">
            <div className="">
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#181D27",
                  margin: 0,
                }}
                className="block"
              >
                Require Video on Interview
              </p>
            </div>
            <div>
              <p>{props.videoInterview ? "Yes ✅" : "No ❌"}</p>
            </div>
          </div>

          <div className="border-bottom">
            <div className="flex space-x-3">
              <img
                src="/iconsV3/secretPrompt.svg"
                alt="Tips Icon"
                width={16}
                height={16}
              />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#181D27",
                  margin: 0,
                }}
              >
                AI Interview Secret Prompt{" "}
              </span>
            </div>
            <p>{props.aiSecretPrompt}</p>
          </div>

          <div>
            <div className="flex flex-row space-x-4">
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#181D27",
                  marginRight: 8,
                }}
                className="block"
              >
                Interview Questions
              </p>
              <p
                className="border px-2"
                style={{ borderRadius: 999, fontSize: 12 }}
              >
                {props.interviewQuestionsCount}
              </p>
            </div>
            <div>
              {props.questions.map((question, key) => (
                <div key={key}>
                  <p
                    style={{ fontWeight: 700, fontSize: 14, color: "#414651" }}
                  >
                    {question.category}
                  </p>

                  <ol className="list-decimal ms-8">
                  {question.questions.map((q, j) => (
                    <li
                      key={q.id || j}
                      style={{
                        fontWeight: 500,
                        fontSize: 16,
                        color: "#414651",
                      }}
                    >
                      {q.question}
                    </li>
                  ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <Collapse items={items} defaultActiveKey={["1"]} />
    </div>
  );
};

export default ReviewCareer;
