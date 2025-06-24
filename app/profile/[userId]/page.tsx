import { Avatar } from "@/components/ui/userProfile/Avatar";
import { Banner } from "./components/Banner";
import { Navbar } from "@/components/ui/navbar/Navbar";

export default function ProfilePage() {
  return (
    <div>
      <Navbar />
      <Banner />
      <Avatar src="/default-avatar.jpeg" size="lg" editable={false} />
    </div>
  );
}
