import { Setting, Settings } from "@/types/settings";

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function groupedSettings(
  fetchedSettings: Setting[],
): Record<Setting["category"] | string, Settings> {
  return fetchedSettings.reduce(
    (acc: Record<Setting["category"] | string, Settings>, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = {
          title: capitalizeFirstLetter(setting.category),
          category: setting.category,
          description: `Manage your ${setting.category}`,
          items: [],
          addPlaceholder: `Add new ${setting.category}`,
        };
      }
      acc[setting.category].items.push({
        id: setting.id,
        category: setting.category,
        value: setting.value,
      });
      return acc;
    },
    {},
  );
}

export function validateSettingCategoryExists(
  category: string,
  settings: Record<Setting["category"] | string, Settings>,
): boolean {
  return Object.keys(settings).includes(category);
}

export function addSettingToGroup(
  setting: Setting,
  settings: Record<Setting["category"] | string, Settings>,
): Record<Setting["category"] | string, Settings> {
  const updatedSettings = { ...settings };
  if (!updatedSettings[setting.category]) {
    updatedSettings[setting.category] = {
      title: capitalizeFirstLetter(setting.category),
      category: setting.category,
      description: `Manage your ${setting.category}`,
      items: [],
      addPlaceholder: `Add new ${setting.category}`,
    };
  }
  updatedSettings[setting.category].items.push(setting);
  return updatedSettings;
}

export function updateSetting(
  setting: Setting,
  settings: Record<Setting["category"] | string, Settings>,
): Record<Setting["category"] | string, Settings> {
  const updatedSettings = { ...settings };
  updatedSettings[setting.category].items = updatedSettings[
    setting.category
  ].items.map((item) => {
    if (item.id === setting.id) {
      return setting;
    }
    return item;
  });
  return updatedSettings;
}

export function deleteSetting(
  id: string,
  settings: Record<Setting["category"] | string, Settings>,
) {
  const settingExists = validateSettingExists(id, settings);

  if (!settingExists) {
    throw new Error("Setting does not exist");
  }

  const updatedSettings = { ...settings };
  for (const category in updatedSettings) {
    updatedSettings[category].items = updatedSettings[category].items.filter(
      (setting) => setting.id !== id,
    );
  }
  return updatedSettings;
}

export function validateSettingExists(
  id: string,
  settings: Record<Setting["category"] | string, Settings>,
) {
  for (const category in settings) {
    const setting = settings[category].items.find(
      (setting) => setting.id === id,
    );
    if (setting) {
      return true;
    }
  }
  return false;
}
