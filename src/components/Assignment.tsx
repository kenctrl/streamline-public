import React from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const drawerWidth = 240; // Width of the fixed sidebar

const Assignment: React.FC = () => {
  const { courseId, assignmentId } = useParams(); // Get courseId and assignmentId from URL
  const assignment = useQuery(api.assignments.getSingleAssignment, { assignmentId: assignmentId || "" });
  const students = useQuery(api.users.getUsersFromCourseId, { courseId: courseId || "" }); // Fetch students related to the assignment

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Sidebar */}
      <Box
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          backgroundColor: '#F5F5F5', // Light background for sidebar
          height: '100vh', // Full height
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)', // Soft shadow to define sidebar
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1976D2' }}>
          Assignment
        </Typography>

        <List component="nav">
          <ListItem button component={Link} to={`/courses/${courseId}`}>
            <ListItemText primary="Back to All Assignments" sx={{ color: '#333' }} />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem button component={Link} to={`/courses/${courseId}/assignments/${assignmentId}/submissions`}>
            <ListItemText primary="Upload Submissions (Beta)" sx={{ color: '#333' }} />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem button component={Link} to={`/courses/${courseId}/assignments/${assignmentId}/rubric`}>
            <ListItemText primary="Rubric" sx={{ color: '#333' }} />
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

        {/* Students Card Layout */}
        <Grid container spacing={3}>
          {students?.length || 0 > 0 ? (
            students?.map((student) => (
              <Grid item xs={12} sm={6} md={4} key={student._id}>
                <Card
                  sx={{
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)', // Subtle shadow for a professional look
                    transition: 'transform 0.2s, box-shadow 0.2s', // Smooth transition
                    borderRadius: 2, // Rounded corners for modern style
                    '&:hover': {
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)', // Slight shadow increase on hover
                      transform: 'translateY(-4px)', // Slight upward movement on hover
                    },
                    padding: 2, // Padding inside the card
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 500, color: '#333' }}>
                      {student.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#777', mt: 1 }}>
                      {student.email}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ mt: 2 }}>
                    <Button
                      size="small"
                      color="primary"
                      component={Link}
                      to={`/courses/${courseId}/assignments/${assignmentId}/students/${student._id}`}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 'bold',
                        borderRadius: 1,
                        color: '#1976D2', // Use professional color palette
                        ':hover': {
                          backgroundColor: '#F5F5F5', // Softer hover background
                        },
                      }}
                    >
                      View Submissions
                    </Button>
                    <Button
                      size="small"
                      color="secondary"
                      component={Link}
                      to={`/courses/${courseId}/assignments/${assignmentId}/students/${student._id}/student-view`}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 'bold',
                        borderRadius: 1,
                        color: '#1976D2', // Use professional color palette
                        ':hover': {
                          backgroundColor: '#F5F5F5', // Softer hover background
                        },
                      }}
                    >
                      View As Student
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography align="center" color="textSecondary">
              No students are currently assigned to this course.
            </Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Assignment;
