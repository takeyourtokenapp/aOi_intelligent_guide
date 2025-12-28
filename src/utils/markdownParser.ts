export function parseMarkdownToHTML(markdown: string): string {
  if (!markdown) return '';

  let html = markdown;

  html = html.replace(/^#{6}\s+(.*)$/gim, '<h6 class="text-base font-semibold mt-3 mb-2 text-slate-800 dark:text-slate-200">$1</h6>');
  html = html.replace(/^#{5}\s+(.*)$/gim, '<h5 class="text-lg font-semibold mt-3 mb-2 text-slate-800 dark:text-slate-200">$1</h5>');
  html = html.replace(/^#{4}\s+(.*)$/gim, '<h4 class="text-xl font-semibold mt-4 mb-3 text-slate-800 dark:text-slate-200">$1</h4>');
  html = html.replace(/^#{3}\s+(.*)$/gim, '<h3 class="text-2xl font-bold mt-6 mb-4 text-slate-900 dark:text-white">$1</h3>');
  html = html.replace(/^#{2}\s+(.*)$/gim, '<h2 class="text-3xl font-bold mt-8 mb-5 text-slate-900 dark:text-white border-b-2 border-slate-200 dark:border-slate-700 pb-3">$1</h2>');
  html = html.replace(/^#\s+(.*)$/gim, '<h1 class="text-4xl font-bold mt-8 mb-6 text-slate-900 dark:text-white">$1</h1>');

  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-bold italic text-slate-900 dark:text-white">$1</strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="italic text-slate-800 dark:text-slate-200">$1</em>');

  html = html.replace(/^---+$/gim, '<hr class="my-8 border-t-2 border-slate-300 dark:border-slate-700" />');

  html = html.replace(/^\d+\.\s+(.*)$/gim, '<li class="ml-6 mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">$1</li>');
  html = html.replace(/^[-*]\s+(.*)$/gim, '<li class="ml-6 mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">$1</li>');

  html = html.replace(/(<li class="ml-6 mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">.*<\/li>\n?)+/g, '<ul class="list-disc space-y-2 my-6 ml-4">$&</ul>');

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

  html = html.replace(/\n\n+/g, '</p><p class="mb-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">');
  html = '<p class="mb-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">' + html + '</p>';

  html = html.replace(/<p class="mb-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300"><h/g, '<h');
  html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
  html = html.replace(/<p class="mb-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300"><hr/g, '<hr');
  html = html.replace(/<\/hr><\/p>/g, '</hr>');
  html = html.replace(/<p class="mb-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300"><ul/g, '<ul');
  html = html.replace(/<\/ul><\/p>/g, '</ul>');
  html = html.replace(/<p class="mb-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300"><\/p>/g, '');

  return html;
}
