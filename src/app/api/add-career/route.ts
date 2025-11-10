import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { guid } from "@/lib/Utils";
import { ObjectId } from "mongodb";
import {
  sanitizeString,
  sanitizeHTML,
  sanitizeObject,
  sanitizeNumber,
  sanitizeBoolean,
  validateLength,
} from "@/lib/sanitization";

export async function POST(request: Request) {
  try {
    let {
      jobTitle,
      description,
      questions,
      lastEditedBy,
      createdBy,
      screeningSetting,
      orgID,
      requireVideo,
      location,
      workSetup,
      workSetupRemarks,
      status,
      salaryNegotiable,
      temporarySave,
      currentStep,
      minimumSalary,
      maximumSalary,
      country,
      province,
      employmentType,
      preScreeningQuestions,
      secretPrompt,
      aiSecretPrompt,
      aiScreeningSetting,
    } = await request.json();

    // Sanitize string inputs
    jobTitle = sanitizeString(jobTitle);
    workSetup = sanitizeString(workSetup);
    workSetupRemarks = sanitizeString(workSetupRemarks);
    screeningSetting = sanitizeString(screeningSetting);
    location = sanitizeString(location);
    country = sanitizeString(country);
    province = sanitizeString(province);
    employmentType = sanitizeString(employmentType);
    aiScreeningSetting = sanitizeString(aiScreeningSetting);
    
    // Sanitize HTML content (job description)
    description = sanitizeHTML(description);
    
    // Sanitize prompts
    secretPrompt = sanitizeString(secretPrompt);
    aiSecretPrompt = sanitizeString(aiSecretPrompt);
    
    // Sanitize nested objects (questions, pre-screening questions)
    questions = sanitizeObject(questions);
    preScreeningQuestions = sanitizeObject(preScreeningQuestions);
    lastEditedBy = sanitizeObject(lastEditedBy);
    createdBy = sanitizeObject(createdBy);
    
    // Validate and sanitize numbers
    const sanitizedMinSalary = sanitizeNumber(minimumSalary);
    const sanitizedMaxSalary = sanitizeNumber(maximumSalary);
    
    // Validate booleans
    requireVideo = sanitizeBoolean(requireVideo);
    salaryNegotiable = sanitizeBoolean(salaryNegotiable);
    temporarySave = sanitizeBoolean(temporarySave);
    
    // Validate required field lengths
    validateLength(jobTitle, "Job title", 3, 200);
    validateLength(description, "Job description", 10, 10000);
    validateLength(workSetup, "Work setup", 2, 100);
    validateLength(location, "Location", 2, 200);
    // Validate required fields
    if (!jobTitle || !description || !questions || !location || !workSetup) {
      return NextResponse.json(
        {
          error:
            "Job title, description, questions, location and work setup are required",
        },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    const orgDetails = await db.collection("organizations").aggregate([
      {
        $match: {
          _id: new ObjectId(orgID)
        }
      },
      {
        $lookup: {
            from: "organization-plans",
            let: { planId: "$planId" },
            pipeline: [
                {
                    $addFields: {
                        _id: { $toString: "$_id" }
                    }
                },
                {
                    $match: {
                        $expr: { $eq: ["$_id", "$$planId"] }
                    }
                }
            ],
            as: "plan"
        }
      },
      {
        $unwind: "$plan"
      },
    ]).toArray();

    if (!orgDetails || orgDetails.length === 0) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const totalActiveCareers = await db.collection("careers").countDocuments({ orgID, status: "active" });

    if (totalActiveCareers >= (orgDetails[0].plan.jobLimit + (orgDetails[0].extraJobSlots || 0))) {
      return NextResponse.json({ error: "You have reached the maximum number of jobs for your plan" }, { status: 400 });
    }

    const career = {
      id: guid(),
      jobTitle,
      description,
      questions,
      location,
      workSetup,
      workSetupRemarks,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastEditedBy,
      createdBy,
      status: status || "active",
      screeningSetting,
      orgID,
      requireVideo,
      temporarySave,
      currentStep,
      lastActivityAt: new Date(),
      salaryNegotiable,
      minimumSalary: sanitizedMinSalary,
      maximumSalary: sanitizedMaxSalary,
      country,
      province,
      employmentType,
      preScreeningQuestions,
      secretPrompt,
      aiSecretPrompt,
      aiScreeningSetting,
    };

    const result = await db.collection("careers").insertOne(career);

    return NextResponse.json({
      message: "Career added successfully",
      career: {
        ...career,
        _id: result.insertedId,
      },
    });
  } catch (error) {
    console.error("Error adding career:", error);
    return NextResponse.json(
      { error: "Failed to add career" },
      { status: 500 }
    );
  }
}
