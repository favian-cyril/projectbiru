import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request, locals: { supabase } }) => {
    const data = await request.formData();
    const lat = data.get('lat') as string;
    const lng = data.get('lng') as string;
    const filename = data.get('filename') as string;
    const fileBlob = new Blob([data.get('file') as string]);
    const color = data.get('color') as string;
    const datetime = data.get('datetime') as string;
    const res = await supabase.storage.from('sky_photos').upload(`root/${filename}`, fileBlob);
    console.log(res);
    
    if (res.data) {
      const { error } = await supabase.from('Entry').insert({ coordinates: `POINT(${lat} ${lng})`, sky_color: color, created_at: datetime, file: res.data.path }).select();
      console.log(error);
    }
  }
};