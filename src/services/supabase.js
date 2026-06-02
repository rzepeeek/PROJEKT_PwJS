import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://idvtppkozgnegtmshvvb.supabase.co";
const supabaseKey = "sb_publishable_KAm9F32JNaWYYccvi71-hw_e5epERH6";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);