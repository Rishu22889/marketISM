import { supabase } from '../lib/supabase';

export class SupabaseService {
  // Products/Marketplace Operations
  static async getProducts(options = {}) {
    try {
      const {
        searchQuery = '',
        category = null,
        sortBy = 'recent',
        limit = 50,
        offset = 0
      } = options;

      let query = supabase?.from('products')?.select(`
          *,
          seller:user_profiles!seller_id (
            full_name,
            hostel_location,
            is_verified
          )
        `)?.eq('is_available', true);

      // Apply search filter
      if (searchQuery) {
        query = query?.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply category filter
      if (category && category !== 'all') {
        query = query?.eq('category', category);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          query = query?.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query?.order('price', { ascending: false });
          break;
        case 'popular':
          query = query?.order('views_count', { ascending: false });
          break;
        case 'recent':
        default:
          query = query?.order('created_at', { ascending: false });
          break;
      }

      // Apply pagination
      query = query?.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  }

  static async getProductById(productId) {
    try {
      const { data, error } = await supabase?.from('products')?.select(`
          *,
          seller:user_profiles!seller_id (
            id,
            full_name,
            hostel_location,
            is_verified,
            phone_number,
            email
          )
        `)?.eq('id', productId)?.single();

      if (error) throw error;

      // Increment view count
      await supabase?.rpc('increment_product_views', {
        product_uuid: productId
      });

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async createProduct(productData) {
    try {
      const { data, error } = await supabase?.from('products')?.insert([productData])?.select()?.single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async updateProduct(productId, updates) {
    try {
      const { data, error } = await supabase?.from('products')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', productId)?.select()?.single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async deleteProduct(productId) {
    try {
      const { error } = await supabase?.from('products')?.delete()?.eq('id', productId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // Wishlist Operations
  static async getUserWishlist(userId) {
    try {
      const { data, error } = await supabase?.from('wishlists')?.select(`
          id,
          product_id,
          created_at,
          product:products (
            id,
            title,
            price,
            images,
            condition,
            is_available,
            seller:user_profiles!seller_id (
              full_name,
              hostel_location
            )
          )
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  }

  static async addToWishlist(productId) {
    try {
      const { data, error } = await supabase?.from('wishlists')?.insert([{
          user_id: (await supabase?.auth?.getUser())?.data?.user?.id,
          product_id: productId
        }])?.select()?.single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async removeFromWishlist(productId) {
    try {
      const { error } = await supabase?.from('wishlists')?.delete()?.eq('user_id', (await supabase?.auth?.getUser())?.data?.user?.id)?.eq('product_id', productId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  static async checkWishlistStatus(productId) {
    try {
      const { data, error } = await supabase?.from('wishlists')?.select('id')?.eq('user_id', (await supabase?.auth?.getUser())?.data?.user?.id)?.eq('product_id', productId)?.maybeSingle();

      if (error) throw error;

      return { isWishlisted: !!data, error: null };
    } catch (error) {
      return { isWishlisted: false, error };
    }
  }

  // File Upload Operations
  static async uploadProductImage(file, productId) {
    try {
      const fileName = `${Date.now()}_${file?.name}`;
      const filePath = `products/${productId}/${fileName}`;

      const { data, error } = await supabase?.storage?.from('product-images')?.upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase?.storage?.from('product-images')?.getPublicUrl(data?.path);

      return { data: { ...data, publicUrl }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async deleteProductImage(imagePath) {
    try {
      const { error } = await supabase?.storage?.from('product-images')?.remove([imagePath]);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // User Profile Operations
  static async getUserProfile(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async getUserProducts(userId, includeUnavailable = false) {
    try {
      let query = supabase?.from('products')?.select(`
          id,
          title,
          price,
          original_price,
          images,
          condition,
          category,
          is_available,
          views_count,
          created_at
        `)?.eq('seller_id', userId)?.order('created_at', { ascending: false });

      if (!includeUnavailable) {
        query = query?.eq('is_available', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  }

  // Analytics and Statistics
  static async getProductStats() {
    try {
      const { data, error } = await supabase?.from('products')?.select('category, condition, price')?.eq('is_available', true);

      if (error) throw error;

      const stats = {
        totalProducts: data?.length || 0,
        avgPrice: data?.length ? data?.reduce((sum, p) => sum + parseFloat(p?.price), 0) / data?.length : 0,
        categoryBreakdown: {},
        conditionBreakdown: {}
      };

      // Calculate breakdowns
      data?.forEach(product => {
        stats.categoryBreakdown[product.category] = (stats?.categoryBreakdown?.[product?.category] || 0) + 1;
        stats.conditionBreakdown[product.condition] = (stats?.conditionBreakdown?.[product?.condition] || 0) + 1;
      });

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Search using RPC function for better performance
  static async searchProducts(searchQuery = '', category = null, minPrice = null, maxPrice = null, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase?.rpc('search_products', {
        search_query: searchQuery,
        category_filter: category,
        min_price: minPrice,
        max_price: maxPrice,
        limit_count: limit,
        offset_count: offset
      });

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  }
}