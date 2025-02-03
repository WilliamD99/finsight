import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { fetchInstitutionByID } from "@/utils/plaid/utils";

export async function GET(request: NextRequest) {
    const supabase = await createClient()

    try {
        let data = await supabase.from("Access Token Table").select()

        let ids = data.data!.map(data => data.item_id!)
        let institutionDataPromise = ids.map(id => fetchInstitutionByID(id))
        let institutionData = await Promise.all(institutionDataPromise)

        // Filter out failed request
        const successData = institutionData.filter(data => data !== null)

        return NextResponse.json({
            institutions: successData
        }, {
            status: 200
        })

    } catch (e) {
        console.log(e)
        return NextResponse.json({
            error: "Something went wrong, please try again."
        }, {
            status: 500
        })
    }
}