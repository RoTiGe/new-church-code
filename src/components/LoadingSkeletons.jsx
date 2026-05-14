export const ImageCardSkeleton = ({ count = 6 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition animate-pulse"
                >
                    {/* Image Placeholder */}
                    <div className="relative w-full h-72 bg-gray-300" />

                    {/* Overlay Placeholder */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />
                </div>
            ))}
        </>
    );
};