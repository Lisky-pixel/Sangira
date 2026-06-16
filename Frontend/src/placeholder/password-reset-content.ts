export const passwordResetContent = {
  request: {
    backToSignInLabel: 'Back to sign in',
    heading: 'Reset your password',
    subcopy:
      "Enter the phone number or email on your account and we'll send a 6-digit reset code to your email.",
    fields: {
      identifier: {
        label: 'Phone or email',
        placeholder: 'e.g. +250 7XX XXX XXX or name@org.rw',
      },
    },
    submitLabel: 'Send reset code',
    toast: {
      sent: 'Reset code sent',
    },
    validation: {
      identifierRequired: 'Phone or email is required',
      identifierInvalid: 'Enter a valid email or Rwanda mobile number',
    },
  },
  verify: {
    heading: 'Enter your reset code',
    subcopyPrefix: 'We sent a 6-digit code to your email',
    subcopySuffix: 'The code expires in 10 minutes.',
    resendPrefix: "Didn't get it?",
    resendLabel: 'Resend code',
    toast: {
      resent: 'Code resent',
      verifying: 'Verifying code…',
      success: 'Password reset successfully',
      error: 'Could not reset password',
    },
    fields: {
      codeLabel: 'Reset code',
      password: {
        label: 'New password',
        placeholder: 'Create a new password',
      },
    },
    submitLabel: 'Reset password and sign in',
    errors: {
      invalidCode: 'Invalid code. Please try again.',
      expired: 'This code has expired. Request a new one.',
      tooManyAttempts: 'Too many attempts. Request a new code.',
    },
  },
  header: {
    needHelpLabel: 'Need help?',
    signInLabel: 'Sign in',
  },
} as const

