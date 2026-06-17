import Link from "next/link";
import { CategoryForm } from "@/components/category-form";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/categories"
          className="text-sm text-muted hover:underline"
        >
          ← Categorías
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Nueva categoría</h1>
      </div>
      <CategoryForm />
    </div>
  );
}
