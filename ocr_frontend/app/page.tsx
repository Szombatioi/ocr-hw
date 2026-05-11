"use client";
import { Button, CircularProgress, Container, Paper, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import ImageUploader from "./components/file-upload";
import api from "./axios";
import { Image } from "@/types/image";
import { runOcr } from "@/app/lib/ocr-api";
import ImageCard from "./components/image-card";
import ImageDialog from "./components/image-dialog";

export default function OcrPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRunningOcr, setIsRunningOcr] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  useEffect(() => {
    api.get<Image[]>("/image").then((res) => setImages(res.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())));
  }, []);

  async function processImage() {
    if (!selectedFile) return;
    setIsLoading(true);

    const createdAt = new Date().toISOString();

    //Upload to the backend, get the image's URL
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("description", description);
    formData.append("createdAt", createdAt);
    const response = await api.post<string>("/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    //Add the image to the list + open dialog
    const newImage: Image = { url: response.data, name: selectedFile.name, description, createdAt, ocrResult: null };
    setImages((prev) => [newImage, ...prev]);
    setSelectedImage(newImage);
    setIsLoading(false);

    // Run OCR
    setIsRunningOcr(true);
    try {
      const ocrResult = await runOcr(response.data);
      await api.patch("/image", { url: response.data, ocrResult });
      setImages((prev) => prev.map((img) => img.url === response.data ? { ...img, ocrResult } : img));
      setSelectedImage((prev) => prev?.url === response.data ? { ...prev, ocrResult } : prev);
    } catch {
      //non-fatal error
    } finally {
      setIsRunningOcr(false);
    }
  }

  async function handleDialogRunOcr() {
    if (!selectedImage) return;
    setIsRunningOcr(true);
    try {
      const ocrResult = await runOcr(selectedImage.url);
      await api.patch("/image", { url: selectedImage.url, ocrResult });
      setImages((prev) => prev.map((img) => img.url === selectedImage.url ? { ...img, ocrResult } : img));
      setSelectedImage((prev) => prev ? { ...prev, ocrResult } : prev);
    } finally {
      setIsRunningOcr(false);
    }
  }

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={1} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Container sx={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center", alignItems: "center" }}>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <>
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
                    <Button variant="contained" color="primary" onClick={processImage}>
                      Process Image
                    </Button>
                  </>
                )}
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
              <ImageCard key={image.url} name={image.name}
                description={image.description} imageUrl={image.url}
                onClick={() => setSelectedImage(image)} />
            ))
          )}
        </Paper>
      </Container>

      <ImageDialog
        image={selectedImage}
        isRunningOcr={isRunningOcr}
        onClose={() => setSelectedImage(null)}
        onRunOcr={handleDialogRunOcr}
      />
    </>
  );
}
