import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

export const getUserFromEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return user[0];
  },
});

export const getUserFromId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.userId))
      .collect();
    return user[0];
  },
});

// export const getUsersFromAssignmentId = query({
//   args: {
//     assignmentId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     // Get assignment
//     const assignment = await ctx.db
//       .query("assignments")
//       .filter((q) => q.eq(q.field("_id"), args.assignmentId))
//       .collect();
//     if (assignment.length === 0) {
//       return [];
//     }

//     // Get user emails from assignment
//     const submissions = assignment[0].submissions;
//     const userEmails = submissions.map((s) => s.userEmail);

//     // Get user for each user email
//     const users = userEmails.map(async (email) => {
//       const user = await getUserFromEmail(ctx, { email });
//       return user;
//     });

//     return users;
//   },
// });

export const getUsersFromCourseId = query({
  args: {
    courseId: v.string(),
  },
  handler: async (ctx, args) => {
    const courses = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("_id"), args.courseId))
      .collect();

    if (courses.length === 0) {
      return [];
    }

    const course = courses[0];
    const courseStudents = course.students;

    const users = courseStudents.map(async (studentId) => {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), studentId))
        .collect();
      return user[0];
    }
    );

    const users2 = await Promise.all(users);
    return users2;
  }
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});