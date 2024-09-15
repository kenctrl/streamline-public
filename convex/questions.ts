import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

export const getQuestionIdsByAssignment = mutation({
  args: {
    assignmentId: v.string(),
  },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("assignmentId"), args.assignmentId))
      .collect();

    return questions.map((q) => q._id);
  },
});

export const getQuestionsByAssignment = query({
  args: {
    assignmentId: v.string(),
  },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("assignmentId"), args.assignmentId))
      .collect();

    return questions;
  },
});

export const getSingleQuestion = query({
  args: {
    questionId: v.string(),
  },
  handler: async (ctx, args) => {
    const question = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("_id"), args.questionId))
      .collect();
    return question[0];
  },
});

export const create = mutation({
  args: {
    question: v.string(),
    assignmentId: v.string(),
    maxPoints: v.number(),
    sampleAnswer: v.string(),
    // manualGrading: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("questions", {
      question: args.question,
      assignmentId: args.assignmentId,
      maxPoints: args.maxPoints,
      sampleAnswer: args.sampleAnswer,
      manualGrading: true,
    });
  },
});