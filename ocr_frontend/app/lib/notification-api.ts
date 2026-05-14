import axios from "axios";

const notificationApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NOTIFICATION_URL ?? "http://localhost:3003",
  headers: { "Content-Type": "application/json" },
});

export async function subscribe(email: string): Promise<void> {
  await notificationApi.post("/subscribe", { email });
}

export async function unsubscribe(email: string): Promise<void> {
  await notificationApi.delete("/subscribe", { data: { email } });
}
