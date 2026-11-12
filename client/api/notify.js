
export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { phone, language, answers } = req.body || {};

    // Validate required information
    if (!/^[6-9]\d{9}$/.test(String(phone || ""))) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    if (!["en", "hi", "mr"].includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
      });
    }

    if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
      console.error("Email environment variables are missing");
      return res.status(500).json({
        success: false,
        message: "Email service is not configured",
      });
    }

    const safeAnswers = JSON.stringify(answers || {}, null, 2)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const emailResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Disha <onboarding@resend.dev>",
          to: [process.env.NOTIFY_EMAIL],
          subject: "Disha: New counsellor callback request",
          html: `
            <h2>New Callback Request</h2>
            <p>A person has requested a counsellor callback.</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Language:</strong> ${language}</p>
            <h3>Interview Answers</h3>
            <pre>${safeAnswers}</pre>
            <p>Please contact this person.</p>
          `,
        }),
      }
    );

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", result);
      return res.status(502).json({
        success: false,
        message: "Email could not be sent",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification email sent",
      id: result.id,
    });
  } catch (error) {
    console.error("Notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
