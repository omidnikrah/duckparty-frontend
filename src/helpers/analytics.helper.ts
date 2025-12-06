export const loadAnalytics = () => {
  if (import.meta.env.PROD) {
    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://umami.apps.omid.toys/script.js";
    script.setAttribute("data-website-id", "ed88636a-1a64-429c-bbf4-34e26a564da3");
    document.head.appendChild(script);
  }
};

