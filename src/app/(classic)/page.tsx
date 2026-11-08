import ClassicHome from '@/components/classic-home';
import DesktopExperience from '@/components/desktop-experience';

export default function Home() {
  return (
    <>
      <div className="root-classic-home">
        <ClassicHome />
      </div>
      <DesktopExperience />
    </>
  );
}
