'use server'
import plaidClient from "@/utils/plaid/config";
import { CountryCode } from "plaid";

export const fetchInstitutionByID = async (id: string) => {
    try {
        let res = await plaidClient.institutionsGetById({
            institution_id: id,
            country_codes: ["CA" as CountryCode],

        });
        // Return the name only for now
        return res.data.institution;
    } catch (e) {
        console.log(e);
        return null;
    }
};