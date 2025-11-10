import React from "react";

const Tips = (props) => {
  return (
    <div className="flex flex-col gap-8 w-full px-2 md:w-2/5">
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
            {props.current == 0 && (
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
                  for better searchability (e.g., “Software Engineer” instead of
                  “Code Ninja” or “Tech Rockstar”).
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
                  or internal role codes that applicants may not understand
                  (e.g., use “QA Engineer” instead of “QE II” or “QA-TL”).
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

            {props.current == 1 && (
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
                  to collect key details such as notice period, work setup, or
                  salary expectations to guide your review and candidate
                  discussions.
                </p>
              </div>
            )}

            {props.current == 2 && (
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
                  to quickly create tailored interview questions, then refine or
                  mix them with your own for balanced results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tips;
