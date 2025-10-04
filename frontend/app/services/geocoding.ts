import { City } from "@/components/Globe";

export interface GeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation?: number;
    feature_code: string;
    country_code: string;
    country: string;
    admin1?: string;
    admin2?: string;
    admin3?: string;
    admin4?: string;
    timezone: string;
    population?: number;
    postcodes?: string[];
  }>;
  generationtime_ms: number;
}

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

export class GeocodingService {
  private static cache = new Map<string, City[]>();

  static async searchCities(
    query: string,
    limit: number = 20,
  ): Promise<City[]> {
    const cacheKey = `${query.toLowerCase()}-${limit}`;

    // Return cached results if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const params = new URLSearchParams({
        name: query,
        count: limit.toString(),
        language: "en",
        format: "json",
      });

      const response = await fetch(`${GEOCODING_API_URL}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeocodingResponse = await response.json();

      if (!data.results || data.results.length === 0) {
        return [];
      }

      const cities: City[] = data.results.map((result) => ({
        id: result.id,
        name: result.name,
        country: result.country,
        country_code: result.country_code,
        lat: result.latitude,
        lng: result.longitude,
        admin1: result.admin1,
      }));

      // Cache the results
      this.cache.set(cacheKey, cities);

      return cities;
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  }

  static async getPopularCities(): Promise<City[]> {
    // Get some popular cities to show by default
    const popularQueries = [
      "New York",
      "London",
      "Tokyo",
      "Paris",
      "Sydney",
      "Berlin",
      "Mumbai",
      "São Paulo",
      "Dubai",
      "Singapore",
      "Los Angeles",
      "Toronto",
      "Bangkok",
      "Rome",
      "Madrid",
    ];

    try {
      const allCities: City[] = [];

      // Get one result for each popular query
      for (const query of popularQueries) {
        const cities = await this.searchCities(query, 1);
        if (cities.length > 0) {
          allCities.push(cities[0]);
        }
      }

      return allCities;
    } catch (error) {
      console.error("Error fetching popular cities:", error);
      return [];
    }
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
