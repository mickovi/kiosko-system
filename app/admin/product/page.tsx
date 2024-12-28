import ProductPagination from "@/components/product/ProductPagination";
import ProductSearchForm from "@/components/product/ProductSearchForm";
import ProductTable from "@/components/product/ProductTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getProducts(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;
  const products = await prisma.product.findMany({
    take: pageSize,
    skip,
    include: {
      category: true,
    },
  });
  return products;
}

async function ProductsCount() {
  return await prisma.product.count();
}

// Useful when the schema changes and you need to update the type
export type ProductsWithCategory = Awaited<ReturnType<typeof getProducts>>;

export default async function ProductPage({
  searchParams,
}: {
  searchParams: { currentPage: string };
}) {
  const { currentPage } = await searchParams;
  const page = +currentPage || 1;
  const pageSize = 10;

  if (page < 0) redirect("/admin/product");

  const productsData = getProducts(page, pageSize);
  const totalProductsData = ProductsCount();

  const [products, totalProducts] = await Promise.all([
    productsData,
    totalProductsData,
  ]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  if (page > totalPages) redirect("/admin/product");

  return (
    <>
      <Heading>Administrar Productos</Heading>
      <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
        <Link
          href={"/admin/product/new"}
          className="bg-amber-400 w-full lg:w-auto text-xl px-10 py-3 text-center font-bold cursor-pointer"
        >
          Crear Producto
        </Link>
        <ProductSearchForm />
      </div>
      <ProductTable products={products} />
      <ProductPagination page={page} totalPages={totalPages} />
    </>
  );
}
