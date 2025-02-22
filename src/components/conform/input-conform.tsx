import { type FieldMetadata, getInputProps } from '@conform-to/react';
import type { ComponentProps } from 'react';
import { Input } from '../ui/input';

export const InputConform = ({
  meta,
  type,
  ...props
}: {
  meta: FieldMetadata<string>;
  type: Parameters<typeof getInputProps>[1]['type'];
} & ComponentProps<typeof Input>) => {
  const inputProps = getInputProps(meta, { type, ariaAttributes: true });

  return <Input {...inputProps} {...props} key={inputProps.key} />;
};
