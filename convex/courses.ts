import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

export const getSingleCourse = query({
  args: {
    courseId: v.string(),
  },
  handler: async (ctx, args) => {
    const course = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("_id"), args.courseId))
      .collect();
    return course[0];
  },
});

// Get course info from courseName and assignmentName
// TODO: for now, we are just displaying everything for everyone
export const get = query({
  handler: async (ctx) => {
    const courses = await ctx.db
      .query("courses")
      // .filter((q) => q.eq(q.field("email"), identity?.email))
      .collect();
    return courses;
  },
});

// Create course
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    teachers: v.array(v.string()),
    students: v.array(v.string()),
    assignments: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const allUsers = await ctx.db.query("users").collect();
    const allUserIds = allUsers.map((user) => user._id);

    const identity = await ctx.auth.getUserIdentity();
    const teacher = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity?.email))
      .collect();

    await ctx.db.insert("courses", {
      name: args.name,
      description: args.description,
      teachers: [teacher[0]._id],
      students: allUserIds, // TODO: add all users for now
      assignments: args.assignments,
    });

    // return course id
    const courseInfo = await get(ctx, {});
    return courseInfo;
  },
});
