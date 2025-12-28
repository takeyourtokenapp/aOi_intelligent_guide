export function parseMarkdownToHTML(markdown: string): string {
  let html = markdown;

  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-8 mb-6 text-slate-900 dark:text-white">$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-8 mb-4 text-slate-900 dark:text-white border-b-2 border-slate-200 dark:border-slate-700 pb-2">$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-6 mb-3 text-slate-900 dark:text-white">$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-xl font-semibold mt-4 mb-2 text-slate-800 dark:text-slate-200">$1</h4>');

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  html = html.replace(/^---$/gim, '<hr class="my-8 border-slate-300 dark:border-slate-700" />');

  html = html.replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 text-slate-700 dark:text-slate-300">$1</li>');

  html = html.replace(/(<li.*<\/li>)/s, '<ul class="list-disc space-y-2 my-4">$1</ul>');

  html = html.replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">');
  html = '<p class="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">' + html + '</p>';

  html = html.replace(/<p class="mb-4 leading-relaxed text-slate-700 dark:text-slate-300"><h/g, '<h');
  html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
  html = html.replace(/<p class="mb-4 leading-relaxed text-slate-700 dark:text-slate-300"><hr/g, '<hr');
  html = html.replace(/<\/hr><\/p>/g, '</hr>');
  html = html.replace(/<p class="mb-4 leading-relaxed text-slate-700 dark:text-slate-300"><ul/g, '<ul');
  html = html.replace(/<\/ul><\/p>/g, '</ul>');

  html = html.replace(/<p class="mb-4 leading-relaxed text-slate-700 dark:text-slate-300"><\/p>/g, '');

  return html;
}
