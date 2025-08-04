import { KeyedMutator } from 'swr';
import { PhotoView } from 'react-photo-view';
import { TableCell, TableRow } from '@/components/ui/table';

const platformColors: { [key: string]: string } = {
  Facebook: 'bg-blue-100 text-blue-800',
  eBay: 'bg-yellow-100 text-yellow-800',
  Craigslist: 'bg-purple-100 text-purple-800'
};

export function Autopilot({
  automation,
  platforms,
  mutate
}: {
  automation: any;
  platforms: string[];
  mutate: KeyedMutator<any>;
}) {
  const PlatformBadge = ({ platform }: { platform: string }) => (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${platformColors[platform] || 'bg-gray-100 text-gray-800'}`}
    >
      {platform}
    </span>
  );

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <PhotoView src={automation.inventory.image_url}>
          <img
            alt="Product image"
            className="aspect-square rounded-md object-cover"
            height="64"
            src={automation.inventory.image_url}
            width="64"
          />
        </PhotoView>
      </TableCell>
      <TableCell className="font-medium">
        {automation.inventory.title.length > 60
          ? `${automation.inventory.title.slice(0, 60)}...`
          : automation.inventory.title}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex flex-wrap gap-2">
          {automation.platforms.map((platform: string) => (
            <PlatformBadge key={platform} platform={platform} />
          ))}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">{automation.stage}</TableCell>
      <TableCell>${automation.offer}</TableCell>
      <TableCell className="hidden md:table-cell">0</TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(automation.created_at).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
}
