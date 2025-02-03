import Dexie, { Table } from 'dexie';
import { defaultCards, defaultSummaryCards } from './default';

export interface SummaryCard {
    id: string;
    cardId: string;
}

export interface Card {
    id: string;
    title: string;
    description: string;
}

export class DB extends Dexie {
    // table name is student 
    summaryCards!: Table<SummaryCard>;
    cards!: Table<Card>;
    constructor() {
        super('app-settings');
        this.version(1).stores({
            summaryCards: 'id',
            cards: "id"
        });
    }
}

const db = new DB()

// This is used to add default data to the table
const initDB = async () => {
    // Check if the table already has any data
    const activeCards = await db.summaryCards.count();
    // If no data exists, add the default data
    if (activeCards === 0) {
        await db.summaryCards.bulkAdd(defaultSummaryCards);
    }

    const availableCards = await db.cards.count()
    if (availableCards === 0) {
        await db.cards.bulkAdd(defaultCards)
    }
}
initDB()


export default db; // export the db