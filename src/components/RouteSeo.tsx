import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://code-cloud-studio.lovable.app";
const SITE_NAME = "CloudCode";

type Meta = { title: string; description: string; noindex?: boolean };

const routes: Record<string, Meta> = {
  "/": {
    title: "CloudCode — Online Cloud IDE for 8+ Languages",
    description:
      "Write, run and share code in the browser. Instant execution for Python, JavaScript, Java, C++, Go, Rust and more.",
  },
  "/editor": {
    title: "Code Editor — Run Code Online | CloudCode",
    description:
      "A fast in-browser editor with syntax highlighting, file saving and one-click execution across 8+ programming languages.",
  },
  "/converter": {
    title: "Code Converter — Translate Between Languages | CloudCode",
    description:
      "Convert code between Python, JavaScript, Java, C++, Go, Rust and Kotlin instantly. No sign-in required.",
  },
  "/docs": {
    title: "Documentation — Guides & Language Support | CloudCode",
    description:
      "Learn how to use CloudCode: supported languages, running code, saving files in folders and converting between languages.",
  },
  "/dashboard": {
    title: "Your Files & Folders | CloudCode",
    description: "Manage your saved code files and folders in your CloudCode workspace.",
    noindex: true,
  },
  "/profile": {
    title: "Your Profile | CloudCode",
    description: "Manage your CloudCode account settings and storage usage.",
    noindex: true,
  },
  "/auth": {
    title: "Sign In or Create an Account | CloudCode",
    description: "Sign in to CloudCode to save your code files, organise folders and sync your workspace.",
    noindex: true,
  },
};

const fallback: Meta = {
  title: "Page Not Found | CloudCode",
  description: "The page you are looking for does not exist on CloudCode.",
  noindex: true,
};

export const RouteSeo = () => {
  const { pathname } = useLocation();
  const path = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const meta = routes[path] ?? fallback;
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;

  const jsonLd =
    path === "/"
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
            },
            {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
            },
            {
              "@type": "SoftwareApplication",
              name: SITE_NAME,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any (web browser)",
              url: SITE_URL,
              description: routes["/"].description,
            },
          ],
        }
      : null;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />
      {meta.noindex ? <meta name="robots" content="noindex, follow" /> : null}
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  );
};

export default RouteSeo;
