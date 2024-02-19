import { Repository } from "typeorm";
import { User } from "../entities/User";
import axios, { AxiosError } from "axios";
import { SendNotificationDTO } from "../dto/send_notification.dto";

export class NotificationService {
  private sentNotifications: Set<string> = new Set();
  private notificationType: string;
  private maxRetries: number = 3;
  
  constructor(private userRepository: Repository<User>, notificationType: string) {
    this.notificationType = notificationType;
  }

  /**
   * The function `sendToApi` sends a notification email to a user if the user exists and has an email
   * address.
   * @param {User} user - The `user` parameter in the `sendToApi` function is an object of type `User`
   * that contains information about a user, such as their email, first name, and last name. The
   * function checks if the user object exists and if it has an email property before sending a
   * notification email
   */
  private async sendToApi(user: User): Promise<void> {
    const api = "https://email-service.digitalenvision.com.au/send-email";

    try {
      // ONLY SEND EXISTING USER WITH EMAIL
      if (user && user.email) {
        const requestSendNotif: SendNotificationDTO = {
          email: user.email,
          message: `Hey, ${user.firstname} ${user.lastname} it's Your ${this.notificationType}`,
        }
        await axios.post(api, requestSendNotif);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        console.error(`API responded with an error: ${axiosError.response.status} - ${axiosError.response.data}`);
      } else if (axiosError.request) {
        console.error('API request made, but no response received.');
      } else {
        console.error(`Error setting up the API request: ${axiosError.message}`);
      }

      throw err;
    }
  }

  /**
   * The function `retry` attempts to send a notification to a user with a specified number of retry
   * attempts before failing.
   * @param {User} user - The `user` parameter in the `retry` function represents an object containing
   * information about a user. It likely includes properties such as `id`, `firstname`, and `lastname`.
   * This object is used to send a notification to the user via an API call.
   * @param {number} retryCount - The `retryCount` parameter in the `retry` function represents the
   * number of times the notification sending process has been retried for a specific user. It starts
   * at 0 and increments with each retry attempt. If the maximum number of retries is reached without
   * successfully sending the notification, an error message is
   */
  private async retry(user: User, retryCount: number): Promise<void> {
    try {
      await this.sendToApi(user);
      console.log(`Notification sent to ${user.firstname} ${user.lastname} after ${retryCount} retries.`);
      this.sentNotifications.add(user.id.toString());
    } catch (err) {
      if (retryCount < this.maxRetries) {
        console.warn(`Retry failed. Retrying (${retryCount + 1}/${this.maxRetries})...`);
        await this.retry(user, retryCount + 1);
      } else {
        console.error(`Max retry attempts (${this.maxRetries}) reached. Notification failed for ${user.id}.`);
      }
    }
  }

  /**
   * The function `sendNotification` checks for duplicate messages before attempting to send a
   * notification to a user and handles any errors that occur during the process.
   * @param {User} user - The `user` parameter in the `sendNotification` function is of type `User`. It
   * is used to represent the user for whom the notification is being sent.
   * @returns If the condition `this.sentNotifications.has(existingNotification)` is true, then the
   * function will return early with a log message "Duplicate notification skipped for user
   * ${user.id}". Otherwise, if an error occurs during the `retry` function call, an error message will
   * be logged with details about the error.
   */
  public async sendNotification(user: User): Promise<void> {
    // CHECKING DUPLICATE MESSAGE
    const existingNotification = user.id.toString();
    if (this.sentNotifications.has(existingNotification)) {
      console.log(`Duplicate notification skipped for user ${user.id}`);
      return;
    }
    try {
      await this.retry(user, 0);
    } catch (error: any) {
      console.error(`Error sending ${this.notificationType.toLowerCase()} notification for user ${user.id}:`, error.message);
    }
  }
}