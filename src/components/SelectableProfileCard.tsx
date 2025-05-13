import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types/Profile";
import { Check, Globe, Coffee, Gift, Cloud, Bitcoin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectableProfileCardProps {
  profile: Profile;
  isSelected: boolean;
  onClick: () => void;
}

const SelectableProfileCard = ({ profile, isSelected, onClick }: SelectableProfileCardProps) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected ? "ring-2 ring-primary" : "hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <CardHeader className="relative pb-2">
        <CardTitle className="text-base">{profile.name}</CardTitle>
        {isSelected && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
            <Check className="h-3 w-3" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div> {/* Removed text-sm from here, apply to individual items */}
          {profile.github && (
            <div className="flex items-center gap-2 mb-2 text-sm">
              <svg className="h-4 w-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" fill="currentColor"/>
              </svg>
              <span className="truncate">{profile.github}</span> {/* No link needed for preview */}
            </div>
          )}
          
          {profile.x && (
            <div className="flex items-center gap-2 mb-2 text-sm">
              <svg className="h-4 w-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z" fill="currentColor"/>
              </svg>
              <span className="truncate">{profile.x}</span> {/* No link needed for preview */}
            </div>
          )}

          {profile.website && (
            <div className="flex items-center gap-2 mb-2 text-sm">
              <Globe className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{profile.website}</span>
            </div>
          )}
          {profile.buymeacoffee && (
            <div className="flex items-center gap-2 mb-2 text-sm">
              <Coffee className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{profile.buymeacoffee}</span>
            </div>
          )}
          {profile.kofi && (
            <div className="flex items-center gap-2 mb-2 text-sm">
              <Gift className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{profile.kofi}</span>
            </div>
          )}
          {profile.bsky && (
            <div className="flex items-center gap-2 mb-2 text-sm">
              <Cloud className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{profile.bsky}</span>
            </div>
          )}
          {profile.bitcoin && (
            <div className="flex items-center gap-2 mb-2 text-sm">
              <Bitcoin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{profile.bitcoin}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectableProfileCard;
