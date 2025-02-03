
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'

const config = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
            'PLAID-SECRET': process.env.PLAID_SECRET || '',
        }
    }
})

// export const ACCESS_TOKEN = "access-sandbox-07c5d6d9-81ed-428e-8491-cbaa84d9ba0b"

export default new PlaidApi(config)