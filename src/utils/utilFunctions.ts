export class Utils {
  static generateOtp() {
    return process.env.NODE_ENV === 'testing'
      ? 123456
      : Math.floor(Math.random() * 900000) + 100000;
  }

  static sendResponse(data, message) {
    return {
      success: true,
      data,
      message,
    };
  }
}
