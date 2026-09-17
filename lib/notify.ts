import { prisma } from "./prisma";

export async function notifyUser(
  userId: string,
  title: string,
  body: string,
  href?: string
) {
  return prisma.notification.create({
    data: { userId, title, body, href },
  });
}
