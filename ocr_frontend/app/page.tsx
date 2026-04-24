//TODO: 
//Add error messages below inputs that are invisible by default
//Add isLoading state while loading the upldoad and OCR results
"use client";
import { Alert, Button, Container, FilledInput, IconButton, Paper, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Clear } from "@mui/icons-material";
import ImageUploader from "./components/file-upload";
import api from "./axios";
import { OcrResult } from "@/types/ocr-result";
import { Image } from "@/types/image";
import ImageCard from "./components/image-card";

export default function OcrPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    api.get<Image[]>("/image").then((res) => setImages(res.data));
  }, []);

  async function processImage() {
    if (!apiKey || !selectedFile) {
      setApiKeyError("Please provide an API key and select an image first.");
      return;
    }

    //Upload to the backend, get the image's URL
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("description", description);
    const response = await api.post<string>("/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setImages((prev) => [...prev, { url: response.data, name: selectedFile.name, description }]);

    //Call the OCR to get the text, then display with rectangles
    try {
      const ocrResponse = await api.get("/api/ocr", {
        baseURL: "",
        params: {
          apikey: apiKey,
          url: response.data,
          isOverlayRequired: true,
        },
      });
      const ocrResult: OcrResult = ocrResponse.data;
      console.log(ocrResult);
    } catch (error: any) {
      if (error.response) {
        setApiKeyError(`OCR API error: ${error.response.data}`);
      } else {
        setApiKeyError(`Network error: ${error.message}`);
      }
    }

    //Display the image in a dialog
  }

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={1} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6">OcrSpace API key:</Typography>
          <div>
            <FilledInput
              // variant="filled"
              fullWidth
              placeholder="Enter your OcrSpace API key"
              value={apiKey || ''}
              type="password"
              endAdornment={apiKey ? <IconButton onClick={() => setApiKey(null)}><Clear /></IconButton> : null}
              onChange={(e) => setApiKey(e.target.value)}
            />
            {apiKeyError && <Typography variant="body2" color="error">{apiKeyError}</Typography>}
          </div>
          {!apiKey && <Alert severity="warning">You did not enter an OcrSpace API key yet.</Alert>}

          <Container sx={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center", alignItems: "center" }}>
            <ImageUploader onFileChange={setSelectedFile} />
            {selectedFile && (
              <>
                <TextField
                  variant="outlined"
                  placeholder="Enter a description for the image (optional)"
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={2}
                />

                <Button variant="contained" color="primary" onClick={() => { processImage() }}>
                  Process Image
                </Button>
              </>
            )}
          </Container>
        </Paper>

        <Paper sx={{ mt: 4, p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" align="center">
            Previously uploaded images
          </Typography>
          {images.length === 0 ? (
            <Typography align="center" variant="body2" color="text.secondary">No images uploaded yet.</Typography>
          ) : (
            images.map((image) => (
              // <Paper key={image.url} variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              //   <img src={image.url} alt={image.description || image.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
              //   <div>
              //     <Typography variant="body1">{image.name || '—'}</Typography>
              //     <Typography variant="body2" color="text.secondary">{image.description || 'No description'}</Typography>
              //   </div>
              // </Paper>
              <ImageCard key={image.url} name={image.name}
                description={image.description} imageUrl={image.url}
                onClick={() => alert(`Clicked on image: ${image.name}`)} />
            ))
          )}
        </Paper>
      </Container>
    </>
  );
}