import React from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import UploadRubricForm from "./UploadRubricForm"; // Assuming you have the upload rubric form

const Rubric: React.FC = () => {
  const { courseId, assignmentId } = useParams(); // Get courseId and assignmentId from URL params
  const assignment = useQuery(api.assignments.getSingleAssignment, { assignmentId: assignmentId || "" }); // Fetch assignment data
  const rubric = useQuery(api.questions.getQuestionsByAssignment, { assignmentId: assignmentId || "" }); // Fetch rubric

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Sidebar */}
      <Box
        sx={{
          width: 240, // Fixed width for sidebar
          backgroundColor: '#F5F5F5', // Light background for sidebar
          height: '100vh', // Full height
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)', // Soft shadow to define sidebar
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1976D2', mr: 20 }}>
          Rubric
        </Typography>

        <List component="nav">
          <ListItem button component={Link} to={`/courses/${courseId}/assignments/${assignmentId}`}>
            <ListItemText primary="Back to Assignment" sx={{ color: '#333' }} />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem button component={Link} to={`/courses/${courseId}/assignments/${assignmentId}/statistics`}>
            <ListItemText primary="Statistics" sx={{ color: '#333' }} />
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
          {assignment?.name}
        </Typography>

        {rubric?.length !== 0 ? (
          // Display the completed rubric in read-only mode
          <List>
            {rubric?.map((item, index) => (
              <Box key={index}>
                <ListItem
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 2, // Padding for a clean layout
                    borderBottom: '1px solid #e0e0e0', // Add a subtle line between items
                    alignItems: 'flex-start', // Ensures text aligns properly
                  }}
                >
                  {/* Left Column: Question and Sample Answer */}
                  <Box sx={{ flex: 1, pr: 2, minWidth: 0 }}> {/* Ensures text wraps properly */}
                    <Typography variant="body3" sx={{ fontWeight: 500, whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Question {index + 1}: {item.question}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: '#555', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      Sample Answer: {item.sampleAnswer}
                    </Typography>
                  </Box>

                  {/* Right Column: Max Points */}
                  <Typography variant="body1" sx={{ fontWeight: 600, whiteSpace: 'nowrap', ml: 2 }}>
                    Max Points: {item.maxPoints}
                  </Typography>
                </ListItem>
              </Box>
            ))}
          </List>
        ) : (
          // Show the upload rubric form if no rubric is defined
          <Box sx={{ marginTop: 4 }}>
            <UploadRubricForm assignmentId={assignmentId} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Rubric;
