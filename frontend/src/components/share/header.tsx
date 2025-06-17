export function Header() {
  return (
    <header className="max-w-xl mx-auto p-4 mb-8">
      <h1 className="text-2xl font-bold mb-2 text-center">File Converter</h1>
      <p className="max-w-xl text-center text-muted-foreground">
        Drag and drop your files below to convert them to different formats.
        Select your desired output format and click the Convert button.
      </p>
    </header>
  );
}
