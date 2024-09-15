import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

export const getSingleRubric = query({
  args: {
    rubricId: v.string(),
  },
  handler: async (ctx, args) => {
    const rubric = await ctx.db
      .query("rubrics")
      .filter((q) => q.eq(q.field("_id"), args.rubricId))
      .collect();
    return rubric[0];
  },
});

export const getByAssignment = query({
  args: {
    assignmentId: v.string(),
  },
  handler: async (ctx, args) => {
    const rubrics = await ctx.db
      .query("rubrics")
      .filter((q) => q.eq(q.field("assignmentId"), args.assignmentId))
      .collect();
    return rubrics[0];
  },
});

export const create = mutation({
  args: {
    assignmentId: v.string(),
    rubricItems: v.array(
      v.string(),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("rubrics", {
      assignmentId: args.assignmentId,
      rubricItems: args.rubricItems,
    });

    const rubrics = await getByAssignment(ctx, { assignmentId: args.assignmentId });
    return rubrics;
  },
});