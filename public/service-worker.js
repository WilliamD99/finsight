import Dexie from "dexie";
import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";

// Make sure to call these before your own SW listeners if you rely on them
clientsClaim();

// This is where Workbox will inject the asset manifest array:
precacheAndRoute(self.__WB_MANIFEST);

const db = new Dexie("app-settings");
db.version(1).stores({
  summaryCards: "id",
  cards: "id",
});

async function syncToDatabase() {
  try {
    const allCards = await db.summaryCards.toArray();

    console.log(allCards);
  } catch (e) {
    console.log("SW error", e);
  }
}

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-db") {
    event.waitUntil(syncToDatabase());
  }
});

self.addEventListener("install", (event) => {
  console.log("SW installed");
});

self.addEventListener("activate", (event) => {
  console.log("SW activated");
});
