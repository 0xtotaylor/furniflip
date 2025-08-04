import Link from 'next/link';
import { KeyedMutator } from 'swr';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { showToast } from '@/utils/toast-utility';
import { deleteCatalog } from '@/lib/dashboard/actions';
import { TableCell, TableRow } from '@/components/ui/table';
import { Link as LinkIcon, MoreHorizontal } from 'lucide-react';

export function Catalog({
  catalog,
  mutate
}: {
  catalog: any;
  mutate: KeyedMutator<any>;
}) {
  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await deleteCatalog(formData);
      await mutate();
    } catch (error) {
      showToast({
        message: 'Please delete the associated inventory first.',
        type: 'error'
      });
    }
  };

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      //await deleteCatalog(formData);
      //await mutate();
    } catch (error) {
      showToast({
        message: 'Oh snap! Failed to send catalog.',
        type: 'error'
      });
    }
  };

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <img
          alt="Catalog image"
          className="aspect-square"
          height="64"
          src="/logos/slides.svg"
          width="64"
        />
      </TableCell>
      <TableCell className="hidden md:table-cell">{catalog.id}</TableCell>
      <TableCell className="hidden md:table-cell">{catalog.status}</TableCell>
      <TableCell>{new Date(catalog.created_at).toLocaleDateString()}</TableCell>
      <TableCell>
        {
          <Link
            href={`https://docs.google.com/presentation/d/${catalog.presentation_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon className="h-5 w-5" />
          </Link>
        }
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <form onSubmit={handleSend}>
                <input type="hidden" name="id" value={catalog.id} />
                <button type="submit">Send</button>
              </form>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form onSubmit={handleDelete}>
                <input type="hidden" name="id" value={catalog.id} />
                <button type="submit" className="text-red-600">
                  Delete
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
