import React from 'react'

const CareerDetails = () => {
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
        
  )
}

export default CareerDetails