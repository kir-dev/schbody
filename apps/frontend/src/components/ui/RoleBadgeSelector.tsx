import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import RoleBadge from '@/components/ui/RoleBadge';
import { Role } from '@/types/user-entity';

type RoleBadgeSelectorProps = {
  onChange: (newRole: Role) => Promise<void>;
  role: Role;
};
export function RoleBadgeSelector(props: RoleBadgeSelectorProps) {
  const [open, setOpen] = useState(false);
  if (!props) return 'a';
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          className='m-0 p-0'
          onClick={() => {
            setOpen(true);
          }}
        >
          <RoleBadge role={props.role} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder='Keresés...' />
          <CommandList>
            <CommandEmpty>Nincs ilyen szerep</CommandEmpty>
            <CommandGroup>
              {Object.keys(Role).map((role) => (
                <CommandItem
                  key={role}
                  value={role}
                  onSelect={(value) => {
                    props.onChange(value as Role);
                    setOpen(false);
                  }}
                >
                  <RoleBadge role={role as Role} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
