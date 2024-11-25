const express = require("express");
const router = express.Router();
const customerAppointmentsController = require("../controllers/customerAppointmentsController");

// Profile routes
router.get("/profile", customerAppointmentsController.getCustomerProfile);
router.put("/profile", customerAppointmentsController.updateCustomerProfile);

// Appointment routes
router.get(
  "/appointments",
  customerAppointmentsController.getCustomerAppointments
);
router.get(
  "/appointments/upcoming",
  customerAppointmentsController.getUpcomingAppointments
);
router.get(
  "/appointments/history",
  customerAppointmentsController.getBookingHistory
);

module.exports = router;
