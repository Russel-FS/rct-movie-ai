import React from 'react';
import { View } from 'react-native';
import QRCodeSVG from 'react-native-qrcode-svg';

interface QRCodeProps {
  value: string;
  size?: number;
  backgroundColor?: string;
  color?: string;
}

export default function QRCode({
  value,
  size = 200,
  backgroundColor = '#FFFFFF',
  color = '#000000',
}: QRCodeProps) {
  return (
    <View
      style={{
        padding: 16,
        backgroundColor,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <QRCodeSVG value={value} size={size} color={color} backgroundColor={backgroundColor} />
    </View>
  );
}
