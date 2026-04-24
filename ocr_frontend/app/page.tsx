"use client";
import { Alert, Button, Container, FilledInput, IconButton, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Clear } from "@mui/icons-material";
import ImageUploader from "./components/file-upload";

export default function OcrPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function processImage() {
      if (!apiKey || !selectedFile){
        alert("Please provide an API key and select an image first.");
        return;
      }

      //Upload to the backend, get the image's URL

      //Call the OCR to get the text, then display with rectangles

      //Display the image in a dialog
  }

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={1} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6">OcrSpace API key:</Typography>
          <FilledInput
            // variant="filled"
            fullWidth
            placeholder="Enter your OcrSpace API key"
            value={apiKey || ''}
            type="password"
            endAdornment={apiKey ? <IconButton onClick={() => setApiKey(null)}><Clear /></IconButton> : null}
            onChange={(e) => setApiKey(e.target.value)}
          />
          {!apiKey &&<Alert severity="warning">You did not enter an OcrSpace API key yet.</Alert>}

          <Container sx={{display: "flex", flexDirection: "column", gap: 2, justifyContent: "center", alignItems: "center"}}>
            <ImageUploader onFileChange={setSelectedFile} />
            {selectedFile && (
            <Button variant="contained" color="primary" onClick={() => { processImage() } }>
              Process Image
            </Button>
          )}
          </Container>

          
        </Paper>
      </Container>
    </>
  );
}