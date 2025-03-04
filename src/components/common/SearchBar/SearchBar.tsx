import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { useDebounce } from '../../../hooks';
import { searchStorage } from '../../../utils/localStorage';

/**
 * 검색바 컴포넌트
 */
const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 검색어 디바운싱
  // const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 검색 기록 로드
  useEffect(() => {
    setSearchHistory(searchStorage.getSearchHistory());
  }, []);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowHistory(false);
        if (searchTerm === '') {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchTerm]);

  // 검색 처리
  const handleSearch = () => {
    if (searchTerm.trim()) {
      // 검색 기록 저장
      searchStorage.addSearchTerm(searchTerm.trim());
      setSearchHistory(searchStorage.getSearchHistory());

      // 검색 페이지로 이동
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);

      // Redux 상태 업데이트
      dispatch({
        type: 'shop/setFilters',
        payload: { search: searchTerm.trim() },
      });

      // UI 정리
      setShowHistory(false);
      setIsExpanded(false);
    }
  };

  // 검색어 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      setIsExpanded(true);
    }
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowHistory(false);
      inputRef.current?.blur();
    }
  };

  // 검색 기록 항목 클릭 핸들러
  const handleHistoryItemClick = (term: string) => {
    setSearchTerm(term);
    handleSearch();
  };

  // 검색 기록 삭제 핸들러
  const handleDeleteHistory = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    searchStorage.removeSearchTerm(term);
    setSearchHistory(searchStorage.getSearchHistory());
  };

  // 전체 검색 기록 삭제 핸들러
  const handleClearAllHistory = () => {
    searchStorage.clearSearchHistory();
    setSearchHistory([]);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${isExpanded ? 'w-64' : 'w-40'} transition-all duration-200`}
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="검색어 입력..."
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsExpanded(true);
            setShowHistory(true);
          }}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        )}
      </div>

      {/* 검색 기록 드롭다운 */}
      {showHistory && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="p-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">최근 검색어</h3>
              {searchHistory.length > 0 && (
                <button
                  onClick={handleClearAllHistory}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  전체 삭제
                </button>
              )}
            </div>

            {searchHistory.length > 0 ? (
              <ul className="space-y-1">
                {searchHistory.map((term, index) => (
                  <li
                    key={index}
                    onClick={() => handleHistoryItemClick(term)}
                    className="flex justify-between items-center px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <span className="text-sm text-gray-800 dark:text-gray-200">{term}</span>
                    <button
                      onClick={(e) => handleDeleteHistory(e, term)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-1">
                최근 검색 기록이 없습니다.
              </p>
            )}

            {/* 인기 검색어 섹션 (추가 기능으로 확장 가능) */}
            {/* <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">인기 검색어</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearchTerms.map((term, index) => (
                  <span
                    key={index}
                    onClick={() => handleHistoryItemClick(term)}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 cursor-pointer"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
