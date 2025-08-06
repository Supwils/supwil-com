const LoadingSpinner = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="w-full h-full border-4 border-[var(--border-color)] border-t-[var(--main-color)] rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 