import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Typography, Button, Box, Modal, Grid, Card, CardContent, CardActions } from "@mui/material";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CreateCourseForm from "./CreateCourseForm";

function Courses() {
  const courses = useQuery(api.courses.get); // Fetch course data from the database
  const [openModal, setOpenModal] = useState(false); // Toggle modal visibility

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" align="center" sx={{ mb: 4, fontWeight: 500 }}>
        Your Courses
      </Typography>

      {/* Card Grid for Existing Courses */}
      <Grid container spacing={3}>
        {courses?.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
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
                  {course.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#777', mt: 1 }}>
                  {course.description || 'No description available.'}
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: 2 }}>
                <Button
                  size="small"
                  color="primary"
                  component={Link}
                  to={`/courses/${course._id}`}
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
                  View Assignments
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Buttons to open the Create Course modal */}
      {/* make the buttons centered on the screen side by side, close together but with some space between */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 8, gap: 4 }}>
        <Button
          variant="outlined"
          // onClick={}
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
          Join Course
        </Button>
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
          Create New Course
        </Button>
      </Box>

      {/* Modal for the Create Course form */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="create-course-modal"
        aria-describedby="create-course-modal-description"
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
          <CreateCourseForm
            onSuccess={() => {
              setOpenModal(false);
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
}

export default Courses;
