export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Capital Cities Quiz. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 