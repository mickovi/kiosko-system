import EditProductForm from "@/components/product/EditProductForm";
import ProductForm from "@/components/product/ProductForm";
import GoBackButton from "@/components/ui/GoBackButton";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";

async function getProductById(id: number) {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  if (!product) notFound(); // Busca el archivo not-found y lo renderiza

  return product;
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(+params.id);

  return (
    <>
      <Heading>Editar producto: {product.name}</Heading>
      <GoBackButton />
      <EditProductForm>
        {/* Principio de Open-Close: Usar el compromente de ProductFrom para crear y editar */}
        <ProductForm product={product} />
      </EditProductForm>
    </>
  );
}
