
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import connectDB from "./db/database.js";
import {errorHandler, notFoundHandler} from "./middlewares/errorHandler.js";
import requestLogger from "./middlewares/requestLogger.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import adminRouter from "./routes/Auth/AdminRoutes.js";
import employeeRouter from "./routes/Auth/EmployeeRoutes.js";
import leaveEmployeeRouter from "./routes/Employee/LeaveEmployeeRoutes.js"
import leaveAdminRouter from "./routes/Admin/LeaveAdminRoutes.js"
import projectRouter from "./routes/Admin/ProjectsRoutes.js"
import attendanceRouter from "./routes/Both/AttendanceRoutes.js"
import payrollRouter from "./routes/Admin/PayrollRoutes.js"
import profileDetailsRouter from "./routes/Employee/ProfileDetailsRoutes.js"
import employeeCalendarRouter from "./routes/Employee/EmployeeCalendarRoutes.js"
import employeePayrollRouter from "./routes/Employee/EmployeePayrollRoutes.js"
import notificationRouter from "./routes/Admin/NotificationRoutes.js"
import uploadRouter from "./routes/Both/UploadRoutes.js"
import forgotPasswordRouter from "./routes/Both/ForgotPasswordRoutes.js"
import taskRouter from "./routes/Both/TaskRoutes.js"
import profilePhotoRouter from "./routes/Both/ProfilePhotoRoutes.js"
import roleRouter from "./routes/Admin/RoleRoutes.js"
import calendarRouter from "./routes/Admin/CalendarRoutes.js"
import idCardRouter from "./routes/Admin/IdCardRoutes.js"
import salaryStructureRouter from "./routes/Admin/SalaryStructureRoutes.js"
import employeeAdminRouter from "./routes/Admin/EmployeeRoutes.js";
import attendanceRuleRouter from "./routes/Admin/AttendanceRuleRoutes.js";
import notificationSettingsRouter from "./routes/Admin/NotificationSettingsRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import csrfProtection from './middlewares/csrf.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app  = express();

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    console.error('Please create a .env file based on env.example');
    process.exit(1);
}

const PORT = process.env.PORT || 5000

//mongoose connection
connectDB();

// Request logging middleware (before other middleware)
if (process.env.NODE_ENV !== 'test') {
    app.use(requestLogger);
}

// Trust proxy for correct protocol/secure cookies behind proxies
app.set('trust proxy', 1);

// Basic middleware first
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Security middleware
app.use(helmet());
app.use(mongoSanitize()); // Prevent NoSQL injection attacks
app.use(xss()); // Prevent XSS attacks

// CORS configuration - environment-aware
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL].filter(Boolean) // Filter out undefined values
    : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174'];

// Ensure FRONTEND_URL is set in production
if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
    console.warn('⚠️  Warning: FRONTEND_URL not set in production environment');
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
}));

// Rate limiting
app.use(apiLimiter);

// CSRF protection (double-submit) for state-changing methods
app.use(csrfProtection);

// HTTPS enforcement in production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            return res.redirect(`https://${req.header('host')}${req.url}`);
        }
        next();
    });
}

// Additional CORS headers - removed duplicate configuration









// -------- ADMIN ROUTES-------------
app.use("/api/v1/admin/auth",adminRouter);
app.use("/api/v1/admin/leave",leaveAdminRouter);
app.use("/api/v1/admin/project",projectRouter);
app.use("/api/v1/admin/payroll",payrollRouter);
app.use("/api/v1/admin/employee",employeeAdminRouter);
 
// app.use("/api/v1/admin/profile-details",profileDetailsRouter);

// -------- EMPLOYEE ROUTES-------------
app.use("/api/v1/employee/auth",employeeRouter);
app.use("/api/v1/employee/leave",leaveEmployeeRouter);
app.use("/api/v1/employee/calendar",employeeCalendarRouter);
app.use("/api/v1/employee/payroll",employeePayrollRouter);



// ----------------BOTH ROUTES ---------------
app.use("/api/v1/both/attendance",attendanceRouter);
app.use("/api/v1/both/notification",notificationRouter);
app.use("/api/v1/both/profile-details",profileDetailsRouter);
app.use("/api/v1/both/document",uploadRouter);
app.use("/api/v1/both/password",forgotPasswordRouter)
app.use("/api/v1/both/project-task",taskRouter)
app.use("/api/v1/both/profile-photo",profilePhotoRouter)

// ----------------ADMIN ADDITIONAL ROUTES ---------------
app.use("/api/v1/admin/roles",roleRouter);
app.use("/api/v1/admin/calendar",calendarRouter);
app.use("/api/v1/admin/id-cards",idCardRouter);
app.use("/api/v1/admin/salary-structure",salaryStructureRouter);
app.use("/api/v1/admin/attendance-rules",attendanceRuleRouter);
app.use("/api/v1/admin/notification-settings",notificationSettingsRouter);

// Serve static files from the public directory (MUST be before catch-all)
app.use(express.static(path.join(__dirname, 'public'), {
  // Don't serve index.html for static file requests
  index: false,
  // Set proper MIME types
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic API route
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'API is running...',
        version: '1.0.0'
    });
});

// Catch-all handler: send back React's index.html file for any non-API routes
// MUST be last, after all other routes and static file serving
app.get('*', (req, res, next) => {
  // Only handle GET requests that are not API routes and not static assets
  if (req.method === 'GET' && 
      !req.path.startsWith('/api') && 
      !req.path.startsWith('/assets') &&
      !req.path.startsWith('/uploads') &&
      !req.path.includes('.')) { // Don't catch files with extensions
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    next();
  }
});

// Handle 404 routes (must be after catch-all)
app.use(notFoundHandler);

//error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

