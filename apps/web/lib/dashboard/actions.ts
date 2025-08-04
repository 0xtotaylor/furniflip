'use server';

import { createClient } from '@/lib/supabase/server';

export async function updateListing(formData: FormData) {
  const supabase = createClient();
  const id = formData.get('id') as string;

  const { data: currentProduct, error: fetchError } = await supabase
    .from('inventory')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error(
      `Failed to fetch current product data: ${fetchError.message}`
    );
  }

  const updates: { [key: string]: any } = {};
  const fieldsToCheck = ['status', 'price', 'category', 'condition'];

  for (const field of fieldsToCheck) {
    const newValue = formData.get(field);
    if (newValue !== null && newValue !== currentProduct[field]) {
      updates[field] =
        field === 'price' ? parseFloat(newValue as string) : newValue;
    }
  }

  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id);

    if (updateError) {
      throw new Error(`Failed to update inventory: ${updateError.message}`);
    }

    if ('price' in updates && updates.price !== currentProduct.price) {
      const { error: priceError } = await supabase
        .from('price_changes')
        .insert({
          inventory_id: id,
          old_price: currentProduct.price,
          new_price: updates.price
        });

      if (priceError) {
        throw new Error(`Failed to log price change: ${priceError.message}`);
      }
    }

    if (
      'condition' in updates &&
      updates.condition !== currentProduct.condition
    ) {
      const { error: conditionError } = await supabase
        .from('condition_changes')
        .insert({
          inventory_id: id,
          old_condition: currentProduct.condition,
          new_condition: updates.condition
        });

      if (conditionError) {
        throw new Error(
          `Failed to log condition change: ${conditionError.message}`
        );
      }
    }

    if ('category' in updates && updates.category !== currentProduct.category) {
      const { error: categoryError } = await supabase
        .from('category_changes')
        .insert({
          inventory_id: id,
          old_category: currentProduct.category,
          new_category: updates.category
        });

      if (categoryError) {
        throw new Error(
          `Failed to log category change: ${categoryError.message}`
        );
      }
    }

    return { success: true, message: 'Listing updated successfully' };
  }

  return { success: true, message: 'No changes were made' };
}

export async function automateListing(id: string, checked: boolean) {
  const supabase = createClient();
  if (checked) {
    const { error } = await supabase
      .from('autopilot')
      .insert([{ inventory_id: id }])
      .select();
    if (error) throw Error(error.message);
  } else {
    return await supabase.from('autopilot').delete().eq('inventory_id', id);
  }
}

export async function deleteListing(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('inventory').delete().eq('id', id);
  if (error) throw Error(error.message);
}

export async function deleteCatalog(formData: FormData) {
  const supabase = createClient();
  let id = formData.get('id');
  const { error } = await supabase.from('catalogs').delete().eq('id', id);
  if (error) throw Error(error.message);
}

export async function getCategories() {
  const supabase = createClient();
  const { data: categories } = await supabase.rpc('get_types', {
    enum_type: 'category'
  });
  return categories;
}

export async function getConditions() {
  const supabase = createClient();
  const { data: conditions } = await supabase.rpc('get_types', {
    enum_type: 'condition'
  });
  return conditions;
}

export async function getStatuses() {
  const supabase = createClient();
  const { data: statuses } = await supabase.rpc('get_types', {
    enum_type: 'status'
  });
  return statuses;
}

export async function getStages() {
  const supabase = createClient();
  const { data: stages } = await supabase.rpc('get_types', {
    enum_type: 'stage'
  });
  return stages;
}

export async function getPlatforms() {
  const supabase = createClient();
  const { data: platforms } = await supabase.rpc('get_types', {
    enum_type: 'platform'
  });
  return platforms;
}
