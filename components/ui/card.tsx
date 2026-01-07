"use client";
import { forwardRef, type HTMLAttributes, type PropsWithChildren } from "react";

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

type DivProps = HTMLAttributes<HTMLDivElement>;

const Base = forwardRef<HTMLDivElement, PropsWithChildren<DivProps>>(function Base(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cx(
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const Header = ({ className, children, ...props }: PropsWithChildren<DivProps>) => (
  <div className={cx("p-6 border-b border-gray-100", className)} {...props}>
    {children}
  </div>
);

const Title = ({ className, children, ...props }: PropsWithChildren<DivProps>) => (
  <div className={cx("text-lg font-semibold text-gray-900", className)} {...props}>
    {children}
  </div>
);

const Description = ({ className, children, ...props }: PropsWithChildren<DivProps>) => (
  <div className={cx("text-sm text-gray-600", className)} {...props}>
    {children}
  </div>
);

const Footer = ({ className, children, ...props }: PropsWithChildren<DivProps>) => (
  <div className={cx("p-6 border-t border-gray-100", className)} {...props}>
    {children}
  </div>
);

export const Card = Object.assign(Base, {
  Header,
  Title,
  Description,
  Footer,
});

export default Card;
