import { useMemo } from "react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

export const useCountryOptions = () => {
  return useMemo(() => {
    const countryObj = countries.getNames("en", { select: "official" });

    const options = Object.entries(countryObj).map(([code, name]) => ({
      label: name,
      value: code,
    }));

    options.sort((a, b) => a.label.localeCompare(b.label));

    return options;
  }, []);
};
