"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Method, Archetype, FeedbackType } from "@/types/patterns";

export async function createPattern(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const symbol = formData.get("symbol") as string;
  const method = formData.get("method") as Method;
  const archetype = formData.get("archetype") as Archetype;
  const color = formData.get("color") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const selectedDays = formData.getAll("selectedDays") as string[];

  if (!name || !method || !archetype || !startTime || !endTime) {
    return { error: "Please fill in all required fields." };
  }

  const feedbackMap: Record<Method, FeedbackType> = {
    takePictureMethod: "qualityImage",
    registerAudioMethod: "qualityAudio",
    takeNotesMethod: "qualityText",
    readBooksMethod: "qualityText",
    learnWithAlfredMethod: "qualityText",
    playGamesMethod: "qualityText",
    trackMotionMethod: "reactionOnly",
    countPushupsMethod: "reactionOnly",
    wakeUpMethod: "reactionOnly",
    undefined: "qualityText",
  };

  const row = {
    user_id: user.id,
    default_settings: {
      template_pattern_id: crypto.randomUUID(),
      pattern_name: name,
      pattern_symbol: symbol || "circle",
      pattern_method: method,
      pattern_archetype: archetype,
      feedback_type: feedbackMap[method] ?? "qualityText",
    },
    user_settings: {
      time_slot: {
        timeSlotID: crypto.randomUUID(),
        startTime,
        endTime,
        isActive: true,
      },
      selected_days: selectedDays,
      selected_color: color || "blue",
      view_option: "default",
      holiday_enabled: false,
      skip_enabled: false,
      alert_time: startTime,
    },
    pattern_instances: {},
  };

  const { error } = await supabase.from("user_patterns").insert(row);
  if (error) return { error: error.message };

  revalidatePath("/patterns");
  revalidatePath("/calendar");
  redirect("/patterns");
}

export async function deletePattern(patternId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_patterns")
    .delete()
    .eq("id", patternId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/patterns");
  revalidatePath("/calendar");
  redirect("/patterns");
}
