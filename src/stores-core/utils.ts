import type { BaseModel, Store, StoreNameAndCurrent } from "./types";
import { randomUUID } from "crypto";

export const createItem = <T extends object>(item: T): T & BaseModel => ({
  ...item,
  id: randomUUID(),
});

export const updateItemLinks = (
  currentItemRef: Record<string, string[]>,
  { name, current }: StoreNameAndCurrent
) => {
  currentItemRef[name] ??= [];
  if (current) currentItemRef[name]!.push(current);
};

export const initStoreAndGetRef = (name: string) => {
  const store: Store = {
    meta: { name, index: 0, id: randomUUID() },
    lib: {},
    current: "",
  };

  return store;
};
