const LoadingFallback = ({ message = "Đang tải..." }) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse">{message}</div>
    </div>
  );
};
export default LoadingFallback;
