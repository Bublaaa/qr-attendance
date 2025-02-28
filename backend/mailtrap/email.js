import { mailtrapClient, sender } from "./mailtrap.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplate.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification email: ${error}`);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "6d035ddc-761a-4673-8a27-3ff8173e1681",
      template_variables: {
        company_info_name: "QR-Attendance",
        name: name,
      },
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }

  // client
  // .send({
  //     from: sender,
  //     to: recipients,
  //     template_uuid: "6fd6402a-3402-4a26-8b4f-14d81e05357d",
  //     template_variables: {
  //     "name": "Test_Name",
  //     "company_info_name": "Test_Company_info_name",
  //     "company_info_address": "Test_Company_info_address",
  //     "company_info_city": "Test_Company_info_city",
  //     "company_info_zip_code": "Test_Company_info_zip_code",
  //     "company_info_country": "Test_Company_info_country"
  //     }
  // })
  // .then(console.log, console.error)
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.error(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password  Reset",
    });
  } catch (error) {
    console.error(`Error sending success reset password email`, error);
    throw new Error(`Error sending success reset password email: ${error}`);
  }
};
