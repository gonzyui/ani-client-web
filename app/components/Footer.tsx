export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted sm:px-6">
        <p>
          Powered by{" "}
          <a
            href="https://github.com/gonzyui/ani-client"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-light hover:underline"
          >
            ani-client
          </a>{" "}
          &middot; Data from{" "}
          <a
            href="https://anilist.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-light hover:underline"
          >
            AniList
          </a>
        </p>
      </div>
    </footer>
  );
}
