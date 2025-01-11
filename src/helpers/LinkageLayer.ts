import type { LinkageLayers, StoreNameAndCurrent } from "../stores-core/types";
import { updateItemLinks } from "../stores-core/utils";

const currentIds: Record<string, string> = {};
const storeRef: LinkageLayers = {};

const LinkageLayer = () => {
  const initLinkageStore = ({ current, name }: StoreNameAndCurrent) => {
    currentIds[name] = current;
    storeRef[name] ??= {};
  };

  const initLinkageStoreItem = ({ current, name }: StoreNameAndCurrent) => {
    storeRef[name]![current] ??= {};
    return storeRef[name]![current];
  };

  const initLinkageDataForCurrentItemStore = (
    { name, current }: StoreNameAndCurrent,
    mainStoreName: string
  ) => {
    if (!current) return;

    storeRef[name] ??= {};
    storeRef[name]![current] ??= {};
    storeRef[name]![current]![mainStoreName] ??= [];
  };

  const pushCurrentLink = (
    { current, name }: StoreNameAndCurrent,
    store: StoreNameAndCurrent
  ) => {
    if (!current) return;

    storeRef[name]![current]![store.name]!.push(store.current);
  };

  const linkCurrentWithEveryStore = (
    currentStore: StoreNameAndCurrent,
    currentItemRef: Record<string, string[]>
  ) => {
    Object.entries(currentIds).forEach(([name, current]) => {
      if (name === currentStore.name) return;

      updateItemLinks(currentItemRef, { name, current });
      initLinkageDataForCurrentItemStore({ name, current }, currentStore.name);
      pushCurrentLink({ name, current }, currentStore);
    });
  };

  const post = (storeName: string, id: string) => {
    const currentStore: StoreNameAndCurrent = { current: id, name: storeName };

    initLinkageStore(currentStore);
    const currentItemRef = initLinkageStoreItem(currentStore);

    linkCurrentWithEveryStore(currentStore, currentItemRef);
  };

  return {
    post,
    ref: () => Object.freeze(storeRef),
  };
};

export default LinkageLayer;
