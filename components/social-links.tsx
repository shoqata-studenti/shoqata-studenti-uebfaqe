import Link from "next/link";
import { Briefcase, Camera, Music2, Users } from "lucide-react";

const socialBtn =
  "inline-flex w-full items-center gap-3 rounded-sm border border-black/12 bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:border-[#E11D48]/50 hover:bg-[#E11D48]/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48]";

const iconClass = "size-5 shrink-0 text-[#E11D48]";

export function SocialLinks() {
  return (
    <ul className="flex flex-col gap-3">
      <li>
        <Link href="#" className={socialBtn} aria-label="Instagram">
          <Camera className={iconClass} aria-hidden />
          Instagram
        </Link>
      </li>
      <li>
        <Link href="#" className={socialBtn} aria-label="LinkedIn">
          <Briefcase className={iconClass} aria-hidden />
          LinkedIn
        </Link>
      </li>
      <li>
        <Link href="#" className={socialBtn} aria-label="TikTok">
          <Music2 className={iconClass} aria-hidden />
          TikTok
        </Link>
      </li>
      <li>
        <Link href="#" className={socialBtn} aria-label="Facebook">
          <Users className={iconClass} aria-hidden />
          Facebook
        </Link>
      </li>
    </ul>
  );
}
