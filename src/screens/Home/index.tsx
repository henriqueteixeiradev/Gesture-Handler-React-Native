import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { MovableCard } from "../../components/MovableCard";

import { data } from "../../mocks/data";
import { DataDTO } from "../../mocks/DataDTO";

export function Home() {
  let scrollY = useSharedValue(0);
  let cardsPosition = useSharedValue(listToObject(data));

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  function listToObject(list: DataDTO[]) {
    const listOfCards = Object.values(list);
    const object: any = [];

    listOfCards.forEach((card, index) => {
      object[card.id] = index;
    });

    return object;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headline}>
        <Text style={styles.title}>Gesture Handler</Text>
        <Text style={styles.description}>Aqui é uma descrição</Text>
      </View>

      <Animated.ScrollView
        style={styles.scroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          height: data.length * 100,
        }}
      >
        {data.map((item) => (
          <MovableCard
            title={item.title}
            key={item.id}
            scrollY={scrollY}
            cardsCount={data.length}
            cardsPosition={cardsPosition}
            id={item.id}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginTop: 80,
    backgroundColor: "#000",
    padding: 16,
  },
  headline: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#fff",
  },
  scroll: {
    width: "100%",
    flex: 1,
    marginTop: 50,
    position: "relative",
  },
});
