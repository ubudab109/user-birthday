require('dotenv').config();
import { AppDataSource } from './data-source';
import { scheduleNotif } from './schedule-notif';
import { Server } from './server';

AppDataSource.initialize().then(async () => {
  const server = new Server();
  scheduleNotif;
  server.start();
}).catch(error => console.log(error));
