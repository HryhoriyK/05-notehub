// src/services/movieService.ts

import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(query: string, page: number = 1): Promise<MovieResponse> {
  if (!query.trim()) {
    throw new Error("Query is empty.");
  }

  try {
    const { data } = await axios.get<MovieResponse>(
      `${BASE_URL}/search/movie`,
      {
        params: {
          query,
          page,
          language: "en",
          include_adult: false,
        },
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Failed to fetch movies.");
  }
}
