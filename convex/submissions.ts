import { v } from "convex/values";
import { query, mutation, action, internalQuery } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { prompt } from "./llm";

export const getSubmissionsByStudent = query({
  args: {
    assignmentId: v.string(),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("assignmentId"), args.assignmentId))
      .filter((q) => q.eq(q.field("userEmail"), args.userEmail))
      .collect();
    return submissions;
  },
});

export const getSubmissionsByAssignment = query({
  args: {
    assignmentId: v.string(),
  },
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("assignmentId"), args.assignmentId))
      .collect();
    return submissions;
  },
});

export const getUserSubmissionsForAssignment = query({
  args: {
    assignmentId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all submissions for the assignment
    const submissions = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("assignmentId"), args.assignmentId))
      .collect();

    // Get all users
    const users = await ctx.db.query("users").collect();

    // Return an array of objects: { userId: [submissions] }
    const userSubmissions = users.map((user) => {
      const userSubs = submissions.filter((sub) => sub.userEmail === user.email);
      return {
        userId: user._id,
        submissions: userSubs,
      };
    });

    return userSubmissions;
  },
});

export const updateSubmissionWithAnswer = mutation({
  args: {
    assignmentId: v.string(),
    userEmail: v.string(),
    questionId: v.string(),
    studentAnswer: v.string(),
  },
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("assignmentId"), args.assignmentId))
      .filter((q) => q.eq(q.field("userEmail"), args.userEmail))
      .filter((q) => q.eq(q.field("questionId"), args.questionId))
      .collect();

    if (submissions.length === 0) {
      return;
    }

    const submission = submissions[0];

    await ctx.db.patch(submission._id, {
      studentAnswer: args.studentAnswer,
    });
  },
});

export const updateSubmission = mutation({
  args: {
    assignmentId: v.string(),
    userEmail: v.string(),
    questionId: v.string(),
    grade: v.number(),
    feedback: v.string(),
    citation: v.string(),
    confidence: v.number(),
  },
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("assignmentId"), args.assignmentId))
      .filter((q) => q.eq(q.field("userEmail"), args.userEmail))
      .filter((q) => q.eq(q.field("questionId"), args.questionId))
      .collect();

    if (submissions.length === 0) {
      return;
    }

    const submission = submissions[0];

    await ctx.db.patch(submission._id, {
      numPoints: args.grade,
      feedback: args.feedback,
      citation: args.citation || "",
      confidence: args.confidence || 2,
    })
  },
});

export const createSubmission = mutation({
  args: {
    assignmentId: v.string(),
    userEmail: v.string(),
    questionId: v.string(),
    studentAnswer: v.string(),
    numPoints: v.number(),
    confidence: v.number(),
    feedback: v.string(),
    citation: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("submissions", {
      assignmentId: args.assignmentId,
      userEmail: args.userEmail,
      questionId: args.questionId,
      studentAnswer: args.studentAnswer,
      numPoints: args.numPoints,
      confidence: args.confidence,
      feedback: args.feedback,
      citation: args.citation,
    });
  },
});

export const getSubmission = internalQuery({
  args: {
    userEmail: v.string(),
    questionId: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const submissions = await ctx.db
      .query("submissions")
      .filter((q: any) => q.eq(q.field("userEmail"), args.userEmail))
      .filter((q: any) => q.eq(q.field("questionId"), args.questionId))
      .collect();

    if (submissions.length == 0) return null;
    return submissions[0];
  }
})

export const createOrModifySubmission = mutation({
  args: {
    assignmentId: v.string(),
    userEmail: v.string(),
    questionId: v.string(),
    studentAnswer: v.string(),
    numPoints: v.number(),
    confidence: v.number(),
    feedback: v.string(),
    citation: v.string(),
  },
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("assignmentId"), args.assignmentId))
      .filter((q) => q.eq(q.field("userEmail"), args.userEmail))
      .filter((q) => q.eq(q.field("questionId"), args.questionId))
      .collect();

    if (submissions.length === 0) {
      await createSubmission(ctx, args);
    } else {
      await updateSubmissionWithAnswer(ctx, {
        assignmentId: args.assignmentId,
        userEmail: args.userEmail,
        questionId: args.questionId,
        studentAnswer: args.studentAnswer,
      });
    }
  },
});

export const getQuestion = internalQuery({
  args: {
    questionId: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const questions = await ctx.db
      .query("questions")
      .filter((q: any) => q.eq(q.field("_id"), args.questionId))
      .collect();

    if (questions.length == 0) return null;
    return questions[0];
  }
})

export const updateSubmissionAuto = action({
  args: {
    assignmentId: v.string(),
    userEmail: v.string(),
    questionId: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    console.log('attempting to autograde', args.userEmail, args.questionId);

    const submission = await ctx.runQuery(internal.submissions.getSubmission, {
      userEmail: args.userEmail,
      questionId: args.questionId,
    });
    if (!submission) return;

    const question = await ctx.runQuery(internal.submissions.getQuestion, {
      questionId: args.questionId
    });

    const evaluation = await prompt(
      question.question,
      question.sampleAnswer,
      submission.studentAnswer,
    );

    await ctx.runMutation(api.submissions.updateSubmission, {
      assignmentId: args.assignmentId,
      userEmail: args.userEmail,
      questionId: args.questionId,
      grade: evaluation.isCorrect ? question.maxPoints : 0,
      feedback: evaluation.feedback,
      citation: evaluation.citation,
      confidence: evaluation.confidence,
    });
  },
});

export const submitStudentAnswersFromForm = action({
  args: {
    assignmentId: v.string(),
    userEmail: v.string(),
    answers: v.array(v.object({
      questionId: v.string(),
      studentAnswer: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    for (const answer of args.answers) {
      const submission = await ctx.runQuery(internal.submissions.getSubmission, {
        userEmail: args.userEmail,
        questionId: answer.questionId,
      });

      if (submission) {
        await ctx.runMutation(api.submissions.updateSubmission, {
          assignmentId: args.assignmentId,
          userEmail: args.userEmail,
          questionId: answer.questionId,
          grade: 0,
          feedback: "Resubmission",
          citation: "",
          confidence: 2,
        });
      } else {
        await ctx.runMutation(api.submissions.createSubmission, {
          userEmail: args.userEmail,
          assignmentId: args.assignmentId,
          questionId: answer.questionId,
          studentAnswer: answer.studentAnswer,
          numPoints: 0,
          confidence: 0,
          feedback: "",
          citation: "",
        });
      }
    }
  }
})