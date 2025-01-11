export const vectorialData: Record<
  string,
  Record<string, { id?: string; index?: number } & Record<string, string[]>>
> = {};

export type BaseModel<T extends object = object> = {
  id: string;
  index?: number;
} & T;

export type StoreMeta = {
  id: string;
  name: string;
  index: number;
};

export type Store = {
  meta: StoreMeta;
  current: string;
  lib: Record<string, BaseModel>;
};

export type StoreNameAndCurrent = Pick<StoreMeta, "name"> &
  Pick<Store, "current">;

export type Stores = Record<string, Store>;

export type LinkageLayer = Record<string, Record<string, string[]>>;

export type LinkageLayers = Record<string, LinkageLayer>;

export type StoreEventType =
  | "STORE:PLUG"
  | "STORE:POST"
  | "STORE:DELETE"
  | "STORE:PUT"
  | "STORE:DESTROY";

export interface StoreEvent extends CustomEvent<BaseModel> {
  type: StoreEventType;
}

export type PublishOptions = Partial<{
  isRelational: boolean;
  excludedItemFields: string[];
  excludedStores: string[];
}>;

// export type Publisher = (event: StoreEvent) => void;

export type Publisher<T extends CustomEvent = CustomEvent> = (event: T) => void;

export type Provider<T extends CustomEvent = CustomEvent> = (
  callback: Publisher<T>
) => void;

export type CustomEvent<T = object> = {
  type: string;
  name: string;
  body?: T | undefined;
  storeRef?: Store;
};
