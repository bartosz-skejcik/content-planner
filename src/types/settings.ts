export interface Settings {
  category: string;
  items: Setting[];
  title: string;
  description: string;
  addPlaceholder: string;
}

export interface Setting {
  id: string;
  value: string;
  category: string;
}
