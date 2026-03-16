import nodemailer from 'nodemailer';

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// ── Booking Confirmation Email ────────────────────────────────────────────────
export const sendBookingConfirmationEmail = async ({ to, customerName, vehicle, serviceName, date }) => {
  const transporter = createTransporter();
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  await transporter.sendMail({
    from: `"Labhante Automotive Studio" <${process.env.EMAIL_USER}>`,
    to,
    subject: '✅ Booking Confirmed – Labhante Automotive Studio',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 30px;
                  border: 1px solid #222; border-radius: 12px; background: #0a0a0a; color: #fff;">
        <h2 style="color: #d4af37; text-align: center; margin-bottom: 4px;">Labhante Automotive Studio</h2>
        <p style="text-align: center; color: #aaa; margin-top: 0;">Service Booking Confirmation</p>
        <hr style="border-color: #333; margin: 20px 0;" />

        <p style="color: #ccc;">Hi <strong style="color:#fff;">${customerName}</strong>,</p>
        <p style="color: #ccc;">Your appointment has been <strong style="color: #4FA8D1;">confirmed</strong>. Here are the details:</p>

        <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px 14px; background:#161616; border: 1px solid #2a2a2a; color:#aaa; width:40%;">Vehicle</td>
            <td style="padding: 10px 14px; background:#111; border: 1px solid #2a2a2a; color:#fff; font-weight:bold;">${vehicle}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; background:#161616; border: 1px solid #2a2a2a; color:#aaa;">Service</td>
            <td style="padding: 10px 14px; background:#111; border: 1px solid #2a2a2a; color:#fff; font-weight:bold;">${serviceName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; background:#161616; border: 1px solid #2a2a2a; color:#aaa;">Date</td>
            <td style="padding: 10px 14px; background:#111; border: 1px solid #2a2a2a; color:#fff; font-weight:bold;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; background:#161616; border: 1px solid #2a2a2a; color:#aaa;">Status</td>
            <td style="padding: 10px 14px; background:#111; border: 1px solid #2a2a2a; color:#4FA8D1; font-weight:bold;">Car Received</td>
          </tr>
        </table>

        <p style="color: #ccc;">You can track your service progress in real-time through your dashboard.</p>
        <hr style="border-color: #333; margin: 20px 0;" />
        <p style="color: #555; font-size: 12px; text-align: center;">
          If you did not make this booking, please contact us immediately.<br/>
          &copy; ${new Date().getFullYear()} Labhante Automotive Studio
        </p>
      </div>
    `,
  });
};

// ── Status Update Email ───────────────────────────────────────────────────────
const statusColors = {
  'Car Received':          '#4FA8D1',
  'Inspection Completed':  '#6c63ff',
  'Service Started':       '#f39c12',
  'Work in Progress':      '#e67e22',
  'Quality Check':         '#1abc9c',
  'Service Completed':     '#2ecc71',
  'Ready for Delivery':    '#d4af37',
};

export const sendStatusUpdateEmail = async ({ to, customerName, vehicle, serviceName, newStatus }) => {
  const transporter = createTransporter();
  const color = statusColors[newStatus] || '#4FA8D1';

  await transporter.sendMail({
    from: `"Labhante Automotive Studio" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🔧 Service Update: ${newStatus} – Labhante Automotive Studio`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 30px;
                  border: 1px solid #222; border-radius: 12px; background: #0a0a0a; color: #fff;">
        <h2 style="color: #d4af37; text-align: center; margin-bottom: 4px;">Labhante Automotive Studio</h2>
        <p style="text-align: center; color: #aaa; margin-top: 0;">Service Progress Update</p>
        <hr style="border-color: #333; margin: 20px 0;" />

        <p style="color: #ccc;">Hi <strong style="color:#fff;">${customerName}</strong>,</p>
        <p style="color: #ccc;">We have an update on your vehicle's service status:</p>

        <div style="text-align: center; margin: 28px 0;">
          <span style="display: inline-block; padding: 12px 28px; border-radius: 50px;
                       background: ${color}22; border: 2px solid ${color};
                       color: ${color}; font-size: 18px; font-weight: bold; letter-spacing: 1px;">
            ${newStatus}
          </span>
        </div>

        <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px 14px; background:#161616; border: 1px solid #2a2a2a; color:#aaa; width:40%;">Vehicle</td>
            <td style="padding: 10px 14px; background:#111; border: 1px solid #2a2a2a; color:#fff; font-weight:bold;">${vehicle}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; background:#161616; border: 1px solid #2a2a2a; color:#aaa;">Service</td>
            <td style="padding: 10px 14px; background:#111; border: 1px solid #2a2a2a; color:#fff; font-weight:bold;">${serviceName}</td>
          </tr>
        </table>

        <p style="color: #ccc;">Log in to your dashboard to view the full live tracking timeline.</p>
        <hr style="border-color: #333; margin: 20px 0;" />
        <p style="color: #555; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Labhante Automotive Studio
        </p>
      </div>
    `,
  });
};
