import { useLiveQuery } from "dexie-react-hooks";
import db, { Card } from "@/utils/dexie";

export const useSummaryCard = () => {
    // Use the live query hook to get the summary cards
    const summaryCards = useLiveQuery(() => db.summaryCards.toArray(), []);
    return summaryCards || [];
};

export const updateCard = async (rowId: string, cardId: string) => {
    // Check if the card already exist
    // User may only have 4 cards at any momment
    // So to add a card, user needs to delete a card
    await db.summaryCards.update(rowId, { cardId });
}

export const getInactiveCards = async (): Promise<Card[]> => {
    let activeCards = (await db.summaryCards.toArray()).map(card => card.cardId)
    let cards = await db.cards.toArray()

    let available = cards.map(card => {
        if (!activeCards.includes(card.id)) {
            return card
        }
    }).filter(e => e !== undefined)
    return available
}