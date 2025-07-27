require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const compression = require("compression");

const passport = require("./config/passport");
const session = require("express-session");
const NotificationScheduler = require("./utils/notificationScheduler");
const recordsRoutes = require("./routes/records");
const client = require("prom-client");
// create default metrics (CPU, memory, nodejs internals)
client.collectDefaultMetrics();
// 1. Create a histogram for HTTP request durations
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [50, 100, 200, 300, 500, 1000, 2000], // customize as needed
});
const app = express();
// 2. Middleware to start/stop the timer
app.use((req, res, next) => {
  // start the timer with methodroute labels
  const end = httpRequestDuration.startTimer({
    method: req.method,
    route: req.route ? req.route.path : req.path,
  });
  res.on("finish", () => {
    end({ status_code: res.statusCode });
  });
  next();
});

connectDB().then(() => {
  console.log("Connected to MongoDB");
  NotificationScheduler.start(); // Start the notification scheduler
});

//Enable compression for all responses
app.use(compression());

// --- CORS Setup (for React frontend to access cookies/sessions) ---
app.use(
  cors({
    origin: process.env.CLIENT_URL, // e.g., "http://localhost:3000"
    credentials: true, // allow cookies/sessions cross-origin
  })
);

app.use(express.json());

// --- Session & Passport Setup ---
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// --- Your Routes ---
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/availability", require("./routes/availability"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/messages", require("./controllers/messageController"));
app.use("/api", require("./routes/records"));
// expose a /metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
