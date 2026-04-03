import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Gulzar Regular (OFL) — TTF required; ImageResponse does not accept woff2. */
const GULZAR_TTF =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/gulzar/Gulzar-Regular.ttf";

export default async function Icon() {
  const fontData = await fetch(GULZAR_TTF).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #0f172a 0%, #1e3a5f 100%)",
          color: "#f1f5f9",
          fontSize: 22,
          fontFamily: "Gulzar",
          fontWeight: 400,
        }}
      >
        5
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Gulzar",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
