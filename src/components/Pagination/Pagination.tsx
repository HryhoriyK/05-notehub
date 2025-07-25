import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

export const Pagination = ({ pageCount, currentPage, onPageChange }: PaginationProps) => {
  const handlePageChange = ({ selected }: { selected: number }) => {
    onPageChange(selected + 1);
  };

  return (
    <div className={css.pagination}>
      <ReactPaginate
        breakLabel="..."
        nextLabel="→"
        previousLabel="←"
        onPageChange={handlePageChange}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        forcePage={currentPage - 1}
        containerClassName={css.pagination}
        pageClassName={css.page}
        previousClassName={css.arrow}
        nextClassName={css.arrow}
        activeClassName={css.active}
      />
    </div>
  );
};