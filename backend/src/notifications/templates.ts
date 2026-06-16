type EmailTemplate = {
  subject: string
  html: string
  text: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function verificationCode(input: {
  code: string
  organisationName: string
  ttlMinutes: number
}): EmailTemplate {
  const org = escapeHtml(input.organisationName)
  const ttl = input.ttlMinutes

  return {
    subject: 'Your Sangira verification code',
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Your Sangira verification code</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f1e7;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1e7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e6dfd3;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#1f7a4d;padding:20px 24px;">
                <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:22px;font-weight:800;letter-spacing:0.2px;color:#ffffff;">
                  Sangira
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 24px 8px 24px;">
                <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:18px;font-weight:700;color:#1a1a1a;">
                  Your verification code
                </div>
                <p style="margin:12px 0 0 0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;line-height:20px;color:#3b3b3b;">
                  A reset code was requested for <strong>${org}</strong>. Enter the code below to continue.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;">
                <div style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:32px;font-weight:800;letter-spacing:6px;color:#1f7a4d;background:#eef7f2;border:1px solid #d6eadf;border-radius:12px;padding:16px 18px;display:inline-block;">
                  ${escapeHtml(input.code)}
                </div>
                <p style="margin:12px 0 0 0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;line-height:18px;color:#5a5a5a;">
                  This code expires in ${ttl} minutes. If you didn't request it, you can ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 24px 24px;">
                <p style="margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:18px;color:#6b6b6b;">
                  Verified food redistribution for Kigali.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    text: `Sangira — Your verification code

Organisation: ${input.organisationName}
Code: ${input.code}

This code expires in ${ttl} minutes.
If you didn't request it, you can ignore this email.
`,
  }
}

// TODO: admin slice — verificationApproved template
export function verificationApproved(): EmailTemplate {
  return {
    subject: 'Sangira verification approved (TODO)',
    html: '<p>TODO</p>',
    text: 'TODO',
  }
}

// TODO: admin slice — verificationRejected template
export function verificationRejected(): EmailTemplate {
  return {
    subject: 'Sangira verification rejected (TODO)',
    html: '<p>TODO</p>',
    text: 'TODO',
  }
}

