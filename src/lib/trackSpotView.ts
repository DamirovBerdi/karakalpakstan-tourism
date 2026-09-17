import { supabase } from '@/lib/supabase';

export async function trackSpotView(spotName: string, category: string = 'general'): Promise<void> {
  try {
    await supabase.from('spot_views').insert({
      spot_name: spotName,
      spot_category: category,
    });
  } catch {
    // Silently fail — analytics should never break the UI
  }
}
