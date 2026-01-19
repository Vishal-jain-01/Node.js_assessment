import dotenv from "dotenv"
import express from "express";
import connectDB from "./config/database.js";
import userRoutes from "./routes/users.js";
import activityRoutes from "./routes/crm/activities.js";
import dealRoutes from "./routes/crm/deals.js";
import attendanceRoutes from "./routes/attendance.js";
import whatsappRoutes from "./routes/whatsapp.js";
import { validateWhatsAppConfig } from "./utils/whatsapp.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

validateWhatsAppConfig();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api', userRoutes);
app.use('/api/crm', activityRoutes);
app.use('/api/crm', dealRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', whatsappRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'User Service API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
