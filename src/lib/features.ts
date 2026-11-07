// Feature switches shared by the server and the browser.

/**
 * Email confirmation for accounts and reviews.
 *  true  → the dashboard stays locked until the email is confirmed, and reviews from
 *          unconfirmed emails wait for the confirmation link before going public.
 *  false → no email confirmation needed: dashboard opens right away, reviews publish
 *          immediately (captcha still required; admins can hide/delete in Admin → Reviews).
 * Turned off while outgoing email (Neo SMTP) isn't available. Set back to true once
 * "Send test email" works in Admin → Settings → Email.
 */
export const REQUIRE_EMAIL_VERIFICATION = false;
