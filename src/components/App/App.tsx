import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { useEffect } from "react";

import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import type { Movie } from "../../types/movie";
import css from "./App.module.css";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: searchQuery.trim().length > 0,
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter a search query.");
      return;
    }
    setSearchQuery(query);
    setPage(1);
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const hasMovies = !!data?.results?.length;

  useEffect(() => {
  if (
    searchQuery.trim() &&
    data &&
    data.results.length === 0 &&
    !isLoading &&
    !isError
  ) {
    toast.dismiss("no-results");
    toast("No movies found for your request.", {
      id: "no-results",
    });
  }
}, [data, isLoading, isError, searchQuery]);

  return (
    <div>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && searchQuery && <Loader />}
      {isError && searchQuery && <ErrorMessage />}

      {hasMovies && (
        <>
        {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={data.results} onSelect={handleMovieClick} />

        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}

      {isFetching && !isLoading && hasMovies && (
        <p style={{ textAlign: "center" }}>Updating results...</p>
      )}
    </div>
  );
}
