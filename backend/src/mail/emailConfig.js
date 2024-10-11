import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const mailtrapClient = new MailtrapClient({
	endpoint: process.env.MAILTRAP_ENDPOINT,
	token: process.env.MAILTRAP_TOKEN,
});
console.log(process.env.MAILTRAP_ENDPOINT,process.env.MAILTRAP_TOKEN)
export const sender = {
	email: "mailtrap@demomailtrap.com",
	name: "Surya",
};
