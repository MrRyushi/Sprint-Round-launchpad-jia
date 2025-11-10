import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
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
    let requestData = await request.json();
    const { _id } = requestData;

    // Validate required fields
    if (!_id) {
      return NextResponse.json(
        { error: "Job Object ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    let dataUpdates = { ...requestData };

    delete dataUpdates._id;

    // Sanitize all string fields
    if (dataUpdates.jobTitle) {
      dataUpdates.jobTitle = sanitizeString(dataUpdates.jobTitle);
      validateLength(dataUpdates.jobTitle, "Job title", 3, 200);
    }
    
    if (dataUpdates.description) {
      dataUpdates.description = sanitizeHTML(dataUpdates.description);
      validateLength(dataUpdates.description, "Job description", 10, 10000);
    }
    
    if (dataUpdates.workSetup) {
      dataUpdates.workSetup = sanitizeString(dataUpdates.workSetup);
      validateLength(dataUpdates.workSetup, "Work setup", 2, 100);
    }
    
    if (dataUpdates.workSetupRemarks) {
      dataUpdates.workSetupRemarks = sanitizeString(dataUpdates.workSetupRemarks);
    }
    
    if (dataUpdates.screeningSetting) {
      dataUpdates.screeningSetting = sanitizeString(dataUpdates.screeningSetting);
    }
    
    if (dataUpdates.location) {
      dataUpdates.location = sanitizeString(dataUpdates.location);
      validateLength(dataUpdates.location, "Location", 2, 200);
    }
    
    if (dataUpdates.country) {
      dataUpdates.country = sanitizeString(dataUpdates.country);
    }
    
    if (dataUpdates.province) {
      dataUpdates.province = sanitizeString(dataUpdates.province);
    }
    
    if (dataUpdates.employmentType) {
      dataUpdates.employmentType = sanitizeString(dataUpdates.employmentType);
    }
    
    if (dataUpdates.aiScreeningSetting) {
      dataUpdates.aiScreeningSetting = sanitizeString(dataUpdates.aiScreeningSetting);
    }
    
    if (dataUpdates.secretPrompt) {
      dataUpdates.secretPrompt = sanitizeString(dataUpdates.secretPrompt);
    }
    
    if (dataUpdates.aiSecretPrompt) {
      dataUpdates.aiSecretPrompt = sanitizeString(dataUpdates.aiSecretPrompt);
    }
    
    // Sanitize nested objects
    if (dataUpdates.questions) {
      dataUpdates.questions = sanitizeObject(dataUpdates.questions);
    }
    
    if (dataUpdates.preScreeningQuestions) {
      dataUpdates.preScreeningQuestions = sanitizeObject(dataUpdates.preScreeningQuestions);
    }
    
    if (dataUpdates.lastEditedBy) {
      dataUpdates.lastEditedBy = sanitizeObject(dataUpdates.lastEditedBy);
    }
    
    // Sanitize numbers
    if (dataUpdates.minimumSalary !== undefined) {
      dataUpdates.minimumSalary = sanitizeNumber(dataUpdates.minimumSalary);
    }
    
    if (dataUpdates.maximumSalary !== undefined) {
      dataUpdates.maximumSalary = sanitizeNumber(dataUpdates.maximumSalary);
    }
    
    // Sanitize booleans
    if (dataUpdates.requireVideo !== undefined) {
      dataUpdates.requireVideo = sanitizeBoolean(dataUpdates.requireVideo);
    }
    
    if (dataUpdates.salaryNegotiable !== undefined) {
      dataUpdates.salaryNegotiable = sanitizeBoolean(dataUpdates.salaryNegotiable);
    }
    
    if (dataUpdates.temporarySave !== undefined) {
      dataUpdates.temporarySave = sanitizeBoolean(dataUpdates.temporarySave);
    }
    
    // Add updated timestamp
    dataUpdates.updatedAt = new Date();

    const career = {
      ...dataUpdates,
    };

    await db
      .collection("careers")
      .updateOne({ _id: new ObjectId(_id) }, { $set: career });

    return NextResponse.json({
      message: "Career updated successfully",
      career,
    });
  } catch (error) {
    console.error("Error adding career:", error);
    return NextResponse.json(
      { error: "Failed to add career" },
      { status: 500 }
    );
  }
}
