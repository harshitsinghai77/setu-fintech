export function TypographyH4({ text, className = "" }) {
  return (
    <h4
      className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}
    >
      {text}
    </h4>
  );
}

export function TypographyP({ text, className = "" }) {
  return (
    <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>
      {text}
    </p>
  );
}
