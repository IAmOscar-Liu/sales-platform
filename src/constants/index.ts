export const THEME_STORAGE_KEY = "cdm-web-ui-theme";
export const AUTH_SETTINGS_KEY = "cdm-auth-settings";

export class QUERIES {
  static salesman = "salesman";
}

export class TIME_IN_MILLISECONDS {
  static thirtySeconds = 30 * 1000;
  static oneMinute = 60 * 1000;
  static fiveMinutes = 5 * this.oneMinute;
  static tenMinutes = 10 * this.oneMinute;
  static oneHour = 60 * this.oneMinute;
  static oneDay = 24 * this.oneHour;
}
