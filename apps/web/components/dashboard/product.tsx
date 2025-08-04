import React, { useState, useMemo } from 'react';
import {
  updateListing,
  deleteListing,
  automateListing
} from '@/lib/dashboard/actions';
import { KeyedMutator } from 'swr';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { PhotoView } from 'react-photo-view';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as Select from '@radix-ui/react-select';
import { showToast } from '@/utils/toast-utility';
import * as Checkbox from '@radix-ui/react-checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { MoreHorizontal, ChevronDown, Check } from 'lucide-react';

export function Product({
  product,
  statuses,
  categories,
  conditions,
  mutate
}: {
  product: any;
  statuses: string[];
  categories: string[];
  conditions: string[];
  mutate: KeyedMutator<any>;
}) {
  const [edit, setEdit] = useState(false);
  const [isAutomated, setIsAutomated] = useState(product.isAutomated);
  const [formData, setFormData] = useState({
    id: product.id,
    title: product.title,
    status: product.status,
    price: product.price.toString(),
    category: product.category,
    condition: product.condition
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAutomate = async (checked: boolean) => {
    setIsAutomated(checked);
    try {
      await automateListing(product.id, checked);
      await mutate();
    } catch (error) {
      setIsAutomated(!checked);
      showToast({
        message: 'Upgrade your tier to enable autopilot.',
        type: 'error'
      });
    }
  };

  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      await deleteListing(product.id);
      await mutate();
    } catch (error) {
      showToast({
        message: 'Oh snap! Failed to delete item.',
        type: 'error'
      });
    }
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateListing(new FormData(event.currentTarget));
      await mutate();
      setEdit(false);
    } catch (error) {
      showToast({
        message: 'Oh snap! Failed to update item.',
        type: 'error'
      });
    }
  };

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell w-[10%]">
        <PhotoView src={product.image_url}>
          <img
            alt="Product image"
            className="aspect-square rounded-md object-cover"
            height="64"
            src={product.image_url}
            width="64"
          />
        </PhotoView>
      </TableCell>
      <TableCell className="font-medium w-[20%]">
        {formData.title.length > 60
          ? `${formData.title.slice(0, 60)}...`
          : formData.title}
      </TableCell>
      <TableCell className="hidden md:table-cell w-[15%]">
        {edit ? (
          <Select.Root
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <Select.Value />
              <Select.Icon>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                <Select.Viewport className="p-1">
                  {statuses?.map((status: string) => (
                    <Select.Item
                      key={status}
                      value={status}
                      className="relative flex h-9 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <Select.ItemText>{status}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        ) : (
          formData.status
        )}
      </TableCell>
      <TableCell className="w-[10%]">
        {edit ? (
          <Input
            id="price"
            name="price"
            type="text"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full rounded-lg bg-background"
          />
        ) : (
          `$${formData.price}`
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell w-[15%]">
        {edit ? (
          <Select.Root
            value={formData.category}
            onValueChange={(value) => handleSelectChange('category', value)}
          >
            <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <Select.Value />
              <Select.Icon>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                <Select.Viewport className="p-1">
                  {categories?.map((category: string) => (
                    <Select.Item
                      key={category}
                      value={category}
                      className="relative flex h-9 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <Select.ItemText>{category}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        ) : (
          formData.category
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell w-[15%]">
        {edit ? (
          <Select.Root
            value={formData.condition}
            onValueChange={(value) => handleSelectChange('condition', value)}
          >
            <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <Select.Value />
              <Select.Icon>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                <Select.Viewport className="p-1">
                  {conditions?.map((condition: string) => (
                    <Select.Item
                      key={condition}
                      value={condition}
                      className="relative flex h-9 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <Select.ItemText>{condition}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        ) : (
          formData.condition
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell w-[10%] p-0">
        <div className="flex items-center justify-center h-full">
          <Checkbox.Root
            className="flex h-4 w-4 appearance-none items-center justify-center rounded-sm border border-primary bg-background outline-none hover:bg-primary/10 focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            checked={isAutomated}
            onCheckedChange={handleAutomate}
            id={`autopilot-${product.id}`}
          >
            <Checkbox.Indicator className="flex items-center justify-center text-current">
              <Check className="h-3.5 w-3.5" />
            </Checkbox.Indicator>
          </Checkbox.Root>
        </div>
      </TableCell>
      <TableCell className="w-[5%]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {edit ? (
              <>
                <DropdownMenuItem>
                  <form onSubmit={handleUpdate}>
                    <input type="hidden" name="id" value={formData.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={formData.status}
                    />
                    <input type="hidden" name="price" value={formData.price} />
                    <input
                      type="hidden"
                      name="category"
                      value={formData.category}
                    />
                    <input
                      type="hidden"
                      name="condition"
                      value={formData.condition}
                    />
                    <button type="submit">Save</button>
                  </form>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEdit(false)}>
                  <span className="text-red-600">Cancel</span>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => setEdit(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  <span className="text-red-600">Delete</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
