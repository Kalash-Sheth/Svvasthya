const twilio = require("twilio");
require("dotenv").config();

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Helper function to send SMS
const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    console.log("SMS sent successfully:", response.sid);
    return response.sid;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
};

// Send notifications for new bookings
exports.sendBookingNotifications = async (customer, bookingDetails) => {
  try {
    const customerMessage = `Hi ${customer.firstname}, your appointment (ID: ${
      bookingDetails.appointmentID
    }) has been booked successfully for ${new Date(
      bookingDetails.startTime
    ).toLocaleString()}. Thank you for choosing Svvasthya.`;

    await sendSMS(customer.mobileNumber, customerMessage);
    return { success: true, message: "Notifications sent successfully" };
  } catch (error) {
    console.error("Error sending notifications:", error);
    throw error;
  }
};

// Send notification for appointment acceptance
exports.sendAcceptanceNotification = async (
  customer,
  attendant,
  bookingDetails
) => {
  try {
    const message = `Hi ${customer.firstname}, your appointment (ID: ${
      bookingDetails.appointmentID
    }) has been accepted by ${
      attendant.firstName
    }. They will arrive at ${new Date(
      bookingDetails.startTime
    ).toLocaleString()}.`;

    await sendSMS(customer.mobileNumber, message);
    return { success: true, message: "Acceptance notification sent" };
  } catch (error) {
    console.error("Error sending acceptance notification:", error);
    throw error;
  }
};

// Send notification for appointment rejection
exports.sendRejectionNotification = async (
  customer,
  attendant,
  bookingDetails
) => {
  try {
    const message = `Hi ${customer.firstname}, unfortunately your appointment (ID: ${bookingDetails.appointmentID}) could not be accepted by ${attendant.firstName}. We are looking for another attendant.`;

    await sendSMS(customer.mobileNumber, message);
    return { success: true, message: "Rejection notification sent" };
  } catch (error) {
    console.error("Error sending rejection notification:", error);
    throw error;
  }
};

// Send reminder notifications
exports.sendReminderNotifications = async (appointment) => {
  try {
    const { customer, assignedAttendant: attendant } = appointment;

    const customerMessage = `Reminder: Your appointment (ID: ${
      appointment.appointmentID
    }) is scheduled for ${new Date(appointment.startTime).toLocaleString()}.`;

    const attendantMessage = `Reminder: You have an appointment (ID: ${
      appointment.appointmentID
    }) scheduled for ${new Date(appointment.startTime).toLocaleString()}.`;

    await Promise.all([
      sendSMS(customer.mobileNumber, customerMessage),
      sendSMS(attendant.personalInfo.mobileNumber, attendantMessage),
    ]);

    return { success: true, message: "Reminder notifications sent" };
  } catch (error) {
    console.error("Error sending reminder notifications:", error);
    throw error;
  }
};

// Send completion notification
exports.sendCompletionNotification = async (customer, bookingDetails) => {
  try {
    const message = `Thank you for using Svvasthya services. Your appointment (ID: ${bookingDetails.appointmentID}) has been completed. We hope you had a great experience!`;

    await sendSMS(customer.mobileNumber, message);
    return { success: true, message: "Completion notification sent" };
  } catch (error) {
    console.error("Error sending completion notification:", error);
    throw error;
  }
};

// Send cancellation notification
exports.sendCancellationNotification = async (
  customer,
  bookingDetails,
  reason
) => {
  try {
    const message = `Hi ${customer.firstname}, your appointment (ID: ${bookingDetails.appointmentID}) has been cancelled. Reason: ${reason}. Please book another appointment if needed.`;

    await sendSMS(customer.mobileNumber, message);
    return { success: true, message: "Cancellation notification sent" };
  } catch (error) {
    console.error("Error sending cancellation notification:", error);
    throw error;
  }
};

// Send attendant arrival notification
exports.sendAttendantArrivalNotification = async (
  customer,
  attendant,
  bookingDetails
) => {
  try {
    const message = `Hi ${customer.firstname}, your attendant ${attendant.firstName} has arrived for appointment (ID: ${bookingDetails.appointmentID}).`;

    await sendSMS(customer.mobileNumber, message);
    return { success: true, message: "Arrival notification sent" };
  } catch (error) {
    console.error("Error sending arrival notification:", error);
    throw error;
  }
};

// Send payment confirmation
exports.sendPaymentConfirmation = async (customer, bookingDetails, amount) => {
  try {
    const message = `Payment of ₹${amount} received for appointment (ID: ${bookingDetails.appointmentID}). Thank you for using Svvasthya services.`;

    await sendSMS(customer.mobileNumber, message);
    return { success: true, message: "Payment confirmation sent" };
  } catch (error) {
    console.error("Error sending payment confirmation:", error);
    throw error;
  }
};

// Send emergency notification
exports.sendEmergencyNotification = async (
  customer,
  attendant,
  bookingDetails,
  emergencyDetails
) => {
  try {
    const customerMessage = `EMERGENCY ALERT: For appointment (ID: ${bookingDetails.appointmentID}). Emergency services have been notified. ${emergencyDetails}`;
    const attendantMessage = `EMERGENCY ALERT: For appointment (ID: ${bookingDetails.appointmentID}). Please follow emergency protocols. ${emergencyDetails}`;

    await Promise.all([
      sendSMS(customer.mobileNumber, customerMessage),
      sendSMS(attendant.personalInfo.mobileNumber, attendantMessage),
    ]);

    return { success: true, message: "Emergency notifications sent" };
  } catch (error) {
    console.error("Error sending emergency notifications:", error);
    throw error;
  }
};

// Send feedback request
exports.sendFeedbackRequest = async (customer, bookingDetails) => {
  try {
    const message = `Hi ${customer.firstname}, please share your feedback about your recent appointment (ID: ${bookingDetails.appointmentID}). Your feedback helps us improve our services.`;

    await sendSMS(customer.mobileNumber, message);
    return { success: true, message: "Feedback request sent" };
  } catch (error) {
    console.error("Error sending feedback request:", error);
    throw error;
  }
};
