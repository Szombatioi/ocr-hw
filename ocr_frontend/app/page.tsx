"use client";
import { io } from "socket.io-client";
import { Button, CircularProgress, Container, Paper, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ImageUploader from "./components/file-upload";
import api from "./axios";
import { Image } from "@/types/image";
import ImageCard from "./components/image-card";
import ImageDialog from "./components/image-dialog";
import { useRouter } from "next/navigation";

export default function OcrPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isRunningOcr, setIsRunningOcr] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [rendered, setRendered] = useState<string[]>([]);

  const _setSelectedFile = (file: File | null) => {
    setSelectedFile(file);
    setDescription("");
  };

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3002', {
      transports: ['websocket'],
    });

    socket.on('image.processed', (img: Image) => {
      // setImages((prev) => {
      //   const exists = prev.some((i) => i.url === img.url);
      //   return exists
      //     ? prev.map((i) => (i.url === img.url ? img : i))
      //     : [img, ...prev];
      // });
      setImages((prev) => [img, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      console.log(`New image: ${img}`);
      // setSelectedImage((prev) => (prev?.url === img.url ? img : prev));
    });


    return () => {
      socket.disconnect();
    };
  }, []);


  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    api.get<Image[]>("/image")
      .then((res) => setImages(res.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())))
      .catch((err) => setErrorText("Error connecting to the backend: " + err));
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
    api.post<string>("/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    //Add the image to the list + open dialog
    // const newImage: Image = { url: response.data, name: selectedFile.name, description, createdAt, ocrResult: null };
    // setImages((prev) => [newImage, ...prev]);
    // setSelectedImage(newImage);
    _setSelectedFile(null);
    setIsLoading(false);

    // Run OCR
    // setIsRunningOcr(true);
    // try {
    //   const ocrResult = await runOcr(response.data);
    //   await api.patch("/image", { url: response.data, ocrResult });
    //   setImages((prev) => prev.map((img) => img.url === response.data ? { ...img, ocrResult } : img));
    //   setSelectedImage((prev) => prev?.url === response.data ? { ...prev, ocrResult } : prev);
    // } catch {
    //   //non-fatal error
    // } finally {
    //   setIsRunningOcr(false);
    // }
  }

  // async function handleDialogRunOcr() {
  //   if (!selectedImage) return;
  //   setIsRunningOcr(true);
  //   try {
  //     const ocrResult = await runOcr(selectedImage.url);
  //     await api.patch("/image", { url: selectedImage.url, ocrResult });
  //     setImages((prev) => prev.map((img) => img.url === selectedImage.url ? { ...img, ocrResult } : img));
  //     setSelectedImage((prev) => prev ? { ...prev, ocrResult } : prev);
  //   } finally {
  //     setIsRunningOcr(false);
  //   }
  // }

  if (errorText !== null) {
    return (
      <>
        <Container sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h6" color="error">{errorText}</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button sx={{position: "absolute", top: 16, right: 16}} variant="outlined" onClick={() => router.push("/subscribe")}>
          Get notifications
        </Button>
        <Paper elevation={1} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Container sx={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center", alignItems: "center" }}>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <>
                <ImageUploader file={selectedFile} onFileChange={_setSelectedFile} />
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
            images.map((image, index) => {
              const isNew = !rendered.includes(image.url);
              return (
                <motion.div
                  key={index + image.url}
                  initial={isNew ? { y: -40, opacity: 0 } : false}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  onAnimationComplete={() => {
                    if (isNew) {
                      setRendered((prev) => [...prev, image.url]);
                    }
                  }}
                >
                  <ImageCard name={image.name}
                    description={image.description} imageUrl={image.url}
                    onClick={() => setSelectedImage(image)} />
                </motion.div>
              );
            })
          )}
        </Paper>
      </Container>

      <ImageDialog
        image={selectedImage}
        isRunningOcr={isRunningOcr}
        onClose={() => setSelectedImage(null)}
        // onRunOcr={handleDialogRunOcr}
      />
    </>
  );
}
