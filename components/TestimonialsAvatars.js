const StarRow = () => (
  <div className="flex items-center gap-1 text-[#f4b400]">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const TrustPill = ({ children }) => (
  <div className="inline-flex items-center rounded-full border border-[#d8e4fb] bg-white px-4 py-2 text-sm font-semibold text-[#100b47] shadow-sm">
    {children}
  </div>
);

const TestimonialsAvatars = () => {
  return (
    <div className="mb-4 rounded-2xl border border-[#d8e4fb] bg-gradient-to-br from-white to-[#f5f9ff] p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <StarRow />
            <p className="text-lg font-bold text-[#100b47]">
              Trusted by London homeowners
            </p>
          </div>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            5-star rated service with verified review proof across Google,
            Houzz, and MyBuilder.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <TrustPill>Google 5 Stars</TrustPill>
          <TrustPill>My Builder 5 Stars</TrustPill>
          <TrustPill>Best of Houzz Award</TrustPill>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsAvatars;
