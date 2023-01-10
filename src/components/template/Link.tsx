import { Link, useResolvedPath, useMatch, LinkProps } from "react-router-dom";

function CustomLink({ children, to, ...props }: LinkProps) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link className={`${match ? "menu-item-active" : ""}`} to={to} {...props}>
      {children}
    </Link>
  );
}

export { CustomLink };
