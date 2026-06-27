import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * QrMatrix — vẽ QR code dạng dot matrix từ mã 6 số.
 * Không dùng thư viện ngoài. Dùng thuật toán đơn giản:
 * seed từ code → tạo ma trận 21×21 deterministic.
 * (Đây là visual placeholder có tính nhất quán, không phải QR chuẩn ISO.)
 */

const SIZE = 21;

function buildMatrix(code: string): boolean[][] {
  // Seed từ code (deterministic)
  let seed = parseInt(code, 10) || 42;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };

  const matrix: boolean[][] = Array.from({ length: SIZE }, () =>
    Array(SIZE).fill(false),
  );

  // Finder patterns (3 góc cố định — giống QR thật)
  const finderCoords = [
    [0, 0], [0, SIZE - 7], [SIZE - 7, 0],
  ];
  finderCoords.forEach(([r, c]) => {
    for (let i = 0; i < 7; i++)
      for (let j = 0; j < 7; j++) {
        const border = i === 0 || i === 6 || j === 0 || j === 6;
        const inner  = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        matrix[r + i][c + j] = border || inner;
      }
  });

  // Data cells — fill ngẫu nhiên theo seed
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      const inFinder =
        (r < 8 && c < 8) ||
        (r < 8 && c >= SIZE - 8) ||
        (r >= SIZE - 8 && c < 8);
      if (!inFinder) matrix[r][c] = rng() > 0.45;
    }

  return matrix;
}

interface QrMatrixProps {
  code: string;
  size?: number;
  color?: string;
  bgColor?: string;
}

export const QrMatrix: React.FC<QrMatrixProps> = ({
  code,
  size = 200,
  color = '#111C36',
  bgColor = '#FFFFFF',
}) => {
  const matrix = useMemo(() => buildMatrix(code), [code]);
  const cellSize = size / SIZE;

  return (
    <View style={[s.wrapper, { width: size, height: size, backgroundColor: bgColor }]}>
      {matrix.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <View
              key={`${r}-${c}`}
              style={{
                position: 'absolute',
                top: r * cellSize,
                left: c * cellSize,
                width: cellSize,
                height: cellSize,
                backgroundColor: color,
              }}
            />
          ) : null,
        ),
      )}
    </View>
  );
};

const s = StyleSheet.create({
  wrapper: { position: 'relative', overflow: 'hidden' },
});
