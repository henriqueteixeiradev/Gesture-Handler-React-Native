import { useState } from "react";
import { StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedReaction,
} from "react-native-reanimated";
import { CardList } from "../CardList";

interface MovableCardProps {
  title: string;
  cardsPosition: SharedValue<number[]>;
  scrollY: SharedValue<number>;
  cardsCount: number;
  id: number;
}

export const MovableCard = ({
  title,
  id,
  cardsPosition,
  scrollY,
  cardsCount,
}: MovableCardProps) => {
  const [moving, setMoving] = useState(false);

  const top = useSharedValue(cardsPosition.value[id] * 110);

  function objectMove(postions: number[], from: number, to: number) {
    "worklet";
    const newPositions = Object.assign({}, postions);

    for (const id in postions) {
      if (postions[id] === from) {
        newPositions[id] = to;
      }

      if (postions[id] === to) {
        newPositions[id] = from;
      }
    }

    return newPositions;
  }

  useAnimatedReaction(
    () => cardsPosition.value[id],
    (currentPosition, previousPosition) => {
      if (currentPosition !== previousPosition) {
        if (!moving) {
          top.value = withSpring(currentPosition * 110);
        }
      }
    }
  );

  const longPressGesture = Gesture.LongPress()
    .onStart(() => {
      runOnJS(setMoving)(true);
    })
    .minDuration(200);

  const penGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((_, state) => {
      moving ? state.activate() : state.fail();
    })
    .onUpdate((event) => {
      const positionY = event.absoluteY + scrollY.value;

      top.value = positionY - 80;
      const startPositionList = 0;
      const endPositionList = cardsCount - 1;

      const currentPosition = Math.floor(positionY / 100);
      ("worklet");
      const newPosition = Math.max(
        startPositionList,
        Math.min(currentPosition, endPositionList)
      );

      if (newPosition !== cardsPosition.value[id]) {
        cardsPosition.value = objectMove(
          cardsPosition.value,
          cardsPosition.value[id],
          newPosition
        );
      }
    })
    .onFinalize(() => {
      const newPosition = cardsPosition.value[id] * 110;
      top.value = withSpring(newPosition);
      runOnJS(setMoving)(false);
    })
    .simultaneousWithExternalGesture(longPressGesture);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: top.value - 100,
      zIndex: moving ? 1 : 0,
      opacity: withSpring(moving ? 1 : 0.4),
    };
  }, [moving]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <GestureDetector gesture={Gesture.Race(penGesture, longPressGesture)}>
        <CardList title={title} />
      </GestureDetector>
    </Animated.View>
  );
};

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
  },
});
