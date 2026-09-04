<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Admin Header -->
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span class="text-white font-heading font-bold text-sm">AB</span>
            </div>
            <h1 class="font-heading font-bold text-lg text-primary">Admin Dashboard</h1>
          </div>
          <div class="flex items-center gap-4">
            <router-link to="/" class="text-sm text-slate-500 hover:text-accent transition-colors">View Store</router-link>
            <button @click="handleLogout" class="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Tabs -->
      <div class="flex gap-1 mb-8 bg-white rounded-lg p-1 shadow-sm w-fit">
        <button
          :class="['px-4 py-2 rounded-md text-sm font-medium transition-all', activeTab === 'products' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100']"
          @click="activeTab = 'products'"
        >
          Products
        </button>
        <button
          :class="['px-4 py-2 rounded-md text-sm font-medium transition-all', activeTab === 'categories' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100']"
          @click="activeTab = 'categories'"
        >
          Categories
        </button>
      </div>

      <!-- Products Tab -->
      <div v-if="activeTab === 'products'">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-heading font-semibold text-xl text-primary">Products ({{ products.length }})</h2>
          <div class="flex items-center gap-3">
            <button
              v-if="selectedIds.length > 0"
              @click="handleBatchDelete"
              class="text-sm flex items-center gap-1 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              Delete Selected ({{ selectedIds.length }})
            </button>
            <button @click="openProductForm(null)" class="btn-primary text-sm flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Add Product
            </button>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      :checked="allPageSelected"
                      :indeterminate.prop="somePageSelected && !allPageSelected"
                      @change="toggleSelectAll"
                    />
                  </th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Product</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">No.</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                  <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Price</th>
                  <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Stock</th>
                  <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="p in pagedProducts" :key="p.id" class="hover:bg-slate-50 transition-colors" :class="{ 'bg-red-50/40': selectedIds.includes(p.id) }">
                  <td class="px-4 py-3">
                    <input
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      :value="p.id"
                      v-model="selectedIds"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <img :src="p.image_url || 'https://placehold.co/40x40/f8fafc/94a3b8?text=?'" class="w-10 h-10 rounded-lg object-cover" @error="handleTableImageError" />
                      <span class="font-medium text-sm text-primary">{{ p.name }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-500">{{ p.product_no }}</td>
                  <td class="px-4 py-3 text-sm text-slate-500">{{ p.category_name || '-' }}</td>
                  <td class="px-4 py-3 text-sm text-right font-medium">${{ Number(p.price).toFixed(2) }}</td>
                  <td class="px-4 py-3 text-sm text-right">
                    <span :class="p.stock > 0 ? 'text-emerald-600' : 'text-red-500'">{{ p.stock }}</span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="openProductForm(p)" class="text-sm text-accent hover:text-accent-dark font-medium">Edit</button>
                      <button @click="handleDeleteProduct(p.id)" class="text-sm text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="pagedProducts.length === 0">
                  <td colspan="7" class="px-4 py-10 text-center text-sm text-slate-400">No products yet</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p class="text-sm text-slate-500">
              Page {{ currentPage }} of {{ totalPages }}
            </p>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-1.5 rounded text-sm border border-gray-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-red-600 hover:text-red-600 transition-colors"
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
              >
                Prev
              </button>
              <button
                v-for="page in pageNumbers"
                :key="page"
                class="w-9 h-9 rounded text-sm border transition-colors"
                :class="page === currentPage
                  ? 'bg-primary border-primary text-white font-semibold'
                  : 'border-gray-200 text-slate-600 hover:border-red-600 hover:text-red-600'"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
              <button
                class="px-3 py-1.5 rounded text-sm border border-gray-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-red-600 hover:text-red-600 transition-colors"
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Tab -->
      <div v-if="activeTab === 'categories'">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-heading font-semibold text-xl text-primary">Categories ({{ categories.length }})</h2>
          <button @click="openCategoryForm(null)" class="btn-primary text-sm flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Category
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="cat in categories" :key="cat.id" class="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-primary">{{ cat.name }}</h3>
              <p class="text-sm text-slate-500 mt-1">{{ cat.description || 'No description' }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button @click="openCategoryForm(cat)" class="text-sm text-accent hover:text-accent-dark font-medium">Edit</button>
              <button @click="handleDeleteCategory(cat.id)" class="text-sm text-red-500 hover:text-red-700 font-medium">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Form Modal -->
    <div v-if="showProductForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="showProductForm = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <h3 class="font-heading font-bold text-xl text-primary mb-6">
          {{ editingProduct ? 'Edit Product' : 'Add Product' }}
        </h3>
        <form @submit.prevent="handleSaveProduct">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Product Number *</label>
              <input v-model="productForm.product_no" class="input-field" required placeholder="e.g. FB-003" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Name *</label>
              <input v-model="productForm.name" class="input-field" required placeholder="Product name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select v-model="productForm.category_id" class="input-field">
                <option :value="null">-- Select Category --</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Price ($) *</label>
                <input v-model.number="productForm.price" type="number" step="0.01" min="0" class="input-field" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                <input v-model.number="productForm.stock" type="number" min="0" class="input-field" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
              <div class="flex items-start gap-4">
                <!-- Preview -->
                <div class="w-24 h-24 rounded-lg border border-slate-200 bg-slate-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  <img v-if="productForm.image_url" :src="productForm.image_url" alt="preview" class="w-full h-full object-cover" />
                  <span v-else class="text-xs text-slate-400 text-center px-1">No image</span>
                </div>
                <!-- Upload area -->
                <div class="flex-1">
                  <input ref="fileInputRef" type="file" accept="image/jpeg,image/png" class="hidden" @change="handleFileSelect" />
                  <button type="button" @click="triggerFileSelect" :disabled="uploading"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-60">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {{ uploading ? 'Uploading...' : (productForm.image_url ? 'Replace Image' : 'Upload Image') }}
                  </button>
                  <p class="text-xs text-slate-400 mt-2">JPG or PNG, max 5MB</p>
                  <p v-if="uploadError" class="text-xs text-red-600 mt-1">{{ uploadError }}</p>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea v-model="productForm.description" class="input-field" rows="3" placeholder="Product description"></textarea>
            </div>
          </div>

          <div v-if="formError" class="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{{ formError }}</div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="showProductForm = false" class="btn-outline text-sm">Cancel</button>
            <button type="submit" :disabled="saving" class="btn-primary text-sm disabled:opacity-50">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Category Form Modal -->
    <div v-if="showCategoryForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="showCategoryForm = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="font-heading font-bold text-xl text-primary mb-6">
          {{ editingCategory ? 'Edit Category' : 'Add Category' }}
        </h3>
        <form @submit.prevent="handleSaveCategory">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Name *</label>
              <input v-model="categoryForm.name" class="input-field" required placeholder="Category name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea v-model="categoryForm.description" class="input-field" rows="2" placeholder="Category description"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="showCategoryForm = false" class="btn-outline text-sm">Cancel</button>
            <button type="submit" :disabled="saving" class="btn-primary text-sm disabled:opacity-50">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { apiClient, type Product, type Category } from '../api';

const router = useRouter();
const authStore = useAuthStore();

const PAGE_SIZE = 10;

const activeTab = ref<'products' | 'categories'>('products');
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);

// Product pagination & selection
const currentPage = ref(1);
const selectedIds = ref<number[]>([]);

const totalPages = computed(() => Math.max(1, Math.ceil(products.value.length / PAGE_SIZE)));

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return products.value.slice(start, start + PAGE_SIZE);
});

const pageNumbers = computed<number[]>(() => {
  const total = totalPages.value;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, total, currentPage.value, currentPage.value - 1, currentPage.value + 1]);
  return Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
});

const allPageSelected = computed(() =>
  pagedProducts.value.length > 0 && pagedProducts.value.every((p) => selectedIds.value.includes(p.id)),
);

const somePageSelected = computed(() =>
  pagedProducts.value.some((p) => selectedIds.value.includes(p.id)),
);

function goToPage(page: number): void {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
}

function toggleSelectAll(e: Event): void {
  const checked = (e.target as HTMLInputElement).checked;
  const pageIds = pagedProducts.value.map((p) => p.id);
  if (checked) {
    const merged = new Set([...selectedIds.value, ...pageIds]);
    selectedIds.value = Array.from(merged);
  } else {
    const pageSet = new Set(pageIds);
    selectedIds.value = selectedIds.value.filter((id) => !pageSet.has(id));
  }
}

// Product form
const showProductForm = ref(false);
const editingProduct = ref<Product | null>(null);
const productForm = reactive({
  product_no: '',
  name: '',
  category_id: null as number | null,
  price: 0,
  stock: 0,
  image_url: '',
  description: '',
});
const formError = ref('');
const saving = ref(false);

// Image upload
const fileInputRef = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadError = ref('');

function triggerFileSelect(): void {
  uploadError.value = '';
  fileInputRef.value?.click();
}

async function handleFileSelect(e: Event): void {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // Client-side validation
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    uploadError.value = 'Only JPG or PNG images are allowed.';
    input.value = '';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'Image size must not exceed 5MB.';
    input.value = '';
    return;
  }

  uploadError.value = '';
  uploading.value = true;
  try {
    const url = await apiClient.uploadProductImage(authStore.token, file);
    productForm.image_url = url;
  } catch (err) {
    uploadError.value = err instanceof Error ? err.message : 'Upload failed';
  } finally {
    uploading.value = false;
    input.value = '';
  }
}

// Category form
const showCategoryForm = ref(false);
const editingCategory = ref<Category | null>(null);
const categoryForm = reactive({
  name: '',
  description: '',
});

function handleTableImageError(e: Event): void {
  const target = e.target as HTMLImageElement;
  target.src = 'https://placehold.co/40x40/f8fafc/94a3b8?text=?';
}

async function loadData(): Promise<void> {
  try {
    const [productsData, categoriesData] = await Promise.all([
      apiClient.getProducts(),
      apiClient.getCategories(),
    ]);
    products.value = productsData;
    categories.value = categoriesData;
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
    // Prune selected ids that no longer exist
    const validIds = new Set(products.value.map((p) => p.id));
    selectedIds.value = selectedIds.value.filter((id) => validIds.has(id));
  } catch (err) {
    console.error('Failed to load data:', err);
  }
}

function openProductForm(product: Product | null): void {
  editingProduct.value = product;
  formError.value = '';
  uploadError.value = '';
  uploading.value = false;
  if (product) {
    Object.assign(productForm, {
      product_no: product.product_no,
      name: product.name,
      category_id: product.category_id,
      price: Number(product.price),
      stock: product.stock,
      image_url: product.image_url,
      description: product.description,
    });
  } else {
    Object.assign(productForm, {
      product_no: '', name: '', category_id: null, price: 0, stock: 0, image_url: '', description: '',
    });
  }
  showProductForm.value = true;
}

function openCategoryForm(category: Category | null): void {
  editingCategory.value = category;
  if (category) {
    categoryForm.name = category.name;
    categoryForm.description = category.description;
  } else {
    categoryForm.name = '';
    categoryForm.description = '';
  }
  showCategoryForm.value = true;
}

async function handleSaveProduct(): Promise<void> {
  if (!authStore.token) return;
  saving.value = true;
  formError.value = '';

  try {
    if (editingProduct.value) {
      await apiClient.updateProduct(authStore.token, editingProduct.value.id, { ...productForm });
    } else {
      await apiClient.createProduct(authStore.token, { ...productForm });
      currentPage.value = 1;
    }
    showProductForm.value = false;
    await loadData();
  } catch (err: unknown) {
    const error = err as Error;
    formError.value = error.message || 'Failed to save product';
  } finally {
    saving.value = false;
  }
}

async function handleDeleteProduct(id: number): Promise<void> {
  if (!authStore.token) return;
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    await apiClient.deleteProduct(authStore.token, id);
    selectedIds.value = selectedIds.value.filter((sid) => sid !== id);
    await loadData();
  } catch (err) {
    console.error('Failed to delete product:', err);
    alert(err instanceof Error ? err.message : 'Failed to delete product');
  }
}

async function handleBatchDelete(): Promise<void> {
  if (!authStore.token) return;
  if (selectedIds.value.length === 0) return;
  if (!confirm(`Are you sure you want to delete ${selectedIds.value.length} selected product(s)? This action cannot be undone.`)) return;

  try {
    const result = await apiClient.deleteProducts(authStore.token, [...selectedIds.value]);
    selectedIds.value = [];
    await loadData();
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
    alert(`Successfully deleted ${result.deleted} product(s).`);
  } catch (err) {
    console.error('Failed to batch delete products:', err);
    alert(err instanceof Error ? err.message : 'Failed to delete products');
  }
}

async function handleSaveCategory(): Promise<void> {
  if (!authStore.token) return;
  saving.value = true;

  try {
    if (editingCategory.value) {
      await apiClient.updateCategory(authStore.token, editingCategory.value.id, { ...categoryForm });
    } else {
      await apiClient.createCategory(authStore.token, { ...categoryForm });
    }
    showCategoryForm.value = false;
    await loadData();
  } catch (err) {
    console.error('Failed to save category:', err);
  } finally {
    saving.value = false;
  }
}

async function handleDeleteCategory(id: number): Promise<void> {
  if (!authStore.token) return;
  if (!confirm('Are you sure you want to delete this category?')) return;

  try {
    await apiClient.deleteCategory(authStore.token, id);
    await loadData();
  } catch (err) {
    console.error('Failed to delete category:', err);
  }
}

function handleLogout(): void {
  authStore.logout();
  router.push('/admin/login');
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/admin/login');
    return;
  }
  await authStore.fetchAdminInfo();
  await loadData();
});
</script>
