  import { useState, useEffect, useMemo } from "react";
  import { City } from "./Globe";
  import { GeocodingService } from "@/app/services/geocoding"
  import { Button } from "./ui/button";
  import { Card, CardContent } from "./ui/card";
  import { Badge } from "./ui/badge";
  import { Input } from "./ui/input";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
  import { ScrollArea } from "./ui/scroll-area";
  import {
    MapPin,
    Globe as GlobeIcon,
    Search,
    Loader2,
    MapIcon,
  } from "lucide-react";

  interface CitySelectorProps {
    selectedCity: City | null;
    onCitySelect: (city: City) => void;
    isRotating: boolean;
  }

  function CityButton({
    city,
    isSelected,
    onSelect,
    isRotating,
  }: {
    city: City;
    isSelected: boolean;
    onSelect: () => void;
    isRotating: boolean;
  }) {
    return (
      <Button
        variant={isSelected ? "secondary" : "ghost"}
        className={`w-full justify-start gap-3 h-auto p-3 ${
          isSelected
            ? "bg-white/20 text-white border border-white/30"
            : "text-white/80 hover:text-white hover:bg-white/10"
        }`}
        onClick={onSelect}
        disabled={isRotating}
      >
        <div className="flex items-center gap-2 flex-1">
          <MapIcon className="h-4 w-4" />
          <div className="text-left">
            <div className="font-medium">{city.name}</div>
            <div className="text-xs opacity-70">
              {city.admin1 ? `${city.admin1}, ${city.country}` : city.country}
            </div>
          </div>
        </div>

        {isSelected && (
          <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
        )}
      </Button>
    );
  }

  export default function CitySelector({
    selectedCity,
    onCitySelect,
    isRotating,
  }: CitySelectorProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<City[]>([]);
    const [popularCities, setPopularCities] = useState<City[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingPopular, setIsLoadingPopular] = useState(true);
    const [activeTab, setActiveTab] = useState("search");

    // Load popular cities on component mount
    useEffect(() => {
      const loadPopularCities = async () => {
        setIsLoadingPopular(true);
        try {
          const cities = await GeocodingService.getPopularCities();
          setPopularCities(cities);
        } catch (error) {
          console.error("Failed to load popular cities:", error);
        } finally {
          setIsLoadingPopular(false);
        }
      };

      loadPopularCities();
    }, []);

    // Search cities with debouncing
    useEffect(() => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      const searchCities = async () => {
        setIsSearching(true);
        try {
          const results = await GeocodingService.searchCities(
            searchTerm.trim(),
            15,
          );
          setSearchResults(results);
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      };

      const timeoutId = setTimeout(searchCities, 300); // Debounce
      return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Display cities based on search state
    const displayCities = useMemo(() => {
      if (searchTerm.trim()) {
        return searchResults;
      }
      return popularCities;
    }, [searchTerm, searchResults, popularCities]);

    // Group cities by country for better organization
    const groupedCities = useMemo(() => {
      const groups: Record<string, City[]> = {};
      displayCities.forEach((city) => {
        if (!groups[city.country]) {
          groups[city.country] = [];
        }
        groups[city.country].push(city);
      });
      return groups;
    }, [displayCities]);

    return (
      <div className="absolute top-6 left-6 z-10 max-w-sm animate-slide-in-left">
        {/* Header */}
        <Card className="backdrop-blur-md bg-white/10 border-white/20 text-white mb-4">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-blue-500/20 backdrop-blur-sm">
                <GlobeIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Globe.gl Earth</h1>
                <p className="text-sm text-white/70">
                  Professional satellite imagery
                </p>
              </div>
            </div>

            {selectedCity && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  <span className="font-semibold">
                    {selectedCity.name}, {selectedCity.country}
                  </span>
                </div>

                {selectedCity.admin1 && (
                  <div className="text-sm text-white/70">
                    📍 {selectedCity.admin1}
                  </div>
                )}

                {isRotating && (
                  <div className="flex items-center gap-2 text-amber-400 text-sm">
                    <div className="animate-spin rounded-full h-3 w-3 border border-amber-400 border-t-transparent"></div>
                    <span>Rotating to {selectedCity.name}...</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* City Search */}
        <Card className="backdrop-blur-md bg-white/10 border-white/20 text-white">
          <CardContent className="p-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger
                  value="search"
                  className="text-white data-[state=active]:bg-white/20"
                >
                  Search
                </TabsTrigger>
                <TabsTrigger
                  value="popular"
                  className="text-white data-[state=active]:bg-white/20"
                >
                  Popular
                </TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="space-y-4 mt-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search any city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 animate-spin" />
                  )}
                </div>

                {/* Search Results */}
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {searchTerm.trim() ? (
                      searchResults.length > 0 ? (
                        Object.entries(groupedCities).map(([country, cities]) => (
                          <div key={country}>
                            <h4 className="font-semibold text-sm text-white/70 mb-2 px-2">
                              {country} ({cities.length})
                            </h4>
                            <div className="space-y-1">
                              {cities.map((city) => (
                                <CityButton
                                  key={`${city.name}-${city.country}-${city.id}`}
                                  city={city}
                                  isSelected={selectedCity?.id === city.id}
                                  onSelect={() => onCitySelect(city)}
                                  isRotating={isRotating}
                                />
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-white/50 py-8">
                          {isSearching ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Searching...</span>
                            </div>
                          ) : (
                            `No cities found matching "${searchTerm}"`
                          )}
                        </div>
                      )
                    ) : (
                      <div className="text-center text-white/50 py-8">
                        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Type a city name to search</p>
                        <p className="text-xs mt-1">
                          Try "London", "Tokyo", or "New York"
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="popular" className="mt-4">
                <ScrollArea className="h-80">
                  <div className="space-y-2">
                    {isLoadingPopular ? (
                      <div className="text-center text-white/50 py-8">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading popular cities...</span>
                        </div>
                      </div>
                    ) : popularCities.length > 0 ? (
                      popularCities.map((city) => (
                        <CityButton
                          key={`${city.name}-${city.country}-${city.id}`}
                          city={city}
                          isSelected={selectedCity?.id === city.id}
                          onSelect={() => onCitySelect(city)}
                          isRotating={isRotating}
                        />
                      ))
                    ) : (
                      <div className="text-center text-white/50 py-8">
                        Failed to load popular cities
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="backdrop-blur-md bg-white/10 border-white/20 text-white mt-4">
          <CardContent className="p-4">
            <div className="text-sm text-white/70 space-y-1">
              <p>
                🌍 <strong>react-globe.gl</strong> - NASA imagery
              </p>
              <p>🔍 Live city search via Open-Meteo API</p>
              <p>🎯 Smooth camera flights to locations</p>
              <p>🎮 Interactive 3D navigation controls</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
