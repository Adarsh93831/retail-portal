import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryCard from "../../components/CategoryCard";
import LoadMoreButton from "../../components/LoadMoreButton";
import ProductCard from "../../components/ProductCard";
import Spinner from "../../components/Spinner";
import useProductStore from "../../store/productStore";

/**
 * HomePage Component
 * Renders categories and grouped products with per-category load-more pagination.
 * Props: none
 */
const HomePage = () => {
  const [searchParams] = useSearchParams();
  const search = (searchParams.get("search") || "").trim();

  const fetchCategories = useProductStore((state) => state.fetchCategories);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const loadCategoryProducts = async ({ categoryId, page = 1, append = false }) => {
    const result = await fetchProducts({
      category: categoryId,
      search,
      page,
      limit: 4,
    });

    if (!result.success) {
      return;
    }

    setSections((prev) => {
      const previousItems = append ? prev[categoryId]?.items || [] : [];
      return {
        ...prev,
        [categoryId]: {
          items: [...previousItems, ...result.data.products],
          page,
          total: result.data.total,
        },
      };
    });
  };

  const initializeHomeData = async () => {
    setIsLoading(true);

    const categoriesResult = await fetchCategories();
    if (!categoriesResult.success) {
      setIsLoading(false);
      return;
    }

    setCategories(categoriesResult.data);
    setSections({});

    for (const category of categoriesResult.data) {
      await loadCategoryProducts({ categoryId: category._id, page: 1, append: false });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    initializeHomeData();
  }, [search]);

  if (isLoading) {
    return <Spinner label="Loading storefront..." />;
  }

  return (
    <div className="space-y-8">
      <section className="hero-gradient rounded-panel p-6 shadow-panel">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Retail Portal</p>
        <h1 className="mt-2 text-3xl font-extrabold text-amber-900 sm:text-4xl">Fresh picks. Fast checkout. Smart inventory.</h1>
        <p className="mt-2 max-w-2xl text-sm text-amber-900/85">
          Browse category sections, discover add-ons, and complete your order journey in one smooth flow.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-extrabold text-amber-900">Browse by Category</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </section>

      {categories.map((category) => {
        const section = sections[category._id] || { items: [], page: 1, total: 0 };
        const hasMore = section.items.length < section.total;

        return (
          <section key={category._id} className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-amber-900">{category.name}</h3>
                <p className="text-sm text-amber-800/80">{category.description || "Top picks in this category"}</p>
              </div>
            </div>

            {section.items.length === 0 ? (
              <p className="text-sm text-amber-800/70">No products found in this category.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {section.items.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {hasMore && (
              <LoadMoreButton
                onClick={() =>
                  loadCategoryProducts({
                    categoryId: category._id,
                    page: section.page + 1,
                    append: true,
                  })
                }
              />
            )}
          </section>
        );
      })}
    </div>
  );
};

export default HomePage;
