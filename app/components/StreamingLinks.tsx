import Image from "next/image";
import type { ExternalLink } from "@/app/lib/types";

interface StreamingLinksProps {
  links: ExternalLink[];
}

export default function StreamingLinks({ links }: StreamingLinksProps) {
  if (links.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
        Streaming
      </h3>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-card-hover"
            style={link.color ? { color: link.color } : undefined}
          >
            {link.icon ? (
              <Image src={link.icon} alt="" width={16} height={16} className="h-4 w-4" unoptimized />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-muted">
                <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
                <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
              </svg>
            )}
            <span className="font-medium">{link.site}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="ml-auto h-3 w-3 text-muted">
              <path d="M6.22 8.72a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 1 1 1.06 1.06L7.81 8.25l2.97 2.97a.75.75 0 1 1-1.06 1.06l-3.5-3.5Z" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
