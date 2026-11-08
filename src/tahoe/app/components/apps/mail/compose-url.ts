export const gmailComposeUrl = (
  recipient: string,
  subject: string,
  body: string
) => {
  const url = new URL("https://mail.google.com/mail/");
  url.searchParams.set("view", "cm");
  url.searchParams.set("fs", "1");
  url.searchParams.set("to", recipient);
  url.searchParams.set("su", subject);
  url.searchParams.set("body", body);
  return url.toString();
};
