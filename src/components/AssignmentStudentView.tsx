import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, TextField, Button, Divider, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const AssignmentStudentView: React.FC = () => {
  const { assignmentId, userId, courseId } = useParams(); // Now with courseId for sidebar links
  const questions = useQuery(api.questions.getQuestionsByAssignment, { assignmentId: assignmentId || "" });
  const [answers, setAnswers] = useState<{ [key: string]: string }>({}); // Store answers keyed by question ID
  const submitAnswers = useMutation(api.submissions.createOrModifySubmission); // Assume an API for submitting answers
  const user = useQuery(api.users.getUserFromId, { userId: userId || "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateSubmissionAuto = useAction(api.submissions.updateSubmissionAuto);

  // Handle answer changes
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Prepare answers for submission
    const answersArray = Object.keys(answers).map((questionId) => ({
      questionId,
      answer: answers[questionId],
    }));

    // Submit answers to the server for each answer
    await Promise.all(answersArray.map(async (answer) => {
      console.log("Submitting answer", answer);
      await submitAnswers({
        userEmail: user?.email || "",
        assignmentId: assignmentId || "",
        questionId: answer.questionId,
        studentAnswer: answer.answer,
        numPoints: 0, // Assume no points for now
        feedback: "", // Assume no feedback for now
        citation: "", // Assume no citation for now
        confidence: 0, // Assume confidence level 2 for now
      });
    }));

    setIsSubmitting(false);

    // Autograde the submissions
    for (const answer of answersArray) {
      await updateSubmissionAuto({
        assignmentId: assignmentId || "",
        userEmail: user?.email || "",
        questionId: answer.questionId,
      });
    }

    alert("Answers submitted successfully!");
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          backgroundColor: '#F5F5F5',
          height: '100vh',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1976D2' }}>
          Student Menu
        </Typography>
        <List component="nav">
          <ListItem button component={Link} to={`/courses/${courseId}/assignments/${assignmentId}`}>
            <ListItemText primary="Back to Teacher View" sx={{ color: '#333' }} />
          </ListItem>
          {/* <Divider sx={{ my: 1 }} /> */}
          {/* <ListItem button component={Link} to={`/courses/${courseId}/assignments/${assignmentId}/students/${userId}`}>
            <ListItemText primary="Go to Teacher View" sx={{ color: '#333' }} />
          </ListItem> */}
        </List>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h3" align="center" sx={{ mb: 4, fontWeight: 600, }}>
          {`Submit Your Answers: ${user?.name}`}
        </Typography>

        {/* Dynamic Form for Questions */}
        {questions ? (
          questions?.map((question) => (
            <Box key={question._id} sx={{ mb: 4, border: '1px solid #ddd', padding: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: "#333", fontWeight: 500 }}>
                {question.question}
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={answers[question._id] || ""}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                placeholder="Enter your answer here"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1976D2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976D2',
                    },
                  },
                }}
              />
              <Divider sx={{ my: 2 }} />
            </Box>
          ))
        ) : (
          <CircularProgress />
        )}

        {/* Submit Button */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="outlined"
            disabled={isSubmitting}
            onClick={handleSubmit}
            sx={{
              padding: '10px 30px',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 1,
              borderColor: isSubmitting ? '#999' : '#1976D2',
              color: isSubmitting ? '#999' : '#1976D2',
              ':hover': {
                backgroundColor: '#f5f5f5',
                borderColor: '#1976D2',
              },
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answers'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AssignmentStudentView;
