'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>حدث خطأ أثناء تحميل الصفحة!</h2>
      <p>{error.message}</p>
      <button
        onClick={() => reset()}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
      >
        إعادة المحاولة
      </button>
    </div>
  );
}