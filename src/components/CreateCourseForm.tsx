import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface CourseForm {
  name: string;
  description: string;
  teachers: string[];
  students: string[];
}

const CreateCourseForm: React.FC = ({ onSuccess }) => {
  const { control, handleSubmit, reset, register, formState: { errors } } = useForm<CourseForm>({
    defaultValues: {
      name: '',
      description: '',
      teachers: [],
      students: [],
    },
  });

  /*
  const { fields: teacherFields, append: appendTeacher, remove: removeTeacher } = useFieldArray({
    control,
    name: 'teachers',
  });

  const { fields: studentFields, append: appendStudent, remove: removeStudent } = useFieldArray({
    control,
    name: 'students',
  });
  */

  const createCourse = useMutation(api.courses.create);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: CourseForm) => {
    setIsSubmitting(true);

    // Save course data to the database
    const courseInfo = await createCourse(
      {
        name: data.name,
        description: data.description,
        teachers: data.teachers,
        students: data.students,
        assignments: [],
      },
    );

    // Reset the form after submission
    reset();
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <Box sx={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '50px' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Create New Course
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Course Name Input */}
        <TextField
          label="Course Name"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('name', { required: 'Course Name is required' })}
          error={!!errors.name}
          helperText={errors.name ? errors.name.message : ''}
        />

        {/* Course Description Input */}
        <TextField
          label="Course Description"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          {...register('description', { required: 'Course Description is required' })}
          error={!!errors.description}
          helperText={errors.description ? errors.description.message : ''}
        />

        {/* 
        <Typography variant="h6" sx={{ marginTop: 3 }}>Teachers</Typography>
        {teacherFields.map((field, index) => (
          <Box key={field.id} sx={{ marginBottom: 2 }}>
            <Controller
              name={`teachers.${index}`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label={`Teacher ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  {...field}
                />
              )}
            />
            <Button
              variant="outlined"
              onClick={() => removeTeacher(index)}
              sx={{ marginTop: 1 }}
            >
              Remove Teacher
            </Button>
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={() => appendTeacher('')}
          sx={{ marginBottom: 2 }}
        >
          Add Teacher
        </Button>

        <Typography variant="h6" sx={{ marginTop: 3 }}>Students</Typography>
        {studentFields.map((field, index) => (
          <Box key={field.id} sx={{ marginBottom: 2 }}>
            <Controller
              name={`students.${index}`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label={`Student ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  {...field}
                />
              )}
            />
            <Button
              variant="outlined"
              onClick={() => removeStudent(index)}
              sx={{ marginTop: 1 }}
            >
              Remove Student
            </Button>
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={() => appendStudent('')}
          sx={{ marginBottom: 2 }}
        >
          Add Student
        </Button>

        */}

        {/* Submit Button */}
        <Box sx={{ position: 'absolute', bottom: 15, left: 0, right: 0, textAlign: 'center' }}>
          <Button
            type="submit"
            variant="outlined"
            disabled={isSubmitting}
            sx={{
              backgroundColor: 'transparent',
              color: 'black',
              border: '1px solid black',
              ':hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              }
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Create Course'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateCourseForm;
