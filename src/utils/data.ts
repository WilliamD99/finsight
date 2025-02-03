import { Transaction } from 'plaid';

export function filterTransactionsByKeys<T extends Transaction>(
    data: T[],
    keys: (keyof T)[]
): Array<Partial<T>> {
    return data.map((item) => {
        const filtered: Partial<T> = {};
        for (const key of keys) {
            if (key in item) {
                filtered[key] = item[key];
            }
        }
        return filtered;
    });
}

// Get current date in this format: YYYY-MM-DD
export function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;

}

export function getDateNDaysBefore(dateString: string, days = 30) {
    // Parse the given dateString into a Date object
    const date = new Date(dateString);

    // Subtract `days` days (default = 30)
    date.setDate(date.getDate() - days);

    // Extract and format YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}