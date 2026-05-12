"use client";
import { Button, CircularProgress, Container, Paper, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ImageUploader from "./components/file-upload";
import api from "./axios";
import { Image } from "@/types/image";
import ImageCard from "./components/image-card";
import ImageDialog from "./components/image-dialog";

const WS_GATEWAY_URL = process.env.NEXT_PUBLIC_WS_GATEWAY_URL ?? "http://localhost:3002";

export default function OcrPage() {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  useEffect(() => {
    async function loadImages() {
      const res = await api.get<Image[]>("/image");
      setImages(res.data.sort((a: Image, b: Image) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
    loadImages();
  }, []);

  useEffect(() => {
    const socket = io(WS_GATEWAY_URL);

    socket.on("image.ready", (image: Image) => {
      setImages((prev) => [image, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  async function processImage() {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("description", description);
      formData.append("createdAt", new Date().toISOString());

      await api.post("/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSelectedFile(null);
      setDescription("");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={1} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Container sx={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center", alignItems: "center" }}>
            {isUploading ? (
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
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
