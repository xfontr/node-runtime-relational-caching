import {
  BaseModel,
  LinkageLayers,
  PublishOptions,
  Store,
  StoreNameAndCurrent,
  Stores,
} from "../stores-core/types";

const Library = (options: PublishOptions = {}) => {
  let currentOptions: PublishOptions = structuredClone(options);
  let storePool: Stores = {};
  let linkageStores: LinkageLayers = {};

  const getLinkedItem = ({ current, name }: StoreNameAndCurrent) => {
    if (!linkageStores?.[name]?.[current]) return {};

    return { meta: linkageStores[name]![current] };
  };

  const cleanItem = <T extends Record<string, unknown>>(
    item?: T
  ): T | undefined => {
    const cleaned =
      item &&
      Object.keys(item).reduce(
        (finalItem, field) => ({
          ...finalItem,
          ...(currentOptions.excludedItemFields?.includes(field)
            ? {}
            : { [field]: item[field] }),
        }),
        {} as T
      );

    if (cleaned && Object.keys(cleaned).length > 0) return cleaned;

    return undefined;
  };

  const getStoreLibWithRefs = ({
    meta: { name },
    lib,
  }: Store): (BaseModel & object & { meta?: Record<string, string[]> })[] =>
    Object.values(lib).flatMap(
      (item) =>
        cleanItem({
          ...item,
          ...getLinkedItem({ current: item.id, name }),
        }) ?? []
    );

  const setStorePool = (stores: Stores) => {
    storePool = structuredClone(stores);
  };

  const setLinkageStores = (stores: LinkageLayers) => {
    linkageStores = structuredClone(stores);
  };

  const get = (refStore: Store, options: PublishOptions = {}) => {
    currentOptions = { ...currentOptions, ...options };
    const storeList = Object.values(storePool);

    return getStoreLibWithRefs(refStore)?.map(
      (ref) =>
        Object.entries(ref.meta ?? {}).reduce(
          (fullRef, [storeName, ids]) => {
            if (storeName === refStore.meta.name) return fullRef;
            if (currentOptions.excludedStores?.includes(storeName))
              return fullRef;

            const currentStore = storeList.find(
              ({ meta: { name } }) => name === storeName
            );

            return {
              ...ref,
              meta: {
                ...fullRef.meta,
                [storeName]: ids.flatMap((id) =>
                  currentOptions.isRelational
                    ? id
                    : cleanItem(currentStore?.lib[id]) ?? []
                ),
              },
            };
          },
          { ...ref, meta: {} } as any
        ) // TODO
    );
  };

  return {
    get,
    setStorePool,
    setLinkageStores,
  };
};

export default Library;
