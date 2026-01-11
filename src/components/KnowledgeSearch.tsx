import { Search, Sparkles, Brain, Code, BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { crossDomainApi } from '../services/crossDomainApi';

interface SearchResult {
  type: string;
  topic: string;
  similarity: number;
  content?: string;
}

interface KnowledgeSearchProps {
  domain?: 'foundation' | 'app';
  placeholder?: string;
}

export function KnowledgeSearch({
  domain = 'foundation',
  placeholder = 'Search knowledge base...'
}: KnowledgeSearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [response, setResponse] = useState('');
  const [sources, setSources] = useState<SearchResult[]>([]);
  const [queryType, setQueryType] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const result = await crossDomainApi.queryAoi(
        query,
        'anonymous',
        'explorer',
        { domain }
      );

      setResponse(result.response);
      setSources(result.sources || []);
      setQueryType(result.queryType || '');
    } catch (error) {
      console.error('Search error:', error);
      setResponse('Sorry, I encountered an error while searching. Please try again.');
      setSources([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === 'cns_knowledge') return <Brain className="w-5 h-5 text-pink-500" />;
    if (type === 'web3_knowledge') return <Code className="w-5 h-5 text-blue-500" />;
    return <BookOpen className="w-5 h-5 text-purple-500" />;
  };

  const getTypeColor = (type: string) => {
    if (type === 'cns_knowledge') return 'border-pink-500/30 bg-pink-50 dark:bg-pink-900/10';
    if (type === 'web3_knowledge') return 'border-blue-500/30 bg-blue-50 dark:bg-blue-900/10';
    return 'border-purple-500/30 bg-purple-50 dark:bg-purple-900/10';
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.8) return 'text-green-600 dark:text-green-400';
    if (similarity >= 0.7) return 'text-blue-600 dark:text-blue-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="relative">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={placeholder}
              disabled={isSearching}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-500/30 rounded-2xl text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 transition-all text-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isSearching}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-purple-500/30 flex items-center gap-2 font-semibold"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Search
              </>
            )}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>Powered by aOi semantic search • {domain === 'foundation' ? 'Medical Knowledge' : 'Web3 Education'}</span>
        </div>
      </div>

      {hasSearched && response && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/20 border-2 border-purple-200 dark:border-purple-500/30 rounded-2xl shadow-lg">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                  aOi Response
                  {queryType && (
                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                      {queryType}
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based on semantic search across knowledge base
                </p>
              </div>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-slate-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                {response}
              </p>
            </div>
          </div>

          {sources.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Knowledge Sources ({sources.length})
                </h4>
              </div>

              <div className="grid gap-3">
                {sources.map((source, idx) => (
                  <div
                    key={idx}
                    className={`p-4 border-2 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg ${getTypeColor(source.type)}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {getTypeIcon(source.type)}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-slate-900 dark:text-white mb-1">
                            {source.topic}
                          </h5>
                          {source.content && (
                            <p className="text-sm text-slate-700 dark:text-gray-300 line-clamp-2">
                              {source.content}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs px-2 py-1 bg-white dark:bg-slate-700 rounded-full text-gray-600 dark:text-gray-400 font-medium">
                              {source.type.replace('_', ' ')}
                            </span>
                            <span className={`text-xs font-bold ${getSimilarityColor(source.similarity)}`}>
                              {(source.similarity * 100).toFixed(0)}% match
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sources.length === 0 && (
            <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No specific sources found, but aOi provided a general response based on knowledge base.
              </p>
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Search the Knowledge Base
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Ask aOi anything about {domain === 'foundation' ? 'pediatric brain tumors, CNS research, and medical science' : 'Web3, blockchain, crypto, and decentralized technology'}
          </p>
          <div className="flex flex-wrap gap-2 justify-center pt-4">
            <button
              onClick={() => {
                setQuery(domain === 'foundation' ? 'What is medulloblastoma?' : 'What is blockchain?');
                setTimeout(() => handleSearch(), 100);
              }}
              className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
            >
              {domain === 'foundation' ? 'What is medulloblastoma?' : 'What is blockchain?'}
            </button>
            <button
              onClick={() => {
                setQuery(domain === 'foundation' ? 'How are brain tumors treated?' : 'How does mining work?');
                setTimeout(() => handleSearch(), 100);
              }}
              className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
            >
              {domain === 'foundation' ? 'How are brain tumors treated?' : 'How does mining work?'}
            </button>
            <button
              onClick={() => {
                setQuery(domain === 'foundation' ? 'What research is being done?' : 'What is Web3?');
                setTimeout(() => handleSearch(), 100);
              }}
              className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
            >
              {domain === 'foundation' ? 'What research is being done?' : 'What is Web3?'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
