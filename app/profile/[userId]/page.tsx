import { Avatar } from "@/components/ui/userProfile/Avatar";
import { Banner } from "./components/Banner";
import { Navbar } from "@/components/ui/navbar/Navbar";
import NavbarCopy from "@/components/ui/navbar/NavbarCopy";

export default function ProfilePage() {
  return (
    <div>
      <NavbarCopy />
      <Banner />
      <Avatar src="/default-avatar.jpeg" size="lg" editable={false} />
    </div>
  );
}
