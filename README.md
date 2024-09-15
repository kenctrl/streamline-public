# Streamline

## Educators: streamline your teaching by transparently automating away the tedious grading!

### Inspiration
We’ve seen first-hand how grading can be time-consuming for teachers, especially with large classes. A common problem faced by all educators is spreading their limited time across preparing course materials, teaching, and tedious grading. Having worked as TAs and graders at MIT, we’ve attempted to automate away as much of the tedious grading process as we can, while still allowing for teacher and student input and promoting trust and transparency for generative models among the educational community.

### Description
We’ve automated away the tedious parts of grading, while still leaving room for teacher and student input in the process. We use LLMs to swiftly grade simple black-or-white questions with high confidence, and provide initial grades for longer/more difficult questions, with requests for human input. To increase trust among the education community, we try our best to provide full transparency to both the teacher and the student, providing citations to specific parts of the student answer for evidence and a confidence score that the LLM assigns itself. Our platform makes it easy for teachers to manually override the LLM generated grade, flagging grades with no citations and a low confidence score. Our hope is that grading time will be reduced for thousands of classes that are graded manually, allowing teachers to focus their energy on other, more meaningful tasks. 

### Instructions
Run `npm install` to install dependencies, then run `npx convex deploy` to deploy the webapp.
