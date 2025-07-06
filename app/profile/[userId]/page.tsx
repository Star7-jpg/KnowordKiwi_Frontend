import { Banner } from "./components/Banner";
import Navbar from "@/components/ui/navbar/Navbar";
import LateralMenu from "@/components/shared/LateralMenu";

export default function ProfilePage() {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <LateralMenu />
        <Banner />
      </div>
    </div>
  );
}
