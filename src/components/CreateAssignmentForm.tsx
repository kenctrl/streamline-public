import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface AssignmentForm {
  name: string;
  description: string;
  dueDate: string;
}

const CreateAssignmentForm: React.FC = ({ onSuccess, courseId }) => {
  const { control, handleSubmit, reset, register, formState: { errors } } = useForm<AssignmentForm>({
    defaultValues: {
      name: '',
      description: '',
      dueDate: '',
    },
  });

  const createAssignment = useMutation(api.assignments.create); // Mutation to save the assignment to the database
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: AssignmentForm) => {
    setIsSubmitting(true);

    // Save assignment data to the database
    await createAssignment({
      name: data.name,
      description: data.description,
      dueDate: data.dueDate,
      course: courseId,
    });

    // Reset the form after submission
    reset();
    setIsSubmitting(false);
    onSuccess(); // Callback to close the modal or refresh data
  };

  return (
    <Box sx={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '50px' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Create New Assignment
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Assignment Name Input */}
        <TextField
          label="Assignment Name"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('name', { required: 'Assignment Name is required' })}
          error={!!errors.name}
          helperText={errors.name ? errors.name.message : ''}
        />

        {/* Assignment Description Input */}
        <TextField
          label="Assignment Description"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          {...register('description', { required: 'Assignment Description is required' })}
          error={!!errors.description}
          helperText={errors.description ? errors.description.message : ''}
        />

        {/* Assignment Due Date Input */}
        <TextField
          label="Due Date"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          {...register('dueDate', { required: 'Due Date is required' })}
          error={!!errors.dueDate}
          helperText={errors.dueDate ? errors.dueDate.message : ''}
        />

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
            {isSubmitting ? 'Submitting...' : 'Create Assignment'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateAssignmentForm;
