import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, Easing } from "react-native";

enum ToastVariants {
  success = "SUCCESS",
  error = "ERROR",
}

interface ToastProps {
  visible: boolean;
  variant?: keyof typeof ToastVariants;
  message: string;
  duration?: number;
  onHide?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  variant = "success",
  message,
  duration = 2000,
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      // Slide down animation
      Animated.timing(translateY, {
        toValue: 40,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        timeoutRef.current = setTimeout(() => {
          // Slide up and hide
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }).start(() => {
            onHide && onHide();
          });
        }, duration);
      });
    } else {
      // Hide immediately if visible becomes false
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, duration, onHide, translateY]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.toastContainer, { transform: [{ translateY }] }]}
    >
      <View style={[styles.toast, styles[variant]]}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 20,
  },
  toast: {
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
  },
  success: {
    backgroundColor: "teal",
  },
  error: {
    backgroundColor: "#c00",
  },
  text: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});
