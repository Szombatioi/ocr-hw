"use client";
import { useState } from "react";
import {
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { subscribe, unsubscribe } from "@/app/lib/notification-api";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function SubscribePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  async function handleSubscribe() {
    if (!email) return;
    setIsLoading(true);
    setErrorText(null);
    setSuccessText(null);
    try {
      await subscribe(email);
      setSuccessText(`Subscribed: ${email}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorText(err?.response?.data?.message ?? err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUnsubscribe() {
    if (!email) return;
    setIsLoading(true);
    setErrorText(null);
    setSuccessText(null);
    try {
      await unsubscribe(email);
      setSuccessText(`Unsubscribed: ${email}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorText(err?.response?.data?.message ?? err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper
        elevation={1}
        sx={{ p: 4, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <IconButton onClick={() => router.back()}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" align="center">
            Email subscription
          </Typography>
          <div></div>
        </div>

        <Typography variant="body2" color="text.secondary" align="center">
          In a real-life scenario, the app would have a user authentication system, and the subscription would be tied to the user account.
          For demonstration purposes, this page allows you to subscribe/unsubscribe using just any email address.
        </Typography>

        <TextField
          type="email"
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <Container
          sx={{ display: "flex", gap: 2, justifyContent: "center" }}
        >
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubscribe}
                disabled={!email}
              >
                Subscribe
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleUnsubscribe}
                disabled={!email}
              >
                Unsubscribe
              </Button>
            </>
          )}
        </Container>

        {errorText && (
          <Typography variant="body2" color="error" align="center">
            {errorText}
          </Typography>
        )}
        {successText && (
          <Typography variant="body2" color="success.main" align="center">
            {successText}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
