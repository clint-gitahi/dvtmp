import React, { memo } from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { palette, typography, type ThemeColor, type TypographyVariant } from '@shared/theme';

type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: ThemeColor;
  align?: TextStyle['textAlign'];
};

function TextBase({
  variant = 'body',
  color = 'ink',
  align,
  style,
  children,
  ...rest
}: TextProps) {
  return (
    <RNText
      {...rest}
      style={[
        typography[variant],
        { color: palette[color] },
        align ? { textAlign: align } : null,
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

export const Text = memo(TextBase);