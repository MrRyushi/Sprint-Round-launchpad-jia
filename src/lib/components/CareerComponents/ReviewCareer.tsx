import React from "react";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";

const ReviewCareer = (props) => {
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Career Details & Team Access",
      children: (
        <div className="">
          <div className="flex flex-col" style={{ margin: 0 }}>
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

          <div className="grid grid-cols-3 gap-x-8">
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

          <div className="grid grid-cols-3 gap-x-8">
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
          <div className="grid grid-cols-3 gap-x-8">
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
        <div>
          <div className="flex flex-col" style={{ margin: 0 }}>
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

          <div className="flex flex-col" style={{ margin: 0 }}>
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

          <div className="flex flex-col" style={{ margin: 0 }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#181D27",
                margin: 0,
              }}
              className=""
            >
              Pre-Screening Questions <span style={{borderRadius: 999, border:"1px solid black", padding:4}}>{props.preScreeningQuestionsCount}</span>
            </p>
            
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: "AI Interview Setup",
      children: <p></p>,
    },
    {
      key: "4",
      label: "Review Career",
      children: <p></p>,
    },
  ];

  return (
    <div className="w-full">
      <Collapse items={items} defaultActiveKey={["1"]} />
    </div>
  );
};

export default ReviewCareer;
