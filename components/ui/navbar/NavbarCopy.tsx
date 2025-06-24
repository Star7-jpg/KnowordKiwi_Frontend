import { NotificationsMenu } from "./NotificationsMenu";
import { ProfileMenu } from "./ProfileMenu";
import SearchBar from "./SearchBar";

export default function NavbarCopy() {
  return (
    <nav className="bg-black text-white p-4 flex items-center justify-between z-50 relative">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold mr-8">KnoWord</h1>
      </div>
      <SearchBar />
      <div className="flex items-center space-x-4 ml-8 mr-4">
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </nav>
  );
}
