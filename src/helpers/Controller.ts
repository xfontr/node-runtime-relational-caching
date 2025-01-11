import type { Provider, CustomEvent } from "../stores-core/types";

const Controller = <T extends Record<string, Function>>(controller: T) => {
  const fullController = new Proxy(controller, {
    get: (item, key) => {
      // TODO: Fallback
      return item?.[key as string];
    },
    set: () => false,
  });

  const handler = (event: CustomEvent) => {
    fullController[event.type]?.(event);
  };

  const subscribe = (...providers: Provider[]) => {
    providers.forEach((pubs) => pubs(handler));
  };

  return { subscribe };
};

export default Controller;
