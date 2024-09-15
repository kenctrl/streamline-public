import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, Grid, Divider, Tooltip, Button, Modal, TextField, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { HighlightOff, Warning as WarningIcon } from "@mui/icons-material"; // Import warning icon
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { styled } from '@mui/system';

// Tooltip styling
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .MuiTooltip-tooltip`]: {
    fontSize: '1rem',
    backgroundColor: '#f5f5f9',
    color: '#333',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '10px 20px',
  },
  [`& .MuiTooltip-arrow`]: {
    color: '#f5f5f9',
  },
});

// Modal style
const styleModal = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  paddingBottom: '80px',
};

// Helper function to wrap the citation with tooltip and highlight
const highlightCitation = (studentAnswer: string, citation: string) => {
  if (!citation) return studentAnswer;

  const regex = new RegExp(`(${citation})`, 'gi');
  const parts = studentAnswer.split(regex);

  return parts.map((part, i) => (
    part.toLowerCase() === citation.toLowerCase() ? (
      <CustomTooltip key={i} title="Cited by AI" arrow followCursor>
        <span style={{ backgroundColor: 'yellow' }}>{part}</span>
      </CustomTooltip>
    ) : (
      <span key={i}>{part}</span>
    )
  ));
};

const Student: React.FC = () => {
  const { courseId, assignmentId, userId } = useParams(); // Get courseId, assignmentId, and student email from URL params
  const [open, setOpen] = useState(false); // Modal state
  const [selectedQuestion, setSelectedQuestion] = useState(""); // Track selected question for manual grading
  const [points, setPoints] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  // Fetch the assignment details, questions, and student submissions
  const user = useQuery(api.users.getUserFromId, { userId: userId || "" });
  const assignment = useQuery(api.assignments.getSingleAssignment, { assignmentId: assignmentId || "" });
  const questions = useQuery(api.questions.getQuestionsByAssignment, { assignmentId: assignmentId || "" });
  const submissions = useQuery(api.submissions.getSubmissionsByStudent, {
    assignmentId: assignmentId || "",
    userEmail: user?.email || "",
  });

  // Calculate the total score for the student
  const totalScore = submissions?.reduce((acc, submission) => acc + (submission.numPoints || 0), 0) || 0;
  const maxTotalScore = questions?.reduce((acc, question) => acc + question.maxPoints, 0) || 0;

  const updateSubmission = useMutation(api.submissions.updateSubmission); // Assume mutation to update submission
  const updateSubmissionAuto = useAction(api.submissions.updateSubmissionAuto);

  const handleManualGradeClick = (questionId: string) => {
    setSelectedQuestion(questionId);
    setOpen(true);
  };

  const handleAutoGradeClick = async (questionId: string) => {
    await updateSubmissionAuto({
      assignmentId: assignmentId || "",
      userEmail: user?.email || "",
      questionId: questionId || "",
    });
  };

  const handleModalClose = () => {
    setOpen(false);
    setSelectedQuestion("");
    setPoints(null);
    setFeedback('');
  };

  const handleFormSubmit = async () => {
    if (selectedQuestion && points !== null) {
      await updateSubmission({
        assignmentId: assignmentId || "",
        userEmail: user?.email || "",
        questionId: selectedQuestion,
        grade: points,
        feedback: feedback,
        citation: "",
        confidence: 2,
      });
      handleModalClose();
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'auto' }}> {/* Ensure content can overflow */}
      {/* Left Sidebar */}
      <Box
        sx={{
          width: 240, // Fixed width for sidebar
          flexShrink: 0,
          backgroundColor: '#F5F5F5', // Light background for sidebar
          height: '100vh', // Full height
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)', // Soft shadow to define sidebar
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1976D2' }}>
          Student Menu
        </Typography>

        <List component="nav">
          <ListItem button component={Link} to={`/courses/${courseId}/assignments/${assignmentId}`}>
            <ListItemText primary="Back to Assignment" sx={{ color: '#333' }} />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem button component={Link} to={`/courses/${courseId}/assignments/${assignmentId}/students/${userId}/student`}>
            <ListItemText primary="View as Student" sx={{ color: '#333' }} />
          </ListItem>
        </List>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          backgroundColor: '#fff', // White background for content area
        }}
      >
        <Typography variant="h3" align="center" sx={{ mb: 4, fontWeight: 500 }}>
          {assignment?.name}: {user?.name}'s Results
        </Typography>

        {/* Display total score at the top */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, }}>
          <Typography variant="h5" sx={{ color: '#1976D2' }}>
            Total Score: {totalScore}/{maxTotalScore}
          </Typography>
        </Box>

        {/* Questions in Expandable Cards */}
        {questions?.map((question, index) => {
          const submission = submissions?.find(sub => sub.questionId === question._id); // Find the submission for this question
          const confidence = submission?.confidence ?? null;
          const isSubmitted = submission?.studentAnswer !== undefined;
          const isGraded = submission?.numPoints !== undefined;
          const isManuallyGraded = submission?.confidence === 2;

          console.log("Citations: ", submission?.citation);

          // Check for low confidence or missing citation
          const needsManualGrading = (confidence !== null && confidence < 0.7) || !submission?.citation;

          return (
            <Accordion key={question._id} sx={{ mb: 2, borderRadius: 2, boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                sx={{
                  backgroundColor: '#f5f5f5',
                  '&:hover': {
                    backgroundColor: '#eaeaea',
                  },
                }}
              >
                {/* span box */}
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, flexGrow: 1 }}>
                    Question {index + 1}
                  </Typography>
                  {/* Grading Status Indicator */}
                  {needsManualGrading && (
                    <CustomTooltip title="Manual grading recommended" arrow>
                      <WarningIcon sx={{ color: 'red', mr: 1.5 }} />
                    </CustomTooltip>
                  )}
                  {!isManuallyGraded && submission?.studentAnswer !== '' && (
                    <Box sx={{
                      backgroundColor: 'lightgrey',
                      color: 'black',
                      borderRadius: 1,
                      p: 0.5,
                      fontSize: '0.75rem',
                      mr: 1.3,
                    }}>
                      Autograder
                    </Box>
                  )}
                  {isSubmitted ? (
                    isGraded ? (
                      <>
                        <Typography variant="body1" sx={{ color: '#1976D2', mr: 1.3, mt: 0.1 }}>
                          {submission?.numPoints}/{question.maxPoints}
                        </Typography>
                        {submission?.numPoints === question.maxPoints ? (
                          <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} /> // Checkmark if graded and correct
                        ) : (
                          <HighlightOff sx={{ color: '#f44336', mr: 1, filter: 'invert(0)' }} /> // Cross if graded but incorrect
                        )}
                      </>
                    ) : (
                      <CircularProgress size={20} color="inherit" /> // Loading icon if still grading
                    )
                  ) : null}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                {/* Full Question and Details when Expanded */}
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  <b>Question:</b> {question.question}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  <b>Rubric Answer:</b> {question.sampleAnswer}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" gutterBottom>
                  <b>Student Answer:</b> {highlightCitation(submission?.studentAnswer || "", submission?.citation || "")}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" gutterBottom>
                  <b>Points:</b> {isGraded && submission?.numPoints !== undefined ? `${submission?.numPoints}/${question.maxPoints}` : "Not Graded Yet"}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" gutterBottom>
                  <b>Confidence:</b> {confidence === null ? "N/A" : confidence >= 0.8 ? `High (${confidence})` : confidence >= 0.6 ? `Medium (${confidence})` : `Low (${confidence})`}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" gutterBottom>
                  <b>Feedback:</b> {submission?.feedback || "N/A"}
                </Typography>

                {/* Buttons at the Bottom */}
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleManualGradeClick(question._id)}
                    sx={{
                      textTransform: 'none', fontWeight: 'normal', mr: 1, color: '#1976D2', borderRadius: 1,
                      borderColor: '#1976D2',
                    }}
                  >
                    Manual Grade
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleAutoGradeClick(question._id)}
                    sx={{
                      textTransform: 'none', fontWeight: 'normal', color: '#1976D2', borderRadius: 1,
                      borderColor: '#1976D2',
                    }}
                  >
                    Auto Grade
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}

        {/* Modal for Manual Grading */}
        <Modal
          open={open}
          onClose={handleModalClose}
          aria-labelledby="manual-grade-modal"
          aria-describedby="manual-grade-form"
        >
          <Box sx={styleModal}>
            <Typography variant="h6" gutterBottom>
              Manual Grading
            </Typography>
            <TextField
              label="Points"
              type="number"
              fullWidth
              margin="normal"
              value={points ?? ''}
              onChange={(e) => setPoints(Number(e.target.value))}
            />
            <TextField
              label="Feedback"
              multiline
              rows={3}
              fullWidth
              margin="normal"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', paddingBottom: '15px' }}>
              <Button
                type="submit"
                variant="outlined"
                sx={{
                  backgroundColor: 'transparent',
                  color: 'black',
                  border: '1px solid grey',
                  ':hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  }
                }}
                onClick={handleFormSubmit}>
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Student;
