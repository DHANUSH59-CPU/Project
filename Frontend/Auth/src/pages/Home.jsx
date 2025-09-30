import Hero from "../components/Hero";
import Hyperspeed from "../ui/HyperSpeed";

const Home = () => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background Animation - Full viewport coverage */}
      <div
        className="fixed inset-0 z-0 w-full h-full overflow-hidden"
        id="lights"
      >
        <Hyperspeed
          effectOptions={{
            onSpeedUp: () => {},
            onSlowDown: () => {},
            distortion: "turbulentDistortion",
            length: 800,
            roadWidth: 20,
            islandWidth: 4,
            lanesPerRoad: 6,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 3,
            carLightsFade: 0.6,
            totalSideLightSticks: 40,
            lightPairsPerRoadWay: 80,
            shoulderLinesWidthPercentage: 0.08,
            brokenLinesWidthPercentage: 0.15,
            brokenLinesLengthPercentage: 0.7,
            lightStickWidth: [0.2, 0.8],
            lightStickHeight: [2.0, 3.0],
            movingAwaySpeed: [80, 120],
            movingCloserSpeed: [-160, -200],
            carLightsLength: [800 * 0.05, 800 * 0.3],
            carLightsRadius: [0.08, 0.2],
            carWidthPercentage: [0.4, 0.7],
            carShiftX: [-1.2, 1.2],
            carFloorSeparation: [0, 8],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0xffffff,
              brokenLines: 0xffffff,
              leftCars: [0xff1493, 0x8a2be2, 0xff69b4],
              rightCars: [0x00ffff, 0x1e90ff, 0x00bfff],
              sticks: 0x00ffff,
            },
          }}
        />
      </div>

      {/* Content on top of animation */}
      <div className="relative z-10">
        <Hero />
      </div>
    </div>
  );
};

export default Home;
