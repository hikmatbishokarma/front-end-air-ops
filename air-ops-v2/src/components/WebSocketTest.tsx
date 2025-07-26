// src/components/WebSocketTest.tsx (or src/WebSocketTest.tsx)

import React, { useEffect, useState } from "react";

// Import Material-UI components
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import socket from "../lib/socket";

/**
 * WebSocketTest Component
 * A React component to test WebSocket connectivity and message handling.
 * It connects to the backend WebSocket server, displays connection status,
 * allows sending test messages, and shows received notifications.
 */
const WebSocketTest: React.FC = () => {
  // State to track the WebSocket connection status
  const [isConnected, setIsConnected] = useState(socket.connected);
  // State to store the last received notification from the backend
  const [lastNotification, setLastNotification] = useState<any>(null);
  // State to store messages sent to and received from the server
  const [messages, setMessages] = useState<string[]>([]);
  // State for the input field to send custom messages
  const [messageInput, setMessageInput] = useState<string>("");
  // State for loading indicator when triggering backend notification
  const [isTriggeringNotification, setIsTriggeringNotification] =
    useState(false);

  /**
   * useEffect hook to manage WebSocket event listeners.
   * This hook runs once on component mount and cleans up on unmount.
   */
  useEffect(() => {
    /**
     * Handler for 'connect' event.
     * Updates connection status and logs to console.
     * Also emits 'joinRoom' events for testing room functionality.
     */
    function onConnect() {
      setIsConnected(true);
      console.log("Frontend: Socket connected!");
      setMessages((prev) => [...prev, "Connected to server."]);

      // Emit to join specific rooms for testing the backend's room logic
      // These should match what your backend expects (e.g., 'role:admin', 'user:123')
      socket.emit("joinRoom", "test-general-room");
      socket.emit("joinRoom", "role:admin"); // Example: join a room for 'admin' role
      socket.emit("joinRoom", "user:123"); // Example: join a room for user ID '123'
      console.log("Frontend: Emitted joinRoom events for testing.");
    }

    /**
     * Handler for 'disconnect' event.
     * Updates connection status and logs to console.
     */
    function onDisconnect() {
      setIsConnected(false);
      console.log("Frontend: Socket disconnected!");
      setMessages((prev) => [...prev, "Disconnected from server."]);
    }

    /**
     * Handler for 'notification:new' event.
     * This event is broadcast by your NestJS NotificationGateway.
     * Updates the last received notification state.
     */
    function onNewNotification(notification: any) {
      console.log("Frontend: Received new notification:", notification);
      setLastNotification(notification);
      setMessages((prev) => [
        ...prev,
        `Received notification: ${JSON.stringify(notification.message || notification)}`,
      ]);
    }

    /**
     * Handler for 'messageFromServer' event.
     * This event is a response from the backend after sending 'messageToServer'.
     */
    function onMessageFromServer(data: string) {
      console.log("Frontend: Received message from server:", data);
      setMessages((prev) => [...prev, `Server response: ${data}`]);
    }

    // Register event listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("notification:new", onNewNotification);
    socket.on("messageFromServer", onMessageFromServer); // Listener for backend responses

    // Cleanup function: remove event listeners when the component unmounts
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("notification:new", onNewNotification);
      socket.off("messageFromServer", onMessageFromServer);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Handles sending a test message to the backend.
   * This assumes your NestJS gateway has a @SubscribeMessage('messageToServer') handler.
   */
  const sendMessageToBackend = () => {
    if (socket.connected && messageInput.trim() !== "") {
      socket.emit("messageToServer", messageInput);
      console.log(
        'Frontend: Emitted "messageToServer" event with:',
        messageInput
      );
      setMessages((prev) => [...prev, `Sent: ${messageInput}`]);
      setMessageInput(""); // Clear input after sending
    } else {
      console.warn(
        "Frontend: Not connected or message is empty. Cannot send message."
      );
      setMessages((prev) => [
        ...prev,
        "Cannot send: Not connected or empty message.",
      ]);
    }
  };

  /**
   * Triggers a test notification from the backend.
   * This requires a REST endpoint on your NestJS backend that calls
   * your NotificationGateway's broadcastNotification method.
   * (e.g., a GET request to http://localhost:3000/test-notification)
   */
  const triggerBackendNotification = async () => {
    setIsTriggeringNotification(true);
    try {
      // Replace with your actual backend test endpoint
      const response = await fetch(
        "http://localhost:3000/test/broadcast-notification"
      );
      const data = await response.text();
      console.log("Frontend: Triggered backend notification:", data);
      setMessages((prev) => [
        ...prev,
        `Triggered backend notification via HTTP: ${data}`,
      ]);
    } catch (error) {
      console.error("Frontend: Error triggering backend notification:", error);
      setMessages((prev) => [
        ...prev,
        `Error triggering backend notification: ${error}`,
      ]);
    } finally {
      setIsTriggeringNotification(false);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: "800px",
        mx: "auto",
        bgcolor: "background.default", // Use theme background color
        borderRadius: 2,
        boxShadow: 3,
        fontFamily: "Roboto, sans-serif", // MUI default font
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4, color: "text.primary" }}
      >
        WebSocket Test Client
      </Typography>

      {/* Connection Status */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: isConnected ? "success.light" : "error.light",
          color: isConnected ? "success.contrastText" : "error.contrastText",
        }}
      >
        {isConnected ? (
          <CheckCircleOutlineIcon
            sx={{ fontSize: 40, color: "success.dark" }}
          />
        ) : (
          <ErrorOutlineIcon sx={{ fontSize: 40, color: "error.dark" }} />
        )}
        <Box>
          <Typography variant="h6" component="p" sx={{ fontWeight: "bold" }}>
            Connection Status: {isConnected ? "Connected" : "Disconnected"}
          </Typography>
          <Typography variant="body2">
            Socket ID: {socket.id || "N/A"}
          </Typography>
        </Box>
      </Paper>

      {/* Send Message Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mb: 2, color: "text.secondary" }}
        >
          Send Message to Backend
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Type your message here..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessageToBackend}
            disabled={!isConnected || messageInput.trim() === ""}
            sx={{ px: 4, py: 1.5, minWidth: "150px" }}
          >
            Send Message
          </Button>
        </Stack>
        <Typography
          variant="caption"
          display="block"
          sx={{ mt: 1, color: "text.disabled" }}
        >
          (Requires `@SubscribeMessage('messageToServer')` in NestJS Gateway)
        </Typography>
      </Paper>

      {/* Trigger Backend Notification Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mb: 2, color: "text.secondary" }}
        >
          Trigger Backend Notification
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Click this button to make an HTTP call to your NestJS backend, which
          should then broadcast a notification via the WebSocket gateway.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={triggerBackendNotification}
          disabled={isTriggeringNotification}
          fullWidth
          sx={{ py: 1.5 }}
        >
          {isTriggeringNotification ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Trigger Backend Notification"
          )}
        </Button>
        <Typography
          variant="caption"
          display="block"
          sx={{ mt: 1, color: "text.disabled" }}
        >
          (Requires a REST endpoint like
          `http://localhost:3000/test-notification` in NestJS)
        </Typography>
      </Paper>

      {/* Last Received Notification */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mb: 2, color: "text.secondary" }}
        >
          Last Received Notification
        </Typography>
        {lastNotification ? (
          <Box
            component="pre"
            sx={{
              bgcolor: "grey.100",
              p: 2,
              borderRadius: 1,
              fontSize: "0.875rem",
              color: "text.secondary",
              overflow: "auto",
              maxHeight: 200,
            }}
          >
            {JSON.stringify(lastNotification, null, 2)}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "text.disabled" }}>
            No notifications received yet.
          </Typography>
        )}
      </Paper>

      {/* Message Log */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mb: 2, color: "text.secondary" }}
        >
          Message Log
        </Typography>
        <Box
          sx={{
            bgcolor: "grey.100",
            p: 2,
            borderRadius: 1,
            fontSize: "0.875rem",
            color: "text.secondary",
            overflow: "auto",
            maxHeight: 250,
          }}
        >
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{ mb: 0.5, wordBreak: "break-word" }}
              >
                {msg}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              No messages logged yet.
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default WebSocketTest;
