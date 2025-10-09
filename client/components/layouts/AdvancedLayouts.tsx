/**
 * 🎨 Advanced Layout Components
 */

import { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useInView } from 'react-intersection-observer';
import Masonry from 'react-masonry-css';

// ========================================
// 1. MASONRY GRID LAYOUT
// ========================================

export const MasonryGrid = ({ 
  items,
  columns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  },
  gap = 16,
  renderItem
}: {
  items: any[];
  columns?: { [key: number]: number; default: number };
  gap?: number;
  renderItem: (item: any, index: number) => ReactNode;
}) => {
  return (
    <Masonry
      breakpointCols={columns}
      className="flex w-full"
      columnClassName="bg-clip-padding"
      style={{ marginLeft: -gap }}
    >
      {items.map((item, index) => (
        <div key={item.id || index} style={{ paddingLeft: gap, marginBottom: gap }}>
          {renderItem(item, index)}
        </div>
      ))}
    </Masonry>
  );
};

// Product Card for Masonry
export const MasonryProductCard = ({ product }: { product: any }) => {
  const heights = [200, 250, 300, 350];
  const randomHeight = heights[Math.floor(Math.random() * heights.length)];

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <div 
        className="relative overflow-hidden bg-gray-100"
        style={{ height: randomHeight }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm opacity-90">{product.price} ج.م</p>
        <button className="mt-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
          عرض التفاصيل
        </button>
      </div>
    </div>
  );
};

// ========================================
// 2. INFINITE SCROLL
// ========================================

export const InfiniteScroll = ({
  loadMore,
  hasMore,
  loader,
  endMessage,
  children,
  threshold = 0.8
}: {
  loadMore: () => void | Promise<void>;
  hasMore: boolean;
  loader?: ReactNode;
  endMessage?: ReactNode;
  children: ReactNode;
  threshold?: number;
}) => {
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setLoading(true);
      Promise.resolve(loadMore()).finally(() => {
        setLoading(false);
      });
    }
  }, [inView, hasMore, loading, loadMore]);

  return (
    <>
      {children}
      {hasMore && (
        <div ref={ref} className="w-full py-8 flex justify-center">
          {loading && (loader || <DefaultLoader />)}
        </div>
      )}
      {!hasMore && endMessage && (
        <div className="w-full py-8 text-center text-gray-500">
          {endMessage}
        </div>
      )}
    </>
  );
};

const DefaultLoader = () => (
  <div className="flex space-x-2">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ))}
  </div>
);

// ========================================
// 3. VIRTUAL LIST
// ========================================

export const VirtualList = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3
}: {
  items: any[];
  itemHeight: number | ((index: number) => number);
  containerHeight: number;
  renderItem: (item: any, index: number) => ReactNode;
  overscan?: number;
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const getItemHeight = (index: number): number => {
    return typeof itemHeight === 'function' ? itemHeight(index) : itemHeight;
  };

  const getTotalHeight = (): number => {
    return items.reduce((acc, _, index) => acc + getItemHeight(index), 0);
  };

  const getVisibleRange = (): { start: number; end: number } => {
    let accumulatedHeight = 0;
    let start = 0;
    let end = items.length - 1;

    for (let i = 0; i < items.length; i++) {
      const height = getItemHeight(i);
      if (accumulatedHeight + height > scrollTop) {
        start = Math.max(0, i - overscan);
        break;
      }
      accumulatedHeight += height;
    }

    accumulatedHeight = 0;
    for (let i = start; i < items.length; i++) {
      if (accumulatedHeight > containerHeight) {
        end = Math.min(items.length - 1, i + overscan);
        break;
      }
      accumulatedHeight += getItemHeight(i);
    }

    return { start, end };
  };

  const { start, end } = getVisibleRange();
  const visibleItems = items.slice(start, end + 1);

  const getItemOffset = (index: number): number => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(i);
    }
    return offset;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={scrollElementRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: getTotalHeight(), position: 'relative' }}>
        {visibleItems.map((item, index) => {
          const actualIndex = start + index;
          return (
            <div
              key={item.id || actualIndex}
              style={{
                position: 'absolute',
                top: getItemOffset(actualIndex),
                left: 0,
                right: 0,
                height: getItemHeight(actualIndex)
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ========================================
// 4. DRAG & DROP INTERFACE
// ========================================

// Sortable Item Component
const SortableItem = ({ 
  id, 
  children 
}: { 
  id: string; 
  children: ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

// Drag & Drop List
export const DragDropList = ({
  items,
  onReorder,
  renderItem
}: {
  items: Array<{ id: string; [key: string]: any }>;
  onReorder: (items: any[]) => void;
  renderItem: (item: any) => ReactNode;
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {renderItem(item)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

// Kanban Board
export const KanbanBoard = ({
  columns,
  onCardMove
}: {
  columns: Array<{
    id: string;
    title: string;
    cards: Array<{ id: string; title: string; description?: string }>;
  }>;
  onCardMove: (cardId: string, fromColumn: string, toColumn: string) => void;
}) => {
  const [localColumns, setLocalColumns] = useState(columns);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeCard = active.id as string;
    const overColumn = localColumns.find(col => 
      col.id === over.id || col.cards.some(card => card.id === over.id)
    );
    
    if (!overColumn) return;

    const sourceColumn = localColumns.find(col =>
      col.cards.some(card => card.id === activeCard)
    );
    
    if (!sourceColumn) return;

    if (sourceColumn.id !== overColumn.id) {
      onCardMove(activeCard, sourceColumn.id, overColumn.id);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {localColumns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
          >
            <h3 className="font-semibold text-lg mb-4">{column.title}</h3>
            <SortableContext
              items={column.cards.map(card => card.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {column.cards.map((card) => (
                  <SortableItem key={card.id} id={card.id}>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow cursor-move hover:shadow-md transition-shadow">
                      <h4 className="font-medium">{card.title}</h4>
                      {card.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {card.description}
                        </p>
                      )}
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
};

// ========================================
// 5. GRID WITH FILTERS
// ========================================

export const FilterableGrid = ({
  items,
  filters,
  onFilterChange,
  renderItem
}: {
  items: any[];
  filters: Array<{
    id: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
  onFilterChange: (filterId: string, value: string) => void;
  renderItem: (item: any) => ReactNode;
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    // Apply filters
    let filtered = items;
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(item => item[key] === value);
      }
    });
    setFilteredItems(filtered);
  }, [items, selectedFilters]);

  const handleFilterChange = (filterId: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [filterId]: value }));
    onFilterChange(filterId, value);
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {filters.map((filter) => (
          <select
            key={filter.id}
            value={selectedFilters[filter.id] || 'all'}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
        {Object.keys(selectedFilters).length > 0 && (
          <button
            onClick={() => setSelectedFilters({})}
            className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            مسح الفلاتر
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id}>{renderItem(item)}</div>
        ))}
      </div>

      {/* No results */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد نتائج مطابقة للفلاتر المحددة</p>
        </div>
      )}
    </div>
  );
};
