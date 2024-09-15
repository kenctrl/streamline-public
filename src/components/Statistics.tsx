import React from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, CircularProgress, List, ListItem, ListItemText, Button, IconButton, Divider } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOff from '@mui/icons-material/HighlightOff';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSidebar } from "../contexts/SidebarContext"; // Sidebar context

const drawerWidth = 240; // Updated to match new theme

const Statistics = () => {
  const { courseId, assignmentId } = useParams();
  const { sidebarOpen, toggleSidebar } = useSidebar();

  const userSubmissions = useQuery(api.submissions.getUserSubmissionsForAssignment, { assignmentId: assignmentId || "" });
  const allUsers = useQuery(api.users.getAllUsers); // Fetch all users

  const studentScores = userSubmissions?.map(submission => submission.submissions?.reduce((start, next) => start + next.numPoints, 0) ?? 0);
  const min = studentScores?.length > 0 ? Math.min(...studentScores) : 0;
  const max = studentScores?.length > 0 ? Math.max(...studentScores) : 0;
  const mean = studentScores?.length > 0 ? studentScores.reduce((acc, score) => acc + score, 0) / studentScores.length : 0;
  const median = studentScores?.length > 0 ? studentScores.sort((a, b) => a - b)[Math.floor(studentScores.length / 2)] : 0;
  const stdDev = studentScores?.length > 0 ? Math.sqrt(studentScores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / studentScores.length) : 0;

  const chartData = [
    { name: "0 - 10", Students: studentScores?.filter(score => score >= 0 && score < 10).length },
    { name: "10 - 20", Students: studentScores?.filter(score => score >= 10 && score < 20).length },
    { name: "20 - 30", Students: studentScores?.filter(score => score >= 20 && score < 30).length },
    { name: "30 - 40", Students: studentScores?.filter(score => score >= 30 && score < 40).length },
    { name: "40 - 50", Students: studentScores?.filter(score => score >= 40 && score < 50).length },
    { name: "50 - 60", Students: studentScores?.filter(score => score >= 50 && score < 60).length },
    { name: "60 - 70", Students: studentScores?.filter(score => score >= 60 && score < 70).length },
    { name: "70 - 80", Students: studentScores?.filter(score => score >= 70 && score < 80).length },
    { name: "80 - 90", Students: studentScores?.filter(score => score >= 80 && score < 90).length },
    { name: "90 - 100", Students: studentScores?.filter(score => score >= 90 && score <= 100).length },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'auto' }}>
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
          Statistics
        </Typography>

        <List component="nav">
          <ListItem button component={Link} to={`/courses/${courseId}/assignments/${assignmentId}`}>
            <ListItemText primary="Back to Assignment" sx={{ color: '#333' }} />
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
          Review Grades
        </Typography>

        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Students" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        {/* Statistics Summary */}
        <div style={{ display: "flex", justifyContent: "space-around", padding: "20px 0" }}>
          <div>Minimum: {min.toFixed(2)}</div>
          <div>Median: {median.toFixed(2)}</div>
          <div>Maximum: {max.toFixed(2)}</div>
          <div>Mean: {mean.toFixed(2)}</div>
          <div>Std Dev: {stdDev.toFixed(2)}</div>
        </div>

        {/* Student Accordion List */}
        {userSubmissions?.map(userSubmission => {
          const user = allUsers?.find(u => u._id === userSubmission.userId);
          const submission = userSubmission.submissions.reduce((acc, sub) => acc + sub.numPoints, 0);
          const wasAutogradeUsed = userSubmission.submissions.some(sub => sub.confidence !== 2 && sub.confidence !== 0);

          return (
            <Accordion key={userSubmission.userId} sx={{ mb: 2, borderRadius: 2, boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${userSubmission.userId}-content`}
                id={`panel${userSubmission.userId}-header`}
                sx={{
                  backgroundColor: '#f5f5f5',
                  '&:hover': {
                    backgroundColor: '#eaeaea',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, flexGrow: 1 }}>
                    {user?.name}
                  </Typography>
                  {/* {submission > 0 ? <CheckCircleIcon sx={{ color: '#4caf50' }} /> : <HighlightOff sx={{ color: '#f44336' }} />} */}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  <b>Email:</b> {user?.email}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" gutterBottom>
                  <b>Score:</b> {submission}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" gutterBottom>
                  <b>Autograder Used?</b> {wasAutogradeUsed ? "✔" : "✘"}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}

      </Box>

      {/* Floating button to open the sidebar when closed */}
      {!sidebarOpen && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: 'fixed',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            zIndex: 1300,
            backgroundColor: '#fff',
            borderRadius: '50%',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
            ':hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          <ChevronRight sx={{ color: '#333' }} />
        </IconButton>
      )}
    </Box>
  );
};

export default Statistics;
