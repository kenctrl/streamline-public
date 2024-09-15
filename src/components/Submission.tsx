import React, { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { styled } from "@mui/material/styles";
import { Box, Typography, Button, Divider, Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import * as pdfjsLib from "pdfjs-dist";
import { prompt } from "../../convex/parser";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Submission: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [nums, setNums] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  // const parse = useAction(api.upload.upload);

  // Load the document and count pages
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  // Change page helpers
  const changePage = (offset: number) => setPageNumber((prev) => prev + offset);
  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  // Convert the first page of the PDF to base64
  const convertFirstPageToBase64 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.0 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;
    const jpegBase64 = canvas.toDataURL("image/jpeg").split(",")[1];

    return jpegBase64;
  };

  // Handle file upload and process the PDF
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      const image = await convertFirstPageToBase64(selectedFile);
      const { questions, studentResponses } = await prompt({ image });
      console.log("hiii", questions, studentResponses);
      setNums(questions);
      setResponses(studentResponses);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 500, color: '#1976D2' }}>
        Upload Your Assignment
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          component="label"
          sx={{ backgroundColor: '#1976D2', textTransform: 'none', fontWeight: 'bold', color: '#fff', borderRadius: 1, padding: '10px 20px' }}
        >
          Upload File
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
      </Box>

      {file && (
        <Box sx={{ mb: 4 }}>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={previousPage}
              disabled={pageNumber <= 1}
              sx={{ textTransform: 'none', fontWeight: 'normal', mr: 1, borderColor: '#1976D2', color: '#1976D2', borderRadius: 1 }}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              onClick={nextPage}
              disabled={pageNumber >= (numPages || 1)}
              sx={{ textTransform: 'none', fontWeight: 'normal', borderColor: '#1976D2', color: '#1976D2', borderRadius: 1 }}
            >
              Next
            </Button>
          </Box>
          <Typography align="center" sx={{ mt: 2 }}>
            Page {pageNumber} of {numPages || '--'}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: '#1976D2' }}>
            Parsed Questions:
          </Typography>
          {nums.length > 0 ? (
            nums.map((item, index) => (
              <Typography key={index} variant="body1" sx={{ color: '#333', mb: 1 }}>
                {index + 1}. {item}
              </Typography>
            ))
          ) : (
            <Typography variant="body1" sx={{ color: '#999' }}>
              No questions found.
            </Typography>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: '#1976D2' }}>
            Parsed Responses:
          </Typography>
          {responses.length > 0 ? (
            responses.map((item, index) => (
              <Typography key={index} variant="body1" sx={{ color: '#333', mb: 1 }}>
                {index + 1}. {item}
              </Typography>
            ))
          ) : (
            <Typography variant="body1" sx={{ color: '#999' }}>
              No responses found.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Submission;
