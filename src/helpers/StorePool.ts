import { Store, Stores } from "../stores-core/types";

const storeRef: Stores = {};

const StorePool = () => {
  const post = (store: Store) => {
    storeRef[store.meta.name] ??= store;
  };

  const ref = () => Object.freeze(storeRef);

  return { post, ref };
};

export default StorePool;
