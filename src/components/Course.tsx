import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Modal, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CreateAssignmentForm from "./CreateAssignmentForm"; // Import the CreateAssignmentForm component

const drawerWidth = 240; // Width of the fixed sidebar

function Course() {
  const { courseId } = useParams(); // Get courseId from the URL params
  const assignments = useQuery(api.assignments.getByCourse, { courseId: courseId || '' }); // Fetch assignments for the course
  const course = useQuery(api.courses.getSingleCourse, { courseId: courseId || '' }); // Fetch course data from the database
  const [openModal, setOpenModal] = useState(false); // Manage modal visibility

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
          Assignments
        </Typography>

        <List component="nav">
          <ListItem button component={Link} to={`/courses`}>
            <ListItemText primary="Back to All Courses" sx={{ color: '#333' }} />
          </ListItem>
          {/* <Divider sx={{ my: 1 }} /> */}
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
        {/* Course Title */}
        <Typography variant="h3" align="center" sx={{ mb: 4, fontWeight: 500 }}>
          Assignments for {course?.name || 'Loading...'}
        </Typography>

        {/* Card Grid for Existing Assignments */}
        <Grid container spacing={3}>
          {assignments?.map((assignment) => (
            <Grid item xs={12} sm={6} md={4} key={assignment._id}>
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
                    {assignment.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#777', mt: 1 }}>
                    {assignment.description || 'No description available.'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    color="primary"
                    component={Link}
                    to={`/courses/${courseId}/assignments/${assignment._id}`}
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
                    View Assignment
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}

          {assignments?.length === 0 && (
            <Typography align="center" sx={{ width: '100%' }} color="textSecondary">
              No assignments available.
            </Typography>
          )}
        </Grid>

        {/* Button to open the Create Assignment modal */}
        <Box textAlign="center" sx={{ marginTop: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenModal(true)}
            sx={{
              marginBottom: 3,
              textTransform: 'none',
              padding: '8px 16px',
              fontWeight: '500',
              borderRadius: 1,
              borderColor: '#1976D2',
              color: '#1976D2',
              ':hover': {
                backgroundColor: '#F5F5F5',
                borderColor: '#1976D2',
              },
            }}
          >
            Create New Assignment
          </Button>
        </Box>

        {/* Modal for the Create Assignment form */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="create-assignment-modal"
          aria-describedby="create-assignment-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
              p: 4,
            }}
          >
            <CreateAssignmentForm
              onSuccess={() => {
                setOpenModal(false); // Close the modal when the assignment is successfully created
              }}
              courseId={courseId} // Pass courseId to associate the new assignment with this course
            />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default Course;
