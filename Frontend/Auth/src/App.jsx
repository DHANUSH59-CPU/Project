import { usePWA } from "./hooks/usePWA";
import Header from "./components/Header";
export default function App() {
  const { isInstallable, installApp, isOnline } = usePWA();

  return (
    <div>
      <Header />
    </div>
  );
}
