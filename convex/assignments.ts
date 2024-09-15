import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

export const getSingleAssignment = query({
  args: {
    assignmentId: v.string(),
  },
  handler: async (ctx, args) => {
    const assignment = await ctx.db
      .query("assignments")
      .filter((q) => q.eq(q.field("_id"), args.assignmentId))
      .collect();
    return assignment[0];
  },
});

export const getByCourse = query({
  args: {
    courseId: v.string(),
  },
  handler: async (ctx, args) => {
    const assignments = await ctx.db
      .query("assignments")
      .filter((q) => q.eq(q.field("course"), args.courseId))
      .collect();
    return assignments;
  },
});

// TODO: for now, we are just displaying everything for everyone
export const get = query({
  handler: async (ctx) => {
    const courses = await ctx.db
      .query("assignments")
      // .filter((q) => q.eq(q.field("email"), identity?.email))
      .collect();
    return courses;
  },
});

// Create assignment
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    dueDate: v.string(),
    course: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("assignments", {
      name: args.name,
      description: args.description,
      dueDate: args.dueDate,
      course: args.course,
      questionIds: [],
      rubricId: "",
    });

    // return assignment id
    const assignmentInfo = await get(ctx, {});
    return assignmentInfo;
  },
});
