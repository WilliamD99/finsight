import Dexie, { Table } from "dexie";
import { defaultCards, defaultSummaryCards } from "./default";

export interface SummaryCard {
  id: string;
  cardId: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
}

export interface AppSettings {
  id: string;
  theme: string;
  dashboard: {
    indicators: {
      debtToIncomeThreshold: number;
      savingsRateThreshold: number;
      essentialRatioThreshold: number;
      essentialCategories: string[];
    };
  };
}

export class DB extends Dexie {
  // table name is student
  summaryCards!: Table<SummaryCard>;
  cards!: Table<Card>;
  appSettings!: Table<AppSettings>;
  constructor() {
    super("app-settings");
    this.version(1).stores({
      summaryCards: "id",
      cards: "id",
      appSettings: "id",
    });
  }
}

const db = new DB();

// This is used to add default data to the table
const initDB = async () => {
  // Check if the table already has any data
  const activeCards = await db.summaryCards.count();
  // If no data exists, add the default data
  if (activeCards === 0) {
    await db.summaryCards.bulkAdd(defaultSummaryCards);
  }

  const availableCards = await db.cards.count();
  if (availableCards === 0) {
    await db.cards.bulkAdd(defaultCards);
  }

  const appSettings = await db.appSettings.count();
  if (appSettings === 0) {
    await db.appSettings.add({
      id: crypto.randomUUID(),
      theme: "light",
      dashboard: {
        indicators: {
          debtToIncomeThreshold: 30,
          savingsRateThreshold: 20,
          essentialRatioThreshold: 50,
          essentialCategories: [
            "LOAN_PAYMENT",
            "RENT_AND_UTILITIES",
            "MEDICAL",
          ],
        },
      },
    });
  }
};
initDB();

export default db; // export the db
