import { Dimensions } from "react-native";

// User-oda Mobile Screen Dimensions (Width & Height)
const { width, height } = Dimensions.get("window");

export const SIZES = {
  // Global Spacing & Margins
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 20,
  extraLarge: 24,

  // Component Specific Sizes
  padding: 16, // Screen Side Padding
  borderRadius: 12, // Card & Button Rounded Corners
  buttonHeight: 52, // Standard Accessible Button Height

  // Screen Width/Height for Responsive Layouts
  width,
  height,
};
