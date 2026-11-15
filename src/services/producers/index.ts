import { supabase } from "../../utils/supabase";

export const getAllProducers = async ({ limit = 10 }: { limit?: number }) => {
    const res = await supabase.from("producers").select("*").limit(limit).order("created_at", { ascending: false })
    return res.data
}
export const getProducerBySlug = async (slug: string) => {
    const res = await supabase.from("producers").select(`*`).eq("slug", slug).single()
    return res.data
}