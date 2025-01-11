import type {
  BaseModel,
  StoreEventType,
  Publisher,
  StoreEvent,
  Provider,
} from "../stores-core/types";
import { createItem, initStoreAndGetRef } from "../stores-core/utils";

export type StoreOptions = Partial<{
  isSilent: boolean;
  verbosity: StoreEventType[];
}>;

const BasicStore = <Model extends object>(
  name: string,
  options: StoreOptions = {}
) => {
  let isDestroyed = false;
  const storeRef = initStoreAndGetRef(name);
  const publishers: Publisher<StoreEvent>[] = [];

  const toVoid = <T>(callback: () => T) =>
    isDestroyed ? (undefined as T) : callback();

  const post = (newItem: Model): void =>
    toVoid(() => {
      const item = createItem({ ...newItem, index: storeRef.meta.index });

      storeRef.lib[item.id] = item;
      storeRef.meta.index += 1;
      storeRef.current = item.id;

      notify("STORE:POST", { id: item.id });
    });

  const get = (id: string): (Model & BaseModel) | undefined =>
    toVoid(
      () =>
        storeRef.lib?.[id ?? storeRef.current] as
          | (Model & BaseModel)
          | undefined
    );

  const destroy = () =>
    toVoid(() => {
      isDestroyed = true;
      notify("STORE:DESTROY");
    });

  const put = (id: string, newData: Model): void =>
    toVoid(() => {
      if (!storeRef.lib?.[id]) return;

      storeRef.lib[id] = { ...storeRef.lib[id], ...newData };

      notify("STORE:PUT", storeRef.lib[id]);
    });

  const remove = (id: string) =>
    toVoid(() => {
      if (!storeRef.lib?.[id]) return;

      delete storeRef.lib[id];

      notify("STORE:DELETE", { id });
    });

  const notify = (type: StoreEventType, body?: BaseModel) => {
    if (options.isSilent) return;
    if (options.verbosity && !options.verbosity?.includes(type)) return;

    publishers.forEach((publisher) => {
      publisher({
        type,
        name,
        body,
        ...(body ? {} : { storeRef }),
      });
    });
  };

  const pubs: Provider<StoreEvent> = (callback): void => {
    publishers.push(callback);
    notify("STORE:PLUG");
  };

  return {
    post,
    put,
    get,
    remove,
    destroy,
    pubs,
    ref: () => Object.freeze(storeRef),
  };
};

export default BasicStore;
