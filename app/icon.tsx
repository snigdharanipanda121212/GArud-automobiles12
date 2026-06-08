import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '25%',
          border: '1.5px solid #d97706',
        }}
      >
        {/* Dynamic high fidelity gold Garud wings icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L14.5 9L18 6L16.5 13L12 11.5L7.5 13L6 6L9.5 9L12 4Z" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.5" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
