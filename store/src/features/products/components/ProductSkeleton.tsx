export function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-soft">
          <div className="aspect-[4/3] animate-pulse bg-slate-100" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-20 animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
            <div className="h-10 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
