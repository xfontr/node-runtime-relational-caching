import LinkageLayer from "./helpers/LinkageLayer";
import StoreController from "./stores-core/StoreController";
import StorePool from "./helpers/StorePool";
import Library from "./helpers/Library";

export const linkage = LinkageLayer();
export const controller = StoreController();
export const pool = StorePool();
export const library = Library();
