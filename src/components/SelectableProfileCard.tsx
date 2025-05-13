import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types/Profile";
import { Check, Coffee, Gift, Bitcoin, Github, Twitter, Link, SquareTerminal, Cloud } from "lucide-react";
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
              <Github className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{profile.github}</span> {/* No link needed for preview */}
            </div>
          )}
          
          {profile.x && (
            <div className="flex items-center gap-2 mb-2 text-sm">
              <Twitter className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{profile.x}</span> {/* No link needed for preview */}
            </div>
          )}

          {profile.website && (
            <div className="flex items-center gap-2 mb-2 text-sm">
              <Link className="h-4 w-4 flex-shrink-0" />
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
