import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Box, TextField, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface RubricItem {
  question: string;
  maxPoints: number;
  sampleAnswer: string;
  // manualGrading: boolean;
}

interface RubricForm {
  rubricItems: RubricItem[];
}

const UploadRubricForm: React.FC = () => {
  const { courseId, assignmentId } = useParams(); // Expect courseName and assignmentName from URL
  const assignment = useQuery(api.assignments.getSingleAssignment, { assignmentId: assignmentId || "" });
  const createRubric = useMutation(api.rubrics.create);
  const createQuestion = useMutation(api.questions.create);
  const getQueryIds = useMutation(api.questions.getQuestionIdsByAssignment);

  const { control, handleSubmit, reset, register } = useForm<RubricForm>({
    defaultValues: {
      rubricItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rubricItems',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: RubricForm) => {
    setIsSubmitting(true);

    // Save each question to an array
    await Promise.all(data.rubricItems.map(async (item) => {
      await createQuestion({
        assignmentId: assignmentId || '',
        question: item.question,
        maxPoints: Number(item.maxPoints),
        sampleAnswer: item.sampleAnswer,
        // manualGrading: item.manualGrading,
      });
    }));

    // Get question ids
    const questionIdsRaw = await getQueryIds({ assignmentId: assignmentId || '' });

    // Save the entire rubric
    await createRubric({
      assignmentId: assignmentId || '',
      rubricItems: questionIdsRaw || [],
    });

    // Reset the form after submission
    reset();
    setIsSubmitting(false);
  };

  return (
    <Box sx={{ maxWidth: '600px', margin: '0 auto', position: 'relative', paddingBottom: '70px' }}> {/* Added paddingBottom */}
      {/* <Typography variant="h4" gutterBottom>
        Edit Rubric for {assignment?.name}
      </Typography> */}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Dynamic Question Fields */}
        {fields.map((field, index) => (
          <Box key={field.id} sx={{ marginBottom: 2, border: '1px solid #ddd', padding: 2 }}>
            <Typography variant="h6">Question {index + 1}</Typography>

            {/* Question Text */}
            <Controller
              name={`rubricItems.${index}.question`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Question"
                  fullWidth
                  type="text"
                  variant="outlined"
                  margin="normal"
                  {...field}
                />
              )}
            />

            {/* Sample Answer */}
            <Controller
              name={`rubricItems.${index}.sampleAnswer`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Rubric Answer"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  {...field}
                />
              )}
            />

            {/* Max Points */}
            {/* make sure max points is positive */}
            <Controller
              name={`rubricItems.${index}.maxPoints`}
              control={control}
              defaultValue={0}
              rules={{
                required: 'Max Points is required',
                validate: (value) => value > 0 || 'Max Points must be greater than 0',
              }}
              render={({ field }) => (
                <TextField
                  label="Max Points"
                  type="number"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  {...field}
                />
              )}
            />

            {/* Manual Grading Checkbox */}
            {/* <Controller
              name={`rubricItems.${index}.manualGrading`}
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Enable Manual Grading"
                />
              )}
            /> */}

            {/* Remove Question Button */}
            <Button
              variant="outlined"
              onClick={() => remove(index)}
              sx={{
                marginTop: 2,
                backgroundColor: 'transparent',
                color: 'black',
                border: '1px solid black',
                ':hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)', // Slight darken on hover
                }
              }}
            >
              Remove Question
            </Button>
          </Box>
        ))}

        {/* Add Question Button */}
        <Box sx={{ paddingTop: "10px" }}>
          <Button
            variant="outlined"
            onClick={() =>
              append({
                question: '',
                maxPoints: 0,
                sampleAnswer: '',
                // manualGrading: false,
              })
            }
            sx={{
              marginBottom: 2,
              backgroundColor: 'transparent',
              color: 'black',
              border: '1px solid black',
              ':hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            Add Question
          </Button>
        </Box>

        {/* Submit Button */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', paddingBottom: '15px' }}>
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
            {isSubmitting ? 'Submitting...' : 'Submit Rubric'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UploadRubricForm;
