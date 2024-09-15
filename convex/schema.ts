// NOTE: You can remove this file. Declaring the shape
// of the database is entirely optional in Convex.
// See https://docs.convex.dev/database/schemas.

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    documents: defineTable({
      fieldOne: v.string(),
      fieldTwo: v.object({
        subFieldOne: v.array(v.number()),
      }),
    }),
    // This definition matches the example query and mutation code:
    numbers: defineTable({
      value: v.number(),
    }),

    // courses
    courses: defineTable({
      name: v.string(),
      description: v.string(),
      teachers: v.array(v.string()),
      students: v.array(v.string()),
      assignments: v.array(v.string()),
    }),

    // users
    users: defineTable({
      name: v.string(),
      email: v.string(),
      role: v.string(),
      courses: v.array(v.string()),
    }),

    // questions
    questions: defineTable({
      question: v.string(),
      assignmentId: v.string(),
      maxPoints: v.number(),
      sampleAnswer: v.string(),
      manualGrading: v.boolean(),
    }),

    // submissions
    submissions: defineTable({
      userEmail: v.string(),
      assignmentId: v.string(),
      questionId: v.string(),
      studentAnswer: v.string(),
      numPoints: v.number(),
      confidence: v.number(),
      feedback: v.string(),
      citation: v.string(),
    }),

    // assignments
    assignments: defineTable({
      name: v.string(),
      description: v.string(),
      dueDate: v.string(),
      course: v.string(),
      questionIds: v.array(v.string()),
      rubricId: v.string(),
    }),

    // grading rubric
    rubrics: defineTable({
      assignmentId: v.string(),
      rubricItems: v.array(v.string()),
    }),
  },
  // If you ever get an error about schema mismatch
  // between your data and your schema, and you cannot
  // change the schema to match the current data in your database,
  // you can:
  //  1. Use the dashboard to delete tables or individual documents
  //     that are causing the error.
  //  2. Change this option to `false` and make changes to the data
  //     freely, ignoring the schema. Don't forget to change back to `true`!
  { schemaValidation: true }
);
