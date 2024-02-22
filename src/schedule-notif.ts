import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import { NotificationService } from "./services/notification.services";
import schedule from 'node-schedule';

const userRepository = AppDataSource.getRepository(User);
const notificationService = new NotificationService(userRepository, process.env.NOTIF_TYPE ?? 'Birthday');

export const scheduleNotif = schedule.scheduleJob('0 9 * * *', async () => {
  const today = new Date();
  const todayDayMonth = today.toISOString().slice(5, 10);
  const users: User[] = await userRepository
    .createQueryBuilder("user")
    .where(`TO_CHAR(user.birthday_date, 'MM-DD') = :dayMonth`, { dayMonth: todayDayMonth })
    .getMany();
  users.forEach((user) => {
    notificationService.sendNotification(user);
  });

  users.forEach((user) => {
    const userTimeZone = user.location;
    const userNow = new Date(today.toLocaleString("en-US", { timeZone: userTimeZone }));
    if (userNow.getHours() >= 9) {
      notificationService.sendNotification(user);
    }
  });
});
