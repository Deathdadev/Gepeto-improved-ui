import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/Profile";
import { Edit, Trash, Link, Coffee, SquareTerminal, Bitcoin, Twitter, Gift, Github, Cloud } from "lucide-react"; // Use Twitter and Gift icons

interface ProfileCardProps {
  profile: Profile;
  onEdit: () => void;
  onDelete: () => void;
}

const ProfileCard = ({ profile, onEdit, onDelete }: ProfileCardProps) => {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>{profile.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3"> {/* Added space-y-3 for better spacing */}
          {profile.github && (
            <div className="flex items-center gap-2 text-sm">
              <Github className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate text-blue-600 dark:text-blue-400">{profile.github}</a>
            </div>
          )}
          
          {profile.x && (
            <div className="flex items-center gap-2 text-sm">
              <Twitter className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <a href={`https://x.com/${profile.x}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate text-blue-600 dark:text-blue-400">{profile.x}</a>
            </div>
          )}

          {profile.website && (
            <div className="flex items-center gap-2 mb-2 text-sm">
              <Link className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate text-blue-600 dark:text-blue-400">{profile.website}</a>
            </div>
          )}
          {profile.buymeacoffee && (
            <div className="flex items-center gap-2 text-sm">
              <Coffee className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <a href={`https://www.buymeacoffee.com/${profile.buymeacoffee}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate text-blue-600 dark:text-blue-400">{profile.buymeacoffee}</a>
            </div>
          )}
          {profile.kofi && (
            <div className="flex items-center gap-2 text-sm">
              <Gift className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <a href={`https://ko-fi.com/${profile.kofi}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate text-blue-600 dark:text-blue-400">{profile.kofi}</a>
            </div>
          )}
          {profile.bsky && (
            <div className="flex items-center gap-2 text-sm">
              <Cloud className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <a href={profile.bsky.startsWith('http') ? profile.bsky : `https://bsky.app/profile/${profile.bsky}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate text-blue-600 dark:text-blue-400">{profile.bsky}</a>
            </div>
          )}
          {profile.bitcoin && (
            <div className="flex items-center gap-2 text-sm">
              <Bitcoin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="truncate text-muted-foreground">{profile.bitcoin}</span> {/* Display Bitcoin address */}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2"> {/* Changed to justify-end and added space-x-2 */}
        <Button variant="outline" size="sm" onClick={onEdit} className="text-xs"> {/* Made text smaller */}
          <Edit className="h-3.5 w-3.5 mr-1" /> {/* Made icon smaller */}
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete} className="text-xs"> {/* Changed to destructive and made text smaller */}
          <Trash className="h-3.5 w-3.5 mr-1" /> {/* Made icon smaller */}
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;