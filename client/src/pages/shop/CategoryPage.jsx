import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import LoadMoreButton from "../../components/LoadMoreButton";
import ProductCard from "../../components/ProductCard";
import Spinner from "../../components/Spinner";
import useProductStore from "../../store/productStore";

/**
 * CategoryPage Component
 * Renders products of a single category with load-more pagination.
 * Props: none
 */
const CategoryPage = () => {
  const { id } = useParams();

  const fetchCategories = useProductStore((state) => state.fetchCategories);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  const [categoryName, setCategoryName] = useState("Category");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async ({ nextPage, append }) => {
    const result = await fetchProducts({ category: id, page: nextPage, limit: 8 });

    if (!result.success) {
      return;
    }

    setProducts((prev) => (append ? [...prev, ...result.data.products] : result.data.products));
    setPage(nextPage);
    setTotal(result.data.total);
  };

  const initializePage = async () => {
    setIsLoading(true);

    const categoriesResult = await fetchCategories();
    if (categoriesResult.success) {
      const activeCategory = categoriesResult.data.find((category) => category._id === id);
      if (activeCategory) {
        setCategoryName(activeCategory.name);
      }
    }

    await loadProducts({ nextPage: 1, append: false });
    setIsLoading(false);
  };

  useEffect(() => {
    initializePage();
  }, [id]);

  const hasMore = products.length < total;

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: categoryName }]} />

      <h1 className="text-3xl font-extrabold text-amber-900">{categoryName}</h1>

      {isLoading ? (
        <Spinner label="Loading category products..." />
      ) : products.length === 0 ? (
        <p className="text-sm text-amber-800/70">No products found in this category.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {hasMore && (
            <LoadMoreButton
              onClick={() => loadProducts({ nextPage: page + 1, append: true })}
              label="Load More Products"
            />
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;
