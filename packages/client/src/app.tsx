import { useState, useEffect } from "react";
import { getCodeSandboxHost } from "@codesandbox/utils";

export type Hotel = {
  _id: string;
  chain_name: string;
  hotel_name: string;
  city: string;
  country: string;
};

export type City = {
  _id: string;
  name: string;
};

export type Country = {
  _id: string;
  country: string;
  countryisocode: string;
};

const codeSandboxHost = getCodeSandboxHost(3001);
const API_URL = codeSandboxHost
  ? `https://${codeSandboxHost}`
  : "http://localhost:3001";

const fetchSearchResults = async (value: string) => {
  const data = await fetch(`${API_URL}/search?searchTerm=${value}`);
  const payload = (await data.json()) as {
    hotels: Hotel[];
    cities: City[];
    countries: Country[];
  };
  return payload;
};

function App() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [showClearBtn, setShowClearBtn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeoutRef, setTimeoutRef] = useState<null | number>(null);

  useEffect(() => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }

    if (!searchTerm) {
      setHotels([]);
      setShowClearBtn(false);
      return;
    }

    setTimeoutRef(
      setTimeout(() => {
        fetchData(searchTerm);
        setTimeoutRef(null);
      }, 500)
    );

    return () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  }, [searchTerm]);

  const fetchData = async (searchTerm: string) => {
    const { hotels, cities, countries } = await fetchSearchResults(searchTerm);
    setShowClearBtn(true);
    setHotels(hotels);
    setCities(cities);
    setCountries(countries);
  };

  const clearSearchTerm = () => {
    setSearchTerm("");
  };

  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="dropdown">
              <div className="form">
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  className="form-control form-input"
                  placeholder="Search accommodation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {showClearBtn && (
                  <span className="left-pan" onClick={clearSearchTerm}>
                    <i className="fa fa-close"></i>
                  </span>
                )}
              </div>
              {!!hotels.length && (
                <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
                  <h2>Hotels</h2>
                  {hotels.length ? (
                    hotels.map((hotel, index) => (
                      <li key={`hotel_${index}`}>
                        <a
                          href={`/hotels/${hotel._id}`}
                          className="dropdown-item"
                        >
                          <i className="fa fa-building mr-2"></i>
                          {hotel.hotel_name}
                        </a>
                        <hr className="divider" />
                      </li>
                    ))
                  ) : (
                    <p>No hotels matched</p>
                  )}
                  <h2>Countries</h2>
                  {countries.length ? (
                    countries.map((country, index) => (
                      <li key={`country_${index}`}>
                        <a
                          href={`/countries/${country._id}`}
                          className="dropdown-item"
                        >
                          <i className="fa fa-building mr-2"></i>
                          {country.country}
                        </a>
                        <hr className="divider" />
                      </li>
                    ))
                  ) : (
                    <p>No countries matched</p>
                  )}
                  <h2>Cities</h2>
                  {cities.length ? (
                    cities.map((city, index) => (
                      <li key={`city_${index}`}>
                        <a
                          href={`/cities/${city._id}`}
                          className="dropdown-item"
                        >
                          <i className="fa fa-building mr-2"></i>
                          {city.name}
                        </a>
                        <hr className="divider" />
                      </li>
                    ))
                  ) : (
                    <p>No cities matched</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
