import Store from "./src/stores-core/Store";

const errorStore = Store<{ message: string }>("error");
const historyStore = Store<{ page: number }>("history");
const actionStore = Store<{ name: string }>("action");

historyStore.post({ page: 1 });
actionStore.post({ name: "Getting products" });
errorStore.post({ message: "Error when loading products" });

console.log(
  historyStore.ref(),
  JSON.stringify(
    historyStore.publish({
      isRelational: false,
    }),
    null,
    4
  )
);

/**
{
  meta: {
    name: 'history',
    index: 1,
    id: 'f332c495-917f-4526-887e-585ae288ff2f'
  },
  lib: {
    'c9528743-df4a-4fd8-97d8-648f1f4a3fdf': { page: 1, index: 0, id: 'c9528743-df4a-4fd8-97d8-648f1f4a3fdf' }
  },
  current: 'c9528743-df4a-4fd8-97d8-648f1f4a3fdf'
}

[
    {
        "page": 1,
        "index": 0,
        "id": "c9528743-df4a-4fd8-97d8-648f1f4a3fdf",
        "meta": {
            "action": [
                {
                    "name": "Getting products",
                    "index": 0,
                    "id": "b7d10293-bbfe-4323-8e7d-c4700ca729d4"
                }
            ],
            "error": [
                {
                    "message": "Error when loading products",
                    "index": 0,
                    "id": "ccb86571-5177-4edb-998d-501aa3e1c34e"
                }
            ]
        }
    }
]
*/
