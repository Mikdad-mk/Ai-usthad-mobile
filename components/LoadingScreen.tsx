import { View, ActivityIndicator, Image } from "react-native";

export default function LoadingScreen() {
  return (
    <View className="flex-1 bg-[#fbf9f6] items-center justify-center">
      <View className="items-center">
        <View className="w-20 h-20 mb-4">
          <Image
            source={{
              uri: "https://res.cloudinary.com/dqliogfsg/image/upload/v1764522883/AI_USTAD-01_fsgefv.png",
            }}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        <ActivityIndicator size="large" color="#d97706" />
      </View>
    </View>
  );
}
