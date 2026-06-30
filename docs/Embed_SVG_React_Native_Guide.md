# Tổng hợp: Embed SVG trong React Native (không cần SVG Transformer)

## Mục tiêu

Đóng gói icon SVG vào thư viện (.tgz) mà **không yêu cầu** ứng dụng sử
dụng phải cấu hình `react-native-svg-transformer` hay `metro.config.js`.

Chỉ cần:

-   react-native-svg

## Ý tưởng

Thay vì import:

``` ts
import Home from './home.svg';
```

chuyển SVG thành dữ liệu TypeScript.

``` ts
interface SvgData {
  viewBox: string;
  children: SvgNode[];
}
```

Ví dụ:

``` ts
HOME: {
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M3 9l9-7...",
        stroke: "currentColor",
        strokeWidth: 2
      }
    }
  ]
}
```

Component Icon render bằng `react-native-svg`.

## Renderer

``` tsx
import Svg, { Path, Circle, Rect, Polyline, Polygon, Line, Ellipse } from 'react-native-svg';
```

Dùng `switch(node.type)` để render đúng component.

## Không nên chỉ lưu

``` ts
paths: string[];
polylines: string[];
```

Vì sẽ mất:

-   stroke
-   fill
-   opacity
-   transform
-   gradient
-   clipPath
-   mask
-   circle
-   rect
-   ellipse
-   line
-   group

## Model đề xuất

``` ts
interface SvgNode {
  type:
    | "path"
    | "circle"
    | "rect"
    | "ellipse"
    | "line"
    | "polyline"
    | "polygon"
    | "g";

  props: Record<string, any>;
}

interface SvgData {
  viewBox: string;
  children: SvgNode[];
}
```

## Cấu trúc thư viện

``` text
design-system/
├── assets/icons
├── src
│   ├── icons
│   │   ├── generated-icons.ts
│   │   ├── Icon.tsx
│   │   └── index.ts
│   └── scripts
│       └── generate-icons.ts
```

## Quy trình

``` text
SVG Designer
      │
      ▼
assets/icons/*.svg
      │
      ▼
generate-icons.ts
      │
      ▼
generated-icons.ts
      │
      ▼
Icon Component
      │
      ▼
App
```

## Tự động generate

Khuyến nghị dùng:

-   svgson
-   svg-parser
-   @svgr/core
-   SVGO

Pipeline:

1.  Đọc SVG.
2.  Parse XML.
3.  Chuẩn hóa bằng SVGO.
4.  Chuyển thành object TypeScript.
5.  Sinh `generated-icons.ts`.

## Ưu điểm

-   Không cần Metro transformer.
-   Không cần import SVG trực tiếp.
-   Dễ publish `.tgz`.
-   Type-safe.
-   Hỗ trợ tree-shaking (nếu tổ chức hợp lý).
-   Có thể mở rộng mọi loại node SVG.

## Nhược điểm

-   Cần script generate.
-   Không nên chỉnh dữ liệu bằng tay.
-   Với icon rất phức tạp cần hỗ trợ đầy đủ các node SVG.

## Khuyến nghị

Đối với Design System React Native:

-   Không lưu chuỗi `paths[]` đơn giản.
-   Không phụ thuộc `react-native-svg-transformer`.
-   Dùng script sinh `generated-icons.ts` từ SVG.
-   Renderer chỉ phụ thuộc `react-native-svg`.

Đây là kiến trúc dễ bảo trì, phù hợp cho thư viện nội bộ và package
`.tgz`.
