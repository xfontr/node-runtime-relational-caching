import { controller, library, pool, linkage } from "..";
import BasicStore, { StoreOptions } from "../helpers/BasicStore";
import { PublishOptions } from "./types";

const Store = <T extends object>(name: string, options: StoreOptions = {}) => {
  const newStore = BasicStore<T>(name, options);

  controller.subscribe(newStore.pubs);

  const publish = (options: PublishOptions = {}) => {
    library.setStorePool(pool.ref());
    library.setLinkageStores(linkage.ref());

    return library.get(newStore.ref(), options);
  };

  return { ...newStore, publish };
};

export default Store;
