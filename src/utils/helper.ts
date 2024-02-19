import { ResponseI } from '../interfaces/response.interface';

export class Helper {
  /**
   * The function "createResponse" creates a response object with a status code, message, and data.
   * @param {number} status - The status parameter is a number that represents the status code of the
   * response. It indicates the success or failure of the request. Common status codes include 200 for
   * success, 400 for bad request, 404 for not found, etc.
   * @param {any} message - The `message` parameter is the message that you want to include in the
   * response. It can be of any type, such as a string or an object.
   * @param {any} data - The `data` parameter is used to pass any additional information or payload
   * that needs to be included in the response. It can be of any type, such as an object, array, or
   * primitive value.
   * @returns {ResponseI} an object of type ResponseI.
   */
  static createResponse(status: number, message: any, data: any): ResponseI {
    return {
      status,
      message,
      data: data,
    };
  }
}