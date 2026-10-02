import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { FoodImage } from '../common/FoodImage';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Percent,
  RotateCcw,
  Sliders,
  DollarSign,
  Save,
  CheckCircle2
} from 'lucide-react';
import { MenuItem, MenuCategory } from '../../types/cafe';

export const OwnerMenuManagement: React.FC = () => {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    updateItemPrice,
    bulkUpdatePrices,
    adjustAllPricesByPercent,
    resetMenuToOriginal,
    deleteMenuItem,
    toggleItemStock,
    toggleItemActive,
  } = useCafe();

  const [categoryFilter, setCategoryFilter] = useState<MenuCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Price Management mode
  const [isBulkPriceMode, setIsBulkPriceMode] = useState(false);
  const [bulkPriceDrafts, setBulkPriceDrafts] = useState<{ [id: string]: number }>({});
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlinePriceValue, setInlinePriceValue] = useState<string>('');
  const [isPriceAdjustModalOpen, setIsPriceAdjustModalOpen] = useState(false);
  const [priceAdjustPercent, setPriceAdjustPercent] = useState('10');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New item form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Exclude<MenuCategory, 'all'>>('fried-chicken');
  const [formPrice, setFormPrice] = useState('120');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('wings');
  const [formDietary, setFormDietary] = useState<'veg' | 'non-veg'>('non-veg');
  const [formVariant, setFormVariant] = useState('');
  const [formPrepTime, setFormPrepTime] = useState('8 mins');
  const [formInStock, setFormInStock] = useState(true);
  const [formIsActive, setFormIsActive] = useState(true);

  const categories: { id: MenuCategory; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'fried-chicken', label: 'Fried Chicken' },
    { id: 'burgers', label: 'Burgers' },
    { id: 'pizza', label: 'Pizza' },
    { id: 'sandwiches', label: 'Sandwiches' },
    { id: 'wraps', label: 'Wraps' },
    { id: 'momos', label: 'Momos' },
    { id: 'maggi', label: 'Maggi' },
    { id: 'sides', label: 'Sides & Dips' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'coffee-drinks', label: 'Coffee & Drinks' },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openAddModal = () => {
    setFormName('');
    setFormCategory('fried-chicken');
    setFormPrice('120');
    setFormDescription('');
    setFormImage('wings');
    setFormDietary('non-veg');
    setFormVariant('');
    setFormPrepTime('8 mins');
    setFormInStock(true);
    setFormIsActive(true);
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPrice(item.price.toString());
    setFormDescription(item.description);
    setFormImage(item.image);
    setFormDietary(item.dietary || 'veg');
    setFormVariant(item.variant || '');
    setFormPrepTime(item.prepTime || '8 mins');
    setFormInStock(item.inStock);
    setFormIsActive(item.isActive);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    if (editingItem) {
      updateMenuItem({
        ...editingItem,
        name: formName.trim(),
        category: formCategory,
        price: parseFloat(formPrice) || 0,
        description: formDescription.trim(),
        image: formImage,
        dietary: formDietary,
        variant: formVariant.trim() || undefined,
        prepTime: formPrepTime,
        inStock: formInStock,
        isActive: formIsActive,
      });
      setEditingItem(null);
    } else {
      addMenuItem({
        name: formName.trim(),
        category: formCategory,
        price: parseFloat(formPrice) || 0,
        description: formDescription.trim() || `${formName} freshly prepared at cafe`,
        image: formImage,
        dietary: formDietary,
        variant: formVariant.trim() || undefined,
        prepTime: formPrepTime,
        inStock: formInStock,
        isActive: formIsActive,
        isPopular: false,
      });
      setIsAddModalOpen(false);
    }
  };

  // Start inline editing of a single price
  const handleStartInlineEdit = (item: MenuItem) => {
    setInlineEditingId(item.id);
    setInlinePriceValue(item.price.toString());
  };

  const handleSaveInlinePrice = (id: string) => {
    const parsed = parseFloat(inlinePriceValue);
    if (!isNaN(parsed) && parsed >= 0) {
      updateItemPrice(id, parsed);
    }
    setInlineEditingId(null);
  };

  // Bulk Price Editor
  const toggleBulkPriceMode = () => {
    if (!isBulkPriceMode) {
      // initialize drafts with current prices
      const drafts: { [id: string]: number } = {};
      menuItems.forEach((m) => {
        drafts[m.id] = m.price;
      });
      setBulkPriceDrafts(drafts);
    }
    setIsBulkPriceMode(!isBulkPriceMode);
  };

  const handleBulkDraftChange = (id: string, val: string) => {
    const num = parseFloat(val);
    setBulkPriceDrafts((prev) => ({
      ...prev,
      [id]: isNaN(num) ? 0 : num,
    }));
  };

  const handleSaveBulkPrices = () => {
    const updates = Object.entries(bulkPriceDrafts).map(([id, price]) => ({
      id,
      price,
    }));
    bulkUpdatePrices(updates);
    setIsBulkPriceMode(false);
  };

  return (
    <div className="p-5 lg:p-7 space-y-6 max-w-7xl mx-auto">
      {/* Header matching mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold tracking-tight text-[#2B170B]">
              Menu Management
            </h2>
            <span className="bg-amber-100 text-[#78350F] text-xs font-bold px-2 py-0.5 rounded-full">
              {menuItems.length} items
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Add items, update descriptions, manage stock, and edit prices across all categories
          </p>
        </div>

        {/* Action Buttons: Add Item & Price Manager */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Bulk Price Editor Mode Toggle */}
          <button
            onClick={toggleBulkPriceMode}
            className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              isBulkPriceMode
                ? 'bg-amber-600 text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-[#EADBCE]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>{isBulkPriceMode ? 'Exit Bulk Price Mode' : 'Change Prices in Bulk'}</span>
          </button>

          {/* Quick % price adjustment */}
          <button
            onClick={() => setIsPriceAdjustModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-neutral-50 text-neutral-700 rounded-xl text-xs font-bold border border-[#EADBCE] shadow-2xs"
            title="Adjust all prices by percentage"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
            <span>Quick % Adjust</span>
          </button>

          {/* Add New Item */}
          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#78350F] hover:bg-[#5C2707] text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add New Item</span>
          </button>
        </div>
      </div>

      {/* Bulk Price Mode Active Banner */}
      {isBulkPriceMode && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-2 text-xs text-amber-900 font-medium">
            <CheckCircle2 className="w-4 h-4 text-amber-700" />
            <span>
              <strong>Bulk Price Editing Enabled:</strong> You can edit any item's price directly in the input boxes below.
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsBulkPriceMode(false)}
              className="px-3 py-1.5 bg-white border border-neutral-300 text-neutral-700 text-xs rounded-xl font-semibold hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBulkPrices}
              className="px-4 py-1.5 bg-[#78350F] hover:bg-[#5C2707] text-white text-xs rounded-xl font-bold flex items-center space-x-1 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save All Prices</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Category Filter Navigation */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <div className="absolute left-3.5 top-2.5 text-neutral-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by item name or ingredient..."
              className="w-full bg-white pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E8DEC8] focus:outline-none focus:border-amber-600 shadow-2xs"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-neutral-500">
            <span>
              Showing <strong className="text-neutral-900">{filteredItems.length}</strong> items
            </span>
            <button
              onClick={resetMenuToOriginal}
              className="inline-flex items-center space-x-1 text-amber-800 hover:text-amber-950 font-semibold underline text-[11px]"
              title="Reset all items to original cafe menu"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reload Default Menu</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const count =
              cat.id === 'all'
                ? menuItems.length
                : menuItems.filter((m) => m.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCategoryFilter(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                  categoryFilter === cat.id
                    ? 'bg-[#78350F] text-white shadow-2xs font-bold'
                    : 'bg-white text-neutral-600 hover:bg-[#FAF5EE] border border-[#EADBCE]'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    categoryFilter === cat.id ? 'bg-amber-500/40 text-white' : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-3xl border border-[#ECE2D8] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#F0E6DA] text-neutral-500 text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-3">Item</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">
                  <div className="flex items-center space-x-1">
                    <span>Price (₹)</span>
                    <span className="text-[10px] text-amber-700 font-normal">(Click to edit)</span>
                  </div>
                </th>
                <th className="py-3 px-3">Stock</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7EFE6]">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    No menu items found for this selection.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FCFAF7] transition-colors group"
                  >
                    {/* Item Thumbnail + Name + Variant */}
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-[#F5EDE4] shadow-2xs">
                          <FoodImage type={item.image} alt={item.name} />
                        </div>
                        <div>
                          <div className="font-bold text-[#2A170B] text-xs flex items-center space-x-1.5">
                            <span>{item.name}</span>
                            {item.variant && (
                              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-semibold">
                                {item.variant}
                              </span>
                            )}
                            {item.dietary && (
                              <span
                                className={`w-2 h-2 rounded-full inline-block ${
                                  item.dietary === 'veg' ? 'bg-emerald-600' : 'bg-red-600'
                                }`}
                                title={item.dietary === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                              />
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-400 max-w-[220px] truncate">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 font-medium capitalize text-neutral-600">
                      <span className="bg-[#FAF3EC] text-[#78350F] px-2 py-0.5 rounded-md border border-[#E8DEC8] text-[11px]">
                        {item.category.replace('-', ' ')}
                      </span>
                    </td>

                    {/* Price with In-Place Editable support */}
                    <td className="py-3 px-3 font-extrabold text-[#78350F] tabular-nums text-xs">
                      {isBulkPriceMode ? (
                        <div className="flex items-center space-x-1">
                          <span className="text-neutral-400">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={bulkPriceDrafts[item.id] ?? item.price}
                            onChange={(e) => handleBulkDraftChange(item.id, e.target.value)}
                            className="w-20 px-2 py-1 text-xs font-bold border border-amber-400 rounded-lg bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      ) : inlineEditingId === item.id ? (
                        <div className="flex items-center space-x-1">
                          <span className="text-neutral-400">₹</span>
                          <input
                            type="number"
                            min="0"
                            autoFocus
                            value={inlinePriceValue}
                            onChange={(e) => setInlinePriceValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveInlinePrice(item.id);
                              if (e.key === 'Escape') setInlineEditingId(null);
                            }}
                            className="w-16 px-1.5 py-0.5 text-xs font-bold border border-amber-600 rounded bg-white"
                          />
                          <button
                            onClick={() => handleSaveInlinePrice(item.id)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            title="Save"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setInlineEditingId(null)}
                            className="p-1 bg-neutral-200 text-neutral-600 rounded hover:bg-neutral-300"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartInlineEdit(item)}
                          className="hover:underline flex items-center space-x-1 group/btn px-1.5 py-0.5 rounded hover:bg-amber-50"
                          title="Click to edit price"
                        >
                          <span>₹{item.price}</span>
                          <Edit2 className="w-2.5 h-2.5 text-neutral-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </td>

                    {/* Stock Status Badge with Click-to-Toggle */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => toggleItemStock(item.id)}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                          item.inStock
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100'
                        }`}
                        title="Click to toggle stock status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.inStock ? 'bg-emerald-600' : 'bg-red-600'}`} />
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>

                    {/* Active/Inactive Toggle Switch */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => toggleItemActive(item.id)}
                        className="flex items-center space-x-1.5 text-xs text-neutral-600 hover:text-neutral-900"
                      >
                        <span
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${
                            item.isActive ? 'bg-emerald-600 justify-end' : 'bg-neutral-300 justify-start'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                        </span>
                        <span className="text-[11px] font-medium hidden sm:inline">
                          {item.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-[#78350F] hover:bg-amber-50 transition-colors"
                          title="Full Edit Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete "${item.name}" from menu?`)) {
                              deleteMenuItem(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-[#FAF7F2] px-4 py-3 border-t border-[#F0E6DA] flex items-center justify-between text-xs text-neutral-600">
          <div>
            Showing{' '}
            <span className="font-semibold text-neutral-800">
              {filteredItems.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-neutral-800">
              {Math.min(currentPage * itemsPerPage, filteredItems.length)}
            </span>{' '}
            of <span className="font-semibold text-neutral-800">{filteredItems.length}</span> items
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#E4D7C8] bg-white disabled:opacity-40 hover:bg-neutral-50"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: Math.min(totalPages, 7) }).map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === idx + 1
                    ? 'bg-[#78350F] text-white shadow-2xs'
                    : 'bg-white border border-[#E4D7C8] hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#E4D7C8] bg-white disabled:opacity-40 hover:bg-neutral-50"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick % Price Adjust Modal */}
      {isPriceAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-[#ECE2D8]">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-amber-700" />
                <h3 className="text-sm font-bold text-neutral-900">Adjust All Prices</h3>
              </div>
              <button onClick={() => setIsPriceAdjustModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <div className="py-3 space-y-3 text-xs">
              <p className="text-neutral-600">
                Quickly adjust prices across all menu items by a percentage (e.g. for seasonal pricing or inflation):
              </p>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Percentage Change (%)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={priceAdjustPercent}
                    onChange={(e) => setPriceAdjustPercent(e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                  <span className="font-bold text-neutral-500">%</span>
                </div>
              </div>

              {/* Quick shortcut chips */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPriceAdjustPercent('5')}
                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-[11px] font-bold"
                >
                  +5%
                </button>
                <button
                  type="button"
                  onClick={() => setPriceAdjustPercent('10')}
                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-[11px] font-bold"
                >
                  +10%
                </button>
                <button
                  type="button"
                  onClick={() => setPriceAdjustPercent('15')}
                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-[11px] font-bold"
                >
                  +15%
                </button>
                <button
                  type="button"
                  onClick={() => setPriceAdjustPercent('-5')}
                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-[11px] font-bold text-red-600"
                >
                  -5%
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsPriceAdjustModalOpen(false)}
                className="px-3 py-1.5 border rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = parseFloat(priceAdjustPercent);
                  if (!isNaN(p)) {
                    adjustAllPricesByPercent(p);
                    setIsPriceAdjustModalOpen(false);
                  }
                }}
                className="px-4 py-1.5 bg-[#78350F] text-white rounded-xl text-xs font-bold"
              >
                Apply to All Items
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Item Modal */}
      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#ECE2D8] animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">
                {editingItem ? 'Edit Menu Item' : 'Add Any Menu Item'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crispy Hot Wings"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:border-amber-600 focus:outline-none capitalize"
                  >
                    <option value="fried-chicken">Fried Chicken</option>
                    <option value="burgers">Burgers</option>
                    <option value="pizza">Pizza</option>
                    <option value="sandwiches">Sandwiches</option>
                    <option value="wraps">Wraps</option>
                    <option value="momos">Momos</option>
                    <option value="maggi">Maggi</option>
                    <option value="sides">Sides & Dips</option>
                    <option value="desserts">Desserts</option>
                    <option value="coffee-drinks">Coffee & Drinks</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="120"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:border-amber-600 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Portion / Variant</label>
                  <input
                    type="text"
                    placeholder="e.g. 4 Pcs / Regular"
                    value={formVariant}
                    onChange={(e) => setFormVariant(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:border-amber-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Dietary Tag</label>
                  <select
                    value={formDietary}
                    onChange={(e) => setFormDietary(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:border-amber-600 focus:outline-none"
                  >
                    <option value="veg">Vegetarian (Green Dot)</option>
                    <option value="non-veg">Non-Vegetarian (Red Dot)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Crispy, juicy, freshly prepared with secret spices..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Illustration Visual</label>
                  <select
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:border-amber-600 focus:outline-none"
                  >
                    <option value="wings">Hot Wings / Lollipops</option>
                    <option value="fried-chicken">Crispy Fried Chicken</option>
                    <option value="popcorn">Popcorn / Strips</option>
                    <option value="burger">Burger</option>
                    <option value="pizza">Pizza</option>
                    <option value="sandwich">Sandwich</option>
                    <option value="wrap">Wrap</option>
                    <option value="momo">Momos / Dumplings</option>
                    <option value="maggi">Maggi Noodles Bowl</option>
                    <option value="fries">Fries / Nuggets</option>
                    <option value="dip">Mayonnaise Dip</option>
                    <option value="brownie">Brownie / Sizzler</option>
                    <option value="cold-coffee">Cold Beverage / Mojito</option>
                    <option value="cappuccino">Hot Coffee Cup</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(e.target.value)}
                    placeholder="8 mins"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="rounded text-amber-700"
                  />
                  <span className="font-semibold text-neutral-800">In Stock</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="rounded text-amber-700"
                  />
                  <span className="font-semibold text-neutral-800">Visible on Storefront</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-xl text-neutral-700 font-semibold hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#78350F] hover:bg-[#5C2707] text-white rounded-xl font-bold shadow-xs"
                >
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
