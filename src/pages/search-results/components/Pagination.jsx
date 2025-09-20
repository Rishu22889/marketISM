import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalResults,
  resultsPerPage,
  onPageChange,
  onLoadMore,
  hasInfiniteScroll = false 
}) => {
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range?.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots?.push(1, '...');
    } else {
      rangeWithDots?.push(1);
    }

    rangeWithDots?.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots?.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots?.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{startResult}</span> to{' '}
            <span className="font-medium text-foreground">{endResult}</span> of{' '}
            <span className="font-medium text-foreground">{totalResults?.toLocaleString('en-IN')}</span> results
          </div>

          {/* Results per page selector */}
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <select
              value={resultsPerPage}
              onChange={(e) => {
                // Handle results per page change
                console.log('Results per page:', e?.target?.value);
              }}
              className="appearance-none bg-background border border-border rounded-lg px-3 py-1 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={96}>96</option>
            </select>
            <Icon 
              name="ChevronDown" 
              size={14} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>

        {/* Infinite Scroll Load More */}
        {hasInfiniteScroll && currentPage < totalPages && (
          <div className="text-center mb-6">
            <Button
              variant="outline"
              onClick={onLoadMore}
              iconName="ChevronDown"
              iconPosition="left"
              size="lg"
            >
              Load More Results
            </Button>
          </div>
        )}

        {/* Traditional Pagination */}
        {!hasInfiniteScroll && (
          <div className="flex items-center justify-center space-x-2">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
              iconPosition="left"
              className="hidden sm:flex"
            >
              Previous
            </Button>

            {/* Mobile Previous */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="sm:hidden"
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {visiblePages?.map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-muted-foreground">...</span>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
              iconPosition="right"
              className="hidden sm:flex"
            >
              Next
            </Button>

            {/* Mobile Next */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="sm:hidden"
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        )}

        {/* Quick Jump (Desktop only) */}
        <div className="hidden lg:flex items-center justify-center mt-4 space-x-4">
          <span className="text-sm text-muted-foreground">Jump to page:</span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              placeholder="Page"
              className="w-16 px-2 py-1 text-sm border border-border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              onKeyPress={(e) => {
                if (e?.key === 'Enter') {
                  const page = parseInt(e?.target?.value);
                  if (page >= 1 && page <= totalPages) {
                    onPageChange(page);
                    e.target.value = '';
                  }
                }
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="ArrowRight"
              onClick={(e) => {
                const input = e?.target?.closest('div')?.querySelector('input');
                const page = parseInt(input?.value);
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page);
                  input.value = '';
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;