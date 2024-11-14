import * as React from "react";

import { cn } from "@/lib/utils";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = React.ComponentProps<"input"> & {
  control?: Control<T>;
  name?: Path<T>;
  wrapperClassName?: string;
  label?: string;
};

function Input<T extends FieldValues>(props: Props<T>) {
  const { name, label, wrapperClassName, control, className, ...rest } = props;

  if (!control) {
    return (
      <input
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        {...rest}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("w-full space-y-1", wrapperClassName)}>
          {Boolean(label) && <label htmlFor={name}>{label}</label>}
          <input
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className,
            )}
            {...rest}
            {...field}
            id={name}
          />
          {Boolean(error) && (
            <p className="text-error text-red-400 text-xs">{error?.message}</p>
          )}
        </div>
      )}
    />
  );
}

export { Input };
