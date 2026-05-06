import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import * as admin from "firebase-admin";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Initialize Firebase Admin
  // Note: For real environment, you'd provide FIREBASE_SERVICE_ACCOUNT_KEY
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized with service account.");
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY not found. Push notifications will fail to send from server.");
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
  }

  // API endpoint to send notification
  app.post("/api/send-notification", async (req, res) => {
    const { token, title, body, data } = req.body;

    if (!admin.apps.length) {
      return res.status(500).json({ error: "Firebase Admin not initialized" });
    }

    try {
      const message = {
        notification: { title, body },
        data: data || {},
        token: token,
      };

      const response = await admin.messaging().send(message);
      res.json({ success: true, messageId: response });
    } catch (error: any) {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API endpoint for Contact Us form
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // In a real app, you might send an email or save to Firestore
      // For this demo, we'll log it and return success
      console.log(`New Contact Form Submission:
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `);

      // You could also save this to Firestore if admin is initialized
      if (admin.apps.length) {
        await admin.firestore().collection("contact_submissions").add({
          name,
          email,
          subject,
          message,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      res.json({ success: true, message: "Thank you for contacting us. We will get back to you soon." });
    } catch (error: any) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ error: "An error occurred while processing your request." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
