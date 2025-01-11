# Architecture

## Store function

As modular as it gets!

- Simple post, put, del, etc. API
- Whenever an action is performed, triggers a notification
- This notification is only forwarded to subbed scripts

Usage example:

```ts
const errorStore = Store("error");

myCustomObserver.inject(errorStore.subs);
```

Doesn't rely on external dependencies. Doesn't even emit events. The consumer will decide how notifications are handled.

## Linkage Layer

Mostly a utility function

- Links stores.
- Ideally, every time a store posts an item, it will notify the linkage layer. The layer will then link the new item to other current items.

## Controller

Handles the relationship between individual stores and the linkage layer.

## Store pool

All the stores data

## Library

Takes the current store, the store pool and the linkage layer. With this, creates a cocktail of all the relevant information.

# Outcome

All the consumer needs to worry about, though, is this:

```ts
const myStore = Store<{ anyKeyIWant: string }>("store-name");

myStore.post({ anyKeyIWant: "Hello world" });
myStore.ref(); // Full store data
myStore.publish(); // The real magic. Store library with the linkage data to every other store.
myStore.destroy(); // Bye bye store :(
```
