import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { AppBar, Toolbar, Box, Button, Container } from "@mui/material";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";

import Statistics from "./components/Statistics";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Courses from "./components/Courses";
import Profile from "./components/Profile";
import Course from "./components/Course";
import Assignment from "./components/Assignment";
import Settings from "./components/Settings";
import { SidebarProvider } from "./contexts/SidebarContext";
import Submission from "./components/Submission";
import Rubric from "./components/Rubric";
import Student from "./components/Student";
import StudentView from "./components/StudentView";
import AssignmentStudentView from "./components/AssignmentStudentView";

import "./App.css";

export default function App() {
  return (
    <main className="container max-w-8xl flex flex-col gap-8 font-proxima">
      <Authenticated>
        <SignedIn />
      </Authenticated>
      <Unauthenticated>
        <div className="flex justify-center mt-10">
          <SignInButton mode="modal">
            <Button>Sign In to use Streamline</Button>
          </SignInButton>
        </div>
      </Unauthenticated>
    </main>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    // <TransitionGroup>
    //   <CSSTransition
    //     key={location.key}
    //     classNames="page"
    //     timeout={{ enter: 300, exit: 300 }}
    //   >
    <Routes location={location}>
      <Route path="/" element={<Courses />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:courseId" element={<Course />} />
      <Route
        path="/courses/:courseId/assignments/:assignmentId"
        element={<Assignment />}
      />
      <Route
        path="/courses/:courseId/assignments/:assignmentId/statistics"
        element={<Statistics />}
      />
      {/* <Route path="/courses/:courseId/assignments/:assignmentId/settings" element={<Settings />} /> */}
      <Route
        path="/courses/:courseId/assignments/:assignmentId/rubric"
        element={<Rubric />}
      />
      {/* <Route path="/profile" element={<Profile />} /> */}
      <Route
        path="/courses/:courseId/assignments/:assignmentId/submissions"
        element={<Submission />}
      />
      <Route path="/courses/:courseId/assignments/:assignmentId/students/:userId" element={<Student />} />
      <Route path="/courses/:courseId/assignments/:assignmentId/students/:userId/student" element={<StudentView />} />
      <Route path="/courses/:courseId/assignments/:assignmentId/students/:userId/student-view" element={<AssignmentStudentView />} />
    </Routes>
    //   </CSSTransition>
    // </TransitionGroup>
  );
}

function SignedIn() {
  const saveUser = useMutation(api.myFunctions.saveUser);

  useEffect(() => {
    void saveUser();
  });

  return (
    <>
      <SidebarProvider>
        <Router>
          <NavBar />
          <Container>
            <AnimatedRoutes />
          </Container>
        </Router>
      </SidebarProvider>
    </>
    // <>
    //   <p>Welcome {viewer}!</p>
    //   <p className="flex gap-4 items-center">
    //     This is you:
    //     <UserButton afterSignOutUrl="#" />
    //   </p>
    //   <p>
    //     Click the button below and open this page in another window - this data
    //     is persisted in the Convex cloud database!
    //   </p>
    //   <p>
    //     <Button
    //       onClick={() => {
    //         void addNumber({ value: Math.floor(Math.random() * 10) });
    //       }}
    //     >
    //       Add a random number
    //     </Button>
    //   </p>
    //   <p>
    //     Numbers:{" "}
    //     {numbers?.length === 0
    //       ? "Click the button!"
    //       : numbers?.join(", ") ?? "..."}
    //   </p>
    //   <p>
    //     Edit{" "}
    //     <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
    //       convex/myFunctions.ts
    //     </code>{" "}
    //     to change your backend
    //   </p>
    //   <p>
    //     Edit{" "}
    //     <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
    //       src/App.tsx
    //     </code>{" "}
    //     to change your frontend
    //   </p>
    //   <p>
    //     Check out{" "}
    //     <a
    //       className="font-medium text-primary underline underline-offset-4"
    //       target="_blank"
    //       href="https://docs.convex.dev/home"
    //     >
    //       Convex docs
    //     </a>
    //   </p>
    //   <Statistics />
    // </>
  );
}
