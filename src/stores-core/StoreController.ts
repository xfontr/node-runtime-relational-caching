import { pool, linkage } from "..";
import Controller from "../helpers/Controller";
import type { Publisher, StoreEvent, StoreEventType } from "./types";

const StoreController = () =>
  Controller<Partial<Record<StoreEventType, Publisher<StoreEvent>>>>({
    "STORE:POST": (event) => {
      if (!event.body?.id) return;
      linkage.post(event.name, event.body?.id);
    },

    "STORE:PLUG": (event) => {
      if (!event.storeRef) return;
      pool.post(event.storeRef);
    },
  });

export default StoreController;
