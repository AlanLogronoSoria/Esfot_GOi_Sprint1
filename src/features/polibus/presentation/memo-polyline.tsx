import React, { memo } from 'react';
import { Polyline } from 'react-native-maps';

interface MemoPolylineProps {
  coordinates: { latitude: number; longitude: number }[];
  color: string;
}

export const MemoPolyline = memo(
  function MemoPolyline({ coordinates, color }: MemoPolylineProps) {
    if (coordinates.length < 2) return null;
    return (
      <Polyline
        coordinates={coordinates}
        strokeColor={color}
        strokeWidth={5}
        lineCap="round"
        lineJoin="round"
        miterLimit={0}
      />
    );
  },
  (prev, next) =>
    prev.color === next.color &&
    prev.coordinates.length === next.coordinates.length &&
    prev.coordinates[0]?.latitude === next.coordinates[0]?.latitude
);
