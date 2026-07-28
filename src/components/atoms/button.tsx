import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white hover:bg-brand-strong",
        secondary: "bg-ink text-white hover:bg-ink/85",
        outline: "border border-line text-ink hover:bg-mist",
        ghost: "text-ink hover:bg-mist",
        link: "text-brand-ink underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: React.ReactNode;
} & (
    | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">)
    | ({ href?: undefined } & React.ComponentProps<"button">)
  );

/** Button that renders a Next.js Link when `href` is provided, else a <button>. */
export function Button({ variant, size, className, children, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} data-aos="fade-up" className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  const { href: _omit, ...rest } = props as { href?: string } & React.ComponentProps<"button">;
  return (
    <button data-aos="fade-up" className={classes} {...rest}>
      {children}
    </button>
  );
}

export { buttonVariants };
