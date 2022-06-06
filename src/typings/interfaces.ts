export interface ManagerOptions {
  guild: string;
  category: string;
  prefix: string;
  role: string;
}

export interface Events {
  ready: () => void;
}