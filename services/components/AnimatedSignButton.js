import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export default function AnimatedSignButton({
  children,
  contentStyle,
  disabled,
  onPress,
  style,
}) {
  const spin = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    spinLoop.start();
    glowLoop.start();

    return () => {
      spinLoop.stop();
      glowLoop.stop();
    };
  }, [glow, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.28, 0.85],
  });
  const glowScale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });
  const sparkleScale = glow.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.22, 1],
  });

  const animateScale = (toValue) => {
    Animated.spring(pressScale, {
      toValue,
      friction: 6,
      tension: 130,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => animateScale(0.98)}
      onPressOut={() => animateScale(1)}
    >
      <Animated.View
        style={[
          styles.button,
          style,
          styles.buttonShape,
          disabled && styles.disabled,
          { transform: [{ scale: pressScale }] },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glowRing,
            { opacity: glowOpacity, transform: [{ scale: glowScale }] },
          ]}
        />

        <View pointerEvents="none" style={styles.dotsBorder}>
          <Animated.View style={[styles.dotsSweep, { transform: [{ rotate }] }]} />
        </View>

        <View pointerEvents="none" style={styles.darkBase} />
        <Animated.View pointerEvents="none" style={[styles.purpleLayer, { opacity: glowOpacity }]}>
          <View style={[styles.lightOrb, styles.lightOrbOne]} />
          <View style={[styles.lightOrb, styles.lightOrbTwo]} />
          <View style={[styles.lightOrb, styles.lightOrbThree]} />
        </Animated.View>

        <View style={[styles.content, contentStyle]}>
          <Animated.Text style={[styles.sparkle, { transform: [{ scale: sparkleScale }] }]}>
            *
          </Animated.Text>
          {children}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "relative",
    overflow: "visible",
  },
  buttonShape: {
    borderRadius: 999,
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.62,
  },
  glowRing: {
    position: "absolute",
    top: -5,
    right: -5,
    bottom: -5,
    left: -5,
    borderRadius: 999,
    backgroundColor: "rgba(235, 203, 122, 0.48)",
  },
  dotsBorder: {
    position: "absolute",
    top: -1,
    right: -1,
    bottom: -1,
    left: -1,
    borderRadius: 999,
    overflow: "hidden",
    zIndex: 0,
  },
  dotsSweep: {
    position: "absolute",
    top: "50%",
    left: "-8%",
    width: "116%",
    height: 30,
    marginTop: -15,
    backgroundColor: "#FFFFFF",
    opacity: 0.9,
  },
  darkBase: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    backgroundColor: "#EBCB7A",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 1,
  },
  purpleLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    backgroundColor: "rgba(235, 203, 122, 0.34)",
    overflow: "hidden",
    zIndex: 2,
  },
  lightOrb: {
    position: "absolute",
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(255, 255, 255, 0.34)",
  },
  lightOrbOne: {
    right: -18,
    bottom: -34,
  },
  lightOrbTwo: {
    left: "42%",
    bottom: -42,
  },
  lightOrbThree: {
    left: -18,
    bottom: -36,
    backgroundColor: "rgba(222, 173, 58, 0.44)",
  },
  content: {
    position: "relative",
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 50,
    paddingHorizontal: 18,
  },
  sparkle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 22,
  },
});
