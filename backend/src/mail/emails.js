import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { sendEmail } from "./emailConfig.js";

// Send Verification Email
export const sendVerificationEmail = async (email, verificationToken) => {
  const html = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    verificationToken
  );
  await sendEmail(email, "Verify your email", html);
};

// Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
  const html = WELCOME_EMAIL_TEMPLATE.replace(/{name}/g, name);
  await sendEmail(email, "Welcome to TravelliFy!", html);
};

// Send Password Reset Email
export const sendPasswordResetEmail = async (email, resetURL) => {
  const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
  await sendEmail(email, "Reset your password", html);
};

// Send Password Reset Success Email
export const sendResetSuccessEmail = async (email) => {
  const html = PASSWORD_RESET_SUCCESS_TEMPLATE;
  await sendEmail(email, "Password Reset Successful", html);
};
