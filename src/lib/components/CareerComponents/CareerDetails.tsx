"use client"
import React, { useEffect, useState } from "react";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import philippineCitiesAndProvinces from "../../../../public/philippines-locations.json";
import RichTextEditor from "./RichTextEditor";

const employmentTypeOptions = [
  {
    name: "Full-Time",
  },
  {
    name: "Part-Time",
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

const CareerDetails = (props) => {
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
    useEffect(() => {
    const parseProvinces = () => {
      setProvinceList(philippineCitiesAndProvinces.provinces);
      const defaultProvince = philippineCitiesAndProvinces.provinces[0];
      if (!props.career?.province) {
        props.setProvince(defaultProvince.name);
      }
      const cities = philippineCitiesAndProvinces.cities.filter(
        (city) => city.province === defaultProvince.key
      );
      setCityList(cities);
      if (!props.career?.location) {
        props.setCity(cities[0].name);
      }
    };
    parseProvinces();
  }, [props.career]);

  return (
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
            <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>
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
                value={props.jobTitle}
                className="form-control"
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#717680",
                }}
                placeholder="Enter job title"
                onChange={(e) => {
                  props.setJobTitle(e.target.value || "");
                }}
                required
              ></input>
              {props.jobTitle.length === 0 && (
                <p style={{ color: "red" }}>This field is required</p>
              )}
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
                      props.setEmploymentType(employmentType);
                    }}
                    screeningSetting={props.employmentType}
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
                      props.setWorkSetup(setting);
                    }}
                    screeningSetting={props.workSetup}
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
                      props.setCountry(setting);
                    }}
                    screeningSetting={props.country}
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
                      props.setProvince(province);
                      const provinceObj = provinceList.find(
                        (p) => p.name === province
                      );
                      const cities = philippineCitiesAndProvinces.cities.filter(
                        (city) => city.province === provinceObj.key
                      );
                      setCityList(cities);
                      props.setCity(cities[0].name);
                    }}
                    screeningSetting={props.province}
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
                      props.setCity(city);
                    }}
                    screeningSetting={props.city}
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
                      value={props.minimumSalary}
                      onChange={(e) => {
                        props.setMinimumSalary(e.target.value || "");
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
                      value={props.maximumSalary}
                      onChange={(e) => {
                        props.setMaximumSalary(e.target.value || "");
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
            <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>
              2. Job Description
            </span>
          </div>
          <div className="layered-card-content">
            <span>Description</span>
            <RichTextEditor
              setText={props.setDescription}
              text={props.description}
              placeholder={"Enter description"}
            />
            *
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerDetails;
