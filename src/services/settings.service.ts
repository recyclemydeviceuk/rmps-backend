import { Settings } from '../models/Settings';
import type { GeneralSettings, OperationsSettings, NotificationSettings } from '../types/settings.types';

export class SettingsService {
  private static async getOrCreate() {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    return settings;
  }

  static async getSettings() {
    return SettingsService.getOrCreate();
  }

  static async updateGeneral(data: Partial<GeneralSettings>) {
    const settings = await SettingsService.getOrCreate();
    Object.assign(settings.general, data);
    return settings.save();
  }

  static async updateOperations(data: Partial<OperationsSettings>) {
    const settings = await SettingsService.getOrCreate();
    Object.assign(settings.operations, data);
    return settings.save();
  }

  static async updateNotifications(data: Partial<NotificationSettings>) {
    const settings = await SettingsService.getOrCreate();
    Object.assign(settings.notifications, data);
    return settings.save();
  }
}
